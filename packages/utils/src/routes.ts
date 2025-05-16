export const MAIN_ROUTES = {
  server: 'http://localhost:3001',
  web: 'http://localhost:3000',
  apps: {
    sortify: 'sortify',
    pf: 'pf'
  },
  auth: 'auth'
};

export const SERVER_API_ROUTES = {
  auth: {
    base: MAIN_ROUTES.auth,
    login: `login`,
  },
  health: {
    base: 'health'
  },
  users: {
    base: 'users'
  },
  sortify: {
    home: `${MAIN_ROUTES.apps.sortify}/home`,
    users: {
      base: `${MAIN_ROUTES.apps.sortify}/users`,
      create: `${MAIN_ROUTES.apps.sortify}/users`,
      getAll: `${MAIN_ROUTES.apps.sortify}/users`,
      update: (id: string) => `${MAIN_ROUTES.apps.sortify}/users/${id}`,
      getById: (id: string) => `${MAIN_ROUTES.apps.sortify}/users/${id}`,
      delete: (id: string) => `${MAIN_ROUTES.apps.sortify}/users/${id}`,
      getSpotifyAuthUrl: (id: string) => `${MAIN_ROUTES.apps.sortify}/users/${id}/spotify/authUrl`,
      playlists: (id: string) => `${MAIN_ROUTES.apps.sortify}/users/${id}/spotify/playlists`,
      trackStates: (id: string) => `${MAIN_ROUTES.apps.sortify}/users/${id}/spotify/trackStates`,
      syncLikedSongs: (id: string) => `${MAIN_ROUTES.apps.sortify}/users/${id}/spotify/syncLikedSongs`,
      syncChangesToSpotify: (id: string) => `${MAIN_ROUTES.apps.sortify}/users/${id}/spotify/syncChangesToSpotify`,
    },
    trackStates: {
      base: `${MAIN_ROUTES.apps.sortify}/track-states`,
      create: `${MAIN_ROUTES.apps.sortify}/track-states`,
      createBatch: `${MAIN_ROUTES.apps.sortify}/track-states/batch`,
      updateBatch: `${MAIN_ROUTES.apps.sortify}/track-states/batch`,
      getAll: `${MAIN_ROUTES.apps.sortify}/track-states`,
      update: (id: string) => `${MAIN_ROUTES.apps.sortify}/track-states/${id}`,
      delete: (id: string) => `${MAIN_ROUTES.apps.sortify}/track-states/${id}`,
    }, 
    spotify: {
      base: `${MAIN_ROUTES.apps.sortify}/spotify`,
      callback: `${MAIN_ROUTES.apps.sortify}/spotify/callback`,
    }, 
  },
  pf: {
    dashboard: `${MAIN_ROUTES.apps.pf}/dashboard`,
    bank_accounts: `${MAIN_ROUTES.apps.pf}/bank-accounts`,
    transaction_categories: `${MAIN_ROUTES.apps.pf}/transaction-categories`,
    transactions: `${MAIN_ROUTES.apps.pf}/transactions`,
    transactions_within_range: `${MAIN_ROUTES.apps.pf}/range`
  }
};

export const FRONTEND_API_ROUTES = {

};

export const API_PREFIX = 'api/v1';

export const BASE_URLS = {
  server: 'http://localhost:3001',
  web: 'http://localhost:3000',
};