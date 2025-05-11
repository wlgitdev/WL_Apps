import { TransactionForecast, type BankAccount, BankAccountFilters as Filters, BankAccountNamingScheme } from "@wl-apps/types";
import { API_ENDPOINTS } from "../config";
import { ApiClient } from "../apiClient";
import { NotFoundError } from "../errors";

export const bankAccountApi = {
  getAll: async (): Promise<BankAccount[]> => {
    return ApiClient.get<BankAccount[]>(API_ENDPOINTS.PF.BANK_ACCOUNTS);
  },

  getById: async (id: string): Promise<BankAccount> => {
    const accounts = await ApiClient.get<BankAccount[]>(
      API_ENDPOINTS.PF.BANK_ACCOUNTS
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
    return ApiClient.post<BankAccount>(API_ENDPOINTS.PF.BANK_ACCOUNTS, data);
  },

  update: async (
    id: string,
    data: Partial<BankAccount>
  ): Promise<BankAccount> => {
    return ApiClient.put<BankAccount>(
      `${API_ENDPOINTS.PF.BANK_ACCOUNTS}/${id}`,
      data
    );
  },

  delete: async (id: string): Promise<void> => {
    return ApiClient.delete(`${API_ENDPOINTS.PF.BANK_ACCOUNTS}/${id}`);
  },

  search: async (criteria: Partial<Filters>): Promise<BankAccount[]> => {
    const queryParams = new URLSearchParams();

    Object.entries(criteria).forEach(([key, value]) => {
      if (value !== '') {
        queryParams.set(key, value.toString());
      }
    });

    queryParams.set('matchType', 'contains');

    return ApiClient.get<BankAccount[]>(`${API_ENDPOINTS.PF.BANK_ACCOUNTS}?${queryParams.toString()}`);
  },

  generateForecast: async (
    id: string,
    startDate: Date,
    endDate: Date
  ): Promise<TransactionForecast[]> => {
    return ApiClient.post<TransactionForecast[]>(
        `${API_ENDPOINTS.PF.BANK_ACCOUNTS}/${id}/forecast`,
        {
          startDate: startDate.toISOString(),
          endDate: endDate.toISOString(),
        }
      );
  },
};
