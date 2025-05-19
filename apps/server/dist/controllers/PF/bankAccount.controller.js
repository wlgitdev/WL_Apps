"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BankAccountController = void 0;
const async_1 = require("../../middleware/async");
const types_1 = require("@wl-apps/types");
const utils_1 = require("../../middleware/utils");
const error_1 = require("../../errors/error");
class BankAccountController {
    constructor(bankAccountService, forecastService) {
        this.bankAccountService = bankAccountService;
        this.forecastService = forecastService;
        this.filterConfig = types_1.bankAccountFilterConfig;
        this.create = (0, async_1.asyncHandler)((0, utils_1.withAuth)(async (req, res) => {
            const result = await this.bankAccountService.createBankAccount(req.body);
            res.status(201).json(result);
        }));
        this.getAll = (0, async_1.asyncHandler)((0, utils_1.withAuth)(async (req, res) => {
            // Create filters dynamically based on query parameters
            const filters = (0, utils_1.createQueryFilters)(req, this.filterConfig);
            const matchType = req.query.matchType === 'contains' ? 'contains' : 'exact';
            const result = await this.bankAccountService.getBankAccounts(filters, { matchType });
            res.status(200).json(result);
        }));
        this.update = (0, async_1.asyncHandler)((0, utils_1.withAuth)(async (req, res) => {
            const { id } = req.params;
            if (!id) {
                throw new error_1.ValidationError("Record id is required");
            }
            const result = await this.bankAccountService.updateBankAccount(id, req.body);
            res.status(200).json(result);
        }));
        this.delete = (0, async_1.asyncHandler)((0, utils_1.withAuth)(async (req, res) => {
            const { id } = req.params;
            if (!id) {
                throw new error_1.ValidationError("Record id is required");
            }
            const result = await this.bankAccountService.deleteBankAccount(id);
            res.status(200).json(result);
        }));
        this.generateForecast = (0, async_1.asyncHandler)((0, utils_1.withAuth)(async (req, res) => {
            const { id } = req.params;
            const { startDate, endDate } = req.body;
            if (!id) {
                throw new error_1.ValidationError("id is required");
            }
            if (!startDate || !endDate) {
                throw new error_1.ValidationError("startDate and endDate are required");
            }
            const result = await this.forecastService.generateForecast({
                bankAccountId: id, // now typescript knows id is defined
                startDate: new Date(startDate),
                endDate: new Date(endDate)
            });
            res.status(200).json(result);
        }));
    }
}
exports.BankAccountController = BankAccountController;
//# sourceMappingURL=bankAccount.controller.js.map