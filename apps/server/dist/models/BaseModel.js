"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.baseModelSchema = exports.BASE_MODEL_FIELDS = void 0;
const mongoose_1 = require("mongoose");
const commonValidators_1 = require("./commonValidators");
exports.BASE_MODEL_FIELDS = [
    'recordId',
    'createdAt',
    'updatedAt'
];
exports.baseModelSchema = new mongoose_1.Schema({
    recordId: (0, commonValidators_1.createStringConfig)({
        context: {
            entityName: 'Base Model',
            fieldDisplayName: 'Record ID'
        }
    }),
    createdAt: (0, commonValidators_1.createDateConfig)({
        context: {
            entityName: 'Base Model',
            fieldDisplayName: 'Created At'
        }
    }),
    updatedAt: (0, commonValidators_1.createDateConfig)({
        context: {
            entityName: 'Base Model',
            fieldDisplayName: 'Updated At'
        }
    })
});
//# sourceMappingURL=BaseModel.js.map