import { BaseModel, EntityNamingScheme, FilterConfig } from "../index";

export const TRACK_STATES_STATUS = {
  NULL: 'null',
  TO_REMOVE: 'to-remove',
  SKIP: 'skip'
};

export const TrackStatesNamingScheme: EntityNamingScheme = {
  MODEL: 'TrackStates',
  SINGULAR: 'Track',
  PLURAL: 'Tracks'
};

export interface TrackStates extends BaseModel {
  name: string;
  trackId: string;
  status: 'null' | 'to-remove' | 'skip';
  targetPlaylists: string[];
  userId: string;
}

export type TrackStatesFilters = Partial<TrackStates>;

export const TrackStatesFilterConfig: FilterConfig<TrackStatesFilters> = (<const>{
  recordId: { type: "string" },
  createdAt: { type: "date" },
  updatedAt: { type: "date" },
  name: { type: "string" },
  trackId: { type: "string" },
  status: { type: "string" },
  targetPlaylists: { type: "array" },
  userId: {type: "string"}
}) satisfies FilterConfig<TrackStatesFilters>;

export interface TrackStatesExtended extends TrackStates, SpotifyApi.TrackObjectFull {
  external_url_spotify: string
  artist_names: string[]
  date_added: Date
  genres: string[]
}