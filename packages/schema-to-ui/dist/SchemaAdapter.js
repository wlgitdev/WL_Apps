"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BaseSchemaAdapter = void 0;
class BaseSchemaAdapter {
    constructor() {
        this.fieldTypeMapping = this.getDefaultFieldTypeMapping();
        this.listTypeMapping = this.getDefaultListTypeMapping();
    }
    getFieldTypeMapping() {
        return this.fieldTypeMapping;
    }
    getListTypeMapping() {
        return this.listTypeMapping;
    }
    addFieldTypeMapping(sourceType, uiType) {
        this.fieldTypeMapping[sourceType] = uiType;
    }
    addListTypeMapping(sourceType, listType) {
        this.listTypeMapping[sourceType] = listType;
    }
    getDefaultFieldTypeMapping() {
        return {
            String: "text",
            Number: "number",
            Date: "date",
            Boolean: "checkbox",
            ObjectId: "select",
            Array: "multiselect",
        };
    }
    getDefaultListTypeMapping() {
        return {
            String: "text",
            Number: "number",
            Date: "date",
            Boolean: "boolean",
            ObjectId: "reference",
            Array: "array",
        };
    }
    formatFieldLabel(fieldName) {
        return fieldName
            .split(/(?=[A-Z])|_/)
            .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
            .join(" ");
    }
    shouldExcludeField(fieldName, excludeFields = []) {
        return excludeFields.includes(fieldName);
    }
    isReadOnlyField(fieldName, readOnlyFields = []) {
        return readOnlyFields.includes(fieldName);
    }
    isSortableField(fieldName, sortableFields = []) {
        return sortableFields.includes(fieldName);
    }
}
exports.BaseSchemaAdapter = BaseSchemaAdapter;
//# sourceMappingURL=SchemaAdapter.js.map