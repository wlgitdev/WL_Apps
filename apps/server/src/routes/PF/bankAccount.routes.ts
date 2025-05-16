import express from "express";
import { BankAccountController } from "../../controllers/PF/bankAccount.controller";
import { BankAccountService } from "../../services/PF/bankAccount.service";
import { ForecastService } from "../../services/PF/forecast.service";

const router = express.Router();
const bankAccountController = new BankAccountController(
  new BankAccountService(),
  new ForecastService()
);

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
export default bankAccountRouter;
