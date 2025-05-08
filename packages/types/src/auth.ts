import { User } from "./users";
import { ApiResponse } from "./common";

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface AuthResponse {
  token: string;
  user: Partial<User>;
}

export interface JWTPayload {
  recordId: string;
  email: string;
  iat?: number;
  exp?: number;
}

export type LoginResponse = ApiResponse<AuthResponse>;
