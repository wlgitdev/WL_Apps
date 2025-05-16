import { UI_EXCLUDE_FIELDS, UI_READONLY_FIELDS } from '@/schemas/constants';
import { ListSchema, MongooseSchemaAdapter } from '@wl-apps/schema-to-ui';
import { trackStatesSchema } from '@wl-apps/server/src/models/Sortify/TrackStates';
import { TrackStatesExtended } from '@wl-apps/types';

const adapter = new MongooseSchemaAdapter();
const initialTrackStatesListSchema = adapter.toListSchema(trackStatesSchema, {
  excludeFields: [
    ...UI_EXCLUDE_FIELDS,
    ...UI_READONLY_FIELDS,
    'trackId',
    'userId'
  ],
  defaultGroupBy: 'status',
  enableSelection: true,
  selectionType: 'multi',
  pageSize: 10
});

Object.entries(initialTrackStatesListSchema.columns).forEach(([, column]) => {
  column.sortable = true;
  column.filterable = true;
});

export const trackStatesListSchema: ListSchema<TrackStatesExtended> = {
  ...initialTrackStatesListSchema,
  columns: {
    ...initialTrackStatesListSchema.columns,
    artist_names: {
      label: 'Artists',
      field: 'artist_names',
      type: 'array',
      sortable: true,
      filterable: true
    },
    date_added: {
      label: 'Date Added',
      field: 'date_added',
      type: 'date',
      sortable: true,
      filterable: true,
      format: {
        date: {
          format: 'MMM dd, yyyy',
          timezone: 'UTC'
        }
      }
    },
    genres: {
      label: 'Genres',
      field: 'genres',
      type: 'array',
      sortable: true,
      filterable: true
    }
    },
  options: {
    ...initialTrackStatesListSchema.options,
    defaultSort: {
      field: 'createdAt',
      direction: 'asc'
    }
  }
};