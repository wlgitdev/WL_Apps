import { useEffect, useState } from 'react';
import { Modal } from '@components/common/Modal';
import SchemaRegistry from '@/registry/SchemaRegistry';
import { FieldValue, FormData, FormTheme, UISchema, DynamicForm } from '@wl-apps/schema-to-ui';

const customTheme: Partial<FormTheme> = {
  form: {
    container: 'space-y-8',
    fieldsContainer: 'space-y-6',
    submitContainer: 'mt-8 flex justify-end'
  },
  banner: {
    container: "mb-4 p-4 border rounded-md",
    title: "font-medium mb-2",
    list: "list-disc list-inside space-y-1",
    item: "text-sm",
    error: {
      container: "border-red-300 bg-red-50",
      title: "text-red-800",
      list: "list-disc list-inside space-y-1",
      item: "text-red-700 text-sm"
    }
  },
  section: {
    container: 'border rounded-lg p-6 mb-6',
    header: 'flex items-center justify-between mb-6',
    title: 'text-xl font-medium',
    content: 'space-y-6',
    collapsible: {
      container: 'border rounded-lg mb-6 overflow-hidden',
      button:
        'w-full flex items-center justify-between p-2 hover:bg-gray-50 transition-colors duration-150 ease-in-out border-b',
      icon: 'w-5 h-5 transform transition-transform',
      iconOpen: 'rotate-180',
      content: 'p-6'
    }
  },
  field: {
    container: 'mb-6',
    label: 'block mb-3 font-medium',
    input: 'block w-full border rounded p-2 mt-2',
    select: 'block w-full border rounded p-2 mt-2',
    checkbox: {
      container: 'flex items-center gap-3 mt-2',
      input: 'h-5 w-5',
      label: 'font-medium'
    },
    required: 'text-red-500 ml-1 font-medium',
    radio: {
      group: 'space-y-2',
      container: 'flex items-center gap-2',
      input: 'h-4 w-4 border-gray-300 text-blue-600 focus:ring-blue-500',
      label: 'text-sm text-gray-900'
    },
    labelGroup: 'flex items-center gap-1 mb-1',
    multiselect: 'block w-full border rounded p-2 mt-2',
    error: 'text-red-500 text-sm mt-2'
  },
  grid: {
    container: 'grid gap-6 md:grid-cols-2',
    item: 'w-full'
  }
};

export interface EntityFormModalProps<EntityFormData, EntityType> {
  open: boolean;
  onClose: () => void;
  onSubmit: (data: EntityFormData) => Promise<void>;
  initialData?: Partial<EntityType>;
  title: string;
  submitLabel: string;
}

interface GenericEntityFormProps<T extends Record<string, unknown>> {
  open: boolean;
  onClose: () => void;
  onSubmit: (data: T) => Promise<void>;
  initialData?: Partial<T>;
  title: string;
  submitLabel: string;
  modelName: string;
  uiSchema: UISchema;
  transformers?: Record<string, (value: FieldValue) => unknown>;
  fetchReferenceData?: (modelName: string) => Promise<Array<{ _id: string; name: string }>>;
  // Navigation props
  showNavigation?: boolean;
  onPrevious?: () => void;
  onNext?: () => void;
  hasPrevious?: boolean;
  hasNext?: boolean;
}

export const GenericEntityForm = <T extends Record<string, unknown>>({
  open,
  onClose,
  onSubmit,
  initialData,
  title,
  submitLabel,
  uiSchema,
  transformers = {},
  fetchReferenceData,
  // Navigation props
  showNavigation = false,
  onPrevious,
  onNext,
  hasPrevious = false,
  hasNext = false
}: GenericEntityFormProps<T>) => {
  const [loading, setLoading] = useState(false);
  const [processedSchema, setProcessedSchema] = useState<UISchema>(uiSchema);
  const [referenceDataLoaded, setReferenceDataLoaded] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Register schema if not already registered
  useEffect(() => {
    const registry = SchemaRegistry.getInstance();
    if (!registry.hasSchema(title)) {
      registry.registerSchema(title, uiSchema, 'form');
    }
  }, [title, uiSchema]);

  // Reset form state when initialData changes (for navigation)
  useEffect(() => {
    // This ensures the form is re-rendered with new data when navigating
    setProcessedSchema(prevSchema => ({ ...prevSchema }));
  }, [initialData]);

  // Project Specific Schema Modifications

  useEffect(() => {
    const loadReferenceData = async () => {
      if (!fetchReferenceData) {
        setReferenceDataLoaded(true);
        return;
      }

      setLoading(true);
      try {
        const referenceFields = Object.entries(uiSchema.fields)
          .filter(([, field]) => field.reference);

        if (referenceFields.length === 0) {
          setReferenceDataLoaded(true);
          return;
        }

        const updatedFields = { ...uiSchema.fields };

        await Promise.all(
          referenceFields.map(async ([fieldName, field]) => {
            if (!field.reference) return;

            const referenceData = await fetchReferenceData(field.reference.modelName);
            updatedFields[fieldName] = {
              ...field,
              options: referenceData.map(item => ({
                value: item._id,
                label: item.name
              }))
            };
          })
        );

        setProcessedSchema({
          ...uiSchema,
          fields: updatedFields
        });
        setReferenceDataLoaded(true);
      } catch (error) {
        console.error('Error loading reference data:', error);
      } finally {
        setLoading(false);
      }
    };

    loadReferenceData();
  }, [uiSchema, fetchReferenceData]);
  

  // Transform form data before submission
  const handleSubmit = async (formData: FormData) => {
    try {
      setIsSubmitting(true);
    // Transform form data using provided transformers or default to raw values
    const entityData = Object.entries(formData).reduce(
      (record, [key, value]) => ({
        ...record,
        [key]: transformers[key] ? transformers[key](value) : value,
      }),
      {} as T
    );

    await onSubmit(entityData);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!referenceDataLoaded) {
    return null;
  }

  return (
    <Modal open={open} onClose={onClose} title={title}>
      {/* Navigation buttons */}
      {showNavigation && (
        <div className="flex justify-between mb-4">
          <div className="flex gap-2">
            <button
              type="button"
              onClick={onPrevious}
              disabled={!hasPrevious || isSubmitting || loading}
              className={`px-4 py-2 rounded-md ${
                hasPrevious && !isSubmitting && !loading
                  ? 'bg-gray-200 hover:bg-gray-300 text-gray-800' 
                  : 'bg-gray-100 text-gray-400 cursor-not-allowed'
              }`}
            >
              ← Previous
            </button>
            <button
              type="button"
              onClick={onNext}
              disabled={!hasNext || isSubmitting || loading}
              className={`px-4 py-2 rounded-md ${
                hasNext && !isSubmitting && !loading
                  ? 'bg-gray-200 hover:bg-gray-300 text-gray-800' 
                  : 'bg-gray-100 text-gray-400 cursor-not-allowed'
              }`}
            >
              Next →
            </button>
          </div>
          
          {/* Display current record position if available */}
          {initialData && initialData.recordId && (
            <div className="text-sm text-gray-500 flex items-center">
              Record ID: {String(initialData.recordId).substring(0, 8)}...
            </div>
          )}
        </div>
      )}

      {/* Form */}
      <DynamicForm
        schema={processedSchema}
        initialValues={initialData as FormData}
        onSubmit={handleSubmit}
        loading={loading || isSubmitting}
        submitLabel={isSubmitting ? 'Saving...' : submitLabel}
        theme={customTheme}
      />
    </Modal>
  );
};