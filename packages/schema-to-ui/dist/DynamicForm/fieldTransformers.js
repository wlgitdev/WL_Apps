"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.FieldTransformer = void 0;
class FieldTransformer {
    constructor(definition) {
        this.definition = definition;
    }
    toDisplay(value) {
        // Use custom mapper if provided
        if (this.definition.valueMapper?.toDisplay) {
            return this.definition.valueMapper.toDisplay(value);
        }
        // Handle BitFlags
        if (this.definition.bitFlags && typeof value === "number") {
            return this.transformBitFlagsToDisplay(value);
        }
        // Handle option groups
        if (this.definition.optionGroups && Array.isArray(value)) {
            return this.transformOptionGroupsToDisplay(value);
        }
        return this.defaultToDisplay(value);
    }
    fromDisplay(value) {
        // Use custom mapper if provided
        if (this.definition.valueMapper?.fromDisplay) {
            return this.definition.valueMapper.fromDisplay(value);
        }
        // Handle BitFlags
        if (this.definition.bitFlags && Array.isArray(value)) {
            return this.transformBitFlagsFromDisplay(value);
        }
        // Handle option groups
        if (this.definition.optionGroups && Array.isArray(value)) {
            return this.transformOptionGroupsFromDisplay(value);
        }
        return this.defaultFromDisplay(value);
    }
    transformBitFlagsToDisplay(value) {
        const selectedFlags = [];
        Object.values(this.definition.bitFlags.groups).forEach((group) => {
            group.options.forEach((option) => {
                if ((value & option.value) === option.value) {
                    selectedFlags.push(option.value);
                }
            });
        });
        return selectedFlags;
    }
    transformBitFlagsFromDisplay(values) {
        return values.reduce((acc, val) => acc | val, 0);
    }
    transformOptionGroupsToDisplay(value) {
        return value.map(String);
    }
    transformOptionGroupsFromDisplay(values) {
        return values;
    }
    defaultToDisplay(value) {
        if (value === null || value === undefined) {
            switch (this.definition.type) {
                case "text":
                case "select":
                case "date":
                    return "";
                case "number":
                    return 0;
                case "checkbox":
                    return false;
                case "multiselect":
                case "list":
                    return [];
                default:
                    return "";
            }
        }
        switch (this.definition.type) {
            case "date":
                return value instanceof Date
                    ? value.toISOString().split("T")[0]
                    : String(value || "");
            case "number":
                return Number(value || 0);
            case "multiselect":
            case "list":
                return Array.isArray(value) ? value : [];
            case "checkbox":
                return Boolean(value);
            default:
                return String(value || "");
        }
    }
    defaultFromDisplay(value) {
        if (value === null || value === undefined) {
            return null;
        }
        switch (this.definition.type) {
            case "date":
                return value ? new Date(value) : null;
            case "number":
                return Number(value);
            case "multiselect":
            case "list":
                return Array.isArray(value) ? value : [String(value)];
            case "checkbox":
                return Boolean(value);
            default:
                return String(value);
        }
    }
    getDefaultDisplayValue() {
        switch (this.definition.type) {
            case "text":
                return "";
            case "number":
                return 0;
            case "date":
                return "";
            case "checkbox":
                return false;
            case "select":
                return "";
            case "multiselect":
            case "list":
                return [];
            default:
                return null;
        }
    }
}
exports.FieldTransformer = FieldTransformer;
//# sourceMappingURL=fieldTransformers.js.map