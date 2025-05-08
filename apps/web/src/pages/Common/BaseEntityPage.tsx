import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@context/AuthContext';
import { EntityTable } from '@components/common/EntityTable';
import { BaseModel, EntityNamingScheme } from '@wl-apps/types';
import { ErrorModal } from '@/components/common/ErrorModal';
import { GetSchemaFunction } from '@/registry/setupSchemaRegistry';
import { GenericEntityForm } from '@/components/common/GenericEntityForm';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { ColumnType, ListSchema, UISchema } from '@wl-apps/schema-to-ui';

interface EntityWithName extends BaseModel {
  name: string;
}

interface EntityApi<T> {
  getAll: () => Promise<T[]>;
  search: (filters: Record<string, unknown>) => Promise<T[]>;
  create: (data: T) => Promise<T>;
  update: (id: string, data: Partial<T>) => Promise<T>;
  delete: (id: string) => Promise<void>;
}

interface BaseEntityPageProps<T extends EntityWithName> {
  entityApi: EntityApi<T>;
  getEntitySchema: GetSchemaFunction;
  entityNamingScheme: EntityNamingScheme;
  fetchReferenceData?: (
    modelName: string
  ) => Promise<Array<{ _id: string; name: string }>>;
}

type FormMode = 'create' | 'edit';

export function BaseEntityPage<T extends EntityWithName>({
  entityApi,
  getEntitySchema,
  entityNamingScheme,
  fetchReferenceData
}: BaseEntityPageProps<T>) {
  const queryClient = useQueryClient();
  const [error, setError] = useState<string | null>(null);
  const [formMode, setFormMode] = useState<FormMode | null>(null);
  const [selectedRecord, setSelectedRecord] = useState<T | null>(null);
  const { logout } = useAuth();
  const navigate = useNavigate();

  const getFormSchema = () => {
    const formSchema = getEntitySchema('form') as UISchema;
    Object.entries(formSchema.fields).forEach(([, field]) => {
      if (field.type === 'date') {
        field.valueMapper = {
          toDisplay: (value: string) => (value ? value.split('T')[0] : ''),
          fromDisplay: (value: string) =>
            value ? new Date(value).toISOString() : null
        };
      }
    });

    return formSchema;
  };
  const getListSchema = () => {
    const listSchema = getEntitySchema('list') as ListSchema<T>;
    listSchema.options = {
      ...listSchema.options,
      pagination: {
        ...listSchema.options?.pagination,
        enabled: true,
        pageSize: 10
      },
      rowActions: {
        ...listSchema.options?.rowActions,
        onDoubleClick(row) {
          handleEdit(row.recordId);
        }
      }
    };
    listSchema.columns = {
      ...listSchema.columns,
      actions: {
        label: 'Actions',
        field: 'actions' as keyof T,
        type: 'action' as ColumnType,
        sortable: false,
        format: {
          action: {
            variant: 'primary'
          }
        }
      }
    }

    Object.entries(listSchema.columns).forEach(([, column]) => {
      if (column.type === 'date') {
        column.format = {
          date: {
            formatter: (value: unknown) =>
              value ? new Date(value as string).toISOString().split('T')[0] : ''
          }
        };
      }
    });

    return listSchema;
  };

  const clearError = () => {
    setError(null);
  };

  const queryKey = ['entities', entityNamingScheme.MODEL];

  const rowActions = (row: T) => {
    return [
      {
        label: 'Edit',
        variant: 'primary',
        onClick: () => {
          handleEdit(row.recordId);
        },
        hidden: !row.recordId
      },
      {
        label: 'Delete',
        variant: 'secondary',
        onClick: async () => await handleDelete(row.recordId),
        hidden: !row.recordId
      }
    ];
  };

  const fetchRecords = async () => {
    try {
      const data = (await entityApi.getAll()).map(record => ({
        ...record,
        actions: rowActions(record)
      })) as T[];
      return data;
    } catch (err) {
      if (err instanceof Error && err.message.includes('Authentication')) {
        logout();
        navigate('/login');
        return [];
      }
      throw err;
    }
  };
  const { data: records, isLoading } = useQuery({
    queryKey,
    queryFn: fetchRecords
  });

  const handleSubmit = async (data: Partial<T>) => {
    try {
      if (formMode === 'create') {
        await entityApi.create(data as T);
      } else if (formMode === 'edit' && selectedRecord?.recordId) {
        await entityApi.update(selectedRecord.recordId, data);
      }
      // Invalidate and refetch
      await queryClient.invalidateQueries({ queryKey });
      handleCloseModal();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to save record');
    }
  };

  const handleEdit = (recordId: string | undefined) => {
    if (!recordId || isLoading || !records) {
      return;
    }

    const record = records.find(record => record.recordId === recordId);

    if (record) {
      setSelectedRecord(record);
      setFormMode('edit');
    }
  };

  const handleCloseModal = () => {
    setFormMode(null);
    setSelectedRecord(null);
  };

  const handleDelete = async (recordId: string | undefined) => {
    if (!recordId) return;
    try {
      await entityApi.delete(recordId);
      await queryClient.invalidateQueries({ queryKey });
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to delete record');
    }
  };

  return (
    <>
      <ErrorModal error={error} onClose={clearError} />

      {isLoading ? (
        <div>Loading...</div>
      ) : (
        <EntityTable<T>
          queryKey={queryKey}
          queryFn={fetchRecords}
          error={null}
          onAdd={() => setFormMode('create')}
          entityNamingScheme={entityNamingScheme}
          entitySchema={getListSchema()}
        />
      )}

      {formMode && (
        <GenericEntityForm
          modelName={entityNamingScheme.MODEL}
          uiSchema={getFormSchema()}
          fetchReferenceData={fetchReferenceData}
          open={true}
          onClose={handleCloseModal}
          onSubmit={handleSubmit}
          initialData={selectedRecord || undefined}
          title={
            formMode === 'create'
              ? `Create ${entityNamingScheme.SINGULAR}`
              : `Edit ${entityNamingScheme.SINGULAR}`
          }
          submitLabel={formMode === 'create' ? 'Create' : 'Save Changes'}
        />
      )}
    </>
  );
}
