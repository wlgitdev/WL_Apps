import React, { JSX } from 'react';
import { FormState, FieldValue, FormData, UISchema } from '../..';
interface FormContextValue {
    state: FormState;
    setFieldValue: (field: string, value: FieldValue) => Promise<void>;
    setValues: (values: Partial<FormData>) => void;
    reset: (values?: FormData) => void;
    getReferenceData: (field: string) => Array<{
        value: string;
        label: string;
    }> | undefined;
    isReferenceLoading: (field: string) => boolean;
    submitForm?: (values: FormData) => Promise<void>;
    validateForm: () => boolean;
}
interface FormProviderProps {
    schema: UISchema;
    initialValues?: FormData;
    children: React.ReactNode;
    onSubmit?: (values: FormData) => Promise<void>;
    validateBeforeSubmit?: boolean;
}
export declare const FormProvider: ({ schema, initialValues, children, onSubmit }: FormProviderProps) => JSX.Element;
export declare const useForm: () => FormContextValue;
export declare const useField: (name: string) => {
    value: FieldValue;
    touched: boolean | undefined;
    error: string | undefined;
    setValue: (newValue: FieldValue) => Promise<void>;
};
export declare const useFormSubmit: (onSubmit?: (values: FormData) => Promise<void>, validateBeforeSubmit?: boolean) => {
    handleSubmit: (e: React.FormEvent) => Promise<void>;
    isSubmitting: boolean;
    isDirty: boolean;
    isValid: boolean;
};
export declare const hasField: (schema: UISchema, field: string) => boolean;
export {};
//# sourceMappingURL=FormContext.d.ts.map