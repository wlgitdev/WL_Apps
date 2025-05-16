import { type TrackStates, BatchUpdate, ApiBatchResponse, TrackStatesFilters as Filters, TrackStatesNamingScheme } from "@wl-apps/types";
import { ApiClient } from "../apiClient";
import { NotFoundError } from "../errors";
import { SERVER_API_ROUTES } from "@wl-apps/utils";

export const trackStatesApi = {
  getAll: async (): Promise<TrackStates[]> => {
    return ApiClient.get<TrackStates[]>(SERVER_API_ROUTES.sortify.trackStates.getAll);
  },

  getById: async (id: string): Promise<TrackStates> => {
    const records = await ApiClient.get<TrackStates[]>(
      SERVER_API_ROUTES.sortify.trackStates.getAll
    );
    const record = records.find(record => record.recordId === id);

    if (!record) {
      throw new NotFoundError(TrackStatesNamingScheme.SINGULAR);
    }

    return record;
  },

  create: async (
    data: Omit<TrackStates, 'recordId' | 'createdAt' | 'updatedAt'>
  ): Promise<TrackStates> => {
    return ApiClient.post<TrackStates>(SERVER_API_ROUTES.sortify.trackStates.create, data);
  },

  update: async (
    id: string,
    data: Partial<TrackStates>
  ): Promise<TrackStates> => {
    return ApiClient.put<TrackStates>(
      `${SERVER_API_ROUTES.sortify.trackStates.update(id)}`,
      data
    );
  },

  delete: async (id: string): Promise<void> => {
    return ApiClient.delete(`${SERVER_API_ROUTES.sortify.trackStates.delete(id)}`);
  },

  search: async (criteria: Partial<Filters>): Promise<TrackStates[]> => {
    const queryParams = new URLSearchParams();

    Object.entries(criteria).forEach(([key, value]) => {
      if (value !== '') {
        queryParams.set(key, value.toString());
      }
    });

    queryParams.set('matchType', 'contains');

    return ApiClient.get<TrackStates[]>(`${SERVER_API_ROUTES.sortify.trackStates.getAll}?${queryParams.toString()}`);
  },

  createBatch: async (
    data: BatchUpdate<TrackStates>[]
  ): Promise<ApiBatchResponse<TrackStates>> => {
    return ApiClient.post<ApiBatchResponse<TrackStates>>(
      SERVER_API_ROUTES.sortify.trackStates.createBatch,
      data
    );
  },

  updateBatch: async (
    updates: BatchUpdate<TrackStates>[]
  ): Promise<ApiBatchResponse<TrackStates>> => {
    return ApiClient.put<ApiBatchResponse<TrackStates>>(
      SERVER_API_ROUTES.sortify.trackStates.updateBatch,
      updates
    );
  },
};
