import express from "express";
import { sessionService } from "../../session";
import { UsersController } from "../../controllers/Sortify";
import { UsersService, SpotifyService, SpotifyTokensService } from "../../services/Sortify";

const router = express.Router();
const usersController = new UsersController(
  new UsersService(),
  new SpotifyService(sessionService, new SpotifyTokensService)
);

router
  .route("/:id")
  .get(usersController.getById)
  .put(usersController.update)
  .delete(usersController.delete);
  
router
  .route(`/:id/spotify/authUrl`)
  .get(usersController.getSpotifyAuthUrl)
  
router
  .route(`/:id/spotify/syncLikedSongs`)
  .get(usersController.syncLikedSongs)
  
router
  .route(`/:id/spotify/syncChangesToSpotify`)
  .post(usersController.syncChangesToSpotify)

router
  .route(`/:id/spotify/playlists`)
  .get(usersController.getUserPlaylists)

router
  .route(`/:id/spotify/trackStates`)
  .get(usersController.getUserTrackStates)

const usersRouter = router;
export default usersRouter;