import { Request, Response } from "express";
import { UserService } from "../services/user.service";
export declare class UserController {
    private userService;
    constructor(userService: UserService);
    private filterConfig;
    create: (req: Request, res: Response, next: import("express").NextFunction) => void;
    getAll: (req: Request, res: Response, next: import("express").NextFunction) => void;
    update: (req: Request, res: Response, next: import("express").NextFunction) => void;
    delete: (req: Request, res: Response, next: import("express").NextFunction) => void;
}
//# sourceMappingURL=user.controller.d.ts.map