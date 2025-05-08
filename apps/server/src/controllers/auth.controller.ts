import { Request, Response } from "express";
import { AuthService } from "../services/auth.service";
import { asyncHandler } from "../middleware/async";
import { LoginCredentials } from "@wl-apps/types";
import { ValidationError } from "../errors/error";

export class AuthController {
  constructor(private authService: AuthService) {}

  public login = asyncHandler(async (req: Request, res: Response) => {
    const credentials: LoginCredentials = req.body;
    
    if (!credentials.email ) {
      throw new ValidationError("Email is required");
    }

    if (!credentials.password) {
      throw new ValidationError("Password is required");
    }

    const result = await this.authService.login(credentials);
    res.status(200).json(result);
  });
}
