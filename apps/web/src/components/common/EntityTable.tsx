import { DynamicList, ListSchema } from '@wl-apps/schema-to-ui';
import { BaseModel, EntityNamingScheme } from '@wl-apps/types';
import { ErrorModal } from './ErrorModal';

export interface EntityTableProps<T extends BaseModel> {
  queryFn: () => Promise<T[]>;
  queryKey: string[];
  error: string | null;
  onAdd: () => void;
  entitySchema: ListSchema<T>;
  entityNamingScheme: EntityNamingScheme;
}

export const EntityTable = <T extends BaseModel>({
  entityNamingScheme,
  queryFn,
  queryKey,
  error,
  onAdd,
  entitySchema
}: EntityTableProps<T>) => {
  return (
    <>
      <ErrorModal error={error} onClose={() => {}} />
      <div className="container mx-auto p-4">
        <div className="flex justify-between items-center mb-4">
          <h1 className="text-2xl font-bold">{entityNamingScheme.PLURAL}</h1>
          <button
            onClick={onAdd}
            className="px-4 py-2 text-white bg-blue-600 rounded-md hover:bg-blue-700"
          >
            Add
          </button>
        </div>

        <DynamicList<T>
          schema={entitySchema}
          queryKey={queryKey}
          queryFn={queryFn}
          className="w-full"
        />
      </div>
    </>
  );
};
