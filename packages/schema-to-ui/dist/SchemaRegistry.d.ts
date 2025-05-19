import { UISchema } from "./DynamicForm/types/schemaUI";
import { ListSchema } from "./DynamicList/types/ListSchema";
export type SchemaType = "form" | "list";
export type Schema = UISchema | ListSchema;
export type SchemaValidator = (schema: Schema, type: SchemaType) => boolean | {
    valid: boolean;
    errors: string[];
};
export type SchemaTransformer = (schema: Schema, type: SchemaType) => Schema;
interface SchemaRegistryOptions {
    validators?: SchemaValidator[];
    transformers?: SchemaTransformer[];
    enableCaching?: boolean;
}
export declare class SchemaRegistry {
    private schemas;
    private validators;
    private transformers;
    private enableCaching;
    private static instance;
    private constructor();
    static getInstance(options?: SchemaRegistryOptions): SchemaRegistry;
    /**
     * Register a new schema with the registry
     */
    registerSchema(name: string, schema: Schema, type: SchemaType): void;
    /**
     * Get a schema from the registry
     */
    getSchema<T extends Schema>(name: string): {
        schema: T | null;
        type: SchemaType | null;
    };
    /**
     * Update an existing schema
     */
    updateSchema(name: string, schema: Schema, type: SchemaType): void;
    /**
     * Remove a schema from the registry
     */
    removeSchema(name: string): boolean;
    /**
     * Check if a schema exists in the registry
     */
    hasSchema(name: string): boolean;
    /**
     * Get schema metadata
     */
    getSchemaMetadata(name: string): {
        timestamp: number;
        version: number;
    } | null;
    /**
     * Add a new validator
     */
    addValidator(validator: SchemaValidator): void;
    /**
     * Add a new transformer
     */
    addTransformer(transformer: SchemaTransformer): void;
    /**
     * Clear all cached schemas
     */
    clearCache(): void;
    /**
     * Validate a schema using all registered validators
     */
    private validateSchema;
    /**
     * Transform a schema using all registered transformers
     */
    private transformSchema;
}
export {};
//# sourceMappingURL=SchemaRegistry.d.ts.map