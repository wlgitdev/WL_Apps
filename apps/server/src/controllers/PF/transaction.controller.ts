import { Request, Response } from "express";
import { TransactionService as EntityService } from "../../services/PF/transaction.service";
import { asyncHandler } from "../../middleware/async";
import { TransactionFilters as EntityFilters, transactionFilterConfig as entityFilterConfig, FilterConfig } from "@wl-apps/types";
import { createQueryFilters, withAuth } from "../../middleware/utils";
import { ValidationError } from "../../errors/error";

export class TransactionController {
  constructor(private entityService: EntityService) {}
  private filterConfig: FilterConfig<EntityFilters> = entityFilterConfig;

  public create = asyncHandler(
    withAuth(async (req: Request, res: Response) => {
      const result = await this.entityService.createTransaction(req.body);
      res.status(201).json(result);
    })
  );

  public createBatch = asyncHandler(
    withAuth(async (req: Request, res: Response) => {
      if (!Array.isArray(req.body)) {
        throw new ValidationError(
          'Request body must be an array of transactions'
        );
      }

      const result = await this.entityService.createTransactionsBatch(req.body);
      res.status(201).json(result);
    })
  );

  public getAll = asyncHandler(
    withAuth(async (req: Request, res: Response) => {
      // Create filters dynamically based on query parameters
      const filters = createQueryFilters<EntityFilters>(req, this.filterConfig);

      const matchType =
        req.query.matchType === 'contains' ? 'contains' : 'exact';

      const result = await this.entityService.getTransactions(filters, {
        matchType
      });
      res.status(200).json(result);
    })
  );

  public getAllWithinRange = asyncHandler(
    withAuth(async (req: Request, res: Response) => {
      const filters = createQueryFilters<EntityFilters>(req, this.filterConfig);
      const matchType =
        req.query.matchType === 'contains' ? 'contains' : 'exact';

      const startDate = new Date(req.query.startDate as string);
      const endDate = new Date(req.query.endDate as string);

      if (isNaN(startDate.getTime()) || isNaN(endDate.getTime())) {
        return res
          .status(400)
          .json({ success: false, message: 'Invalid date range' });
      }

      const result = await this.entityService.getTransactionsWithinRange(
        startDate,
        endDate,
        filters,
        { matchType }
      );
      res.status(200).json(result);
    })
  );

  public update = asyncHandler(
    withAuth(async (req: Request, res: Response) => {
      const { id } = req.params;

      if (!id) {
        throw new ValidationError('Record id is required');
      }

      const result = await this.entityService.updateTransaction(id, req.body);
      res.status(200).json(result);
    })
  );

  public updateBatch = asyncHandler(
    withAuth(async (req: Request, res: Response) => {
      if (!Array.isArray(req.body)) {
        throw new ValidationError('Request body must be an array of updates');
      }

      const updates = req.body.map(item => {
        if (!item.recordId || !item.data) {
          throw new ValidationError(
            'Each update must contain a recordId and data object'
          );
        }
        return {
          recordId: item.recordId,
          data: item.data
        };
      });

      const result = await this.entityService.updateTransactionsBatch(updates);
      res.status(200).json(result);
    })
  );

  public delete = asyncHandler(
    withAuth(async (req: Request, res: Response) => {
      const { id } = req.params;

      if (!id) {
        throw new ValidationError('Record id is required');
      }

      const result = await this.entityService.deleteTransaction(id);
      res.status(200).json(result);
    })
  );
}
