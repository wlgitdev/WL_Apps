"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.DynamicForm = void 0;
const jsx_runtime_1 = require("react/jsx-runtime");
const react_1 = __importDefault(require("react"));
const __1 = require("../..");
const ValidationSummary_1 = __importDefault(require("./ValidationSummary"));
const FieldRenderer = ({ name, field, disabled }) => {
    const theme = (0, __1.useFormTheme)();
    const { state } = (0, __1.useForm)();
    if (field.hidden) {
        return null;
    }
    const commonProps = {
        name,
        label: field.label,
        disabled: disabled || field.readOnly,
        error: state.touched[name] ? state.errors[name] : undefined,
        required: field.validation?.required,
        field,
    };
    switch (field.type) {
        case "text":
        case "number":
        case "date":
            return ((0, jsx_runtime_1.jsx)(__1.InputField, { ...commonProps, type: field.type, placeholder: field.placeholder }));
        case "select":
            return ((0, jsx_runtime_1.jsx)(__1.SelectField, { ...commonProps, options: field.options || [], placeholder: field.placeholder }));
        case "checkbox":
            return (0, jsx_runtime_1.jsx)(__1.CheckboxField, { ...commonProps, text: field.placeholder });
        case "multiselect":
            return ((0, jsx_runtime_1.jsx)(__1.MultiSelectField, { ...commonProps, options: field.options || [], placeholder: field.placeholder }));
        default:
            return ((0, jsx_runtime_1.jsxs)("div", { className: theme.field.error, children: ["Unsupported field type: ", field.label, " / ", field.type] }));
    }
};
const FormFields = ({ schema, disabled }) => {
    const { state } = (0, __1.useForm)();
    const [effectsCache, setEffectsCache] = react_1.default.useState(new Map());
    // Initialize dependency handler
    const dependencyHandler = react_1.default.useMemo(() => new __1.DependencyHandler(schema.fields), [schema]);
    // Evaluate all field dependencies and cache the results
    react_1.default.useEffect(() => {
        const newEffects = new Map();
        // Evaluate dependencies for all fields
        Object.keys(schema.fields).forEach((fieldName) => {
            const fieldEffects = dependencyHandler.evaluateDependencies(fieldName, state.values);
            fieldEffects.forEach((effect, targetField) => {
                newEffects.set(targetField, effect);
            });
        });
        setEffectsCache(newEffects);
    }, [schema, state.values, dependencyHandler]);
    const renderFields = (fields) => {
        return fields.map((fieldName) => {
            const field = schema.fields[fieldName];
            if (!field)
                return null;
            // Get any effects that apply to this field
            const fieldEffect = effectsCache.get(fieldName);
            // Check if field should be hidden based on dependency effects
            if (fieldEffect?.hide) {
                return null;
            }
            // Handle options and optionGroups separately
            let fieldOptions = field.options;
            if (fieldEffect?.setOptions) {
                fieldOptions = fieldEffect.setOptions;
            }
            else if (fieldEffect?.setOptionGroups) {
                fieldOptions = fieldEffect.setOptionGroups.flatMap((group) => group.options);
            }
            const modifiedField = {
                ...field,
                readOnly: fieldEffect?.disable || field.readOnly,
                options: fieldOptions,
                optionGroups: fieldEffect?.setOptionGroups || field.optionGroups,
            };
            return ((0, jsx_runtime_1.jsx)("div", { className: "w-full", children: (0, jsx_runtime_1.jsx)(FieldRenderer, { name: fieldName, field: modifiedField, disabled: disabled || modifiedField.readOnly }) }, fieldName));
        });
    };
    // If there are groups defined in the layout
    if (schema.layout?.groups) {
        return ((0, jsx_runtime_1.jsx)(jsx_runtime_1.Fragment, { children: schema.layout.groups.map((group, index) => ((0, jsx_runtime_1.jsx)(__1.FormSection, { title: group.label, collapsible: group.collapsible, defaultOpen: true, children: renderFields(group.fields) }, group.name || index))) }));
    }
    // If no groups are defined, use a single responsive grid
    return ((0, jsx_runtime_1.jsx)(__1.GridContainer, { children: renderFields(Object.keys(schema.fields)) }));
};
const FormContent = ({ schema, submitLabel, loading, className, onSubmit, validateBeforeSubmit = true, }) => {
    const [submitAttempted, setSubmitAttempted] = react_1.default.useState(false);
    const { handleSubmit: originalHandleSubmit, isSubmitting, isDirty, isValid, } = (0, __1.useFormSubmit)(onSubmit, validateBeforeSubmit);
    const theme = (0, __1.useFormTheme)();
    const handleSubmit = async (e) => {
        setSubmitAttempted(true);
        await originalHandleSubmit(e);
    };
    const formDisabled = loading || isSubmitting;
    const submitDisabled = formDisabled || !isDirty || (validateBeforeSubmit && !isValid);
    return ((0, jsx_runtime_1.jsxs)("form", { onSubmit: handleSubmit, className: `${theme.form?.container || ""} ${className || ""}`, noValidate: true, children: [(0, jsx_runtime_1.jsx)("div", { className: theme.form?.fieldsContainer || "", children: (0, jsx_runtime_1.jsx)(FormFields, { schema: schema, disabled: formDisabled }) }), (0, jsx_runtime_1.jsx)("div", { className: theme.form?.submitContainer || "", children: (0, jsx_runtime_1.jsx)("button", { type: "submit", disabled: submitDisabled, className: `${theme.button?.base || ""} ${submitDisabled
                        ? theme.button?.disabled || ""
                        : theme.button?.primary || ""}`, children: isSubmitting ? "Submitting..." : submitLabel }) }), validateBeforeSubmit && ((0, jsx_runtime_1.jsx)(ValidationSummary_1.default, { submitAttempted: submitAttempted }))] }));
};
const DynamicForm = ({ schema, initialValues, onSubmit, submitLabel = "Submit", loading = false, className = "", theme, validateBeforeSubmit = true, }) => {
    return ((0, jsx_runtime_1.jsx)(__1.ThemeProvider, { theme: theme, children: (0, jsx_runtime_1.jsx)(__1.FormProvider, { schema: schema, initialValues: initialValues, onSubmit: onSubmit, validateBeforeSubmit: validateBeforeSubmit, children: (0, jsx_runtime_1.jsx)(FormContent, { schema: schema, submitLabel: submitLabel, loading: loading, className: className, onSubmit: onSubmit, validateBeforeSubmit: validateBeforeSubmit }) }) }));
};
exports.DynamicForm = DynamicForm;
//# sourceMappingURL=DynamicForm.js.map