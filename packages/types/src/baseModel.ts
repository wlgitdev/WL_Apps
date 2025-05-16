export const BASE_MODEL_FIELDS = [
  'recordId',
  'createdAt',
  'updatedAt'
] as const;

export type BaseModelField = (typeof BASE_MODEL_FIELDS)[number];

// Type definition for field types
export type BaseModelFieldType = {
  recordId: string | undefined;
  createdAt: Date;
  updatedAt: Date;
};

// Generate the base model type from the fields
export type BaseModel = Readonly<{
  [K in BaseModelField]: BaseModelFieldType[K];
}>;
