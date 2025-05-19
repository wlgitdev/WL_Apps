"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ListHeader = void 0;
const jsx_runtime_1 = require("react/jsx-runtime");
const react_table_1 = require("@tanstack/react-table");
const ListThemeContext_1 = require("../contexts/ListThemeContext");
const react_select_1 = __importDefault(require("react-select"));
const FilterControl = ({ column, columnDef, filterOptions, }) => {
    const theme = (0, ListThemeContext_1.useListTheme)();
    if (!columnDef.filterable)
        return null;
    switch (columnDef.type) {
        case "array": {
            if (!filterOptions)
                return null;
            const filterConfig = columnDef.format?.array?.filter;
            const isMulti = filterConfig?.isMulti ?? true;
            const currentValue = column.getFilterValue() || [];
            const options = filterOptions.uniqueValues.map((value) => ({
                value,
                label: value,
            }));
            const selectedOptions = options.filter((opt) => currentValue.includes(opt.value));
            const selectStyles = {
                container: (provided) => ({
                    ...provided,
                    ...(theme.table.header.select?.container && {
                        className: theme.table.header.select.container,
                    }),
                }),
                control: (provided) => ({
                    ...provided,
                    ...(theme.table.header.select?.control && {
                        className: theme.table.header.select.control,
                    }),
                }),
                menu: (provided) => ({
                    ...provided,
                    ...(theme.table.header.select?.menu && {
                        className: theme.table.header.select.menu,
                    }),
                }),
                option: (provided) => ({
                    ...provided,
                    ...(theme.table.header.select?.option && {
                        className: theme.table.header.select.option,
                    }),
                }),
                multiValue: (provided) => ({
                    ...provided,
                    ...(theme.table.header.select?.multiValue && {
                        className: theme.table.header.select.multiValue,
                    }),
                }),
                placeholder: (provided) => ({
                    ...provided,
                    ...(theme.table.header.select?.placeholder && {
                        className: theme.table.header.select.placeholder,
                    }),
                }),
                input: (provided) => ({
                    ...provided,
                    ...(theme.table.header.select?.input && {
                        className: theme.table.header.select.input,
                    }),
                }),
            };
            return ((0, jsx_runtime_1.jsx)(react_select_1.default, { isMulti: isMulti, value: selectedOptions, options: options, onChange: (selected) => {
                    const values = selected
                        ? isMulti
                            ? selected.map((opt) => opt.value)
                            : [selected?.value].filter(Boolean)
                        : undefined;
                    column.setFilterValue(values);
                }, placeholder: filterConfig?.placeholder ?? `Filter ${columnDef.label}...`, noOptionsMessage: () => filterConfig?.noOptionsMessage ?? "No options available", isClearable: filterConfig?.isClearable ?? true, isSearchable: filterConfig?.isSearchable ?? true, maxMenuHeight: filterConfig?.maxMenuHeight ?? 200, styles: selectStyles, classNamePrefix: "react-select" }));
        }
        case "text":
            return ((0, jsx_runtime_1.jsx)("input", { type: "text", value: (column.getFilterValue() ?? ""), onChange: (e) => column.setFilterValue(e.target.value), placeholder: `Filter ${columnDef.label}...`, className: theme.table.header.filterInput }));
        case "number":
            return ((0, jsx_runtime_1.jsxs)("div", { className: "flex gap-1", children: [(0, jsx_runtime_1.jsx)("input", { type: "number", value: (column.getFilterValue()?.[0] ?? ""), onChange: (e) => {
                            const value = e.target.value === "" ? undefined : Number(e.target.value);
                            column.setFilterValue((prev) => [
                                value,
                                prev?.[1],
                            ]);
                        }, placeholder: "Min", className: theme.table.header.filterInput }), (0, jsx_runtime_1.jsx)("input", { type: "number", value: (column.getFilterValue()?.[1] ?? ""), onChange: (e) => {
                            const value = e.target.value === "" ? undefined : Number(e.target.value);
                            column.setFilterValue((prev) => [
                                prev?.[0],
                                value,
                            ]);
                        }, placeholder: "Max", className: theme.table.header.filterInput })] }));
        case "boolean":
            return ((0, jsx_runtime_1.jsxs)("select", { value: (column.getFilterValue() ?? "").toString(), onChange: (e) => {
                    const value = e.target.value;
                    // Clear filter if "All" is selected, otherwise convert to boolean
                    column.setFilterValue(value === "" ? undefined : value === "true");
                }, className: theme.table.header.filterInput, children: [(0, jsx_runtime_1.jsx)("option", { value: "", children: "All" }), (0, jsx_runtime_1.jsx)("option", { value: "true", children: columnDef.format?.boolean?.trueText ?? "Yes" }), (0, jsx_runtime_1.jsx)("option", { value: "false", children: columnDef.format?.boolean?.falseText ?? "No" })] }));
        case "date":
            return ((0, jsx_runtime_1.jsxs)("div", { className: "flex gap-1", children: [(0, jsx_runtime_1.jsx)("input", { type: "date", value: (column.getFilterValue()?.[0] ?? ""), onChange: (e) => column.setFilterValue((prev) => [
                            e.target.value,
                            prev?.[1],
                        ]), className: theme.table.header.filterInput }), (0, jsx_runtime_1.jsx)("input", { type: "date", value: (column.getFilterValue()?.[1] ?? ""), onChange: (e) => column.setFilterValue((prev) => [
                            prev?.[0],
                            e.target.value,
                        ]), className: theme.table.header.filterInput })] }));
        default:
            return null;
    }
};
const ListHeader = ({ table, showGroupCounts, schema, columnFilterOptions, }) => {
    const theme = (0, ListThemeContext_1.useListTheme)();
    return ((0, jsx_runtime_1.jsx)("thead", { className: theme.table.header.container, children: table.getHeaderGroups().map((headerGroup) => ((0, jsx_runtime_1.jsx)("tr", { children: headerGroup.headers.map((header) => {
                const columnDef = schema.columns[header.id];
                return ((0, jsx_runtime_1.jsx)("th", { className: theme.table.header.cell, children: header.isPlaceholder ? null : ((0, jsx_runtime_1.jsxs)("div", { children: [(0, jsx_runtime_1.jsxs)("div", { className: "flex items-center gap-2 cursor-pointer", onClick: header.column.getToggleSortingHandler(), children: [(0, jsx_runtime_1.jsx)(jsx_runtime_1.Fragment, { children: (0, react_table_1.flexRender)(header.column.columnDef.header, header.getContext()) }), header.column.getIsSorted() && ((0, jsx_runtime_1.jsx)("span", { className: theme.table.header.sortIcon, children: header.column.getIsSorted() === "asc" ? " ↑" : " ↓" }))] }), columnDef && ((0, jsx_runtime_1.jsx)(FilterControl, { column: header.column, columnDef: columnDef, filterOptions: columnFilterOptions.get(header.id) }))] })) }, header.id));
            }) }, headerGroup.id))) }));
};
exports.ListHeader = ListHeader;
//# sourceMappingURL=ListHeader.js.map