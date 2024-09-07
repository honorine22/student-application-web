import { type SchemaTypeDefinition } from 'sanity'

import {studentAdmissionType} from './studentAdmissionType'

export const schema: { types: SchemaTypeDefinition[] } = {
  types: [studentAdmissionType],
}
