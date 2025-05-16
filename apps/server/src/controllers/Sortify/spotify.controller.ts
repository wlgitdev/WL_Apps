import { Request, Response } from "express";
import { SpotifyService } from "../../services/Sortify/spotify.service";
import { asyncHandler } from "../../middleware/async";
import { BASE_URLS } from "@wl-apps/utils";

export class SpotifyController {
  constructor(private spotifyService: SpotifyService) {}
    
  public handleCallback = asyncHandler(
    async (req: Request, res: Response) => {
      const result = await this.spotifyService.handleCallback(req.query);
      res.redirect(`${BASE_URLS.web}?spotify_connected=${result.success == true ? 'true': 'false'}`);
    }
  );
}
