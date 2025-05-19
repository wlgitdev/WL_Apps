"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TransactionController = void 0;
const async_1 = require("../../middleware/async");
const types_1 = require("@wl-apps/types");
const utils_1 = require("../../middleware/utils");
const error_1 = require("../../errors/error");
class TransactionController {
    constructor(entityService) {
        this.entityService = entityService;
        this.filterConfig = types_1.transactionFilterConfig;
        this.create = (0, async_1.asyncHandler)((0, utils_1.withAuth)(async (req, res) => {
            const result = await this.entityService.createTransaction(req.body);
            res.status(201).json(result);
        }));
        this.createBatch = (0, async_1.asyncHandler)((0, utils_1.withAuth)(async (req, res) => {
            if (!Array.isArray(req.body)) {
                throw new error_1.ValidationError('Request body must be an array of transactions');
            }
            const result = await this.entityService.createTransactionsBatch(req.body);
            res.status(201).json(result);
        }));
        this.getAll = (0, async_1.asyncHandler)((0, utils_1.withAuth)(async (req, res) => {
            // Create filters dynamically based on query parameters
            const filters = (0, utils_1.createQueryFilters)(req, this.filterConfig);
            const matchType = req.query.matchType === 'contains' ? 'contains' : 'exact';
            const result = await this.entityService.getTransactions(filters, {
                matchType
            });
            res.status(200).json(result);
        }));
        this.getAllWithinRange = (0, async_1.asyncHandler)((0, utils_1.withAuth)(async (req, res) => {
            const filters = (0, utils_1.createQueryFilters)(req, this.filterConfig);
            const matchType = req.query.matchType === 'contains' ? 'contains' : 'exact';
            const startDate = new Date(req.query.startDate);
            const endDate = new Date(req.query.endDate);
            if (isNaN(startDate.getTime()) || isNaN(endDate.getTime())) {
                return res
                    .status(400)
                    .json({ success: false, message: 'Invalid date range' });
            }
            const result = await this.entityService.getTransactionsWithinRange(startDate, endDate, filters, { matchType });
            res.status(200).json(result);
        }));
        this.update = (0, async_1.asyncHandler)((0, utils_1.withAuth)(async (req, res) => {
            const { id } = req.params;
            if (!id) {
                throw new error_1.ValidationError('Record id is required');
            }
            const result = await this.entityService.updateTransaction(id, req.body);
            res.status(200).json(result);
        }));
        this.updateBatch = (0, async_1.asyncHandler)((0, utils_1.withAuth)(async (req, res) => {
            if (!Array.isArray(req.body)) {
                throw new error_1.ValidationError('Request body must be an array of updates');
            }
            const updates = req.body.map(item => {
                if (!item.recordId || !item.data) {
                    throw new error_1.ValidationError('Each update must contain a recordId and data object');
                }
                return {
                    recordId: item.recordId,
                    data: item.data
                };
            });
            const result = await this.entityService.updateTransactionsBatch(updates);
            res.status(200).json(result);
        }));
        this.delete = (0, async_1.asyncHandler)((0, utils_1.withAuth)(async (req, res) => {
            const { id } = req.params;
            if (!id) {
                throw new error_1.ValidationError('Record id is required');
            }
            const result = await this.entityService.deleteTransaction(id);
            res.status(200).json(result);
        }));
    }
}
exports.TransactionController = TransactionController;
//# sourceMappingURL=transaction.controller.js.map