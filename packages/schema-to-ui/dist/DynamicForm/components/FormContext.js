"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.hasField = exports.useFormSubmit = exports.useField = exports.useForm = exports.FormProvider = void 0;
const jsx_runtime_1 = require("react/jsx-runtime");
const react_1 = __importStar(require("react"));
const __1 = require("../..");
const FormContext = (0, react_1.createContext)(null);
const FormProvider = ({ schema, initialValues, children, onSubmit }) => {
    const store = (0, react_1.useMemo)(() => new __1.FormStore(schema, initialValues), [schema]);
    const [state, setState] = react_1.default.useState(store.getState());
    (0, react_1.useEffect)(() => {
        return store.subscribe(newState => {
            setState(newState);
        });
    }, [store]);
    const contextValue = (0, react_1.useMemo)(() => ({
        state,
        setFieldValue: store.setFieldValue.bind(store),
        setValues: store.setValues.bind(store),
        reset: store.reset.bind(store),
        getReferenceData: store.getReferenceData.bind(store),
        isReferenceLoading: store.isReferenceLoading.bind(store),
        submitForm: onSubmit,
        validateForm: store.validateForm.bind(store),
    }), [state, store, onSubmit]);
    return ((0, jsx_runtime_1.jsx)(FormContext.Provider, { value: contextValue, children: children }));
};
exports.FormProvider = FormProvider;
// Custom hooks for consuming form context
const useForm = () => {
    const context = (0, react_1.useContext)(FormContext);
    if (!context) {
        throw new Error('useForm must be used within a FormProvider');
    }
    return context;
};
exports.useForm = useForm;
const useField = (name) => {
    const { state, setFieldValue } = (0, exports.useForm)();
    const value = state.values[name];
    const touched = state.touched[name];
    const error = state.errors[name];
    const setValue = async (newValue) => {
        await setFieldValue(name, newValue);
    };
    return {
        value,
        touched,
        error,
        setValue,
    };
};
exports.useField = useField;
const useFormSubmit = (onSubmit, validateBeforeSubmit = true) => {
    const { state, validateForm } = (0, exports.useForm)();
    const [isSubmitting, setIsSubmitting] = react_1.default.useState(false);
    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!onSubmit) {
            console.warn("No onSubmit handler provided");
            return;
        }
        if (validateBeforeSubmit && !validateForm()) {
            return;
        }
        try {
            setIsSubmitting(true);
            await onSubmit(state.values);
        }
        catch (error) {
            console.error("Error submitting form:", error);
        }
        finally {
            setIsSubmitting(false);
        }
    };
    return {
        handleSubmit,
        isSubmitting,
        isDirty: state.dirty,
        isValid: state.isValid,
    };
};
exports.useFormSubmit = useFormSubmit;
// Type guard for checking field existence in schema
const hasField = (schema, field) => {
    return field in schema.fields;
};
exports.hasField = hasField;
//# sourceMappingURL=FormContext.js.map