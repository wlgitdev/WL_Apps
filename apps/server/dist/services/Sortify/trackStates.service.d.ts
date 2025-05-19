import { TrackStatesDocument as EntityDocument } from '../../models/Sortify/TrackStates';
import { ApiBatchResponse, ApiResponse, BatchUpdate } from '@wl-apps/types';
import { TrackStatesFilters } from '@wl-apps/types';
export declare class TrackStatesService {
    createTrackStates(data: Partial<EntityDocument>): Promise<ApiResponse<EntityDocument>>;
    getTrackStates(filters?: TrackStatesFilters, options?: {
        matchType?: 'exact' | 'contains';
    }): Promise<ApiResponse<EntityDocument[]>>;
    updateTrackStates(recordId: string, data: Partial<EntityDocument>): Promise<ApiResponse<EntityDocument>>;
    deleteTrackStates(recordId: string): Promise<ApiResponse<boolean>>;
    createTrackStatesBatch(dataArray: Partial<EntityDocument>[]): Promise<ApiResponse<ApiBatchResponse<EntityDocument>>>;
    updateTrackStatesBatch(updates: BatchUpdate<EntityDocument>[]): Promise<ApiResponse<ApiBatchResponse<EntityDocument>>>;
}
//# sourceMappingURL=trackStates.service.d.ts.map