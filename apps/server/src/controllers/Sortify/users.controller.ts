import { Request, Response } from "express";
import { UserFilters, userFilterConfig, FilterConfig } from "@wl-apps/types";
import {
  createQueryFilters,
  withAuth,
} from "../../middleware/utils";
import { asyncHandler } from "../../middleware/async";
import { ValidationError } from "../../errors/error";
import { UsersService, SpotifyService } from "../../services/Sortify";

export class UsersController {
  constructor(private usersService: UsersService, private spotifyService: SpotifyService) {}
  private filterConfig: FilterConfig<UserFilters> = userFilterConfig;

  public create = asyncHandler(
    withAuth(async (req: Request, res: Response) => {
      const result = await this.usersService.createUser(req.body);
      res.status(201).json(result);
    })
  );

  public getAll = asyncHandler(
    withAuth(async (req: Request, res: Response) => {
      const filters = createQueryFilters<UserFilters>(req, this.filterConfig);

      const matchType =
        req.query.matchType === 'contains' ? 'contains' : 'exact';

      const result = await this.usersService.getUsers(filters, { matchType });
      res.status(200).json(result);
    })
  );

  public update = asyncHandler(
    withAuth(async (req: Request, res: Response) => {
      const { id } = req.params;

      if (!id) {
        throw new ValidationError("Record id is required");
      }

      const result = await this.usersService.updateUser(id, req.body);
      res.status(200).json(result);
    })
  );

  public getById = asyncHandler(
    withAuth(async (req: Request, res: Response) => {
      const { id } = req.params;
  
      if (!id) {
        throw new ValidationError("Record id is required");
      }
  
      const result = await this.usersService.getUsers({ recordId: id }, { matchType: 'exact' });
      
      if (result.success) {
        res.status(200).json({ ...result, data: result.data[0] ? [result.data[0]] : [] });
      } else {
        res.status(200).json(result);
      }
    })
  );

  public delete = asyncHandler(
    withAuth(async (req: Request, res: Response) => {
      const { id } = req.params;

      if (!id) {
        throw new ValidationError("Record id is required");
      }

      const result = await this.usersService.deleteUser(id);
      res.status(200).json(result);
    })
  );

  public getSpotifyAuthUrl = asyncHandler(
    withAuth(async (req: Request, res: Response) => {
      const { id } = req.params;

      if (!id) {
        throw new ValidationError("User id is required");
      }
      
      const result = await this.spotifyService.getSpotifyAuthUrl(id);
      res.status(200).json(result);
    })
  );

  public syncLikedSongs = asyncHandler(
    withAuth(async (req: Request, res: Response) => {
      const { id } = req.params;

      if (!id) {
        throw new ValidationError("User id is required");
      }
      
      const result = await this.spotifyService.syncLikedSongs(id);
      res.status(200).json(result);
    })
  );

  public syncChangesToSpotify = asyncHandler(
    withAuth(async (req: Request, res: Response) => {
      const { id } = req.params;

      if (!id) {
        throw new ValidationError("User id is required");
      }
      
      if (!Array.isArray(req.body)) {
        throw new ValidationError(
          'Request body must be an array of tracks'
        );
      }

      const result = await this.spotifyService.syncChangesToSpotify(id, req.body);
      res.status(200).json(result);
    })
  );

  public getUserPlaylists = asyncHandler(
    withAuth(async (req: Request, res: Response) => {
      const { id } = req.params;

      if (!id) {
        throw new ValidationError("User id is required");
      }
      
      const result = await this.spotifyService.getUserPlaylists(id);
      res.status(200).json(result);
    })
  );

  public getUserTrackStates = asyncHandler(
    withAuth(async (req: Request, res: Response) => {
      const { id } = req.params;

      if (!id) {
        throw new ValidationError("User id is required");
      }
      
      const result = await this.spotifyService.getTrackStatesExtended(id);
      res.status(200).json(result);
    })
  );


}
