import { type TransactionCategory, TransactionCategoryFilters as Filters, TransactionCategoryNamingScheme } from "@wl-apps/types";
import { API_ENDPOINTS } from "../config";
import { ApiClient } from "../apiClient";
import { NotFoundError } from "../errors";

export const transactionCategoryApi = {
  // Get all data
  getAll: async (): Promise<TransactionCategory[]> => {
    return ApiClient.get<TransactionCategory[]>(
      API_ENDPOINTS.PF.TRANSACTION_CATEGORIES
    );
  },

  getById: async (id: string): Promise<TransactionCategory> => {
    const categories = await ApiClient.get<TransactionCategory[]>(
      API_ENDPOINTS.PF.TRANSACTION_CATEGORIES
    );
    const category = categories.find(record => record.recordId === id);

    if (!category) {
      throw new NotFoundError(TransactionCategoryNamingScheme.SINGULAR);
    }

    return category;
  },

  create: async (
    record: Omit<TransactionCategory, 'recordId' | 'createdAt' | 'updatedAt'>
  ): Promise<TransactionCategory> => {
    return ApiClient.post<TransactionCategory>(
      API_ENDPOINTS.PF.TRANSACTION_CATEGORIES,
      record
    );
  },

  update: async (
    id: string,
    record: Partial<TransactionCategory>
  ): Promise<TransactionCategory> => {
    return ApiClient.put<TransactionCategory>(
      `${API_ENDPOINTS.PF.TRANSACTION_CATEGORIES}/${id}`,
      record
    );
  },

  delete: async (id: string): Promise<void> => {
    return ApiClient.delete(`${API_ENDPOINTS.PF.TRANSACTION_CATEGORIES}/${id}`);
  },

  // Search data
  search: async (
    criteria: Partial<Filters>
  ): Promise<TransactionCategory[]> => {
    const queryParams = new URLSearchParams();

    // Add filters to query params
    Object.entries(criteria).forEach(([key, value]) => {
      if (value !== '') {
        queryParams.set(key, value.toString());
      }
    });

    queryParams.set('matchType', 'contains');

    return ApiClient.get<TransactionCategory[]>(
      `${API_ENDPOINTS.PF.TRANSACTION_CATEGORIES}?${queryParams.toString()}`
    );
  }
};
