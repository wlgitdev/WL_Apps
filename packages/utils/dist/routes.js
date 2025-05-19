"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BASE_URLS = exports.API_PREFIX = exports.FRONTEND_API_ROUTES = exports.SERVER_API_ROUTES = exports.MAIN_ROUTES = void 0;
exports.MAIN_ROUTES = {
    server: 'http://localhost:3001',
    web: 'http://localhost:3000',
    apps: {
        sortify: 'sortify',
        pf: 'pf'
    },
    auth: 'auth'
};
exports.SERVER_API_ROUTES = {
    auth: {
        base: exports.MAIN_ROUTES.auth,
        login: `login`,
    },
    health: {
        base: 'health'
    },
    users: {
        base: 'users'
    },
    sortify: {
        home: `${exports.MAIN_ROUTES.apps.sortify}/home`,
        users: {
            base: `${exports.MAIN_ROUTES.apps.sortify}/users`,
            create: `${exports.MAIN_ROUTES.apps.sortify}/users`,
            getAll: `${exports.MAIN_ROUTES.apps.sortify}/users`,
            update: (id) => `${exports.MAIN_ROUTES.apps.sortify}/users/${id}`,
            getById: (id) => `${exports.MAIN_ROUTES.apps.sortify}/users/${id}`,
            delete: (id) => `${exports.MAIN_ROUTES.apps.sortify}/users/${id}`,
            getSpotifyAuthUrl: (id) => `${exports.MAIN_ROUTES.apps.sortify}/users/${id}/spotify/authUrl`,
            playlists: (id) => `${exports.MAIN_ROUTES.apps.sortify}/users/${id}/spotify/playlists`,
            trackStates: (id) => `${exports.MAIN_ROUTES.apps.sortify}/users/${id}/spotify/trackStates`,
            syncLikedSongs: (id) => `${exports.MAIN_ROUTES.apps.sortify}/users/${id}/spotify/syncLikedSongs`,
            syncChangesToSpotify: (id) => `${exports.MAIN_ROUTES.apps.sortify}/users/${id}/spotify/syncChangesToSpotify`,
        },
        trackStates: {
            base: `${exports.MAIN_ROUTES.apps.sortify}/track-states`,
            create: `${exports.MAIN_ROUTES.apps.sortify}/track-states`,
            createBatch: `${exports.MAIN_ROUTES.apps.sortify}/track-states/batch`,
            updateBatch: `${exports.MAIN_ROUTES.apps.sortify}/track-states/batch`,
            getAll: `${exports.MAIN_ROUTES.apps.sortify}/track-states`,
            update: (id) => `${exports.MAIN_ROUTES.apps.sortify}/track-states/${id}`,
            delete: (id) => `${exports.MAIN_ROUTES.apps.sortify}/track-states/${id}`,
        },
        spotify: {
            base: `${exports.MAIN_ROUTES.apps.sortify}/spotify`,
            callback: `${exports.MAIN_ROUTES.apps.sortify}/spotify/callback`,
        },
    },
    pf: {
        dashboard: `${exports.MAIN_ROUTES.apps.pf}/dashboard`,
        bank_accounts: `${exports.MAIN_ROUTES.apps.pf}/bank-accounts`,
        transaction_categories: `${exports.MAIN_ROUTES.apps.pf}/transaction-categories`,
        transactions: `${exports.MAIN_ROUTES.apps.pf}/transactions`,
        transactions_within_range: `${exports.MAIN_ROUTES.apps.pf}/range`
    }
};
exports.FRONTEND_API_ROUTES = {};
exports.API_PREFIX = 'api/v1';
exports.BASE_URLS = {
    server: 'http://localhost:3001',
    web: 'http://localhost:3000',
};
//# sourceMappingURL=routes.js.map