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
exports.useFormTheme = exports.ThemeProvider = void 0;
const jsx_runtime_1 = require("react/jsx-runtime");
const react_1 = __importStar(require("react"));
const types_1 = require("../types");
const ThemeContext = (0, react_1.createContext)(types_1.defaultFormTheme);
const deepMerge = (target, source) => {
    if (!source)
        return target;
    const output = { ...target };
    Object.keys(source).forEach((key) => {
        if (source[key] &&
            typeof source[key] === "object" &&
            !Array.isArray(source[key])) {
            output[key] = deepMerge(target[key] || {}, source[key]);
        }
        else {
            output[key] = source[key];
        }
    });
    return output;
};
const ThemeProvider = ({ theme, children }) => {
    const mergedTheme = react_1.default.useMemo(() => deepMerge(types_1.defaultFormTheme, theme), [theme]);
    return ((0, jsx_runtime_1.jsx)(ThemeContext.Provider, { value: mergedTheme, children: children }));
};
exports.ThemeProvider = ThemeProvider;
const useFormTheme = () => (0, react_1.useContext)(ThemeContext);
exports.useFormTheme = useFormTheme;
//# sourceMappingURL=FormThemeContext.js.map