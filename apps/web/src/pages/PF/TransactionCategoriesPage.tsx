import { BaseEntityPage } from '@pages/Common/BaseEntityPage';

import {
  type TransactionCategory as EntityType,
  TransactionCategoryNamingScheme as EntityNamingScheme,
} from '@wl-apps/types';
import { transactionCategoryApi as entityApi } from '@api/PF/transactionCategory';
import { getTransactionCategorySchema} from '@/registry/PF/setupSchemaRegistry';

export const TransactionCategoriesPage = () => {
  return (
    <BaseEntityPage<EntityType>
      entityApi={entityApi}
      getEntitySchema={getTransactionCategorySchema}
      entityNamingScheme={EntityNamingScheme}
    />
  );
};