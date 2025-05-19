"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ListThemeProvider = exports.useListTheme = void 0;
const jsx_runtime_1 = require("react/jsx-runtime");
const react_1 = __importDefault(require("react"));
const defaultListTheme_1 = require("../types/defaultListTheme");
const ThemeContext = react_1.default.createContext(defaultListTheme_1.defaultListTheme);
const useListTheme = () => react_1.default.useContext(ThemeContext);
exports.useListTheme = useListTheme;
const ListThemeProvider = ({ theme, children }) => {
    const mergedTheme = react_1.default.useMemo(() => ({ ...defaultListTheme_1.defaultListTheme, ...theme }), [theme]);
    return ((0, jsx_runtime_1.jsx)(ThemeContext.Provider, { value: mergedTheme, children: children }));
};
exports.ListThemeProvider = ListThemeProvider;
//# sourceMappingURL=ListThemeContext.js.map