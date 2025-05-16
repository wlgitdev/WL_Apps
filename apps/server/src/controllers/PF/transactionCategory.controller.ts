import { Request, Response } from "express";
import { TransactionCategoryService } from "../../services/PF/transactionCategory.service";
import { asyncHandler } from "../../middleware/async";
import { TransactionCategoryFilters, transactionCategoryFilterConfig, FilterConfig } from "@wl-apps/types";
import { createQueryFilters, withAuth } from "../../middleware/utils";
import { ValidationError } from "../../errors/error";

export class TransactionCategoryController {
  constructor(private transactionCategoryService: TransactionCategoryService) {}
  private filterConfig: FilterConfig<TransactionCategoryFilters> =
    transactionCategoryFilterConfig;

  public create = asyncHandler(
    withAuth(async (req: Request, res: Response) => {
      const result =
        await this.transactionCategoryService.createTransactionCategory(
          req.body
        );
      res.status(201).json(result);
    })
  );

  public getAll = asyncHandler(
    withAuth(async (req: Request, res: Response) => {
      // Create filters dynamically based on query parameters
      const filters = createQueryFilters<TransactionCategoryFilters>(
        req,
        this.filterConfig
      );

      const matchType =
        req.query.matchType === 'contains' ? 'contains' : 'exact';

      const result = await this.transactionCategoryService.getTransactionCategories(filters, { matchType });
      res.status(200).json(result);
    })
  );

  public update = asyncHandler(
    withAuth(async (req: Request, res: Response) => {
      const { id } = req.params;

      if (!id) {
        throw new ValidationError("Record Id is required");
      }

      const result =
        await this.transactionCategoryService.updateTransactionCategory(
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
        throw new ValidationError("Record Id is required");
      }

      const result = await this.transactionCategoryService.deleteTransactionCategory(id);
      res.status(200).json(result);
    })
  );
}
