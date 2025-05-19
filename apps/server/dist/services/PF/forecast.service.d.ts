import { ApiResponse, TransactionForecast, ForecastRequest } from "@wl-apps/types";
export declare class ForecastService {
    private transactionService;
    generateForecast(request: ForecastRequest): Promise<ApiResponse<TransactionForecast[]>>;
    private calculateForecastPoints;
}
//# sourceMappingURL=forecast.service.d.ts.map