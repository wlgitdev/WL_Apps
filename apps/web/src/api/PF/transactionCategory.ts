import { type TransactionCategory, TransactionCategoryFilters as Filters, TransactionCategoryNamingScheme } from "@wl-apps/types";
import { SERVER_API_ROUTES } from "@wl-apps/utils";
import { ApiClient } from "../apiClient";
import { NotFoundError } from "../errors";

export const transactionCategoryApi = {
  // Get all data
  getAll: async (): Promise<TransactionCategory[]> => {
    return ApiClient.get<TransactionCategory[]>(
      SERVER_API_ROUTES.pf.transaction_categories
    );
  },

  getById: async (id: string): Promise<TransactionCategory> => {
    const categories = await ApiClient.get<TransactionCategory[]>(
      SERVER_API_ROUTES.pf.transaction_categories
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
      SERVER_API_ROUTES.pf.transaction_categories,
      record
    );
  },

  update: async (
    id: string,
    record: Partial<TransactionCategory>
  ): Promise<TransactionCategory> => {
    return ApiClient.put<TransactionCategory>(
      `${SERVER_API_ROUTES.pf.transaction_categories}/${id}`,
      record
    );
  },

  delete: async (id: string): Promise<void> => {
    return ApiClient.delete(`${SERVER_API_ROUTES.pf.transaction_categories}/${id}`);
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
      `${SERVER_API_ROUTES.pf.transaction_categories}?${queryParams.toString()}`
    );
  }
};
