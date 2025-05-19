import { Schema } from 'mongoose';
export declare const BASE_MODEL_FIELDS: readonly ["recordId", "createdAt", "updatedAt"];
export type BaseModelField = (typeof BASE_MODEL_FIELDS)[number];
export declare const baseModelSchema: Schema<any, import("mongoose").Model<any, any, any, any, any, any>, {}, {}, {}, {}, import("mongoose").DefaultSchemaOptions, {
    recordId: import("mongoose").SchemaDefinitionProperty;
    createdAt: import("mongoose").SchemaDefinitionProperty;
    updatedAt: import("mongoose").SchemaDefinitionProperty;
}, import("mongoose").Document<unknown, {}, import("mongoose").FlatRecord<{
    recordId: import("mongoose").SchemaDefinitionProperty;
    createdAt: import("mongoose").SchemaDefinitionProperty;
    updatedAt: import("mongoose").SchemaDefinitionProperty;
}>, {}> & import("mongoose").FlatRecord<{
    recordId: import("mongoose").SchemaDefinitionProperty;
    createdAt: import("mongoose").SchemaDefinitionProperty;
    updatedAt: import("mongoose").SchemaDefinitionProperty;
}> & {
    _id: import("mongoose").Types.ObjectId;
} & {
    __v: number;
}>;
//# sourceMappingURL=BaseModel.d.ts.map