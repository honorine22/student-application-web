import { type SchemaTypeDefinition } from "sanity";

import { studentAdmissionType } from "./studentAdmissionType";
import { notificationType } from "./notificationType";
import { programType } from "./programType";

export const schema: { types: SchemaTypeDefinition[] } = {
  types: [studentAdmissionType, notificationType, programType],
};
