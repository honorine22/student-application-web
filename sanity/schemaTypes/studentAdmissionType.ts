import { defineField, defineType } from 'sanity';

export const studentAdmissionType = defineType({
  name: 'studentAdmission',
  title: 'Student Admission',
  type: 'document',
  fields: [
    defineField({ name: 'firstName', title: 'First Name', type: 'string', validation: Rule => Rule.required() }),
    defineField({ name: 'lastName', title: 'Last Name', type: 'string', validation: Rule => Rule.required() }),
    defineField({ name: 'telephoneNumber', title: 'Telephone Number', type: 'string', validation: Rule => Rule.required() }),
    defineField({ name: 'nationalIDNumber', title: 'National ID Number', type: 'string', validation: Rule => Rule.required() }),
    defineField({ name: 'country', title: 'Country', type: 'string', validation: Rule => Rule.required() }),
    defineField({ name: 'district', title: 'District', type: 'string', validation: Rule => Rule.required() }),
    defineField({ name: 'sector', title: 'Sector', type: 'string', validation: Rule => Rule.required() }),
    defineField({ name: 'village', title: 'Village', type: 'string', validation: Rule => Rule.required() }),
    defineField({
      name: 'email',
      title: 'Email',
      type: 'string',
      validation: Rule => 
        Rule.required()
          .email()
          .max(255) // Adjust the maximum length if needed
    }),
    defineField({
      name: 'education',
      title: 'Education',
      type: 'string',
          options: {
            list: [
              { title: 'Primary', value: 'primary' },
              { title: 'Ordinary Level', value: 'ordinary' },
              { title: 'Advanced Level', value: 'advanced' },
              { title: 'Associate Degree', value: 'associate' },
              { title: 'Bachelor\'s Degree', value: 'bachelor' },
              { title: 'Master\'s Degree', value: 'master' },
              { title: 'Doctorate', value: 'doctorate' }
  ]}
    }),
    defineField({
      name: 'tradeToLearn',
      title: 'Trade to Learn',
      type: 'string',
      options: {
        list: [
          { title: 'Tailoring/Ubudozi', value: 'Tailoring' },
          { title: 'Electronic Services', value: 'Electronic Services' },
          { title: 'Masonry/Ubwubatsi', value: 'Masonry' },
          { title: 'Automobile Repair and Maintenance/Ubukanishi', value: 'Automobile Repair and Maintenance' },
          { title: 'Church Music/Umuziki ukoreshwa mu nsengero/Kiliziya', value: 'Church Music' },
          { title: 'Provisional permit/Kwiga amategeko y\'umuhanda', value: 'Provisional permit' },
          { title: 'Licence Cat B/Gutwara imodoka', value: 'Licence Cat B' },
          { title: 'Licence Cat A', value: 'Licence Cat A' },
        ],
      },
      validation: Rule => Rule.required(),
    }),
    defineField({
      name: 'status',
      title: 'Status',
      type: 'string',
      options: {
        list: [
          { title: 'Pending', value: 'pending' },
          { title: 'Approved', value: 'approved' },
          { title: 'Rejected', value: 'rejected' },
        ],
      },
      initialValue: 'pending', // Default status
      validation: Rule => Rule.required(),
    }),
  ],
});
