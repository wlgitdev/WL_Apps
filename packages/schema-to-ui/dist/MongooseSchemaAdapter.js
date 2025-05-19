"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MongooseSchemaAdapter = void 0;
const _1 = require(".");
class MongooseSchemaAdapter extends _1.BaseSchemaAdapter {
    toUISchema(mongooseSchema, options = {}) {
        const { excludeFields = ["_id", "__v"], readOnlyFields = [], groups = [], } = options;
        const fields = {};
        // Process regular fields
        this.processSchemaFields(mongooseSchema, "", fields, excludeFields, readOnlyFields);
        // Process virtuals
        const virtuals = this.processVirtuals(mongooseSchema, excludeFields);
        Object.assign(fields, virtuals);
        // Update groups to include only existing fields
        const validGroups = groups.map((group) => ({
            ...group,
            fields: group.fields.filter((field) => fields[field] !== undefined),
        }));
        return {
            fields,
            layout: {
                groups: validGroups,
                order: validGroups.flatMap((group) => group.fields),
            },
        };
    }
    toListSchema(mongooseSchema, options = {}) {
        const { excludeFields = ["_id", "__v"], sortableFields = [], visibleFields = [], defaultGroupBy, showGroupCounts = true, enableSelection = false, selectionType = "multi", pageSize = 10, } = options;
        const columns = {};
        // Process regular fields
        this.processListColumns(mongooseSchema, "", columns, excludeFields, sortableFields, visibleFields);
        // Process virtuals
        const virtualColumns = this.processVirtualColumns(mongooseSchema, excludeFields, sortableFields);
        Object.assign(columns, virtualColumns);
        // Build the list schema
        const listSchema = {
            columns,
            options: {
                pagination: {
                    enabled: true,
                    pageSize,
                },
            },
        };
        // Add selection if enabled
        if (enableSelection) {
            listSchema.options.selection = {
                enabled: true,
                type: selectionType,
            };
        }
        // Add grouping if specified
        if (defaultGroupBy) {
            listSchema.options.groupBy = {
                field: defaultGroupBy,
                showCounts: showGroupCounts,
                expanded: true,
            };
        }
        return listSchema;
    }
    processSchemaFields(schema, prefix, fields, excludeFields, readOnlyFields) {
        schema.eachPath((path, schemaType) => {
            const fullPath = prefix ? `${prefix}.${path}` : path;
            if (this.shouldExcludeField(fullPath, excludeFields))
                return;
            // Handle nested schemas
            if (schemaType.schema) {
                this.processSchemaFields(schemaType.schema, fullPath, fields, excludeFields, readOnlyFields);
                return;
            }
            fields[fullPath] = this.convertField(fullPath, schemaType, readOnlyFields);
        });
    }
    processListColumns(schema, prefix, columns, excludeFields, sortableFields, visibleFields) {
        schema.eachPath((path, schemaType) => {
            const fullPath = prefix ? `${prefix}.${path}` : path;
            if (this.shouldExcludeField(fullPath, excludeFields))
                return;
            // Handle nested schemas
            if (schemaType.schema) {
                this.processListColumns(schemaType.schema, fullPath, columns, excludeFields, sortableFields, visibleFields);
                return;
            }
            // Skip hidden fields if visibleFields is specified and doesn't include this field
            if (visibleFields.length > 0 && !visibleFields.includes(fullPath))
                return;
            columns[fullPath] = this.convertListColumn(fullPath, schemaType, sortableFields);
        });
    }
    isFieldRequired(schemaType) {
        // Check direct required flag
        if (schemaType.options?.required) {
            return true;
        }
        // Check nested required in type definition
        if (Array.isArray(schemaType.options.type) &&
            schemaType.options.type[0]?.required) {
            return true;
        }
        // Check for validation array
        if (Array.isArray(schemaType.options?.validate)) {
            return schemaType.options.validate.some((validator) => validator.required || validator.options?.required);
        }
        return false;
    }
    convertField(fieldName, schemaType, readOnlyFields) {
        const isReadOnly = this.isReadOnlyField(fieldName, readOnlyFields);
        const isRequired = this.isFieldRequired(schemaType);
        const baseField = {
            type: this.determineFieldType(schemaType),
            label: this.formatFieldLabel(fieldName),
            ...(isReadOnly ? { readOnly: true } : {}),
            ...(isRequired ? { validation: { required: true } } : {}),
        };
        // Add reference if it exists
        const reference = this.processReference(schemaType);
        if (reference) {
            baseField.reference = reference;
        }
        // Handle enums
        if (schemaType.options.enum || schemaType.options.type?.[0]?.enum) {
            const enumValues = schemaType.options.enum || schemaType.options.type[0].enum;
            baseField.options = this.processEnumOptions(enumValues);
            baseField.type =
                schemaType.instance === "Array" ? "multiselect" : "select";
        }
        return baseField;
    }
    convertListColumn(fieldName, schemaType, sortableFields) {
        const isSortable = this.isSortableField(fieldName, sortableFields);
        const baseColumn = {
            label: this.formatFieldLabel(fieldName),
            field: fieldName,
            type: this.determineListColumnType(schemaType),
            sortable: isSortable,
        };
        // Add reference configuration if it's a reference field
        const reference = this.processReference(schemaType);
        if (reference) {
            baseColumn.reference = {
                queryKey: [`${reference.modelName.toLowerCase()}-list`],
                collection: reference.modelName,
                valueField: "_id",
            };
            // Add format for reference display
            baseColumn.format = {
                reference: {
                    labelField: reference.displayField,
                    fallback: "-",
                },
            };
        }
        // Handle enums
        if (schemaType.options.enum || schemaType.options.type?.[0]?.enum) {
            // For enums, we still use "text" type but provide formatting options
            baseColumn.type = "text";
            // Could add more sophisticated handling for enum values if needed
            baseColumn.format = {
                text: {
                    transform: "capitalize",
                },
            };
        }
        // Add specific format for dates
        if (baseColumn.type === "date") {
            baseColumn.format = {
                date: {
                    format: "MMM dd, yyyy",
                    timezone: "UTC",
                },
            };
        }
        return baseColumn;
    }
    determineFieldType(schemaType) {
        // Handle array references
        if (Array.isArray(schemaType.options.type) &&
            schemaType.options.type[0]?.ref) {
            return "multiselect";
        }
        // Handle single references
        if (schemaType.options.ref) {
            return "select";
        }
        // Handle enum types
        if (schemaType.options.enum || schemaType.options.type?.[0]?.enum) {
            return schemaType.instance === "Array" ? "multiselect" : "select";
        }
        // Handle array types
        if (schemaType.instance === "Array") {
            return "list";
        }
        // Use standard type mapping
        return this.fieldTypeMapping[schemaType.instance] || "text";
    }
    determineListColumnType(schemaType) {
        // Handle array references
        if (Array.isArray(schemaType.options.type) &&
            schemaType.options.type[0]?.ref) {
            return "reference";
        }
        // Handle single references
        if (schemaType.options.ref) {
            return "reference";
        }
        // Use standard type mapping
        return this.listTypeMapping[schemaType.instance] || "text";
    }
    processReference(schemaType) {
        // Handle array references
        if (Array.isArray(schemaType.options.type) &&
            schemaType.options.type[0]?.ref) {
            return {
                modelName: schemaType.options.type[0].ref,
                displayField: "name",
                multiple: true,
            };
        }
        // Handle single references
        if (schemaType.options.ref) {
            return {
                modelName: schemaType.options.ref,
                displayField: "name",
                multiple: false,
            };
        }
        return undefined;
    }
    processEnumOptions(enumValues) {
        return enumValues.map((value) => ({
            value,
            label: this.formatFieldLabel(value.toString()),
        }));
    }
    processVirtuals(mongooseSchema, excludeFields) {
        const virtualFields = {};
        const virtuals = mongooseSchema.virtuals;
        Object.entries(virtuals).forEach(([virtualPath, virtual]) => {
            if (this.shouldExcludeField(virtualPath, excludeFields))
                return;
            if (virtual.options?.ref)
                return; // Skip populated virtuals
            const getterFunction = virtual.getters?.[0]?.toString() || "";
            virtualFields[virtualPath] = {
                type: this.inferVirtualType(getterFunction),
                label: this.formatFieldLabel(virtualPath),
                readOnly: true,
                description: `Calculated field: ${virtualPath}`,
            };
        });
        return virtualFields;
    }
    processVirtualColumns(mongooseSchema, excludeFields, sortableFields) {
        const virtualColumns = {};
        const virtuals = mongooseSchema.virtuals;
        Object.entries(virtuals).forEach(([virtualPath, virtual]) => {
            if (this.shouldExcludeField(virtualPath, excludeFields))
                return;
            if (virtual.options?.ref)
                return; // Skip populated virtuals
            const getterFunction = virtual.getters?.[0]?.toString() || "";
            const columnType = this.inferVirtualColumnType(getterFunction);
            virtualColumns[virtualPath] = {
                label: this.formatFieldLabel(virtualPath),
                field: virtualPath,
                type: columnType,
                sortable: this.isSortableField(virtualPath, sortableFields),
            };
            // Add specific formatting based on column type
            if (columnType === "boolean") {
                virtualColumns[virtualPath].format = {
                    boolean: {
                        trueText: "Yes",
                        falseText: "No",
                    },
                };
            }
            else if (columnType === "date") {
                virtualColumns[virtualPath].format = {
                    date: {
                        format: "MMM dd, yyyy",
                    },
                };
            }
            else if (columnType === "number") {
                virtualColumns[virtualPath].format = {
                    number: {
                        precision: 2,
                    },
                };
            }
        });
        return virtualColumns;
    }
    inferVirtualType(getterFunction) {
        // Check for boolean comparisons and returns
        if (/return.*[><=!]+/.test(getterFunction) ||
            getterFunction.includes("Boolean") ||
            /\btrue\b/.test(getterFunction) ||
            /\bfalse\b/.test(getterFunction)) {
            return "checkbox";
        }
        // Check for date operations
        if (getterFunction.includes("new Date") ||
            getterFunction.includes("Date(") ||
            getterFunction.includes("Date") ||
            getterFunction.includes("date")) {
            return "date";
        }
        // Check for numeric operations
        if (getterFunction.includes("Number") ||
            getterFunction.includes("Math.") ||
            /[-+*/%]/.test(getterFunction) ||
            /\d+/.test(getterFunction)) {
            return "number";
        }
        // Check for array operations
        if (getterFunction.includes("Array") || getterFunction.includes("[]")) {
            return "list";
        }
        // Default to text for string concatenation and other string operations
        return "text";
    }
    inferVirtualColumnType(getterFunction) {
        // Check for boolean comparisons and returns
        if (/return.*[><=!]+/.test(getterFunction) ||
            getterFunction.includes("Boolean") ||
            /\btrue\b/.test(getterFunction) ||
            /\bfalse\b/.test(getterFunction)) {
            return "boolean";
        }
        // Check for date operations
        if (getterFunction.includes("new Date") ||
            getterFunction.includes("Date(") ||
            getterFunction.includes("Date") ||
            getterFunction.includes("date")) {
            return "date";
        }
        // Check for numeric operations
        if (getterFunction.includes("Number") ||
            getterFunction.includes("Math.") ||
            /[-+*/%]/.test(getterFunction) ||
            /\d+/.test(getterFunction)) {
            return "number";
        }
        // Check for array operations
        if (getterFunction.includes("Array") || getterFunction.includes("[]")) {
            return "array";
        }
        // Default to text for string concatenation and other string operations
        return "text";
    }
}
exports.MongooseSchemaAdapter = MongooseSchemaAdapter;
//# sourceMappingURL=MongooseSchemaAdapter.js.map