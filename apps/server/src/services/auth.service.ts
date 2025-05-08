import jwt from "jsonwebtoken";
import { Request } from "express";
import { UserService } from "./user.service";
import {
  LoginResponse,
  LoginCredentials,
  JWTPayload,
  ApiResponse,
} from "@wl-apps/types";
import { UserDocument } from "../models/User";
import { env } from "../config/env";
import { AuthenticationError, ValidationError } from "../errors/error";

export class AuthService {
  private readonly jwtSecret: string;
  private readonly jwtExpiresIn: string;

  constructor(
    private userService: UserService,
    jwtSecret = env.JWT_SECRET || "wl-apps-key",
    jwtExpiresIn = env.JWT_EXPIRES_IN || "1d"
  ) {
    this.jwtSecret = jwtSecret;
    this.jwtExpiresIn = jwtExpiresIn;
  }

  async login(credentials: LoginCredentials): Promise<LoginResponse> {
    try {
      const userValidation = await this.userService.validateUserCredentials(
        credentials
      );

      if (!userValidation.success || !userValidation.data) {
        throw new AuthenticationError("Invalid credentials");
      }

      const userResponse = userValidation.data;

      const token = this.generateToken({
        recordId: userValidation.data.id,
        email: userValidation.data.email,
      });

      return {
        success: true,
        data: {
          token,
          user: userResponse,
        },
      };
    } catch (error) {
      if (error instanceof AuthenticationError) {
        throw error;
      }
      throw new AuthenticationError(
        error instanceof Error ? error.message : "Authentication failed"
      );
    }
  }

  private generateToken(payload: Omit<JWTPayload, "iat" | "exp">): string {
    try {
      return jwt.sign(payload, this.jwtSecret, {
        expiresIn: this.jwtExpiresIn as jwt.SignOptions["expiresIn"],
      });
    } catch (error) {
      throw new ValidationError(
        error instanceof Error ? error.message : "Failed to generate token"
      );
    }
  }

  private verifyToken(token: string): JWTPayload {
    try {
      return jwt.verify(token, this.jwtSecret) as JWTPayload;
    } catch (error) {
      throw new AuthenticationError("Invalid token");
    }
  }

  async authenticateRequest(
    req: Request
  ): Promise<ApiResponse<Partial<UserDocument>>> {
    try {
      const authHeader = req.headers.authorization;
      const token = authHeader?.split(" ")[1];

      if (!token) {
        throw new AuthenticationError("Authentication token required");
      }

      const decoded = this.verifyToken(token);
      const userResponse = await this.userService.getUsers({
        recordId: decoded.recordId,
      });

      if (!userResponse.success || !userResponse.data?.length) {
        throw new AuthenticationError("Invalid token");
      }

      return {
        success: userResponse.data[0] ? true : false,
        data: userResponse.data[0] || {}
      };
    } catch (error) {
      if (error instanceof AuthenticationError) {
        throw error;
      }
      throw new AuthenticationError(
        error instanceof Error ? error.message : "Authentication failed"
      );
    }
  }
}
