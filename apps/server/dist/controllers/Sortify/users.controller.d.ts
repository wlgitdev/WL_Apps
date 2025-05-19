import { Request, Response } from "express";
import { UsersService, SpotifyService } from "../../services/Sortify";
export declare class UsersController {
    private usersService;
    private spotifyService;
    constructor(usersService: UsersService, spotifyService: SpotifyService);
    private filterConfig;
    create: (req: Request, res: Response, next: import("express").NextFunction) => void;
    getAll: (req: Request, res: Response, next: import("express").NextFunction) => void;
    update: (req: Request, res: Response, next: import("express").NextFunction) => void;
    getById: (req: Request, res: Response, next: import("express").NextFunction) => void;
    delete: (req: Request, res: Response, next: import("express").NextFunction) => void;
    getSpotifyAuthUrl: (req: Request, res: Response, next: import("express").NextFunction) => void;
    syncLikedSongs: (req: Request, res: Response, next: import("express").NextFunction) => void;
    syncChangesToSpotify: (req: Request, res: Response, next: import("express").NextFunction) => void;
    getUserPlaylists: (req: Request, res: Response, next: import("express").NextFunction) => void;
    getUserTrackStates: (req: Request, res: Response, next: import("express").NextFunction) => void;
}
//# sourceMappingURL=users.controller.d.ts.map