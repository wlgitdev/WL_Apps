// Shared/general types

export interface GenericError {
  message: string;
  code?: string;
  stack?: string;
}

export type ApiResponse<T> = {
  //ensures that success is indicated by the response
  success: boolean;
  data: T;
};

export interface BatchResult<T> {
  success: boolean;
  data?: T;
  error?: string;
  index: number;
}

export interface BatchOperationResult<T> {
  success: boolean;
  data?: T;
  error?: string;
  index: number;
}

export interface BatchSummary {
  total: number;
  successful: number;
  failed: number;
  completeSuccess: boolean;
}

export interface BatchUpdate<T> {
  recordId: string; // Changed from 'id' to 'recordId' to match existing patterns
  data: Partial<T>;
}

export interface ApiBatchResponse<T> {
  results: BatchOperationResult<T>[];
  summary: BatchSummary;
}

export type ValidationError = {
  message: string;
  path: string;
};

export type FilterConfigType =
  | "string"
  | "number"
  | "date"
  | "boolean"
  | "array";

export type FilterConfig<T> = {
  [K in keyof T]: {
    type: FilterConfigType;
    transform?: (value: string) => any;
  };
};

export type EntityNamingScheme = {
  MODEL: string;
  SINGULAR: string;
  PLURAL: string;
};