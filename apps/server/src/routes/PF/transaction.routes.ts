import express from "express";
import { TransactionController } from "../../controllers/PF/transaction.controller";
import { TransactionService } from "../../services/PF/transaction.service";

const router = express.Router();
const transactionController = new TransactionController(
  new TransactionService()
);

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
export default transactionRouter;