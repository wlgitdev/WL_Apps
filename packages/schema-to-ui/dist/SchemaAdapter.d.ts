import { UISchema, UIFieldDefinition, UIFieldType } from "./DynamicForm";
import { ColumnType, ListSchema } from './DynamicList';
export interface AdapterOptions {
    excludeFields?: string[];
    readOnlyFields?: string[];
    groups?: Array<{
        name: string;
        label: string;
        fields: string[];
        collapsible?: boolean;
    }>;
}
export interface ListAdapterOptions {
    excludeFields?: string[];
    sortableFields?: string[];
    visibleFields?: string[];
    defaultGroupBy?: string;
    showGroupCounts?: boolean;
    enableSelection?: boolean;
    selectionType?: "single" | "multi";
    pageSize?: number;
}
export interface SchemaAdapter<T> {
    /**
     * Convert source schema to UISchema
     */
    toUISchema(sourceSchema: T, options?: AdapterOptions): UISchema;
    /**
     * Convert source schema to ListSchema
     */
    toListSchema<U extends object>(sourceSchema: T, options?: ListAdapterOptions): ListSchema<U>;
    /**
     * Get field type mapping
     */
    getFieldTypeMapping(): Record<string, UIFieldType>;
    /**
     * Get list column type mapping
     */
    getListTypeMapping(): Record<string, string>;
    /**
     * Add custom field type mapping
     */
    addFieldTypeMapping(sourceType: string, uiType: UIFieldType): void;
    /**
     * Add custom list column type mapping
     */
    addListTypeMapping(sourceType: string, listType: string): void;
    /**
     * Process field reference/relations
     */
    processReference(field: any): UIFieldDefinition["reference"] | undefined;
}
export declare abstract class BaseSchemaAdapter<T> implements SchemaAdapter<T> {
    protected fieldTypeMapping: Record<string, UIFieldType>;
    protected listTypeMapping: Record<string, ColumnType>;
    constructor();
    abstract toUISchema(sourceSchema: T, options?: AdapterOptions): UISchema;
    abstract toListSchema<U extends object>(sourceSchema: T, options?: ListAdapterOptions): ListSchema<U>;
    getFieldTypeMapping(): Record<string, UIFieldType>;
    getListTypeMapping(): Record<string, string>;
    addFieldTypeMapping(sourceType: string, uiType: UIFieldType): void;
    addListTypeMapping(sourceType: string, listType: ColumnType): void;
    abstract processReference(field: any): UIFieldDefinition["reference"] | undefined;
    protected getDefaultFieldTypeMapping(): Record<string, UIFieldType>;
    protected getDefaultListTypeMapping(): Record<string, ColumnType>;
    protected formatFieldLabel(fieldName: string): string;
    protected shouldExcludeField(fieldName: string, excludeFields?: string[]): boolean;
    protected isReadOnlyField(fieldName: string, readOnlyFields?: string[]): boolean;
    protected isSortableField(fieldName: string, sortableFields?: string[]): boolean;
}
//# sourceMappingURL=SchemaAdapter.d.ts.map