export const API_ENDPOINTS = {
  AUTH: `${import.meta.env.VITE_API_URL}/auth`,
  AUTH_LOGIN: '/login',
  PF: {
    BANK_ACCOUNTS: `${import.meta.env.VITE_API_URL}/pf/bank-accounts`,
    TRANSACTION_CATEGORIES: `${import.meta.env.VITE_API_URL
      }/pf/transaction-categories`,
    TRANSACTIONS: `${import.meta.env.VITE_API_URL}/pf/transactions`,
    TRANSACTIONS_WITHIN_RANGE: `${import.meta.env.VITE_API_URL
      }/pf/transactions/range`
  }
} as const;
