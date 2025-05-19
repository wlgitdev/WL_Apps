"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.listSchemaValidator = void 0;
const zod_1 = require("zod");
// Schema validation
exports.listSchemaValidator = zod_1.z.object({
    columns: zod_1.z.record(zod_1.z.string(), zod_1.z.object({
        label: zod_1.z.string(),
        field: zod_1.z.string(),
        type: zod_1.z.enum(["text", "number", "date", "boolean", "array", "reference", "action"]),
        width: zod_1.z.union([zod_1.z.number(), zod_1.z.string()]).optional(),
        sortable: zod_1.z.boolean().optional(),
        filterable: zod_1.z.boolean().optional(),
        visible: zod_1.z.union([zod_1.z.boolean(), zod_1.z.function()]).optional(),
        className: zod_1.z.union([zod_1.z.string(), zod_1.z.function()]).optional(),
        format: zod_1.z.object({}).optional(),
    })),
    options: zod_1.z.object({
        pagination: zod_1.z.object({
            enabled: zod_1.z.boolean(),
            pageSize: zod_1.z.number().optional(),
            pageSizeOptions: zod_1.z.array(zod_1.z.number()).optional()
        }).optional(),
        selection: zod_1.z.object({
            enabled: zod_1.z.boolean(),
            type: zod_1.z.enum(["single", "multi"]),
            onSelect: zod_1.z.function().optional()
        }).optional(),
        groupBy: zod_1.z.object({
            field: zod_1.z.string(),
            expanded: zod_1.z.boolean().optional(),
            showCounts: zod_1.z.boolean().optional()
        }).optional(),
        selectedActions: zod_1.z.array(zod_1.z.object({
            label: zod_1.z.string(),
            onClick: zod_1.z.function(),
            disabled: zod_1.z.union([zod_1.z.boolean(), zod_1.z.function()]).optional()
        })).optional()
    }).optional()
});
//# sourceMappingURL=ListSchema.js.map