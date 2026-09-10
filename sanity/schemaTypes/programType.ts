import { defineField, defineType } from "sanity";

export const programType = defineType({
  name: "program",
  title: "Program",
  type: "document",
  fields: [
    defineField({
      name: "title",
      title: "Program Name",
      type: "string",
      validation: (R) => R.required().min(2),
    }),
    defineField({
      name: "description",
      title: "Short Description",
      type: "text",
      rows: 3,
    }),
    defineField({
      name: "isActive",
      title: "Available for Applications",
      type: "boolean",
      initialValue: true,
    }),
    defineField({
      name: "restrictedLocation",
      title: "Required Study Location",
      type: "string",
      description: "Leave empty when applicants may choose any study location.",
    }),
    defineField({
      name: "sortOrder",
      title: "Display Order",
      type: "number",
      initialValue: 10,
    }),
    defineField({
      name: "createdAt",
      title: "Created At",
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
    select: { title: "title", active: "isActive" },
    prepare: ({ title, active }) => ({
      title,
      subtitle: active ? "Accepting applications" : "Inactive",
    }),
  },
});
