import { useState, useMemo, useEffect } from "react";
import { useDebounce } from "react-use";
import { ChevronIcon } from "./ChevronIcon";
import { DynamicForm, FormData, UISchema } from "@wl-apps/schema-to-ui";

export interface SearchCriteria {
  filters: Record<string, string | boolean | number>;
}

export type ReferenceOption = {
  _id: string;
  name: string;
  [key: string]: unknown;
};
type FilterValue = string | boolean | number;
type FilterRecord = Record<string, FilterValue>;

interface EntitySearchFiltersProps {
  onFilter: (criteria: SearchCriteria) => void;
  uiSchema: UISchema;
  fetchReferenceData?: (modelName: string) => Promise<ReferenceOption[]>;
}

export const EntitySearchFilters: React.FC<EntitySearchFiltersProps> = ({
  onFilter,
  uiSchema,
  fetchReferenceData,
}) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [filters, setFilters] = useState<FilterRecord>({});
  const [referenceData, setReferenceData] = useState<
    Record<string, ReferenceOption[]>
  >({});
  const [isLoadingReferences, setIsLoadingReferences] = useState(false);

  // Get active filter field names and their labels
  const activeFilterLabels = useMemo(() => {
    return Object.keys(filters).map((fieldName) => ({
      name: fieldName,
      label: uiSchema.fields[fieldName]?.label || fieldName,
    }));
  }, [filters, uiSchema.fields]);

  // Transform form data to filter format
  const transformFormDataToFilters = (formData: FormData): FilterRecord => {
    return Object.entries(formData).reduce((acc, [key, value]) => {
      if (value === null || value === undefined || value === '') {
        return acc;
      }

      // Handle checkbox/boolean values
      if (
        typeof value === 'string' &&
        (value === 'true' || value === 'false')
      ) {
        acc[key] = value === 'true';
        return acc;
      }

      // Handle numeric values
      if (typeof value === 'string' && !isNaN(Number(value))) {
        acc[key] = Number(value);
        return acc;
      }

      // Handle other values
      acc[key] = value as FilterValue;
      return acc;
    }, {} as FilterRecord);
  };

  // Load reference data
  useEffect(() => {
    const loadReferenceData = async () => {
      if (!fetchReferenceData) return;

      const referencedFields = Object.entries(uiSchema.fields).filter(
        ([, field]) => field.reference
      );

      if (referencedFields.length === 0) return;

      setIsLoadingReferences(true);
      try {
        const results = await Promise.all(
          referencedFields.map(async ([fieldName, field]) => {
            if (!field.reference?.modelName) return null;
            const data = await fetchReferenceData(field.reference.modelName);
            return { fieldName, data };
          })
        );

        const newReferenceData = results.reduce((acc, result) => {
          if (result) {
            acc[result.fieldName] = result.data;
          }
          return acc;
        }, {} as Record<string, ReferenceOption[]>);

        setReferenceData(newReferenceData);
      } catch (error) {
        console.error('Failed to load reference data:', error);
      } finally {
        setIsLoadingReferences(false);
      }
    };

    loadReferenceData();
  }, [uiSchema, fetchReferenceData]);

  // Create a search-specific schema with modifications for search behavior
  const searchSchema = useMemo(() => {
    const searchFields: UISchema['fields'] = {};

    Object.entries(uiSchema.fields).forEach(([fieldName, field]) => {
      if (field.type === 'list') return; // Skip list fields for search

      // Create a modified field definition for search
      searchFields[fieldName] = {
        ...field,
        placeholder: `Filter ${field.label}...`
      };

      
      if (searchFields[fieldName]?.readOnly === true) {
        searchFields[fieldName].readOnly = false;
      }
      
      // Handle reference fields
      if (field.reference && referenceData[fieldName]) {
        searchFields[fieldName] = {
          ...searchFields[fieldName],
          type: "select",
          options: [
            { value: "", label: "Any" },
            ...referenceData[fieldName].map((item) => ({
              value: item._id,
              label:
                item[field.reference?.displayField || "name"]?.toString() ||
                item._id,
            })),
          ],
        };
      }

      // Convert number fields to text for range searches
      if (field.type === 'number') {
        searchFields[fieldName].type = 'text';
      }

      // Modify select/multiselect fields to include an "Any" option
      if (field.type === 'select' || field.type === 'multiselect') {
        searchFields[fieldName].type = 'select'; // Force single select for search
        searchFields[fieldName].options = [
          { value: '', label: 'Any' },
          ...(field.options || [])
        ];
      }

      // Convert checkbox to select for three-state filtering
      if (field.type === 'checkbox') {
        searchFields[fieldName].type = 'select';
        searchFields[fieldName].options = [
          { value: '', label: 'Any' },
          { value: 'true', label: 'Yes' },
          { value: 'false', label: 'No' }
        ];
      }
    });

    return {
      fields: searchFields,
      layout: {
        groups: [
          {
            name: 'filters',
            label: '',
            fields: Object.keys(searchFields)
          }
        ]
      }
    };
  }, [uiSchema, referenceData]);

  // Handle form changes with debounce
  useDebounce(
    () => {
      // Remove empty values from filters
      const activeFilters = Object.entries(filters).reduce(
        (acc, [key, value]) => {
          if (value !== "" && value !== null && value !== undefined) {
            acc[key] = value;
          }
          return acc;
        },
        {} as Record<string, string | boolean | number>
      );

      onFilter({ filters: activeFilters });
    },
    300,
    [filters]
  );

  const handleSubmit = async (formData: FormData) => {
    const transformedFilters = transformFormDataToFilters(formData);
    setFilters(transformedFilters);
  };

  if (isLoadingReferences) {
    return (
      <div className="bg-white shadow-sm rounded-lg p-4 mb-4 border border-gray-200">
        <div className="flex justify-center items-center p-4">
          <span className="text-gray-600">Loading filters...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white shadow-sm rounded-lg p-4 mb-4 border border-gray-200">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-medium text-gray-900">Filters</h3>
        <div className="flex items-center gap-4">
          {activeFilterLabels.length > 0 && (
            <div className="flex flex-wrap gap-2">
              <span className="bg-blue-100 text-blue-800 px-2 py-0.5 rounded-full text-xs">
                {activeFilterLabels.length} active
              </span>
              <div className="flex flex-wrap gap-1">
                {activeFilterLabels.map(({ label }, index) => (
                  <span
                    key={label}
                    className="bg-gray-100 text-gray-700 px-2 py-0.5 rounded-full text-xs"
                  >
                    {label}
                    {index < activeFilterLabels.length - 1 ? "," : ""}
                  </span>
                ))}
              </div>
            </div>
          )}
        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className="flex items-center gap-2 text-sm font-medium text-gray-600 hover:text-gray-800"
        >
          <ChevronIcon isExpanded={isExpanded} />
        </button>
        </div>
      </div>

      {/* Expandable Filters Section */}
      {isExpanded && (
        <div className="mt-4">
          <DynamicForm
            schema={searchSchema}
            onSubmit={handleSubmit}
            submitLabel="Filter"
            className="space-y-4"
            validateBeforeSubmit={false}
          />
        </div>
      )}
    </div>
  );
};
