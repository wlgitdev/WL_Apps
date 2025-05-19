"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const bankAccount_controller_1 = require("../../controllers/PF/bankAccount.controller");
const bankAccount_service_1 = require("../../services/PF/bankAccount.service");
const forecast_service_1 = require("../../services/PF/forecast.service");
const router = express_1.default.Router();
const bankAccountController = new bankAccount_controller_1.BankAccountController(new bankAccount_service_1.BankAccountService(), new forecast_service_1.ForecastService());
router
    .route("/")
    .post(bankAccountController.create)
    .get(bankAccountController.getAll);
router.post("/:id/forecast", bankAccountController.generateForecast);
router
    .route("/:id")
    .put(bankAccountController.update)
    .delete(bankAccountController.delete);
const bankAccountRouter = router;
exports.default = bankAccountRouter;
//# sourceMappingURL=bankAccount.routes.js.map