"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SpotifyController = void 0;
const async_1 = require("../../middleware/async");
const utils_1 = require("@wl-apps/utils");
class SpotifyController {
    constructor(spotifyService) {
        this.spotifyService = spotifyService;
        this.handleCallback = (0, async_1.asyncHandler)(async (req, res) => {
            const result = await this.spotifyService.handleCallback(req.query);
            res.redirect(`${utils_1.BASE_URLS.web}?spotify_connected=${result.success == true ? 'true' : 'false'}`);
        });
    }
}
exports.SpotifyController = SpotifyController;
//# sourceMappingURL=spotify.controller.js.map