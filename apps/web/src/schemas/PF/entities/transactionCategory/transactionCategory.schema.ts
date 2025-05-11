import { transactionCategorySchema } from '@wl-apps/server/src/models/PF/TransactionCategory';
import { UI_EXCLUDE_FIELDS, UI_READONLY_FIELDS } from '@/schemas/constants';
import { ListSchema, MongooseSchemaAdapter } from '@wl-apps/schema-to-ui';
import { TransactionCategory } from '@wl-apps/types';

const adapter = new MongooseSchemaAdapter();

// Form Schema
export const transactionCategoryUpdateUISchema = adapter.toUISchema(transactionCategorySchema, {
  groups: [
    {
      name: 'basic',
      label: 'Basic Information',
      fields: ['name']
    },
    {
      name: 'system',
      label: 'System Fields',
      fields: UI_READONLY_FIELDS,
      collapsible: true
    }
  ],
  excludeFields: UI_EXCLUDE_FIELDS,
  readOnlyFields: UI_READONLY_FIELDS
});

// List Schema
const listSchema = adapter.toListSchema<TransactionCategory>(transactionCategorySchema, {
  excludeFields: [...UI_EXCLUDE_FIELDS, ...UI_READONLY_FIELDS],
  pageSize: 10
});

Object.entries(listSchema.columns).forEach(([, column]) => {
  column.sortable = true;
  column.filterable = true;
});

export const transactionCategoryListUISchema: ListSchema<TransactionCategory> = {
  ...listSchema,
  columns: listSchema.columns,
  options: {
    ...listSchema.options,
    defaultSort: {
      field: 'name' as keyof TransactionCategory,
      direction: 'asc'
    }
  }
};