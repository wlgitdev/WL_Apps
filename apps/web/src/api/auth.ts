import {
  type LoginCredentials,
  type AuthResponse
} from "@wl-apps/types";
import { API_ENDPOINTS } from "./config";
import { ApiClient } from "./apiClient";

export const authApi = {
  login: async (credentials: LoginCredentials): Promise<AuthResponse> => {
    const response = await ApiClient.post<AuthResponse>(
      `${API_ENDPOINTS.AUTH}${API_ENDPOINTS.AUTH_LOGIN}`,
      credentials,
      true
    );

    if (!response.token || !response.user) {
      throw new Error("Login failed");
    }

    localStorage.setItem('token', response.token);

    return response;
  },

  logout: () => {
    localStorage.removeItem("token");
  },

  isAuthenticated: (): boolean => {
    return localStorage.getItem("token") !== null;
  },

  getToken: (): string | null => {
    return localStorage.getItem("token");
  },
};