"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.transactionCategoryRouter = exports.transactionRouter = exports.bankAccountRouter = void 0;
const bankAccount_routes_1 = __importDefault(require("./bankAccount.routes"));
exports.bankAccountRouter = bankAccount_routes_1.default;
const transaction_routes_1 = __importDefault(require("./transaction.routes"));
exports.transactionRouter = transaction_routes_1.default;
const transactionCategory_routes_1 = __importDefault(require("./transactionCategory.routes"));
exports.transactionCategoryRouter = transactionCategory_routes_1.default;
//# sourceMappingURL=index.js.map