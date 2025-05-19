"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.usersRouter = exports.trackStatesRouter = exports.spotifyRouter = void 0;
const spotify_routes_1 = __importDefault(require("./spotify.routes"));
exports.spotifyRouter = spotify_routes_1.default;
const trackStates_routes_1 = __importDefault(require("./trackStates.routes"));
exports.trackStatesRouter = trackStates_routes_1.default;
const users_routes_1 = __importDefault(require("./users.routes"));
exports.usersRouter = users_routes_1.default;
//# sourceMappingURL=index.js.map