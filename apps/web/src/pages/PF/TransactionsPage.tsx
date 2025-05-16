import { BaseEntityPage } from '@pages/Common/BaseEntityPage';

import {
  BankAccount,
  BankAccountNamingScheme,
  TransactionNamingScheme as EntityNamingScheme,
  Transaction,
  TransactionCategory,
  TransactionCategoryNamingScheme,
} from '@wl-apps/types';
import { transactionCategoryApi, transactionApi as entityApi, bankAccountApi } from '@api/PF';
import { getTransactionSchema } from '@/registry/PF/setupSchemaRegistry';

export const TransactionsPage = () => {
  const fetchReferenceData = async (
    modelName: string
  ): Promise<Array<{ _id: string; name: string }>> => {
    if (modelName === BankAccountNamingScheme.MODEL) {
      const records = await bankAccountApi.getAll();
      return records
        .filter(
          (record): record is BankAccount & { recordId: string } =>
            typeof record.recordId === 'string'
        )
        .map(record => ({
          _id: record.recordId,
          name: record.name
        }));
    } else if (modelName === TransactionCategoryNamingScheme.MODEL) {
      const records = await transactionCategoryApi.getAll();
      return records
        .filter(
          (record): record is TransactionCategory & { recordId: string } =>
            typeof record.recordId === 'string'
        )
        .map(record => ({
          _id: record.recordId,
          name: record.name
        }));
    }
    return [];
  };

  // Pre-fetch categories for the list view
  const transformData = async (transaction: Transaction) => {
    const categories = await fetchReferenceData(TransactionCategoryNamingScheme.MODEL);
    return {
      ...transaction,
      categories: transaction.categories?.map(categoryId => {
        const category = categories.find(c => c._id === categoryId);
        return category?.name || categoryId;
      })
    };
  };

  return (
    <BaseEntityPage
      entityApi={{
        ...entityApi,
        getAll: async () => {
          const transactions = await entityApi.getAll();
          return Promise.all(transactions.map(transformData));
        }
      }}
      getEntitySchema={getTransactionSchema}
      entityNamingScheme={EntityNamingScheme}
      fetchReferenceData={fetchReferenceData} 
    />
  );
};