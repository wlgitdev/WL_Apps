import { trackStatesSchema } from '@wl-apps/server/src/models/Sortify/TrackStates';
import {
  createSchemaVariants,
  UI_EXCLUDE_FIELDS,
  UI_READONLY_FIELDS
} from '@/schemas/constants';
import {
  MongooseSchemaAdapter,
  createUISchema
} from '@wl-apps/schema-to-ui';

export const adapter = new MongooseSchemaAdapter();
const baseSchema = adapter.toUISchema(trackStatesSchema, {
  groups: [
    {
      name: 'basic',
      label: 'Basic Information',
      fields: ['name', ...UI_READONLY_FIELDS]
    }
  ]
});

const updateFields = {
  ...baseSchema.fields
};
const listFields = {
  ...baseSchema.fields
};
const config = {
  excludeFields: [...UI_EXCLUDE_FIELDS],
  readOnlyFields: [...UI_READONLY_FIELDS]
};

export const { updateSchema, filterSchema, listSchema } = createSchemaVariants(
  baseSchema,
  updateFields,
  listFields,
  config
);

export const trackStatesUpdateUISchema = createUISchema(updateSchema);
export const trackStatesFilteringUISchema = createUISchema(filterSchema);
export const trackStatesListUISchema = createUISchema(listSchema);
