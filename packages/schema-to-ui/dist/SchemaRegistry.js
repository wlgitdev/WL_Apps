"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SchemaRegistry = void 0;
const ListSchema_1 = require("./DynamicList/types/ListSchema");
const readOnlyFieldsTransformer = (schema, type) => {
    if (type === "form") {
        const formSchema = schema;
        const transformedFields = { ...formSchema.fields };
        Object.entries(transformedFields).forEach(([fieldName, field]) => {
            if (field.readOnly) {
                transformedFields[fieldName] = {
                    ...field
                };
            }
        });
        return {
            ...formSchema,
            fields: transformedFields,
        };
    }
    // For list schemas, no transformation needed
    return schema;
};
class SchemaRegistry {
    constructor(options = {}) {
        this.schemas = new Map();
        this.validators = options.validators || [];
        // Always include readOnlyFieldsTransformer as the first transformer
        this.transformers = [
            readOnlyFieldsTransformer,
            ...(options.transformers || []),
        ];
        this.enableCaching = options.enableCaching ?? true;
    }
    static getInstance(options = {}) {
        if (!SchemaRegistry.instance) {
            SchemaRegistry.instance = new SchemaRegistry(options);
        }
        // If instance exists but new transformers are provided, add them after the readOnlyFieldsTransformer
        else if (options.transformers) {
            SchemaRegistry.instance.transformers = [
                readOnlyFieldsTransformer,
                ...options.transformers,
            ];
        }
        return SchemaRegistry.instance;
    }
    /**
     * Register a new schema with the registry
     */
    registerSchema(name, schema, type) {
        const validationResults = this.validateSchema(schema, type);
        if (!validationResults.valid) {
            throw new Error(`Invalid schema: ${validationResults.errors.join(", ")}`);
        }
        const transformedSchema = this.transformSchema(schema, type);
        // Cache schema
        this.schemas.set(name, {
            schema: transformedSchema,
            type,
            timestamp: Date.now(),
            version: 1,
        });
    }
    /**
     * Get a schema from the registry
     */
    getSchema(name) {
        const cachedSchema = this.schemas.get(name);
        if (!cachedSchema)
            return { schema: null, type: null };
        const schema = this.enableCaching
            ? cachedSchema.schema
            : this.transformSchema(cachedSchema.schema, cachedSchema.type);
        return {
            schema: schema,
            type: cachedSchema.type
        };
    }
    /**
     * Update an existing schema
     */
    updateSchema(name, schema, type) {
        const existing = this.schemas.get(name);
        if (!existing) {
            throw new Error(`Schema ${name} not found`);
        }
        if (existing.type !== type) {
            throw new Error(`Schema type mismatch. Expected ${existing.type}, got ${type}`);
        }
        const validationResults = this.validateSchema(schema, type);
        if (!validationResults.valid) {
            throw new Error(`Invalid schema: ${validationResults.errors.join(", ")}`);
        }
        const transformedSchema = this.transformSchema(schema, type);
        this.schemas.set(name, {
            schema: transformedSchema,
            type,
            timestamp: Date.now(),
            version: existing.version + 1,
        });
    }
    /**
     * Remove a schema from the registry
     */
    removeSchema(name) {
        return this.schemas.delete(name);
    }
    /**
     * Check if a schema exists in the registry
     */
    hasSchema(name) {
        return this.schemas.has(name);
    }
    /**
     * Get schema metadata
     */
    getSchemaMetadata(name) {
        const cached = this.schemas.get(name);
        if (!cached)
            return null;
        return {
            timestamp: cached.timestamp,
            version: cached.version,
        };
    }
    /**
     * Add a new validator
     */
    addValidator(validator) {
        this.validators.push(validator);
    }
    /**
     * Add a new transformer
     */
    addTransformer(transformer) {
        this.transformers.push(transformer);
    }
    /**
     * Clear all cached schemas
     */
    clearCache() {
        this.schemas.clear();
    }
    /**
     * Validate a schema using all registered validators
     */
    validateSchema(schema, type) {
        const errors = [];
        // Built-in validation for list schemas
        if (type === "list") {
            try {
                ListSchema_1.listSchemaValidator.parse(schema);
            }
            catch (error) {
                errors.push(`List schema validation failed: ${error}`);
            }
        }
        // Custom validators
        for (const validator of this.validators) {
            const result = validator(schema, type);
            if (typeof result === "boolean") {
                if (!result) {
                    errors.push("Schema validation failed");
                }
            }
            else {
                if (!result.valid) {
                    errors.push(...result.errors);
                }
            }
        }
        return {
            valid: errors.length === 0,
            errors,
        };
    }
    /**
     * Transform a schema using all registered transformers
     */
    transformSchema(schema, type) {
        return this.transformers.reduce((transformedSchema, transformer) => transformer(transformedSchema, type), { ...schema });
    }
}
exports.SchemaRegistry = SchemaRegistry;
//# sourceMappingURL=SchemaRegistry.js.map