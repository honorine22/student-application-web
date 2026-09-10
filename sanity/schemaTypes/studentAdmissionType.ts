import { defineField, defineType } from "sanity";

const programs = [
  "Tailoring",
  "Electronic Services",
  "Masonry",
  "Automobile Repair and Maintenance",
  "Church Music Arts",
  "Videography",
  "Mobile Phone Repair",
  "Domestic Electricity",
  "Provisional permit",
  "Licence Cat B",
  "Licence Cat A",
];
export const studentAdmissionType = defineType({
  name: "studentAdmission",
  title: "Student Admission",
  type: "document",
  fields: [
    defineField({
      name: "fullName",
      title: "Full Name",
      type: "string",
      readOnly: true,
    }),
    defineField({
      name: "firstName",
      title: "First Name",
      type: "string",
      validation: (R) => R.required().min(2),
    }),
    defineField({
      name: "lastName",
      title: "Last Name",
      type: "string",
      validation: (R) => R.required().min(2),
    }),
    defineField({
      name: "nationalIDNumber",
      title: "National ID",
      type: "string",
      validation: (R) =>
        R.required().regex(/^\d{16}$/, { name: "16-digit National ID" }),
    }),
    defineField({
      name: "email",
      title: "Email",
      type: "string",
      validation: (R) => R.required().email(),
    }),
    defineField({
      name: "telephoneNumber",
      title: "Applicant Phone",
      type: "string",
      validation: (R) =>
        R.required().regex(/^(?:\+250|0)7\d{8}$/, {
          name: "Rwanda phone number",
        }),
    }),
    defineField({
      name: "education",
      title: "Highest Education Level",
      type: "string",
    }),
    defineField({
      name: "country",
      title: "Country (legacy)",
      type: "string",
      hidden: true,
    }),
    defineField({
      name: "province",
      title: "Province / Intara",
      type: "string",
    }),
    defineField({
      name: "district",
      title: "District / Akarere",
      type: "string",
    }),
    defineField({ name: "sector", title: "Sector / Umurenge", type: "string" }),
    defineField({ name: "cell", title: "Cell / Akagari", type: "string" }),
    defineField({
      name: "village",
      title: "Village / Umudugudu",
      type: "string",
    }),
    defineField({
      name: "tradeToLearn",
      title: "Program / Trade to Learn",
      type: "string",
      options: { list: programs.map((x) => ({ title: x, value: x })) },
      validation: (R) => R.required(),
    }),
    defineField({
      name: "trainingLocation",
      title: "Preferred Study Location",
      type: "string",
      description: "Church Music Arts is available only at Karama.",
      validation: (R) => R.required(),
    }),
    defineField({
      name: "emergencyContactName",
      title: "Emergency Contact Name",
      type: "string",
    }),
    defineField({
      name: "emergencyContactRelationship",
      title: "Relationship",
      type: "string",
      options: {
        list: ["Parent", "Guardian", "Brother/Sister", "Relative", "Other"],
      },
    }),
    defineField({
      name: "emergencyContactPhone",
      title: "Emergency Contact Phone",
      type: "string",
    }),
    defineField({
      name: "registrationFee",
      title: "Registration Fee (RWF)",
      type: "number",
      initialValue: 5000,
      validation: (R) => R.min(0),
    }),
    defineField({
      name: "paymentMethod",
      title: "Payment Method",
      type: "string",
    }),
    defineField({
      name: "paymentReference",
      title: "Transaction / Reference",
      type: "string",
    }),
    defineField({
      name: "paymentProof",
      title: "Proof of Payment",
      type: "file",
      description:
        "Applicant payment evidence. Keep access limited to authorized staff.",
      options: { accept: "image/jpeg,image/png,application/pdf" },
    }),
    defineField({
      name: "paymentStatus",
      title: "Payment Status",
      type: "string",
      initialValue: "pending",
      options: {
        list: [
          { title: "Pending Verification", value: "pending" },
          { title: "Payment Confirmed", value: "confirmed" },
          { title: "Needs Review", value: "needsReview" },
          { title: "Payment Rejected", value: "rejected" },
        ],
      },
    }),
    defineField({
      name: "applicationStatus",
      title: "Application Status",
      type: "string",
      initialValue: "submitted",
      options: {
        list: [
          { title: "Submitted", value: "submitted" },
          { title: "Under Review", value: "underReview" },
          { title: "Approved", value: "approved" },
          { title: "Rejected", value: "rejected" },
        ],
      },
    }),
    defineField({
      name: "status",
      title: "Legacy Admission Status",
      type: "string",
      hidden: true,
    }),
    defineField({
      name: "createdAt",
      title: "Submitted At",
      type: "datetime",
      readOnly: true,
    }),
    defineField({
      name: "updatedAt",
      title: "Updated At",
      type: "datetime",
      readOnly: true,
    }),
  ],
  preview: {
    select: {
      firstName: "firstName",
      lastName: "lastName",
      program: "tradeToLearn",
      status: "paymentStatus",
    },
    prepare: ({ firstName, lastName, program, status }) => ({
      title:
        `${firstName || ""} ${lastName || ""}`.trim() || "Unnamed applicant",
      subtitle: `${program || "No program"} · ${status || "pending"}`,
    }),
  },
});
