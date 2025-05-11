import { BaseEntityPage } from '@pages/Common/BaseEntityPage';

import {
  BankAccount,
  BankAccountNamingScheme,
  TransactionNamingScheme as EntityNamingScheme,
  TransactionCategory,
  TransactionCategoryNamingScheme,
} from '@wl-apps/types';
import { transactionApi as entityApi } from '@api/PF/transaction';
import { bankAccountApi } from '@/api/PF/bankAccount';
import { getTransactionSchema } from '@/registry/PF/setupSchemaRegistry';
import { transactionCategoryApi } from '@/api/PF/transactionCategory';

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

  return (
    <BaseEntityPage
      entityApi={entityApi}
      getEntitySchema={getTransactionSchema}
      entityNamingScheme={EntityNamingScheme}
      fetchReferenceData={fetchReferenceData} 
    />
  );
}
