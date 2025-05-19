"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const transaction_controller_1 = require("../../controllers/PF/transaction.controller");
const transaction_service_1 = require("../../services/PF/transaction.service");
const router = express_1.default.Router();
const transactionController = new transaction_controller_1.TransactionController(new transaction_service_1.TransactionService());
router
    .route("/")
    .post(transactionController.create)
    .get(transactionController.getAll);
router
    .route('/batch')
    .post(transactionController.createBatch)
    .put(transactionController.updateBatch);
router
    .route("/:id")
    .put(transactionController.update)
    .delete(transactionController.delete);
router.route('/range').get(transactionController.getAllWithinRange);
const transactionRouter = router;
exports.default = transactionRouter;
//# sourceMappingURL=transaction.routes.js.map