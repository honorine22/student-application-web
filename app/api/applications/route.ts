import { createClient } from "next-sanity";
import { NextResponse } from "next/server";
import { REGISTRATION_FEE } from "../../lib/admissions";

export const runtime = "nodejs";

const MAX_PROOF_SIZE = 5 * 1024 * 1024;
const PROOF_TYPES = new Set(["image/jpeg", "image/png", "application/pdf"]);
type SubmissionStage = "request" | "configuration" | "upload" | "save";

class SubmissionError extends Error {
  constructor(
    message: string,
    readonly status: number,
    readonly code: string,
  ) {
    super(message);
  }
}
const requiredFields = [
  "firstName",
  "lastName",
  "telephoneNumber",
  "nationalIDNumber",
  "email",
  "education",
  "province",
  "district",
  "sector",
  "cell",
  "village",
  "tradeToLearn",
  "musicArtsBranch",
  "trainingLocation",
  "emergencyContactName",
  "emergencyContactRelationship",
  "emergencyContactPhone",
  "paymentMethod",
  "paymentReference",
] as const;

function getWriteClient() {
  const projectId =
    process.env.SANITY_PROJECT_ID || process.env.NEXT_PUBLIC_SANITY_PROJECT_ID;
  const dataset =
    process.env.SANITY_DATASET || process.env.NEXT_PUBLIC_SANITY_DATASET;
  const token = process.env.SANITY_API_WRITE_TOKEN;

  if (!projectId || !dataset || !token) {
    throw new SubmissionError(
      "Applications are temporarily unavailable because the submission service is not configured. Please contact ETP admissions.",
      503,
      "SERVICE_NOT_CONFIGURED",
    );
  }

  return createClient({
    projectId,
    dataset,
    apiVersion: process.env.NEXT_PUBLIC_SANITY_API_VERSION || "2024-09-07",
    token,
    useCdn: false,
  });
}

export async function POST(request: Request) {
  const reference = crypto.randomUUID().slice(0, 8).toUpperCase();
  let stage: SubmissionStage = "request";

  try {
    const form = await request.formData();
    const data = Object.fromEntries(
      requiredFields.map((field) => [field, String(form.get(field) || "").trim()]),
    ) as Record<(typeof requiredFields)[number], string>;
    const missing = requiredFields.find(
      (field) =>
        !data[field] &&
        !(field === "musicArtsBranch" && data.tradeToLearn !== "Church Music Arts"),
    );

    if (missing) {
      return NextResponse.json(
        { error: `Missing required field: ${missing}` },
        { status: 400 },
      );
    }

    if (!/^\d{16}$/.test(data.nationalIDNumber)) {
      return NextResponse.json({ error: "Invalid National ID" }, { status: 400 });
    }
    if (!/^(?:\+250|0)7\d{8}$/.test(data.telephoneNumber.replace(/\s/g, ""))) {
      return NextResponse.json({ error: "Invalid phone number" }, { status: 400 });
    }

    const proof = form.get("paymentProof");
    if (!proof || typeof proof === "string" || proof.size === 0) {
      return NextResponse.json({ error: "Payment proof is required" }, { status: 400 });
    }
    if (proof.size > MAX_PROOF_SIZE || !PROOF_TYPES.has(proof.type)) {
      return NextResponse.json(
        { error: "Payment proof must be a JPG, PNG or PDF no larger than 5 MB" },
        { status: 400 },
      );
    }

    stage = "configuration";
    const client = getWriteClient();
    stage = "upload";
    const asset = await client.assets.upload("file", Buffer.from(await proof.arrayBuffer()), {
      filename: proof.name,
      contentType: proof.type,
    });
    const now = new Date().toISOString();
    const fullName = `${data.firstName} ${data.lastName}`;
    const applicationId = `studentAdmission-${crypto.randomUUID()}`;

    stage = "save";
    await client
      .transaction()
      .create({
        _id: applicationId,
        _type: "studentAdmission",
        ...data,
        paymentProof: {
          _type: "file",
          asset: { _type: "reference", _ref: asset._id },
        },
        fullName,
        registrationFee: REGISTRATION_FEE,
        paymentStatus: "pending",
        applicationStatus: "submitted",
        status: "pending",
        createdAt: now,
        updatedAt: now,
      })
      .create({
        _type: "notification",
        title: "New application received",
        message: `${fullName} submitted an application with payment proof.`,
        type: "application",
        recipient: "admin",
        application: { _type: "reference", _ref: applicationId },
        isRead: false,
        createdAt: now,
        link: "/admin",
      })
      .commit();

    return NextResponse.json({ ok: true }, { status: 201 });
  } catch (error) {
    const statusCode =
      typeof error === "object" && error && "statusCode" in error
        ? Number(error.statusCode)
        : undefined;
    let response =
      error instanceof SubmissionError
        ? error
        : new SubmissionError(
            "Your application could not be submitted. Please try again. If the problem continues, contact ETP admissions.",
            500,
            "SUBMISSION_FAILED",
          );

    if (statusCode === 401 || statusCode === 403) {
      response = new SubmissionError(
        "Applications are temporarily unavailable because the submission service could not be authorized. Please contact ETP admissions.",
        503,
        "SERVICE_NOT_AUTHORIZED",
      );
    } else if (statusCode === 429) {
      response = new SubmissionError(
        "The application service is busy. Please wait a minute and submit again.",
        503,
        "SERVICE_BUSY",
      );
    } else if (!(error instanceof SubmissionError) && stage === "upload") {
      response = new SubmissionError(
        "Your payment proof could not be uploaded. Check your connection and submit again.",
        502,
        "UPLOAD_FAILED",
      );
    } else if (!(error instanceof SubmissionError) && stage === "save") {
      response = new SubmissionError(
        "Your application could not be saved. Please submit again. If the problem continues, contact ETP admissions.",
        502,
        "SAVE_FAILED",
      );
    }

    console.error("Application submission failed", {
      reference,
      stage,
      statusCode,
      code: response.code,
      error,
    });
    return NextResponse.json(
      {
        error: `${response.message} Reference: ${reference}`,
        code: response.code,
        reference,
      },
      { status: response.status },
    );
  }
}
