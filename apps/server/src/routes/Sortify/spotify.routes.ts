import express from "express";
import { sessionService } from "../../session";
import { SpotifyController } from "../../controllers/Sortify";
import { SpotifyService, SpotifyTokensService } from "../../services/Sortify";

const router = express.Router();
const spotifyController = new SpotifyController(
  new SpotifyService(sessionService, new SpotifyTokensService())
);

router
  .route(`/callback`)
  .get(spotifyController.handleCallback);

const spotifyRouter = router;
export default spotifyRouter;
