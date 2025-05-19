"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const transactionCategory_controller_1 = require("../../controllers/PF/transactionCategory.controller");
const transactionCategory_service_1 = require("../../services/PF/transactionCategory.service");
const router = express_1.default.Router();
const transactionCategoryController = new transactionCategory_controller_1.TransactionCategoryController(new transactionCategory_service_1.TransactionCategoryService());
router
    .route("/")
    .post(transactionCategoryController.create)
    .get(transactionCategoryController.getAll);
router
    .route("/:id")
    .put(transactionCategoryController.update)
    .delete(transactionCategoryController.delete);
const transactionCategoryRouter = router;
exports.default = transactionCategoryRouter;
//# sourceMappingURL=transactionCategory.routes.js.map