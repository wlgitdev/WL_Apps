import { Request, Response } from "express";
import { TrackStatesService } from "../../services/Sortify/trackStates.service";
import { asyncHandler } from "../../middleware/async";
import { FilterConfig } from "@wl-apps/types";
import { createQueryFilters, withAuth } from "../../middleware/utils";
import { ValidationError } from "../../errors/error";
import { TrackStatesFilters,TrackStatesFilterConfig } from "@wl-apps/types";

export class TrackStatesController {
  constructor(private trackStatesService: TrackStatesService) {}
  private filterConfig: FilterConfig<TrackStatesFilters> =
    TrackStatesFilterConfig;

  public create = asyncHandler(
    withAuth(async (req: Request, res: Response) => {
      const result = await this.trackStatesService.createTrackStates(req.body);
      res.status(201).json(result);
    })
  );

  public getAll = asyncHandler(
    withAuth(async (req: Request, res: Response) => {
      // Create filters dynamically based on query parameters
      const filters = createQueryFilters<TrackStatesFilters>(
        req,
        this.filterConfig
      );
      
      const matchType = req.query.matchType === 'contains' ? 'contains' : 'exact';

      const result = await this.trackStatesService.getTrackStates(filters, { matchType });
      res.status(200).json(result);
    })
  );

  public update = asyncHandler(
    withAuth(async (req: Request, res: Response) => {
      const { id } = req.params;

      if (!id) {
        throw new ValidationError("Record id is required");
      }

      const result = await this.trackStatesService.updateTrackStates(
        id,
        req.body
      );
      res.status(200).json(result);
    })
  );

  public delete = asyncHandler(
    withAuth(async (req: Request, res: Response) => {
      const { id } = req.params;

      if (!id) {
        throw new ValidationError("Record id is required");
      }

      const result = await this.trackStatesService.deleteTrackStates(id);
      res.status(200).json(result);
    })
  );
  
  public createBatch = asyncHandler(
    withAuth(async (req: Request, res: Response) => {
      const result = await this.trackStatesService.createTrackStatesBatch(req.body);
      res.status(201).json(result);
    })
  );

  public updateBatch = asyncHandler(
    withAuth(async (req: Request, res: Response) => {
      const result = await this.trackStatesService.updateTrackStatesBatch(req.body);
      res.status(200).json(result);
    })
  );
}
