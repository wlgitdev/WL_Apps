import { BaseEntityPage } from '@pages/Common/BaseEntityPage';

import { type BankAccount as EntityType, BankAccountNamingScheme as EntityNamingScheme} from '@wl-apps/types/src/PF';
import { bankAccountApi as entityApi} from '@api/PF';
import { getBankAccountSchema} from '@/registry/PF/setupSchemaRegistry';

export const BankAccountsPage = () => {

  return (
    <BaseEntityPage<EntityType>
      entityApi={entityApi}
      getEntitySchema={getBankAccountSchema}
      entityNamingScheme={EntityNamingScheme}
    />
  );
};
