"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ListBody = void 0;
const jsx_runtime_1 = require("react/jsx-runtime");
const react_table_1 = require("@tanstack/react-table");
const ListThemeContext_1 = require("../contexts/ListThemeContext");
const ListBody = ({ table, showGroupCounts }) => {
    const theme = (0, ListThemeContext_1.useListTheme)();
    const renderCell = (content) => {
        return content;
    };
    return ((0, jsx_runtime_1.jsx)("tbody", { children: table.getRowModel().rows.map(row => ((0, jsx_runtime_1.jsx)("tr", { className: theme.table.row, children: row.getVisibleCells().map(cell => {
                const isGrouped = cell.getIsGrouped();
                const isAggregated = cell.getIsAggregated();
                const isPlaceholder = cell.getIsPlaceholder();
                return ((0, jsx_runtime_1.jsx)("td", { className: theme.table.cell, ...(isGrouped && { colSpan: row.getVisibleCells().length }), children: isGrouped ? ((0, jsx_runtime_1.jsxs)("div", { style: { cursor: 'pointer' }, onClick: row.getToggleExpandedHandler(), children: [renderCell((0, react_table_1.flexRender)(cell.column.columnDef.cell, cell.getContext())), showGroupCounts && ((0, jsx_runtime_1.jsx)("span", { className: theme.table.groupRow.count, children: ` (${row.subRows.length})` })), (0, jsx_runtime_1.jsx)("span", { className: theme.table.groupRow.expandIcon, children: row.getIsExpanded() ? ' ↓' : ' →' })] })) : isAggregated ? (renderCell((0, react_table_1.flexRender)(cell.column.columnDef.aggregatedCell ?? cell.column.columnDef.cell, cell.getContext()))) : isPlaceholder ? null : (renderCell((0, react_table_1.flexRender)(cell.column.columnDef.cell, cell.getContext()))) }, cell.id));
            }) }, row.id))) }));
};
exports.ListBody = ListBody;
//# sourceMappingURL=ListBody.js.map