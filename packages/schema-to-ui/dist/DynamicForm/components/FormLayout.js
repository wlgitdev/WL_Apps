"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.FormSection = exports.GridContainer = exports.CollapsibleSection = void 0;
const jsx_runtime_1 = require("react/jsx-runtime");
const __1 = require("../..");
const react_1 = __importDefault(require("react"));
const CollapsibleSection = ({ title, defaultOpen = false, children, }) => {
    const [isOpen, setIsOpen] = react_1.default.useState(defaultOpen);
    const theme = (0, __1.useFormTheme)();
    return ((0, jsx_runtime_1.jsxs)("div", { className: theme.section.collapsible.container, children: [(0, jsx_runtime_1.jsxs)("button", { type: "button", onClick: () => setIsOpen(!isOpen), className: `${theme.section.collapsible.button} ${isOpen ? "border-gray-200" : "border-transparent"}`, children: [(0, jsx_runtime_1.jsx)("span", { className: theme.section.title, children: title }), (0, jsx_runtime_1.jsx)("svg", { className: `${theme.section.collapsible.icon} ${isOpen ? theme.section.collapsible.iconOpen : ""}`, fill: "none", viewBox: "0 0 24 24", stroke: "currentColor", children: (0, jsx_runtime_1.jsx)("path", { strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: 2, d: "M19 9l-7 7-7-7" }) })] }), isOpen && ((0, jsx_runtime_1.jsx)("div", { className: theme.section.collapsible.content, children: children }))] }));
};
exports.CollapsibleSection = CollapsibleSection;
const GridContainer = ({ children }) => {
    const theme = (0, __1.useFormTheme)();
    return (0, jsx_runtime_1.jsx)("div", { className: theme.grid.container, children: children });
};
exports.GridContainer = GridContainer;
const FormSection = ({ title, collapsible = false, defaultOpen = true, children }) => {
    const theme = (0, __1.useFormTheme)();
    if (!title) {
        return (0, jsx_runtime_1.jsx)("div", { className: theme.section.content, children: children });
    }
    if (collapsible) {
        return ((0, jsx_runtime_1.jsx)(exports.CollapsibleSection, { title: title, defaultOpen: defaultOpen, children: (0, jsx_runtime_1.jsx)("div", { className: theme.section.content, children: children }) }));
    }
    return ((0, jsx_runtime_1.jsxs)("div", { className: theme.section.container, children: [(0, jsx_runtime_1.jsx)("div", { className: theme.section.header, children: (0, jsx_runtime_1.jsx)("h3", { className: theme.section.title, children: title }) }), (0, jsx_runtime_1.jsx)("div", { className: theme.section.content, children: children })] }));
};
exports.FormSection = FormSection;
//# sourceMappingURL=FormLayout.js.map