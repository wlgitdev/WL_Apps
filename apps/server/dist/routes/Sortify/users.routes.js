"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const session_1 = require("../../session");
const Sortify_1 = require("../../controllers/Sortify");
const Sortify_2 = require("../../services/Sortify");
const router = express_1.default.Router();
const usersController = new Sortify_1.UsersController(new Sortify_2.UsersService(), new Sortify_2.SpotifyService(session_1.sessionService, new Sortify_2.SpotifyTokensService));
router
    .route("/:id")
    .get(usersController.getById)
    .put(usersController.update)
    .delete(usersController.delete);
router
    .route(`/:id/spotify/authUrl`)
    .get(usersController.getSpotifyAuthUrl);
router
    .route(`/:id/spotify/syncLikedSongs`)
    .get(usersController.syncLikedSongs);
router
    .route(`/:id/spotify/syncChangesToSpotify`)
    .post(usersController.syncChangesToSpotify);
router
    .route(`/:id/spotify/playlists`)
    .get(usersController.getUserPlaylists);
router
    .route(`/:id/spotify/trackStates`)
    .get(usersController.getUserTrackStates);
const usersRouter = router;
exports.default = usersRouter;
//# sourceMappingURL=users.routes.js.map