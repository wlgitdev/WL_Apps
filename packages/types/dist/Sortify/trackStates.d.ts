import { BaseModel, EntityNamingScheme, FilterConfig } from "../index";
export declare const TRACK_STATES_STATUS: {
    NULL: string;
    TO_REMOVE: string;
    SKIP: string;
};
export declare const TrackStatesNamingScheme: EntityNamingScheme;
export interface TrackStates extends BaseModel {
    name: string;
    trackId: string;
    status: 'null' | 'to-remove' | 'skip';
    targetPlaylists: string[];
    userId: string;
}
export type TrackStatesFilters = Partial<TrackStates>;
export declare const TrackStatesFilterConfig: FilterConfig<TrackStatesFilters>;
export interface TrackStatesExtended extends TrackStates, SpotifyApi.TrackObjectFull {
    external_url_spotify: string;
    artist_names: string[];
    date_added: Date;
    genres: string[];
}
//# sourceMappingURL=trackStates.d.ts.map