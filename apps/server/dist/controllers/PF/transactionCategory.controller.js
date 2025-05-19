"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TransactionCategoryController = void 0;
const async_1 = require("../../middleware/async");
const types_1 = require("@wl-apps/types");
const utils_1 = require("../../middleware/utils");
const error_1 = require("../../errors/error");
class TransactionCategoryController {
    constructor(transactionCategoryService) {
        this.transactionCategoryService = transactionCategoryService;
        this.filterConfig = types_1.transactionCategoryFilterConfig;
        this.create = (0, async_1.asyncHandler)((0, utils_1.withAuth)(async (req, res) => {
            const result = await this.transactionCategoryService.createTransactionCategory(req.body);
            res.status(201).json(result);
        }));
        this.getAll = (0, async_1.asyncHandler)((0, utils_1.withAuth)(async (req, res) => {
            // Create filters dynamically based on query parameters
            const filters = (0, utils_1.createQueryFilters)(req, this.filterConfig);
            const matchType = req.query.matchType === 'contains' ? 'contains' : 'exact';
            const result = await this.transactionCategoryService.getTransactionCategories(filters, { matchType });
            res.status(200).json(result);
        }));
        this.update = (0, async_1.asyncHandler)((0, utils_1.withAuth)(async (req, res) => {
            const { id } = req.params;
            if (!id) {
                throw new error_1.ValidationError("Record Id is required");
            }
            const result = await this.transactionCategoryService.updateTransactionCategory(id, req.body);
            res.status(200).json(result);
        }));
        this.delete = (0, async_1.asyncHandler)((0, utils_1.withAuth)(async (req, res) => {
            const { id } = req.params;
            if (!id) {
                throw new error_1.ValidationError("Record Id is required");
            }
            const result = await this.transactionCategoryService.deleteTransactionCategory(id);
            res.status(200).json(result);
        }));
    }
}
exports.TransactionCategoryController = TransactionCategoryController;
//# sourceMappingURL=transactionCategory.controller.js.map