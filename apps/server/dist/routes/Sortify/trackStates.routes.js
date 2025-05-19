"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const Sortify_1 = require("../../controllers/Sortify");
const Sortify_2 = require("../../services/Sortify");
const router = express_1.default.Router();
const trackStatesController = new Sortify_1.TrackStatesController(new Sortify_2.TrackStatesService());
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
exports.default = trackStatesRouter;
//# sourceMappingURL=trackStates.routes.js.map