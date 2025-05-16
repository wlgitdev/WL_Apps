import { BatchUpdate, TrackStates, TrackStatesExtended, UserPlaylist, type User } from "@wl-apps/types";
import { ApiClient } from "../apiClient";
import { SERVER_API_ROUTES } from "@wl-apps/utils";
import { authApi } from "../auth";
;

export const userApi = {  
  update: async (
    id: string,
    data: Partial<User>
  ): Promise<User> => {
    return ApiClient.put<User>(
      SERVER_API_ROUTES.sortify.users.update(id),
      data
    );
  },

  getById: async (
    id: string
  ): Promise<User> => {
    return ApiClient.get<User>(
      SERVER_API_ROUTES.sortify.users.getById(id)
    );
  },

  getSpotifyAuthUrl: async (
    id: string
  ): Promise<string> => {    
    
    return ApiClient.get<string>(
      SERVER_API_ROUTES.sortify.users.getSpotifyAuthUrl(id)
    );
  },

  syncLikedSongs: async (
    id: string
  ): Promise<boolean> => {    
    
    return ApiClient.get<boolean>(
      SERVER_API_ROUTES.sortify.users.syncLikedSongs(id)
    );
  },

  syncChangesToSpotify: async (
    id: string,
    data: BatchUpdate<TrackStates>[]
  ): Promise<boolean> => {    
    
    return ApiClient.post<boolean>(
      SERVER_API_ROUTES.sortify.users.syncChangesToSpotify(id), 
      data
    );
  },

  getUserPlaylists: async (
    id: string
  ): Promise<UserPlaylist[]> => {    
    
    return ApiClient.get<UserPlaylist[]>(
      SERVER_API_ROUTES.sortify.users.playlists(id)
    );
  },

  getUserTrackStates: async (
  ): Promise<TrackStatesExtended[]> => {
    const id = await authApi.userId()

    return ApiClient.get<TrackStatesExtended[]>(
      SERVER_API_ROUTES.sortify.users.trackStates(id)
    );
  },
};
