import React from 'react';
import { UIFieldDefinition } from '../..';
interface BaseFieldProps {
    name: string;
    label: string;
    disabled?: boolean;
    required?: boolean;
    field: UIFieldDefinition;
}
interface InputFieldProps extends BaseFieldProps {
    type?: "text" | "number" | "email" | "password" | "date";
    placeholder?: string;
}
export declare const InputField: React.FC<InputFieldProps>;
interface SelectOption {
    value: string | number;
    label: string;
}
interface SelectFieldProps extends BaseFieldProps {
    options: SelectOption[];
    placeholder?: string;
}
export declare const SelectField: React.FC<SelectFieldProps>;
interface CheckboxFieldProps extends BaseFieldProps {
    text?: string;
}
export declare const CheckboxField: React.FC<CheckboxFieldProps>;
interface RadioGroupFieldProps extends BaseFieldProps {
    options: SelectOption[];
}
export declare const RadioGroupField: React.FC<RadioGroupFieldProps>;
interface MultiSelectFieldProps extends SelectFieldProps {
}
export declare const MultiSelectField: React.FC<MultiSelectFieldProps>;
export {};
//# sourceMappingURL=FormFields.d.ts.map