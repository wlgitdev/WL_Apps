"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SelectionToolbar = void 0;
const jsx_runtime_1 = require("react/jsx-runtime");
const SelectionToolbar = ({ table, selectedActions, theme, }) => {
    const selectedRows = table.getSelectedRowModel().rows.map(row => row.original);
    if (!selectedRows.length || !selectedActions?.length)
        return null;
    return ((0, jsx_runtime_1.jsxs)("div", { className: theme?.container ?? 'flex gap-2 p-2 bg-gray-100 rounded', children: [(0, jsx_runtime_1.jsxs)("span", { className: theme?.count ?? 'text-sm text-gray-600', children: [selectedRows.length, " item", selectedRows.length !== 1 ? 's' : '', " selected"] }), (0, jsx_runtime_1.jsx)("div", { className: theme?.actions ?? 'flex gap-2', children: selectedActions.map((action, index) => {
                    const isDisabled = typeof action.disabled === 'function'
                        ? action.disabled(selectedRows)
                        : action.disabled;
                    return ((0, jsx_runtime_1.jsx)("button", { onClick: () => action.onClick(selectedRows), disabled: isDisabled, className: theme?.button ?? 'px-3 py-1 text-sm bg-white border rounded hover:bg-gray-50 disabled:opacity-50', children: action.label }, index));
                }) })] }));
};
exports.SelectionToolbar = SelectionToolbar;
//# sourceMappingURL=SelectionToolbar.js.map