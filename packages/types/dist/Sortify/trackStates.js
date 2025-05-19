"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TrackStatesFilterConfig = exports.TrackStatesNamingScheme = exports.TRACK_STATES_STATUS = void 0;
exports.TRACK_STATES_STATUS = {
    NULL: 'null',
    TO_REMOVE: 'to-remove',
    SKIP: 'skip'
};
exports.TrackStatesNamingScheme = {
    MODEL: 'TrackStates',
    SINGULAR: 'Track',
    PLURAL: 'Tracks'
};
exports.TrackStatesFilterConfig = {
    recordId: { type: "string" },
    createdAt: { type: "date" },
    updatedAt: { type: "date" },
    name: { type: "string" },
    trackId: { type: "string" },
    status: { type: "string" },
    targetPlaylists: { type: "array" },
    userId: { type: "string" }
};
//# sourceMappingURL=trackStates.js.map