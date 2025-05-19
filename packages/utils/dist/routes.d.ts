export declare const MAIN_ROUTES: {
    server: string;
    web: string;
    apps: {
        sortify: string;
        pf: string;
    };
    auth: string;
};
export declare const SERVER_API_ROUTES: {
    auth: {
        base: string;
        login: string;
    };
    health: {
        base: string;
    };
    users: {
        base: string;
    };
    sortify: {
        home: string;
        users: {
            base: string;
            create: string;
            getAll: string;
            update: (id: string) => string;
            getById: (id: string) => string;
            delete: (id: string) => string;
            getSpotifyAuthUrl: (id: string) => string;
            playlists: (id: string) => string;
            trackStates: (id: string) => string;
            syncLikedSongs: (id: string) => string;
            syncChangesToSpotify: (id: string) => string;
        };
        trackStates: {
            base: string;
            create: string;
            createBatch: string;
            updateBatch: string;
            getAll: string;
            update: (id: string) => string;
            delete: (id: string) => string;
        };
        spotify: {
            base: string;
            callback: string;
        };
    };
    pf: {
        dashboard: string;
        bank_accounts: string;
        transaction_categories: string;
        transactions: string;
        transactions_within_range: string;
    };
};
export declare const FRONTEND_API_ROUTES: {};
export declare const API_PREFIX = "api/v1";
export declare const BASE_URLS: {
    server: string;
    web: string;
};
//# sourceMappingURL=routes.d.ts.map