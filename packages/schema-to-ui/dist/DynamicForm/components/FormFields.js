"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MultiSelectField = exports.RadioGroupField = exports.CheckboxField = exports.SelectField = exports.InputField = void 0;
const jsx_runtime_1 = require("react/jsx-runtime");
const react_1 = require("react");
const __1 = require("../..");
const FieldLabel = ({ name, label, required }) => {
    const theme = (0, __1.useFormTheme)();
    return ((0, jsx_runtime_1.jsxs)("div", { className: theme.field.labelGroup, children: [(0, jsx_runtime_1.jsx)("label", { htmlFor: name, className: theme.field.label, children: label }), required && ((0, jsx_runtime_1.jsx)("span", { className: theme.field.required, "aria-hidden": "true", children: "*" }))] }));
};
const FieldWrapper = ({ name, label, error, touched, children, required, field }) => {
    const theme = (0, __1.useFormTheme)();
    return ((0, jsx_runtime_1.jsxs)("div", { className: theme.field.container, children: [(0, jsx_runtime_1.jsx)(FieldLabel, { name: name, label: label, required: required, field: field }), children, touched && error && ((0, jsx_runtime_1.jsx)("p", { className: theme.field.error, id: `${name}-error`, children: error }))] }));
};
const InputField = ({ name, label, type = 'text', placeholder, disabled = false, required, field, }) => {
    const { value, touched, setValue } = (0, __1.useField)(name);
    const theme = (0, __1.useFormTheme)();
    const transformer = (0, react_1.useMemo)(() => new __1.FieldTransformer(field), [field]);
    const displayValue = (0, react_1.useMemo)(() => transformer.toDisplay(value), [transformer, value]);
    const handleChange = (0, react_1.useCallback)((e) => {
        setValue(transformer.fromDisplay(e.target.value));
    }, [setValue, transformer]);
    return ((0, jsx_runtime_1.jsx)(FieldWrapper, { name: name, label: label, touched: touched, required: required, field: field, children: (0, jsx_runtime_1.jsx)("input", { id: name, name: name, type: type, value: displayValue, onChange: handleChange, placeholder: placeholder, disabled: disabled, className: theme.field.input, "aria-required": required }) }));
};
exports.InputField = InputField;
const SelectField = ({ name, label, options, placeholder, disabled = false, required, field, }) => {
    const { value, touched, setValue } = (0, __1.useField)(name);
    const { getReferenceData, isReferenceLoading } = (0, __1.useForm)();
    const theme = (0, __1.useFormTheme)();
    const transformer = (0, react_1.useMemo)(() => new __1.FieldTransformer(field), [field]);
    const displayValue = (0, react_1.useMemo)(() => transformer.toDisplay(value), [transformer, value]);
    const referenceData = getReferenceData(name);
    const loading = isReferenceLoading(name);
    const fieldOptions = referenceData || options;
    const handleChange = (0, react_1.useCallback)((e) => {
        setValue(transformer.fromDisplay(e.target.value));
    }, [setValue, transformer]);
    if (loading) {
        return ((0, jsx_runtime_1.jsx)(FieldWrapper, { name: name, label: label, required: required, field: field, children: (0, jsx_runtime_1.jsx)("select", { disabled: true, className: theme.field.select, children: (0, jsx_runtime_1.jsx)("option", { children: "Loading..." }) }) }));
    }
    return ((0, jsx_runtime_1.jsx)(FieldWrapper, { name: name, label: label, touched: touched, required: required, field: field, children: (0, jsx_runtime_1.jsxs)("select", { id: name, name: name, value: value, onChange: handleChange, disabled: disabled, className: theme.field.select, "aria-required": required, children: [placeholder && ((0, jsx_runtime_1.jsx)("option", { value: "", disabled: true, children: placeholder })), fieldOptions.map((option) => ((0, jsx_runtime_1.jsx)("option", { value: option.value, children: option.label }, option.value)))] }) }));
};
exports.SelectField = SelectField;
const CheckboxField = ({ name, label, text, disabled = false, required, field, }) => {
    const { value, touched, setValue } = (0, __1.useField)(name);
    const theme = (0, __1.useFormTheme)();
    const transformer = (0, react_1.useMemo)(() => new __1.FieldTransformer(field), [field]);
    const displayValue = (0, react_1.useMemo)(() => transformer.toDisplay(value), [transformer, value]);
    const handleChange = (0, react_1.useCallback)((e) => {
        setValue(transformer.fromDisplay(e.target.checked));
    }, [setValue, transformer]);
    return ((0, jsx_runtime_1.jsx)(FieldWrapper, { name: name, label: label, touched: touched, required: required, field: field, children: (0, jsx_runtime_1.jsxs)("div", { className: theme.field.checkbox.container, children: [(0, jsx_runtime_1.jsx)("input", { id: name, name: name, type: "checkbox", checked: displayValue, onChange: handleChange, disabled: disabled, className: theme.field.checkbox.input, "aria-required": required }), text && ((0, jsx_runtime_1.jsx)("label", { htmlFor: name, className: theme.field.checkbox.label, children: text }))] }) }));
};
exports.CheckboxField = CheckboxField;
const RadioGroupField = ({ name, label, options, disabled = false, required, field }) => {
    const { value, touched, setValue } = (0, __1.useField)(name);
    const theme = (0, __1.useFormTheme)();
    const handleChange = (0, react_1.useCallback)((e) => {
        setValue(e.target.value);
    }, [setValue]);
    return ((0, jsx_runtime_1.jsx)(FieldWrapper, { name: name, label: label, touched: touched, required: required, field: field, children: (0, jsx_runtime_1.jsx)("div", { className: theme.field.radio.group, children: options.map((option) => ((0, jsx_runtime_1.jsxs)("div", { className: theme.field.radio.container, children: [(0, jsx_runtime_1.jsx)("input", { id: `${name}-${option.value}`, name: name, type: "radio", value: option.value, checked: value === option.value, onChange: handleChange, disabled: disabled, className: theme.field.radio.input, "aria-required": required }), (0, jsx_runtime_1.jsx)("label", { htmlFor: `${name}-${option.value}`, className: theme.field.radio.label, children: option.label })] }, option.value))) }) }));
};
exports.RadioGroupField = RadioGroupField;
const MultiSelectField = ({ name, label, options, placeholder, disabled = false, required, field, }) => {
    const { value, touched, setValue } = (0, __1.useField)(name);
    const theme = (0, __1.useFormTheme)();
    const transformer = (0, react_1.useMemo)(() => new __1.FieldTransformer(field), [field]);
    const displayValue = (0, react_1.useMemo)(() => transformer.toDisplay(value), [transformer, value]);
    const handleChange = (0, react_1.useCallback)((e) => {
        const selectedOptions = Array.from(e.target.selectedOptions).map((option) => option.value);
        setValue(transformer.fromDisplay(selectedOptions));
    }, [setValue, transformer]);
    return ((0, jsx_runtime_1.jsx)(FieldWrapper, { name: name, label: label, touched: touched, required: required, field: field, children: (0, jsx_runtime_1.jsxs)("select", { id: name, name: name, multiple: true, value: displayValue, onChange: handleChange, disabled: disabled, className: theme.field.multiselect, "aria-required": required, children: [placeholder && ((0, jsx_runtime_1.jsx)("option", { value: "", disabled: true, children: placeholder })), options.map((option) => ((0, jsx_runtime_1.jsx)("option", { value: option.value, children: option.label }, option.value)))] }) }));
};
exports.MultiSelectField = MultiSelectField;
//# sourceMappingURL=FormFields.js.map