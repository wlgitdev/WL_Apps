"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const jsx_runtime_1 = require("react/jsx-runtime");
const __1 = require("../..");
const ValidationSummary = ({ submitAttempted = false, }) => {
    const { state } = (0, __1.useForm)();
    const theme = (0, __1.useFormTheme)();
    const invalidFields = Object.entries(state.errors)
        .filter(([fieldName, error]) => error)
        .map(([fieldName, error]) => ({
        fieldName,
        error,
    }));
    if (invalidFields.length === 0) {
        return null;
    }
    return ((0, jsx_runtime_1.jsxs)("div", { className: `${theme.banner.container} ${theme.banner.error.container}`, children: [(0, jsx_runtime_1.jsx)("div", { className: `${theme.banner.title} ${theme.banner.error.title}`, children: "Please fix the following validation errors:" }), (0, jsx_runtime_1.jsx)("ul", { className: `${theme.banner.list} ${theme.banner.error.list}`, children: invalidFields.map(({ fieldName, error }) => ((0, jsx_runtime_1.jsx)("li", { className: `${theme.banner.item} ${theme.banner.error.item}`, children: error }, fieldName))) })] }));
};
exports.default = ValidationSummary;
//# sourceMappingURL=ValidationSummary.js.map