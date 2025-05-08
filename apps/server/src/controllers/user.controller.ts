import { Request, Response } from "express";
import { UserService } from "../services/user.service";
import { asyncHandler } from "../middleware/async";
import { UserFilters, userFilterConfig, FilterConfig } from "@wl-apps/types";
import {
  createQueryFilters,
  withAuth,
} from "../middleware/utils";
import { ValidationError } from "../errors/error";

export class UserController {
  constructor(private userService: UserService) {}
  private filterConfig: FilterConfig<UserFilters> = userFilterConfig;

  public create = asyncHandler(
    withAuth(async (req: Request, res: Response) => {
      const result = await this.userService.createUser(req.body);
      res.status(201).json(result);
    })
  );

  public getAll = asyncHandler(
    withAuth(async (req: Request, res: Response) => {
      const filters = createQueryFilters<UserFilters>(req, this.filterConfig);

      const matchType =
        req.query.matchType === 'contains' ? 'contains' : 'exact';

      const result = await this.userService.getUsers(filters, { matchType });
      res.status(200).json(result);
    })
  );

  public update = asyncHandler(
    withAuth(async (req: Request, res: Response) => {
      const { id } = req.params;

      if (!id) {
        throw new ValidationError("Record id is required");
      }

      const result = await this.userService.updateUser(id, req.body);
      res.status(200).json(result);
    })
  );

  public delete = asyncHandler(
    withAuth(async (req: Request, res: Response) => {
      const { id } = req.params;

      if (!id) {
        throw new ValidationError("Record id is required");
      }

      const result = await this.userService.deleteUser(id);
      res.status(200).json(result);
    })
  );
}
