import { Schema } from 'mongoose';
import { createDateConfig, createStringConfig } from './commonValidators';

export const BASE_MODEL_FIELDS = [
  'recordId',
  'createdAt',
  'updatedAt'
] as const;
export type BaseModelField = (typeof BASE_MODEL_FIELDS)[number];

export const baseModelSchema = new Schema({
  recordId: createStringConfig({
    context: {
      entityName: 'Base Model',
      fieldDisplayName: 'Record ID'
    }
  }),
  createdAt: createDateConfig({
    context: {
      entityName: 'Base Model',
      fieldDisplayName: 'Created At'
    }
  }),
  updatedAt: createDateConfig({
    context: {
      entityName: 'Base Model',
      fieldDisplayName: 'Updated At'
    }
  })
});

export const isBaseModelField = (
  fieldName: string
): fieldName is BaseModelField => {
  return BASE_MODEL_FIELDS.includes(fieldName as BaseModelField);
};
