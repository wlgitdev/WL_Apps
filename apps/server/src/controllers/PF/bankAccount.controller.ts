import { Request, Response } from "express";
import { BankAccountService } from "../../services/PF/bankAccount.service";
import { asyncHandler } from "../../middleware/async";
import { BankAccountFilters, bankAccountFilterConfig, FilterConfig } from "@wl-apps/types";
import { createQueryFilters, withAuth } from "../../middleware/utils";
import { ForecastService } from "../../services/PF/forecast.service";
import { ValidationError } from "../../errors/error";

export class BankAccountController {
  constructor(private bankAccountService: BankAccountService, private forecastService: ForecastService) {}
  private filterConfig: FilterConfig<BankAccountFilters> =
    bankAccountFilterConfig;

  public create = asyncHandler(
    withAuth(async (req: Request, res: Response) => {
      const result = await this.bankAccountService.createBankAccount(req.body);
      res.status(201).json(result);
    })
  );

  public getAll = asyncHandler(
    withAuth(async (req: Request, res: Response) => {
      // Create filters dynamically based on query parameters
      const filters = createQueryFilters<BankAccountFilters>(
        req,
        this.filterConfig
      );
      
      const matchType = req.query.matchType === 'contains' ? 'contains' : 'exact';

      const result = await this.bankAccountService.getBankAccounts(filters, { matchType });
      res.status(200).json(result);
    })
  );

  public update = asyncHandler(
    withAuth(async (req: Request, res: Response) => {
      const { id } = req.params;

      if (!id) {
        throw new ValidationError("Record id is required");
      }

      const result = await this.bankAccountService.updateBankAccount(
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

      const result = await this.bankAccountService.deleteBankAccount(id);
      res.status(200).json(result);
    })
  );
  
  public generateForecast = asyncHandler(
    withAuth(async (req: Request, res: Response) => {
      const { id } = req.params;
      const { startDate, endDate } = req.body;
  
      if (!id) {
        throw new ValidationError("id is required");
      }
  
      if (!startDate || !endDate) {
        throw new ValidationError("startDate and endDate are required");
      }
  
      const result = await this.forecastService.generateForecast({
        bankAccountId: id, // now typescript knows id is defined
        startDate: new Date(startDate),
        endDate: new Date(endDate)
      });
  
      res.status(200).json(result);
    })
  );
}
