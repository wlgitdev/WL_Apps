"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UsersController = void 0;
const types_1 = require("@wl-apps/types");
const utils_1 = require("../../middleware/utils");
const async_1 = require("../../middleware/async");
const error_1 = require("../../errors/error");
class UsersController {
    constructor(usersService, spotifyService) {
        this.usersService = usersService;
        this.spotifyService = spotifyService;
        this.filterConfig = types_1.userFilterConfig;
        this.create = (0, async_1.asyncHandler)((0, utils_1.withAuth)(async (req, res) => {
            const result = await this.usersService.createUser(req.body);
            res.status(201).json(result);
        }));
        this.getAll = (0, async_1.asyncHandler)((0, utils_1.withAuth)(async (req, res) => {
            const filters = (0, utils_1.createQueryFilters)(req, this.filterConfig);
            const matchType = req.query.matchType === 'contains' ? 'contains' : 'exact';
            const result = await this.usersService.getUsers(filters, { matchType });
            res.status(200).json(result);
        }));
        this.update = (0, async_1.asyncHandler)((0, utils_1.withAuth)(async (req, res) => {
            const { id } = req.params;
            if (!id) {
                throw new error_1.ValidationError("Record id is required");
            }
            const result = await this.usersService.updateUser(id, req.body);
            res.status(200).json(result);
        }));
        this.getById = (0, async_1.asyncHandler)((0, utils_1.withAuth)(async (req, res) => {
            const { id } = req.params;
            if (!id) {
                throw new error_1.ValidationError("Record id is required");
            }
            const result = await this.usersService.getUsers({ recordId: id }, { matchType: 'exact' });
            if (result.success) {
                res.status(200).json({ ...result, data: result.data[0] ? [result.data[0]] : [] });
            }
            else {
                res.status(200).json(result);
            }
        }));
        this.delete = (0, async_1.asyncHandler)((0, utils_1.withAuth)(async (req, res) => {
            const { id } = req.params;
            if (!id) {
                throw new error_1.ValidationError("Record id is required");
            }
            const result = await this.usersService.deleteUser(id);
            res.status(200).json(result);
        }));
        this.getSpotifyAuthUrl = (0, async_1.asyncHandler)((0, utils_1.withAuth)(async (req, res) => {
            const { id } = req.params;
            if (!id) {
                throw new error_1.ValidationError("User id is required");
            }
            const result = await this.spotifyService.getSpotifyAuthUrl(id);
            res.status(200).json(result);
        }));
        this.syncLikedSongs = (0, async_1.asyncHandler)((0, utils_1.withAuth)(async (req, res) => {
            const { id } = req.params;
            if (!id) {
                throw new error_1.ValidationError("User id is required");
            }
            const result = await this.spotifyService.syncLikedSongs(id);
            res.status(200).json(result);
        }));
        this.syncChangesToSpotify = (0, async_1.asyncHandler)((0, utils_1.withAuth)(async (req, res) => {
            const { id } = req.params;
            if (!id) {
                throw new error_1.ValidationError("User id is required");
            }
            if (!Array.isArray(req.body)) {
                throw new error_1.ValidationError('Request body must be an array of tracks');
            }
            const result = await this.spotifyService.syncChangesToSpotify(id, req.body);
            res.status(200).json(result);
        }));
        this.getUserPlaylists = (0, async_1.asyncHandler)((0, utils_1.withAuth)(async (req, res) => {
            const { id } = req.params;
            if (!id) {
                throw new error_1.ValidationError("User id is required");
            }
            const result = await this.spotifyService.getUserPlaylists(id);
            res.status(200).json(result);
        }));
        this.getUserTrackStates = (0, async_1.asyncHandler)((0, utils_1.withAuth)(async (req, res) => {
            const { id } = req.params;
            if (!id) {
                throw new error_1.ValidationError("User id is required");
            }
            const result = await this.spotifyService.getTrackStatesExtended(id);
            res.status(200).json(result);
        }));
    }
}
exports.UsersController = UsersController;
//# sourceMappingURL=users.controller.js.map