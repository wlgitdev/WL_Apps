import { SchemaDefinitionProperty } from "mongoose";
interface FieldContext {
    entityName: string;
    fieldDisplayName?: string;
}
export declare const createNumericConfig: (options?: {
    min?: number;
    max?: number;
    required?: boolean;
    default?: number;
    context?: FieldContext;
}) => SchemaDefinitionProperty;
export declare const createStringConfig: (options?: {
    allowSelect?: boolean;
    minLength?: number;
    maxLength?: number;
    required?: boolean;
    pattern?: RegExp;
    patternMessage?: string;
    context?: FieldContext;
}) => SchemaDefinitionProperty;
export declare const createDateConfig: (options?: {
    required?: boolean;
    min?: Date;
    max?: Date;
    context?: FieldContext;
}) => SchemaDefinitionProperty;
export declare const createReferenceConfig: (options: {
    modelName: string;
    required?: boolean;
    context?: FieldContext;
}) => SchemaDefinitionProperty;
export declare const createArrayConfig: (options: {
    minLength?: number;
    maxLength?: number;
    required?: boolean;
    unique?: boolean;
    context?: FieldContext;
}) => SchemaDefinitionProperty;
export declare const createArrayReferencesConfig: (options: {
    modelName: string;
    minLength?: number;
    maxLength?: number;
    required?: boolean;
    unique?: boolean;
    context?: FieldContext;
}) => SchemaDefinitionProperty;
export declare const createBooleanConfig: (options?: {
    required?: boolean;
    context?: FieldContext;
}) => SchemaDefinitionProperty;
export declare const createEnumConfig: <T extends string | number>(options: {
    values: readonly T[];
    required?: boolean;
    context?: FieldContext;
    default?: T;
}) => SchemaDefinitionProperty;
export {};
//# sourceMappingURL=commonValidators.d.ts.map