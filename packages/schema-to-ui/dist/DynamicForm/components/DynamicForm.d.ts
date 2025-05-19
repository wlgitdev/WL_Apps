import { JSX } from "react";
import { UISchema, FormTheme, FormData } from "../..";
interface DynamicFormProps {
    schema: UISchema;
    initialValues?: FormData;
    onSubmit?: (values: FormData) => Promise<void>;
    submitLabel?: string;
    loading?: boolean;
    className?: string;
    theme?: Partial<FormTheme>;
    validateBeforeSubmit?: boolean;
}
export declare const DynamicForm: ({ schema, initialValues, onSubmit, submitLabel, loading, className, theme, validateBeforeSubmit, }: DynamicFormProps) => JSX.Element;
export {};
//# sourceMappingURL=DynamicForm.d.ts.map