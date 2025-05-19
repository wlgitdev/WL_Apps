import mongoose from 'mongoose';
import { TrackStatesModel as EntityModel, TrackStatesDocument as EntityDocument} from '../../models/Sortify/TrackStates';
import { ApiBatchResponse, ApiResponse, BatchResult, BatchUpdate} from '@wl-apps/types';
import { TrackStatesFilters, TrackStatesNamingScheme} from '@wl-apps/types';
import { DatabaseError, NotFoundError, ValidationError } from '../../errors/error';

export class TrackStatesService {
  async createTrackStates(
    data: Partial<EntityDocument>
  ): Promise<ApiResponse<EntityDocument>> {
    try {
      const trackStates = new EntityModel({
        ...data
      });

      await trackStates.save();
      return {
        success: true,
        data: trackStates.toJSON()
      };
    } catch (error) {
      if (error instanceof mongoose.Error.ValidationError) {
        throw new ValidationError(error.message);
      }
      throw new DatabaseError(
        error instanceof Error ? error.message : 'Failed to create record'
      );
    }
  }

  async getTrackStates(
    filters: TrackStatesFilters = {},
    options: {
      matchType?: 'exact' | 'contains';
    } = {}
  ): Promise<ApiResponse<EntityDocument[]>> {
    try {
      const mongooseFilters: any = { ...filters };
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

      const trackStatess = await EntityModel.find(mongooseFilters)
        .sort({ name: -1 });

      return {
        success: true,
        data: trackStatess.map(record => record.toJSON())
      };
    } catch (error) {
      throw new DatabaseError(
        error instanceof Error ? error.message : 'Failed to fetch data'
      );
    }
  }

  async updateTrackStates(
    recordId: string,
    data: Partial<EntityDocument>
  ): Promise<ApiResponse<EntityDocument>> {
    try {
      const trackStates = await EntityModel.findById(recordId);

      if (!trackStates) {
        throw new NotFoundError(TrackStatesNamingScheme.SINGULAR);
      }

      Object.assign(trackStates, data);

      // Save the document - this will trigger the pre-save middleware
      await trackStates.save();

      return {
        success: true,
        data: trackStates.toJSON()
      };
    } catch (error) {
      if (error instanceof NotFoundError) {
        throw error;
      }
      if (error instanceof mongoose.Error.ValidationError) {
        throw new ValidationError(error.message);
      }
      throw new DatabaseError(
        error instanceof Error ? error.message : 'Failed to update record'
      );
    }
  }

  async deleteTrackStates(recordId: string): Promise<ApiResponse<boolean>> {
    const session = await mongoose.startSession();
    session.startTransaction();

    try {
      // First check if record exists
      const trackStates = await EntityModel.findById(recordId).session(session);
      
      if (!trackStates) {
        throw new NotFoundError(TrackStatesNamingScheme.SINGULAR);
      }

      await EntityModel.findByIdAndDelete(recordId).session(session);

      await session.commitTransaction();
      return {
        success: true,
        data: true
      };
    } catch (error) {
      await session.abortTransaction();
      if (error instanceof NotFoundError) {
        throw error;
      }
      throw new DatabaseError(
        error instanceof Error ? error.message : 'Failed to delete record'
      );
    } finally {
      session.endSession();
    }
  }

  async createTrackStatesBatch(
    dataArray: Partial<EntityDocument>[]
  ): Promise<ApiResponse<ApiBatchResponse<EntityDocument>>> {
    const results: BatchResult<EntityDocument>[] = [];
    const session = await mongoose.startSession();
    
    try {
      await session.withTransaction(async () => {
        for (let i = 0; i < dataArray.length; i++) {
          try {
            const record = new EntityModel({
              ...dataArray[i]
            });
            await record.save({ session });
            results.push({
              success: true,
              data: record.toJSON(),
              index: i
            });
          } catch (error) {
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
    } catch (error) {
      throw new DatabaseError(
        error instanceof Error ? error.message : 'Failed to create trackstates batch'
      );
    } finally {
      await session.endSession();
    }
  }

  async updateTrackStatesBatch(
    updates: BatchUpdate<EntityDocument>[]
  ): Promise<ApiResponse<ApiBatchResponse<EntityDocument>>> {
    if (!Array.isArray(updates)) {
      throw new ValidationError("Updates must be an array");
    }

    const results: BatchResult<EntityDocument>[] = [];
    const session = await mongoose.startSession();

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
            const record = await EntityModel.findByIdAndUpdate(
              update.recordId,
              { ...update.data },
              {
                new: true,
                runValidators: true,
                session
              }
            );

            if (!record) {
              throw new NotFoundError(TrackStatesNamingScheme.SINGULAR);
            }

            results.push({
              success: true,
              data: record.toJSON(),
              index: i
            });
          } catch (error) {
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
    } catch (error) {
      throw new DatabaseError(
        error instanceof Error ? error.message : 'Failed to update trackstates batch'
      );
    } finally {
      await session.endSession();
    }
  }
}
