import mongoose, { Schema, SchemaDefinitionProperty } from "mongoose";

interface FieldContext {
  entityName: string; 
  fieldDisplayName?: string; 
}

// Helper to get display name for error messages
const getDisplayName = (path: string, context?: FieldContext): string => {
  if (context?.fieldDisplayName) return context.fieldDisplayName;
  return `${context?.entityName || "Field"} ${path.toLowerCase()}`;
};

// Numeric field validation
export const createNumericConfig = (options?: {
  min?: number;
  max?: number;
  required?: boolean;
  default?: number;
  context?: FieldContext;
}): SchemaDefinitionProperty => ({
  type: Number,
  required: [
    options?.required ?? false,
    (props: { path: string }) =>
      `${getDisplayName(props.path, options?.context)} is required`,
  ],
  validate: [
    {
      validator: function (value: number) {
        if (options?.min !== undefined && value < options.min) return false;
        if (options?.max !== undefined && value > options.max) return false;
        return true;
      },
      message: (props: { path: string; value: number }) => {
        if (options?.min !== undefined && options?.max !== undefined) {
          return `${getDisplayName(
            props.path,
            options?.context
          )} must be between ${options.min} and ${options.max}`;
        }
        if (options?.min !== undefined) {
          return `${getDisplayName(
            props.path,
            options?.context
          )} must be at least ${options.min}`;
        }
        if (options?.max !== undefined) {
          return `${getDisplayName(
            props.path,
            options?.context
          )} must be at most ${options.max}`;
        }
        return "Invalid number";
      },
    },
  ],
  // default: options?.default,
});

// String field validation
export const createStringConfig = (options?: {
  allowSelect?: boolean;
  minLength?: number;
  maxLength?: number;
  required?: boolean;
  pattern?: RegExp;
  patternMessage?: string;
  context?: FieldContext;
}): SchemaDefinitionProperty => ({
  type: String,
  required: options?.required ?? false,
  validate: {
    validator: function (value: string) {
      if (options?.minLength !== undefined && value.length < options.minLength)
        return false;
      if (options?.maxLength !== undefined && value.length > options.maxLength)
        return false;
      if (options?.pattern && !options.pattern.test(value)) return false;
      return true;
    },
    message: (props: { path: string; value: string }) => {
      if (options?.pattern && !options.pattern.test(props.value)) {
        return options?.patternMessage ?? "Invalid format";
      }
      if (
        options?.minLength !== undefined &&
        props.value.length < options.minLength
      ) {
        return `${getDisplayName(
          props.path,
          options?.context
        )} must be at least ${options.minLength} characters long`;
      }
      if (
        options?.maxLength !== undefined &&
        props.value.length > options.maxLength
      ) {
        return `${getDisplayName(
          props.path,
          options?.context
        )} must be at most ${options.maxLength} characters long`;
      }
      return "Invalid string";
    },
  },
  select: options?.allowSelect ?? true,
});

// Date field validation
export const createDateConfig = (options?: {
  required?: boolean;
  min?: Date;
  max?: Date;
  context?: FieldContext;
}): SchemaDefinitionProperty => ({
  type: Date,
  required: [
    options?.required ?? false,
    (props: { path: string }) =>
      `${getDisplayName(props.path, options?.context)} is required`,
  ],
  validate: [
    {
      validator: function (value: Date) {
        if (options?.min && value < options.min) return false;
        if (options?.max && value > options.max) return false;
        return true;
      },
      message: (props: { path: string; value: Date }) => {
        if (options?.min && props.value < options.min) {
          return `${getDisplayName(
            props.path,
            options?.context
          )} must be after ${options.min.toISOString().split("T")[0]}`;
        }
        if (options?.max && props.value > options.max) {
          return `${getDisplayName(
            props.path,
            options?.context
          )} must be before ${options.max.toISOString().split("T")[0]}`;
        }
        return "Invalid date";
      },
    },
  ],
});

// Reference field validation
export const createReferenceConfig = (options: {
  modelName: string;
  required?: boolean;
  context?: FieldContext;
}): SchemaDefinitionProperty => ({
  type: Schema.Types.ObjectId,
  ref: options.modelName,
  required: [
    options?.required ?? false,
    (props: { path: string }) =>
      `${getDisplayName(props.path, options?.context)} is required`,
  ],
  validate: [
    {
      validator: async function (value: any) {
        if (!value) return true; // Skip validation if value is not provided
        const Model = mongoose.model(options.modelName);
        const exists = await Model.exists({ _id: value });
        return exists !== null;
      },
      message: (props: { path: string }) =>
        `Referenced ${options.modelName} in ${getDisplayName(
          props.path,
          options?.context
        )} does not exist`,
    },
  ],
});

// Array field validation
export const createArrayConfig = (options: {
  minLength?: number;
  maxLength?: number;
  required?: boolean;
  unique?: boolean;
  context?: FieldContext;
}): SchemaDefinitionProperty => ({
  type: [Schema.Types.Mixed],
  required: [
    options?.required ?? false,
    (props: { path: string }) =>
      `${getDisplayName(props.path, options?.context)} is required`,
  ],
});

// Array of References field validation
export const createArrayReferencesConfig = (options: {
  modelName: string;
  minLength?: number;
  maxLength?: number;
  required?: boolean;
  unique?: boolean;
  context?: FieldContext;
}): SchemaDefinitionProperty => ({
  type: [{ 
    type: Schema.Types.ObjectId, 
    ref: options.modelName 
  }],
  required: [
    options?.required ?? false,
    (props: { path: string }) =>
      `${getDisplayName(props.path, options?.context)} is required`,
  ],
  validate: [
    {
      validator: async function(values: any[]) {
        if (!values || values.length === 0) return true;

        // Check min length
        if (options.minLength !== undefined && values.length < options.minLength) {
          return false;
        }

        // Check max length
        if (options.maxLength !== undefined && values.length > options.maxLength) {
          return false;
        }

        // Unique check
        if (options.unique && new Set(values).size !== values.length) {
          return false;
        }

        // Validate each reference exists
        const Model = mongoose.model(options.modelName);
        const existingDocs = await Model.find({ _id: { $in: values } });
        
        return existingDocs.length === values.length;
      },
      message: (props: { path: string; value: any[] }) => {
        const displayName = getDisplayName(props.path, options?.context);
        
        if (options.minLength !== undefined && props.value.length < options.minLength) {
          return `${displayName} must have at least ${options.minLength} references`;
        }
        
        if (options.maxLength !== undefined && props.value.length > options.maxLength) {
          return `${displayName} must have at most ${options.maxLength} references`;
        }
        
        if (options.unique && new Set(props.value).size !== props.value.length) {
          return `${displayName} must have unique references`;
        }
        
        return `Invalid references for ${displayName}. Some referenced ${options.modelName} data doesn't exist`;
      }
    }
  ]
});

export const createBooleanConfig = (options?: {
  required?: boolean;
  context?: FieldContext;
}): SchemaDefinitionProperty => ({
  type: Boolean,
  required: [
    options?.required ?? false,
    (props: { path: string }) =>
      `${getDisplayName(props.path, options?.context)} is required`,
  ],
});

export const createEnumConfig = <T extends string | number>(options: {
  values: readonly T[];
  required?: boolean;
  context?: FieldContext;
  default?: T;
}): SchemaDefinitionProperty => {
  return {
    type: Schema.Types.String,
    enum: options.values,
    required: [
      options?.required ?? false,
      (props: { path: string }) =>
        `${getDisplayName(props.path, options?.context)} is required`,
    ],
    validate: {
      validator: function (value: T) {
        return options.values.includes(value);
      },
      message: (props: { path: string; value: T }) =>
        `${getDisplayName(
          props.path,
          options?.context
        )} must be one of: ${options.values.join(", ")}. Received: ${
          props.value
        }`,
    },
    default: options?.default,
  } as SchemaDefinitionProperty;
};