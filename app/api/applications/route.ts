import { createClient } from "next-sanity";
import { NextResponse } from "next/server";
import { apiVersion, dataset, projectId } from "../../../sanity/env";
import { REGISTRATION_FEE } from "../../lib/admissions";

export const runtime = "nodejs";

const MAX_PROOF_SIZE = 5 * 1024 * 1024;
const PROOF_TYPES = new Set(["image/jpeg", "image/png", "application/pdf"]);
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
  "trainingLocation",
  "emergencyContactName",
  "emergencyContactRelationship",
  "emergencyContactPhone",
  "paymentMethod",
  "paymentReference",
] as const;

function getWriteClient() {
  const token =
    process.env.SANITY_API_WRITE_TOKEN ||
    process.env.NEXT_PUBLIC_SANITY_API_WRITE_TOKEN;

  if (!token) throw new Error("Sanity write token is not configured");

  return createClient({ projectId, dataset, apiVersion, token, useCdn: false });
}

export async function POST(request: Request) {
  try {
    const form = await request.formData();
    const data = Object.fromEntries(
      requiredFields.map((field) => [field, String(form.get(field) || "").trim()]),
    ) as Record<(typeof requiredFields)[number], string>;
    const missing = requiredFields.find((field) => !data[field]);

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

    const client = getWriteClient();
    const asset = await client.assets.upload("file", Buffer.from(await proof.arrayBuffer()), {
      filename: proof.name,
      contentType: proof.type,
    });
    const now = new Date().toISOString();
    const fullName = `${data.firstName} ${data.lastName}`;
    const applicationId = `studentAdmission-${crypto.randomUUID()}`;

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
    console.error("Application submission failed", error);
    return NextResponse.json(
      { error: "The application service is temporarily unavailable" },
      { status: 500 },
    );
  }
}
