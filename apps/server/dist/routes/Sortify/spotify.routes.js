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
const spotifyController = new Sortify_1.SpotifyController(new Sortify_2.SpotifyService(session_1.sessionService, new Sortify_2.SpotifyTokensService()));
router
    .route(`/callback`)
    .get(spotifyController.handleCallback);
const spotifyRouter = router;
exports.default = spotifyRouter;
//# sourceMappingURL=spotify.routes.js.map