import express from "express";
import { TransactionCategoryController } from "../../controllers/PF/transactionCategory.controller";
import { TransactionCategoryService } from "../../services/PF/transactionCategory.service";

const router = express.Router();
const transactionCategoryController = new TransactionCategoryController(
  new TransactionCategoryService()
);

router
  .route("/")
  .post(transactionCategoryController.create)
  .get(transactionCategoryController.getAll);

router
  .route("/:id")
  .put(transactionCategoryController.update)
  .delete(transactionCategoryController.delete);

const transactionCategoryRouter = router;
export default transactionCategoryRouter;