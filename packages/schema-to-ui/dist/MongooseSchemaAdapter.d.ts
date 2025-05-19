import { Schema } from "mongoose";
import { UISchema, UIFieldReference, BaseSchemaAdapter, AdapterOptions, ListAdapterOptions, ListSchema } from ".";
interface MongooseFieldType {
    instance: string;
    options: any;
    schema?: Schema;
}
export declare class MongooseSchemaAdapter extends BaseSchemaAdapter<Schema> {
    toUISchema(mongooseSchema: Schema, options?: AdapterOptions): UISchema;
    toListSchema<T extends object>(mongooseSchema: Schema, options?: ListAdapterOptions): ListSchema<T>;
    private processSchemaFields;
    private processListColumns;
    private isFieldRequired;
    private convertField;
    private convertListColumn;
    private determineFieldType;
    private determineListColumnType;
    processReference(schemaType: MongooseFieldType): UIFieldReference | undefined;
    private processEnumOptions;
    private processVirtuals;
    private processVirtualColumns;
    private inferVirtualType;
    private inferVirtualColumnType;
}
export {};
//# sourceMappingURL=MongooseSchemaAdapter.d.ts.map