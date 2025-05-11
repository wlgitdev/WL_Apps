import { TransactionFilters as Filters, TransactionNamingScheme, type Transaction } from "@wl-apps/types";
import { API_ENDPOINTS } from "../config";
import { NotFoundError } from "../errors";
import { ApiClient } from "../apiClient";

export const transactionApi = {
  // Get all data
  getAll: async (): Promise<Transaction[]> => {
    return ApiClient.get<Transaction[]>(API_ENDPOINTS.PF.TRANSACTIONS);
  },

  getById: async (id: string): Promise<Transaction> => {
    const transactions = await ApiClient.get<Transaction[]>(
      API_ENDPOINTS.PF.TRANSACTIONS
    );
    const transaction = transactions.find(record => record.recordId === id);

    if (!transaction) {
      throw new NotFoundError(TransactionNamingScheme.SINGULAR);
    }

    return transaction;
  },

  create: async (
    record: Omit<Transaction, 'recordId' | 'createdAt' | 'updatedAt'>
  ): Promise<Transaction> => {
    return ApiClient.post<Transaction>(API_ENDPOINTS.PF.TRANSACTIONS, record);
  },

  update: async (
    id: string,
    record: Partial<Transaction>
  ): Promise<Transaction> => {
    return ApiClient.put<Transaction>(
      `${API_ENDPOINTS.PF.TRANSACTIONS}/${id}`,
      record
    );
  },

  delete: async (id: string): Promise<void> => {
    return ApiClient.delete(`${API_ENDPOINTS.PF.TRANSACTIONS}/${id}`);
  },

  // Search data
  search: async (criteria: Partial<Filters>): Promise<Transaction[]> => {
    const queryParams = new URLSearchParams();

    // Add filters to query params
    Object.entries(criteria).forEach(([key, value]) => {
      if (value !== '' && value !== null) {
        queryParams.set(key, value.toString());
      }
    });

    queryParams.set('matchType', 'contains');

    return ApiClient.get<Transaction[]>(
      `${API_ENDPOINTS.PF.TRANSACTIONS}?${queryParams.toString()}`
    );
  },

  getWithinDateRange: async (
    startDate: string,
    endDate: string,
    filters: Partial<Filters> = {}
  ): Promise<Transaction[]> => {
    const queryParams = new URLSearchParams();
    queryParams.set('startDate', startDate);
    queryParams.set('endDate', endDate);

    Object.entries(filters).forEach(([key, value]) => {
      if (value !== '' && value !== null) {
        queryParams.set(key, value.toString());
      }
    });

    return ApiClient.get<Transaction[]>(
      `${API_ENDPOINTS.PF.TRANSACTIONS_WITHIN_RANGE}?${queryParams.toString()}`
    );
  }
};
