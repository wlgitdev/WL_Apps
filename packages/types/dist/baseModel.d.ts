export declare const BASE_MODEL_FIELDS: readonly ["recordId", "createdAt", "updatedAt"];
export type BaseModelField = (typeof BASE_MODEL_FIELDS)[number];
export type BaseModelFieldType = {
    recordId: string | undefined;
    createdAt: Date;
    updatedAt: Date;
};
export type BaseModel = Readonly<{
    [K in BaseModelField]: BaseModelFieldType[K];
}>;
//# sourceMappingURL=baseModel.d.ts.map