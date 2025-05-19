import { Request, Response } from "express";
import { SpotifyService } from "../../services/Sortify/spotify.service";
export declare class SpotifyController {
    private spotifyService;
    constructor(spotifyService: SpotifyService);
    handleCallback: (req: Request, res: Response, next: import("express").NextFunction) => void;
}
//# sourceMappingURL=spotify.controller.d.ts.map