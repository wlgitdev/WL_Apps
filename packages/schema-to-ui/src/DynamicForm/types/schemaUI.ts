export type UIFieldType =
  | 'text'
  | 'number'
  | 'date'
  | 'select'
  | 'checkbox'
  | 'list'
  | 'multiselect';

// Define possible operations for field dependencies
export type DependencyOperator =
  | 'equals'
  | 'notEquals'
  | 'contains'
  | 'notContains'
  | 'greaterThan'
  | 'lessThan'
  | 'greaterThanOrEqual'
  | 'lessThanOrEqual'
  | 'in'
  | 'notIn'
  | 'isNull'
  | 'isNotNull'
  | 'startsWith'
  | 'endsWith'
  | 'regex';

export interface ValidationRule {
  required?: boolean;
  message?: string;
}

export interface BitFlagGroup {
  label: string;
  options: BitFlagOption[];
}

export interface BitFlagConfig<T extends string = string> {
  flagValue: number;
  groups: Record<T, BitFlagGroup>;
}

export interface OptionGroup {
  label: string;
  options: Array<{
    value: string | number;
    label: string;
  }>;
}

export interface BitFlagOption {
  value: number;
  label: string;
}


export interface FieldEffect {
  // Visual effects
  hide?: boolean;
  disable?: boolean;
  highlight?: boolean;
  // Value manipulation
  setValue?: any;
  clearValue?: boolean;
  // Options modification for select/multiselect
  filterOptions?: {
    field: string;
    operator: DependencyOperator;
    value: any;
  };
  setOptions?: Array<{
    value: string | number;
    label: string;
  }>;
  setOptionGroups?: OptionGroup[];
  setBitFlags?: BitFlagConfig;
  defaultFromField?: {
    field: string;
    transform?: (value: any) => any;
  };
  // Custom effects
  custom?: (
    field: UIFieldDefinition,
    dependentValue: any
  ) => Partial<UIFieldDefinition>;
}

export interface DependencyRule {
  field: string;
  operator: DependencyOperator;
  value?: any;
  effect: FieldEffect;
  // Optional: evaluate multiple conditions
  and?: DependencyRule[];
  or?: DependencyRule[];
}

export interface UIFieldReference {
  modelName: string;
  displayField: string;
  multiple?: boolean;
}

export interface UIFieldDefinition {
  type: UIFieldType;
  label: string;
  description?: string;
  defaultValue?: any;
  placeholder?: string;
  reference?: UIFieldReference;
  options?: Array<{
    value: string | number;
    label: string;
  }>;
  readOnly?: boolean;
  hidden?: boolean;
  // Enhanced dependency configuration
  dependencies?: DependencyRule[];
  bitFlags?: BitFlagConfig;
  optionGroups?: OptionGroup[];
  valueMapper?: {
    toDisplay?: (value: any) => any;
    fromDisplay?: (value: any) => any;
  };
  validation?: ValidationRule;
}

export interface UISchema {
  fields: Record<string, UIFieldDefinition>;
  // Optional layout configuration
  layout?: {
    groups?: Array<{
      name: string;
      label: string;
      fields: string[];
      collapsible?: boolean;
    }>;
    order?: string[];
  };
}

export const createUISchema = (config: UISchema): UISchema => config;

// Helper function to create a type-safe bit flag config
export function createBitFlagConfig<T extends string>(config: BitFlagConfig<T>): BitFlagConfig<T> {
  return config;
}