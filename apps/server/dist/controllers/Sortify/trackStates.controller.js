"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TrackStatesController = void 0;
const async_1 = require("../../middleware/async");
const utils_1 = require("../../middleware/utils");
const error_1 = require("../../errors/error");
const types_1 = require("@wl-apps/types");
class TrackStatesController {
    constructor(trackStatesService) {
        this.trackStatesService = trackStatesService;
        this.filterConfig = types_1.TrackStatesFilterConfig;
        this.create = (0, async_1.asyncHandler)((0, utils_1.withAuth)(async (req, res) => {
            const result = await this.trackStatesService.createTrackStates(req.body);
            res.status(201).json(result);
        }));
        this.getAll = (0, async_1.asyncHandler)((0, utils_1.withAuth)(async (req, res) => {
            // Create filters dynamically based on query parameters
            const filters = (0, utils_1.createQueryFilters)(req, this.filterConfig);
            const matchType = req.query.matchType === 'contains' ? 'contains' : 'exact';
            const result = await this.trackStatesService.getTrackStates(filters, { matchType });
            res.status(200).json(result);
        }));
        this.update = (0, async_1.asyncHandler)((0, utils_1.withAuth)(async (req, res) => {
            const { id } = req.params;
            if (!id) {
                throw new error_1.ValidationError("Record id is required");
            }
            const result = await this.trackStatesService.updateTrackStates(id, req.body);
            res.status(200).json(result);
        }));
        this.delete = (0, async_1.asyncHandler)((0, utils_1.withAuth)(async (req, res) => {
            const { id } = req.params;
            if (!id) {
                throw new error_1.ValidationError("Record id is required");
            }
            const result = await this.trackStatesService.deleteTrackStates(id);
            res.status(200).json(result);
        }));
        this.createBatch = (0, async_1.asyncHandler)((0, utils_1.withAuth)(async (req, res) => {
            const result = await this.trackStatesService.createTrackStatesBatch(req.body);
            res.status(201).json(result);
        }));
        this.updateBatch = (0, async_1.asyncHandler)((0, utils_1.withAuth)(async (req, res) => {
            const result = await this.trackStatesService.updateTrackStatesBatch(req.body);
            res.status(200).json(result);
        }));
    }
}
exports.TrackStatesController = TrackStatesController;
//# sourceMappingURL=trackStates.controller.js.map