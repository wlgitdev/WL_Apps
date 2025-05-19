"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ValidationService = void 0;
class ValidationService {
    constructor(schema) {
        this.schema = schema;
    }
    isFieldValidatable(field) {
        if (field.hidden || field.readOnly) {
            return false;
        }
        return true;
    }
    validateField(fieldName, value) {
        const field = this.schema.fields[fieldName];
        if (!field?.validation || !this.isFieldValidatable(field))
            return null;
        // Required field validation
        if (field.validation.required) {
            if (value === undefined || value === null || value === "") {
                return {
                    field: fieldName,
                    message: field.validation.message || `${field.label} is required`,
                };
            }
            // Array type validation (multiselect, list)
            if ((field.type === "multiselect" || field.type === "list") &&
                Array.isArray(value) &&
                value.length === 0) {
                return {
                    field: fieldName,
                    message: field.validation.message || `${field.label} is required`,
                };
            }
        }
        return null;
    }
    validateForm(values) {
        const errors = [];
        Object.entries(this.schema.fields).forEach(([fieldName, field]) => {
            if (!this.isFieldValidatable(field))
                return;
            const error = this.validateField(fieldName, values[fieldName]);
            if (error) {
                errors.push(error);
            }
        });
        return errors;
    }
    isValid(values) {
        return this.validateForm(values).length === 0;
    }
}
exports.ValidationService = ValidationService;
//# sourceMappingURL=ValidationService.js.map