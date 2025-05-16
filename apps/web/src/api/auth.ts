import {
  type LoginCredentials,
  type AuthResponse
} from "@wl-apps/types";
import { ApiClient } from "./apiClient";
import { SERVER_API_ROUTES } from "@wl-apps/utils";

export const authApi = {
  login: async (credentials: LoginCredentials): Promise<AuthResponse> => {
    const response = await ApiClient.post<AuthResponse>(
      `${SERVER_API_ROUTES.auth.base}/${SERVER_API_ROUTES.auth.login}`,
      credentials,
      true
    );

    if (!response.token || !response.user) {
      throw new Error("Login failed");
    }

    localStorage.setItem('token', response.token);
    localStorage.setItem('isConnectedToSpotify', (response.user.connectedToSpotify || false).toString());
    localStorage.setItem('userId', (response.user.recordId || ''));
    
    return response;
  },

  logout: () => {
    localStorage.removeItem("token");
    localStorage.removeItem("isConnectedToSpotify");
    localStorage.removeItem("userId");
  },

  isAuthenticated: (): boolean => {
    return localStorage.getItem("token") !== null;
  },

  isConnectedToSpotify: async (): Promise<boolean> => {
    return localStorage.getItem("isConnectedToSpotify") === "true";
  },

  userId: async (): Promise<string> => {
    return localStorage.getItem("userId") || '';
  },

  getToken: (): string | null => {
    return localStorage.getItem("token");
  },
};