import { transactionSchema } from '@wl-apps/server/src/models/PF/Transaction';
import { UI_EXCLUDE_FIELDS, UI_READONLY_FIELDS } from '@/schemas/constants';
import { ListSchema, MongooseSchemaAdapter } from '@wl-apps/schema-to-ui';
import { Transaction } from '@wl-apps/types';
import { transactionRecurOnConfig } from './bit-flags';
import { recurOnDependencies } from './dependencies';

const adapter = new MongooseSchemaAdapter();

// Form Schema
export const transactionUpdateUISchema = adapter.toUISchema(transactionSchema, {
  groups: [
    {
      name: 'basic',
      label: '',
      fields: [
        'name',
        'bankAccount',
        'direction',
        'amount',
        'notes',
        'categories'
      ]
    },
    {
      name: 'scheduling',
      label: 'Scheduling',
      fields: [
        'startDate',
        'endDate',
        'recurInterval',
        'recurFrequency',
        'recurOn',
        'nextOccurrence'
      ],
      collapsible: true
    },
    {
      name: 'system',
      label: 'System Fields',
      fields: [...UI_READONLY_FIELDS],
      collapsible: true
    }
  ],
  excludeFields: UI_EXCLUDE_FIELDS,
  readOnlyFields: UI_READONLY_FIELDS
});

// Add custom field configurations
transactionUpdateUISchema.fields.recurOn = {
    type: 'multiselect',
    label: 'Recur On',
    dependencies: recurOnDependencies,
    bitFlags: transactionRecurOnConfig
};

// List Schema
const listSchema = adapter.toListSchema<Transaction>(transactionSchema, {
  excludeFields: [...UI_EXCLUDE_FIELDS, ...UI_READONLY_FIELDS],
  pageSize: 10,
  visibleFields: ['name', 'amount']
});

Object.entries(listSchema.columns).forEach(([, column]) => {
  column.sortable = true;
  column.filterable = true;
});

export const transactionListUISchema: ListSchema<Transaction> = {
  ...listSchema,
  columns: listSchema.columns,
  options: {
    ...listSchema.options,
    defaultSort: {
      field: 'name' as keyof Transaction,
      direction: 'asc'
    }
  }
};