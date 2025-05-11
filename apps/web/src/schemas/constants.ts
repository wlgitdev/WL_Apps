import {
  UIFieldDefinition,
  UIFieldType,
  UISchema
} from '@wl-apps/schema-to-ui';

export const UI_READONLY_FIELDS = ['recordId', 'createdAt', 'updatedAt'];
export const UI_EXCLUDE_FIELDS = ['_id', '__v', 'id'];

type FieldTransformer = (field: UIFieldDefinition) => UIFieldDefinition;

interface SchemaConfig {
  readOnlyFields?: string[];
  excludeFields?: string[];
  customMappers?: Partial<Record<UIFieldType, Partial<UIFieldDefinition>>>;
}

export class SchemaVariantGenerator {
  private baseSchema: UISchema;
  private config: Required<SchemaConfig>;
  private defaultMappers: Partial<
    Record<UIFieldType, Partial<UIFieldDefinition>>
  >;

  constructor(baseSchema: UISchema, config: SchemaConfig = {}) {
    this.baseSchema = baseSchema;
    this.config = {
      readOnlyFields: config.readOnlyFields || [],
      excludeFields: config.excludeFields || [],
      customMappers: config.customMappers || {}
    };
    this.defaultMappers = {
      date: {
        valueMapper: {
          toDisplay: (value: string) => (value ? value.split('T')[0] : ''),
          fromDisplay: (value: string) =>
            value ? new Date(value).toISOString() : null
        }
      },
      ...config.customMappers
    };
  }
  private transformFields(
    transformer: (field: UIFieldDefinition, key: string) => UIFieldDefinition
  ): Record<string, UIFieldDefinition> {
    return Object.entries(this.baseSchema.fields)
      .filter(([key]) => !this.config.excludeFields.includes(key))
      .reduce(
        (acc, [key, field]) => ({
          ...acc,
          [key]: transformer({
            ...field,
            ...(this.defaultMappers[field.type] || {}),
            ...(this.config.readOnlyFields.includes(key)
              ? { readOnly: true }
              : {})
          }, key)
        }),
        {}
      );
  }

  createFilteringVariant(): UISchema {
    return {
      ...this.baseSchema,
      fields: this.transformFields((field) => ({
        ...field,
        bitFlags: field.bitFlags,
        optionGroups: field.optionGroups,
        options: field.options,
        readOnly: undefined,
        validation: undefined,
        defaultValue: undefined,
        dependencies: field.dependencies?.map((dep) => ({
          ...dep,
          effect: {
            ...dep.effect,
            setValue: undefined,
            hide: undefined,
          },
        })),
      })),
    };
  }

  createUpdateVariant(
    customFields?: Record<string, Partial<UIFieldDefinition>>
  ): UISchema {
    return {
      ...this.baseSchema,
      fields: this.transformFields((field, key) => {
        const baseField = {
          ...field,
          ...(this.defaultMappers[field.type] || {})
        };

        if (!customFields?.[key]) return baseField;

        // deep merge custom overrides while preserving core functionality
        return {
          ...baseField,
          ...customFields[key],
          // preserve complex objects unless explicitly overridden
          dependencies:
            customFields[key]?.dependencies ?? baseField.dependencies,
          bitFlags: customFields[key]?.bitFlags ?? baseField.bitFlags,
          valueMapper: customFields[key]?.valueMapper ?? baseField.valueMapper,
          validation: customFields[key]?.validation ?? baseField.validation,
          optionGroups:
            customFields[key]?.optionGroups ?? baseField.optionGroups
        };
      })
    };
  }

  createListVariant(
    customFields?: Record<string, Partial<UIFieldDefinition>>
  ): UISchema {
    return {
      ...this.baseSchema,
      fields: this.transformFields((field, key) => {
        const baseField = {
          ...field,
          ...(this.defaultMappers[field.type] || {})
        };

        if (!customFields?.[key]) return baseField;

        // deep merge custom overrides while preserving core functionality
        return {
          ...baseField,
          ...customFields[key],
          // preserve complex objects unless explicitly overridden
          dependencies:
            customFields[key]?.dependencies ?? baseField.dependencies,
          bitFlags: customFields[key]?.bitFlags ?? baseField.bitFlags,
          valueMapper: customFields[key]?.valueMapper ?? baseField.valueMapper,
          validation: customFields[key]?.validation ?? baseField.validation,
          optionGroups:
            customFields[key]?.optionGroups ?? baseField.optionGroups
        };
      })
    };
  }

  createCustomVariant(transformer: FieldTransformer): UISchema {
    return {
      ...this.baseSchema,
      fields: this.transformFields(transformer)
    };
  }
}

// usage helper
export const createSchemaVariants = (
  baseSchema: UISchema,
  updateFields?: Record<string, Partial<UIFieldDefinition>>,
  listFields?: Record<string, Partial<UIFieldDefinition>>,
  config?: SchemaConfig
) => {
  const generator = new SchemaVariantGenerator(baseSchema, config);
  return {
    updateSchema: generator.createUpdateVariant(updateFields),
    filterSchema: generator.createFilteringVariant(),
    listSchema: generator.createListVariant(listFields),
  };
};
