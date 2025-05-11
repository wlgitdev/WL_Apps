import { bankAccountSchema } from '@wl-apps/server/src/models/PF';
import {
  UI_EXCLUDE_FIELDS,
  UI_READONLY_FIELDS
} from '@/schemas/constants';
import { ListSchema, MongooseSchemaAdapter } from '@wl-apps/schema-to-ui';
import { BankAccount, TransactionCategoryNamingScheme } from '@wl-apps/types';

const adapter = new MongooseSchemaAdapter();

// Form Schema

export const bankAccountUpdateUISchema = adapter.toUISchema(bankAccountSchema, {
  groups: [
    {
      name: 'basic',
      label: 'Basic Information',
      fields: ['name', 'balance', 'balanceUpdateDate']
    },
    {
      name: 'system',
      label: 'System Fields',
      fields: UI_READONLY_FIELDS,
      collapsible: true
    }
  ],  
  excludeFields: [...UI_EXCLUDE_FIELDS, TransactionCategoryNamingScheme.PLURAL],
  readOnlyFields: [...UI_READONLY_FIELDS, 'balanceUpdateDate']
});

// List Schema

const listSchema = adapter.toListSchema<BankAccount>(bankAccountSchema, {
  excludeFields: [...UI_EXCLUDE_FIELDS, ...UI_READONLY_FIELDS],
});

Object.entries(listSchema.columns).forEach(([, column]) => {
  column.sortable = true;
  column.filterable = true;
});

export const bankAccountListUISchema: ListSchema<BankAccount> = {
  ...listSchema,
  columns: listSchema.columns,
  options: {
    ...listSchema.options,
    defaultSort: {
      field: 'name' as keyof BankAccount,
      direction: 'asc'
    },
  }
};
