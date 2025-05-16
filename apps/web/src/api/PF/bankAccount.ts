import { TransactionForecast, type BankAccount, BankAccountFilters as Filters, BankAccountNamingScheme } from "@wl-apps/types";
import { ApiClient } from "../apiClient";
import { NotFoundError } from "../errors";
import { SERVER_API_ROUTES } from "@wl-apps/utils";

export const bankAccountApi = {
  getAll: async (): Promise<BankAccount[]> => {
    return ApiClient.get<BankAccount[]>(SERVER_API_ROUTES.pf.bank_accounts);
  },

  getById: async (id: string): Promise<BankAccount> => {
    const accounts = await ApiClient.get<BankAccount[]>(
      SERVER_API_ROUTES.pf.bank_accounts
    );
    const account = accounts.find(record => record.recordId === id);

    if (!account) {
      throw new NotFoundError(BankAccountNamingScheme.SINGULAR);
    }

    return account;
  },

  // Create new data
  create: async (
    data: Omit<BankAccount, 'recordId' | 'createdAt' | 'updatedAt'>
  ): Promise<BankAccount> => {
    return ApiClient.post<BankAccount>(SERVER_API_ROUTES.pf.bank_accounts, data);
  },

  update: async (
    id: string,
    data: Partial<BankAccount>
  ): Promise<BankAccount> => {
    return ApiClient.put<BankAccount>(
      `${SERVER_API_ROUTES.pf.bank_accounts}/${id}`,
      data
    );
  },

  delete: async (id: string): Promise<void> => {
    return ApiClient.delete(`${SERVER_API_ROUTES.pf.bank_accounts}/${id}`);
  },

  search: async (criteria: Partial<Filters>): Promise<BankAccount[]> => {
    const queryParams = new URLSearchParams();

    Object.entries(criteria).forEach(([key, value]) => {
      if (value !== '') {
        queryParams.set(key, value.toString());
      }
    });

    queryParams.set('matchType', 'contains');

    return ApiClient.get<BankAccount[]>(`${SERVER_API_ROUTES.pf.bank_accounts}?${queryParams.toString()}`);
  },

  generateForecast: async (
    id: string,
    startDate: Date,
    endDate: Date
  ): Promise<TransactionForecast[]> => {
    return ApiClient.post<TransactionForecast[]>(
        `${SERVER_API_ROUTES.pf.bank_accounts}/${id}/forecast`,
        {
          startDate: startDate.toISOString(),
          endDate: endDate.toISOString(),
        }
      );
  },
};
