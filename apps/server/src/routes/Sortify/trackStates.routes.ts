import express from "express";
import { TrackStatesController } from "../../controllers/Sortify";
import { TrackStatesService } from "../../services/Sortify";

const router = express.Router();
const trackStatesController = new TrackStatesController(
  new TrackStatesService()
);

router
  .route("/")
  .post(trackStatesController.create)
  .get(trackStatesController.getAll);

router
  .route("/batch")
  .post(trackStatesController.createBatch)
  .put(trackStatesController.updateBatch);

router
  .route("/:id")
  .put(trackStatesController.update)
  .delete(trackStatesController.delete);

const trackStatesRouter = router;
export default trackStatesRouter;