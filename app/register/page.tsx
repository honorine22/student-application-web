"use client";
import { useEffect, useMemo, useState } from "react";
import {
  ArrowLeft,
  ArrowRight,
  Check,
  CheckCircle2,
  FileUp,
  GraduationCap,
  LockKeyhole,
  MapPin,
  Receipt,
  ShieldCheck,
} from "lucide-react";
import { useForm, UseFormRegisterReturn } from "react-hook-form";
import { toast } from "sonner";
import { rwandaLocation } from "@devrw/rwanda-location";
import { client } from "../../sanity/lib/client";
import Navbar from "../components/Navbar";
import {
  formatRwf,
  PAYMENT_INSTRUCTIONS,
  PAYMENT_METHODS,
  PROGRAMS,
  REGISTRATION_FEE,
  TRAINING_LOCATIONS,
  trainingLocationValue,
} from "../lib/admissions";

type FormData = {
  firstName: string;
  lastName: string;
  telephoneNumber: string;
  nationalIDNumber: string;
  email: string;
  education: string;
  province: string;
  district: string;
  sector: string;
  cell: string;
  village: string;
  tradeToLearn: string;
  trainingLocation: string;
  emergencyContactName: string;
  emergencyContactRelationship: string;
  emergencyContactPhone: string;
  paymentMethod: string;
  paymentReference: string;
  paymentProof?: FileList;
};
type ProgramOption = {
  _id?: string;
  value: string;
  label: string;
  restrictedLocation?: string;
};
const steps = [
  "Personal",
  "Contact",
  "Education",
  "Address",
  "Program",
  "Payment",
  "Review",
];
const titles = [
  "Personal information",
  "Contact information",
  "Education background",
  "Home address",
  "Program & study location",
  "Payment information",
  "Review & submit",
];
const descriptions = [
  "Start with the details shown on your official identification.",
  "Tell us how to reach you and someone close to you.",
  "Select the highest level of education you completed.",
  "Choose your official address from Rwanda’s administrative hierarchy.",
  "Choose what you want to learn and where you prefer to study.",
  "Add the details and evidence from your manual payment.",
  "Check your complete application before sending it to ETP.",
];
const fields: (keyof FormData)[][] = [
  ["firstName", "lastName", "nationalIDNumber"],
  [
    "telephoneNumber",
    "email",
    "emergencyContactName",
    "emergencyContactRelationship",
    "emergencyContactPhone",
  ],
  ["education"],
  ["province", "district", "sector", "cell", "village"],
  ["tradeToLearn", "trainingLocation"],
  ["paymentMethod", "paymentReference", "paymentProof"],
  [],
];

export default function Register() {
  const [step, setStep] = useState(0),
    [submitting, setSubmitting] = useState(false),
    [complete, setComplete] = useState(false);
  const [provinceCode, setProvinceCode] = useState<number>(),
    [districtCode, setDistrictCode] = useState<number>(),
    [sectorCode, setSectorCode] = useState<string>(),
    [cellCode, setCellCode] = useState<number>();
  const [uploadProgress, setUploadProgress] = useState(0);
  const [programOptions, setProgramOptions] = useState<ProgramOption[]>(
    PROGRAMS.map((p) => ({
      value: p.value,
      label: p.label,
      restrictedLocation:
        "restrictedLocation" in p ? p.restrictedLocation : undefined,
    })),
  );
  const {
    register,
    handleSubmit,
    trigger,
    watch,
    setValue,
    formState: { errors },
  } = useForm<FormData>();
  const values = watch();
  const provinces = rwandaLocation.getProvinces(),
    districts = provinceCode ? rwandaLocation.getDistricts(provinceCode) : [],
    sectors = districtCode ? rwandaLocation.getSectors(districtCode) : [],
    cells = sectorCode ? rwandaLocation.getCells(sectorCode) : [],
    villages = cellCode ? rwandaLocation.getVillages(cellCode) : [];
  const selectedProgram = programOptions.find(
    (p) => p.value === values.tradeToLearn,
  );
  const restrictedLocation =
    selectedProgram?.restrictedLocation ||
    (values.tradeToLearn === "Church Music Arts" ? "Karama" : "");
  const locations = restrictedLocation
    ? TRAINING_LOCATIONS.filter(
        (x) =>
          trainingLocationValue(x) === restrictedLocation ||
          x.name === restrictedLocation,
      )
    : TRAINING_LOCATIONS;
  const fullName = useMemo(
    () => `${values.firstName || ""} ${values.lastName || ""}`.trim(),
    [values.firstName, values.lastName],
  );
  useEffect(() => {
    const preset = new URLSearchParams(window.location.search).get("program");
    if (preset && PROGRAMS.some((p) => p.value === preset))
      setValue("tradeToLearn", preset);
  }, [setValue]);
  useEffect(() => {
    client
      .fetch<
        {
          _id: string;
          title: string;
          isActive?: boolean;
          restrictedLocation?: string;
        }[]
      >(
        `*[_type=="program"]|order(sortOrder asc,title asc){_id,title,isActive,restrictedLocation}`,
      )
      .then((items) => {
        if (items.length) {
          const managed = new Map(items.map((item) => [item.title, item]));
          const defaults = PROGRAMS.filter(
            (program) => managed.get(program.value)?.isActive !== false,
          ).map((program) => {
            const override = managed.get(program.value);
            return {
              _id: override?._id,
              value: override?.title || program.value,
              label: override?.title || program.label,
              restrictedLocation:
                override?.restrictedLocation ||
                ("restrictedLocation" in program
                  ? program.restrictedLocation
                  : undefined),
            };
          });
          const additions = items
            .filter(
              (item) =>
                item.isActive !== false &&
                !PROGRAMS.some((program) => program.value === item.title),
            )
            .map((item) => ({
              _id: item._id,
              value: item.title,
              label: item.title,
              restrictedLocation: item.restrictedLocation,
            }));
          setProgramOptions([...defaults, ...additions]);
        }
      })
      .catch(() => undefined);
  }, []);
  const next = async () => {
    if (!(await trigger(fields[step])))
      return toast.error("Please complete the required fields.");
    setStep(Math.min(step + 1, 6));
    window.scrollTo({ top: 0, behavior: "smooth" });
  };
  const submit = async (data: FormData) => {
    setSubmitting(true);
    setUploadProgress(10);
    try {
      const file = data.paymentProof?.[0];
      if (!file) throw new Error();
      const asset = await client.assets.upload("file", file, {
        filename: file.name,
      });
      setUploadProgress(70);
      const now = new Date().toISOString();
      const application = await client.create({
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
      });
      await client.create({
        _type: "notification",
        title: "New application received",
        message: `${fullName} submitted an application with payment proof.`,
        type: "application",
        recipient: "admin",
        application: { _type: "reference", _ref: application._id },
        isRead: false,
        createdAt: now,
        link: "/admin",
      });
      setUploadProgress(100);
      setComplete(true);
      toast.success("Application submitted successfully.");
    } catch {
      toast.error("Your application could not be submitted. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };
  const input = (
    name: keyof FormData,
    label: string,
    type = "text",
    placeholder = "",
  ) => (
    <label className="field">
      <span>
        {label} <b>*</b>
      </span>
      <input
        type={type}
        placeholder={placeholder}
        {...register(name, {
          required: `${label} is required`,
          validate: (raw) => {
            const value = String(raw || "").trim();
            if (name === "nationalIDNumber")
              return (
                /^\d{16}$/.test(value) || "Enter a valid 16-digit National ID"
              );
            if (name === "telephoneNumber" || name === "emergencyContactPhone")
              return (
                /^(?:\+250|0)7\d{8}$/.test(value.replace(/\s/g, "")) ||
                "Enter a valid Rwanda phone number"
              );
            if (name === "email")
              return (
                /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value) ||
                "Enter a valid email address"
              );
            if (
              ["firstName", "lastName", "emergencyContactName"].includes(name)
            )
              return value.length >= 2 || `${label} is too short`;
            if (name === "paymentReference")
              return value.length >= 3 || "Enter a valid payment reference";
            return true;
          },
        })}
      />
      {errors[name] && <small>{errors[name]?.message as string}</small>}
    </label>
  );
  if (complete)
    return (
      <>
        <Navbar />
        <main className="application-page">
          <section className="success-card">
            <span className="success-icon">
              <CheckCircle2 />
            </span>
            <span className="eyebrow">Application received</span>
            <h1>Thank you, {values.firstName}.</h1>
            <p>
              Your application was submitted successfully. Payment remains{" "}
              <strong>Pending Verification</strong> until reviewed by ETP.
            </p>
            <a href="/" className="button button-dark">
              Return home <ArrowRight />
            </a>
          </section>
        </main>
      </>
    );
  return (
    <>
      <Navbar />
      <main className="application-page application-wizard min-h-[calc(100svh-72px)] bg-etp-surface p-3 sm:p-6">
        <div className="wizard-shell mx-auto grid w-full max-w-[1080px] items-stretch overflow-hidden rounded-3xl bg-white shadow-etp-card lg:min-h-[650px] lg:grid-cols-[0.82fr_1.18fr]">
          <aside className="wizard-aside flex h-full flex-col justify-between bg-etp-ink p-7 text-white sm:p-10 lg:p-12">
            <div>
              <span className="eyebrow">ETP Admissions</span>
              <h1>Take the next step toward your future.</h1>
              <p>A clear, guided application that takes only a few minutes.</p>
            </div>
            <div className="wizard-benefits">
              <span>
                <GraduationCap /> Practical and creative programs
              </span>
              <span>
                <MapPin /> 13 available study locations
              </span>
              <span>
                <ShieldCheck /> Payment reviewed by ETP staff
              </span>
            </div>
            <div className="wizard-fee">
              <Receipt />
              <span>
                Registration fee<strong>{formatRwf(REGISTRATION_FEE)}</strong>
              </span>
            </div>
          </aside>
          <section className="wizard-form-panel flex h-full min-w-0 flex-col p-5 sm:p-8 lg:p-10">
            <div className="wizard-top flex items-center justify-between border-b border-black/10 pb-4">
              <a href="/" className="brand">
                <span className="brand-mark">E</span>
                <span>
                  ETP <small>Admissions</small>
                </span>
              </a>
              <span>
                Step {step + 1} of {steps.length}
              </span>
            </div>
            <nav
              className="wizard-progress my-5 flex items-start gap-1"
              aria-label="Application steps"
            >
              {steps.map((label, i) => (
                <button
                  type="button"
                  key={label}
                  className={`${i === step ? "active" : ""} ${i < step ? "done" : ""}`}
                  onClick={() => i < step && setStep(i)}
                >
                  <span>{i < step ? <Check /> : i + 1}</span>
                  <small>{label}</small>
                </button>
              ))}
            </nav>
            <form
              onSubmit={handleSubmit(submit)}
              className="wizard-form flex min-h-0 flex-1 flex-col"
            >
              <header>
                <span className="eyebrow">{steps[step]}</span>
                <h2>{titles[step]}</h2>
                <p>{descriptions[step]}</p>
              </header>
              {step === 0 && (
                <div className="form-grid">
                  {input("firstName", "First name", "text", "e.g. Aline")}
                  {input("lastName", "Last name", "text", "e.g. Uwase")}
                  <div className="span-2">
                    {input(
                      "nationalIDNumber",
                      "National ID",
                      "text",
                      "16-digit national ID",
                    )}
                  </div>
                </div>
              )}
              {step === 1 && (
                <div className="form-grid">
                  {input(
                    "telephoneNumber",
                    "Applicant phone",
                    "tel",
                    "+250 7…",
                  )}
                  {input("email", "Email address", "email", "you@example.com")}
                  <div className="span-2 wizard-divider">
                    Parent, guardian or emergency contact
                  </div>
                  {input("emergencyContactName", "Contact person name")}
                  <label className="field">
                    <span>
                      Relationship <b>*</b>
                    </span>
                    <select
                      {...register("emergencyContactRelationship", {
                        required: "Relationship is required",
                      })}
                    >
                      <option value="">Select relationship</option>
                      {[
                        "Parent",
                        "Guardian",
                        "Brother/Sister",
                        "Relative",
                        "Other",
                      ].map((x) => (
                        <option key={x}>{x}</option>
                      ))}
                    </select>
                    {errors.emergencyContactRelationship && (
                      <small>
                        {errors.emergencyContactRelationship.message}
                      </small>
                    )}
                  </label>
                  <div className="span-2">
                    {input(
                      "emergencyContactPhone",
                      "Contact person phone",
                      "tel",
                      "+250 7…",
                    )}
                  </div>
                </div>
              )}
              {step === 2 && (
                <label className="field">
                  <span>
                    Highest education level <b>*</b>
                  </span>
                  <select
                    {...register("education", {
                      required: "Education level is required",
                    })}
                  >
                    <option value="">Choose your education level</option>
                    {[
                      ["primary", "Primary"],
                      ["ordinary", "Ordinary Level"],
                      ["advanced", "Advanced Level"],
                      ["associate", "Associate Degree"],
                      ["bachelor", "Bachelor’s Degree"],
                      ["master", "Master’s Degree"],
                      ["doctorate", "Doctorate"],
                    ].map(([v, l]) => (
                      <option value={v} key={v}>
                        {l}
                      </option>
                    ))}
                  </select>
                  {errors.education && (
                    <small>{errors.education.message}</small>
                  )}
                </label>
              )}
              {step === 3 && (
                <div className="form-grid">
                  <Select
                    label="Province / Intara"
                    disabled={false}
                    error={errors.province?.message}
                    reg={register("province", {
                      required: "Province is required",
                    })}
                    onChange={(v) => {
                      const x = provinces.find((p) => p.name === v);
                      setProvinceCode(x?.code);
                      setDistrictCode(undefined);
                      setSectorCode(undefined);
                      setCellCode(undefined);
                      setValue("province", v);
                      ["district", "sector", "cell", "village"].forEach((k) =>
                        setValue(k as keyof FormData, ""),
                      );
                    }}
                    options={provinces.map((x) => x.name)}
                  />
                  <Select
                    label="District / Akarere"
                    disabled={!provinceCode}
                    error={errors.district?.message}
                    reg={register("district", {
                      required: "District is required",
                    })}
                    onChange={(v) => {
                      setDistrictCode(
                        districts.find((x) => x.name === v)?.code,
                      );
                      setSectorCode(undefined);
                      setCellCode(undefined);
                      setValue("district", v);
                    }}
                    options={districts.map((x) => x.name)}
                  />
                  <Select
                    label="Sector / Umurenge"
                    disabled={!districtCode}
                    error={errors.sector?.message}
                    reg={register("sector", { required: "Sector is required" })}
                    onChange={(v) => {
                      setSectorCode(sectors.find((x) => x.name === v)?.code);
                      setCellCode(undefined);
                      setValue("sector", v);
                    }}
                    options={sectors.map((x) => x.name)}
                  />
                  <Select
                    label="Cell / Akagari"
                    disabled={!sectorCode}
                    error={errors.cell?.message}
                    reg={register("cell", { required: "Cell is required" })}
                    onChange={(v) => {
                      setCellCode(cells.find((x) => x.name === v)?.code);
                      setValue("cell", v);
                    }}
                    options={cells.map((x) => x.name)}
                  />
                  <div className="span-2">
                    <Select
                      label="Village / Umudugudu"
                      disabled={!cellCode}
                      error={errors.village?.message}
                      reg={register("village", {
                        required: "Village is required",
                      })}
                      onChange={(v) => setValue("village", v)}
                      options={villages.map((x) => x.name)}
                    />
                  </div>
                </div>
              )}
              {step === 4 && (
                <div className="form-grid">
                  <label className="field span-2">
                    <span>
                      Program / Trade to learn <b>*</b>
                    </span>
                    <select
                      {...register("tradeToLearn", {
                        required: "Program is required",
                        onChange: (e) => {
                          const program = programOptions.find(
                            (p) => p.value === e.target.value,
                          );
                          const restriction =
                            program?.restrictedLocation ||
                            (e.target.value === "Church Music Arts"
                              ? trainingLocationValue(TRAINING_LOCATIONS[0])
                              : "");
                          setValue("trainingLocation", restriction);
                        },
                      })}
                    >
                      <option value="">Choose a program</option>
                      {programOptions.map((x) => (
                        <option value={x.value} key={x.value}>
                          {x.label}
                        </option>
                      ))}
                    </select>
                    {errors.tradeToLearn && (
                      <small>{errors.tradeToLearn.message}</small>
                    )}
                  </label>
                  <label className="field span-2">
                    <span>
                      Preferred study location <b>*</b>
                    </span>
                    <select
                      {...register("trainingLocation", {
                        required: "Study location is required",
                      })}
                    >
                      <option value="">Choose a location</option>
                      {locations.map((x) => (
                        <option key={x.name} value={trainingLocationValue(x)}>
                          {x.name} · {x.district} — {x.detail}
                        </option>
                      ))}
                    </select>
                    {restrictedLocation && (
                      <em>
                        This program is available only at {restrictedLocation}.
                      </em>
                    )}
                    {errors.trainingLocation && (
                      <small>{errors.trainingLocation.message}</small>
                    )}
                  </label>
                </div>
              )}
              {step === 5 && (
                <div className="wizard-payment">
                  <div className="payment-summary">
                    <span>Registration fee</span>
                    <strong>{formatRwf(REGISTRATION_FEE)}</strong>
                    <p>{PAYMENT_INSTRUCTIONS.note}</p>
                  </div>
                  <label className="field">
                    <span>
                      Payment method <b>*</b>
                    </span>
                    <select
                      {...register("paymentMethod", {
                        required: "Payment method is required",
                      })}
                    >
                      <option value="">Choose method</option>
                      {PAYMENT_METHODS.map((x) => (
                        <option key={x}>{x}</option>
                      ))}
                    </select>
                  </label>
                  {input("paymentReference", "Transaction / reference")}
                  <label className="upload-field">
                    <FileUp />
                    <strong>Upload payment proof</strong>
                    <span>JPG, PNG or PDF · Maximum 5 MB</span>
                    <input
                      type="file"
                      accept=".jpg,.jpeg,.png,.pdf"
                      {...register("paymentProof", {
                        required: "Payment proof is required",
                        validate: (f) => {
                          if (!f?.[0]) return true;
                          if (f[0].size > 5242880)
                            return "File must be 5 MB or smaller";
                          return (
                            [
                              "image/jpeg",
                              "image/png",
                              "application/pdf",
                            ].includes(f[0].type) ||
                            "Upload a JPG, PNG or PDF file"
                          );
                        },
                      })}
                    />
                    {values.paymentProof?.[0] && (
                      <div className="upload-file">
                        <FileUp />
                        <span>
                          <strong>{values.paymentProof[0].name}</strong>
                          <small>
                            {(
                              values.paymentProof[0].size /
                              1024 /
                              1024
                            ).toFixed(2)}{" "}
                            MB
                          </small>
                        </span>
                      </div>
                    )}
                    {submitting && (
                      <div
                        className="upload-progress"
                        aria-label={`Upload ${uploadProgress}% complete`}
                      >
                        <span style={{ width: `${uploadProgress}%` }} />
                      </div>
                    )}
                    {errors.paymentProof && (
                      <small>{errors.paymentProof.message}</small>
                    )}
                  </label>
                </div>
              )}
              {step === 6 && (
                <div className="review-grid">
                  {[
                    ["Applicant", fullName],
                    ["Contact", `${values.telephoneNumber} · ${values.email}`],
                    ["Education", values.education],
                    [
                      "Home address",
                      [
                        values.village,
                        values.cell,
                        values.sector,
                        values.district,
                        values.province,
                      ]
                        .filter(Boolean)
                        .join(", "),
                    ],
                    ["Program", values.tradeToLearn],
                    ["Study location", values.trainingLocation],
                    [
                      "Payment",
                      `${values.paymentMethod} · ${values.paymentReference}`,
                    ],
                  ].map(([k, v]) => (
                    <div key={k}>
                      <span>{k}</span>
                      <strong>{v}</strong>
                    </div>
                  ))}
                  <div className="review-confirm">
                    <LockKeyhole />
                    <p>Payment is verified manually by ETP after submission.</p>
                  </div>
                </div>
              )}
              <footer className="wizard-actions mt-auto flex items-center justify-between border-t border-black/10 pt-5">
                {step > 0 ? (
                  <button
                    type="button"
                    className="button button-ghost"
                    onClick={() => setStep(step - 1)}
                  >
                    <ArrowLeft />
                    Back
                  </button>
                ) : (
                  <span />
                )}
                {step < 6 ? (
                  <button
                    type="button"
                    className="button button-dark"
                    onClick={next}
                  >
                    Continue
                    <ArrowRight />
                  </button>
                ) : (
                  <button
                    type="submit"
                    disabled={submitting}
                    className="button button-lime"
                  >
                    {submitting
                      ? `Sending for review · ${uploadProgress}%`
                      : "Submit for approval"}
                    <ArrowRight />
                  </button>
                )}
              </footer>
            </form>
          </section>
        </div>
      </main>
    </>
  );
}

function Select({
  label,
  disabled,
  error,
  reg,
  onChange,
  options,
}: {
  label: string;
  disabled: boolean;
  error?: string;
  reg: UseFormRegisterReturn;
  onChange: (value: string) => void;
  options: string[];
}) {
  return (
    <label className="field">
      <span>
        {label} <b>*</b>
      </span>
      <select
        disabled={disabled}
        {...reg}
        onChange={(e) => onChange(e.target.value)}
      >
        <option value="">Select</option>
        {options.map((x) => (
          <option key={x}>{x}</option>
        ))}
      </select>
      {error && <small>{error}</small>}
    </label>
  );
}
