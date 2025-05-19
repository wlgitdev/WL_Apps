"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.TrackStatesService = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const TrackStates_1 = require("../../models/Sortify/TrackStates");
const types_1 = require("@wl-apps/types");
const error_1 = require("../../errors/error");
class TrackStatesService {
    async createTrackStates(data) {
        try {
            const trackStates = new TrackStates_1.TrackStatesModel({
                ...data
            });
            await trackStates.save();
            return {
                success: true,
                data: trackStates.toJSON()
            };
        }
        catch (error) {
            if (error instanceof mongoose_1.default.Error.ValidationError) {
                throw new error_1.ValidationError(error.message);
            }
            throw new error_1.DatabaseError(error instanceof Error ? error.message : 'Failed to create record');
        }
    }
    async getTrackStates(filters = {}, options = {}) {
        try {
            const mongooseFilters = { ...filters };
            const { matchType = 'exact' } = options;
            if (mongooseFilters.recordId) {
                mongooseFilters._id = mongooseFilters.recordId;
                delete mongooseFilters.recordId;
            }
            for (const [key, value] of Object.entries(mongooseFilters)) {
                if (matchType === 'contains' && typeof value === 'string') {
                    mongooseFilters[key] = { $regex: value, $options: 'i' };
                }
            }
            const trackStatess = await TrackStates_1.TrackStatesModel.find(mongooseFilters)
                .sort({ name: -1 });
            return {
                success: true,
                data: trackStatess.map(record => record.toJSON())
            };
        }
        catch (error) {
            throw new error_1.DatabaseError(error instanceof Error ? error.message : 'Failed to fetch data');
        }
    }
    async updateTrackStates(recordId, data) {
        try {
            const trackStates = await TrackStates_1.TrackStatesModel.findById(recordId);
            if (!trackStates) {
                throw new error_1.NotFoundError(types_1.TrackStatesNamingScheme.SINGULAR);
            }
            Object.assign(trackStates, data);
            // Save the document - this will trigger the pre-save middleware
            await trackStates.save();
            return {
                success: true,
                data: trackStates.toJSON()
            };
        }
        catch (error) {
            if (error instanceof error_1.NotFoundError) {
                throw error;
            }
            if (error instanceof mongoose_1.default.Error.ValidationError) {
                throw new error_1.ValidationError(error.message);
            }
            throw new error_1.DatabaseError(error instanceof Error ? error.message : 'Failed to update record');
        }
    }
    async deleteTrackStates(recordId) {
        const session = await mongoose_1.default.startSession();
        session.startTransaction();
        try {
            // First check if record exists
            const trackStates = await TrackStates_1.TrackStatesModel.findById(recordId).session(session);
            if (!trackStates) {
                throw new error_1.NotFoundError(types_1.TrackStatesNamingScheme.SINGULAR);
            }
            await TrackStates_1.TrackStatesModel.findByIdAndDelete(recordId).session(session);
            await session.commitTransaction();
            return {
                success: true,
                data: true
            };
        }
        catch (error) {
            await session.abortTransaction();
            if (error instanceof error_1.NotFoundError) {
                throw error;
            }
            throw new error_1.DatabaseError(error instanceof Error ? error.message : 'Failed to delete record');
        }
        finally {
            session.endSession();
        }
    }
    async createTrackStatesBatch(dataArray) {
        const results = [];
        const session = await mongoose_1.default.startSession();
        try {
            await session.withTransaction(async () => {
                for (let i = 0; i < dataArray.length; i++) {
                    try {
                        const record = new TrackStates_1.TrackStatesModel({
                            ...dataArray[i]
                        });
                        await record.save({ session });
                        results.push({
                            success: true,
                            data: record.toJSON(),
                            index: i
                        });
                    }
                    catch (error) {
                        results.push({
                            success: false,
                            error: error instanceof Error ? error.message : 'Unknown error',
                            index: i
                        });
                    }
                }
            });
            const success = results.every(result => result.success);
            const successCount = results.filter(result => result.success).length;
            const failureCount = results.length - successCount;
            return {
                success: true,
                data: {
                    results,
                    summary: {
                        total: results.length,
                        successful: successCount,
                        failed: failureCount,
                        completeSuccess: success
                    }
                }
            };
        }
        catch (error) {
            throw new error_1.DatabaseError(error instanceof Error ? error.message : 'Failed to create trackstates batch');
        }
        finally {
            await session.endSession();
        }
    }
    async updateTrackStatesBatch(updates) {
        if (!Array.isArray(updates)) {
            throw new error_1.ValidationError("Updates must be an array");
        }
        const results = [];
        const session = await mongoose_1.default.startSession();
        try {
            await session.withTransaction(async () => {
                for (let i = 0; i < updates.length; i++) {
                    const update = updates[i];
                    // Validate update object structure
                    if (!update || !update.recordId || !update.data) {
                        results.push({
                            success: false,
                            error: "Invalid update object structure",
                            index: i,
                        });
                        continue;
                    }
                    try {
                        const record = await TrackStates_1.TrackStatesModel.findByIdAndUpdate(update.recordId, { ...update.data }, {
                            new: true,
                            runValidators: true,
                            session
                        });
                        if (!record) {
                            throw new error_1.NotFoundError(types_1.TrackStatesNamingScheme.SINGULAR);
                        }
                        results.push({
                            success: true,
                            data: record.toJSON(),
                            index: i
                        });
                    }
                    catch (error) {
                        results.push({
                            success: false,
                            error: error instanceof Error ? error.message : 'Unknown error',
                            index: i
                        });
                    }
                }
            });
            const success = results.every(result => result.success);
            const successCount = results.filter(result => result.success).length;
            const failureCount = results.length - successCount;
            return {
                success: true,
                data: {
                    results,
                    summary: {
                        total: results.length,
                        successful: successCount,
                        failed: failureCount,
                        completeSuccess: success
                    }
                }
            };
        }
        catch (error) {
            throw new error_1.DatabaseError(error instanceof Error ? error.message : 'Failed to update trackstates batch');
        }
        finally {
            await session.endSession();
        }
    }
}
exports.TrackStatesService = TrackStatesService;
//# sourceMappingURL=trackStates.service.js.map