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
exports.DynamicList = void 0;
const jsx_runtime_1 = require("react/jsx-runtime");
const react_1 = __importStar(require("react"));
const react_query_1 = require("@tanstack/react-query");
const react_table_1 = require("@tanstack/react-table");
const ListHeader_1 = require("./ListHeader");
const ListBody_1 = require("./ListBody");
const SelectionToolbar_1 = require("./SelectionToolbar");
const ListThemeContext_1 = require("../contexts/ListThemeContext");
const isReferenceValue = (value) => {
    return typeof value === "object" && value !== null && !Array.isArray(value);
};
const formatCellValue = (value, row, col) => {
    if (value === null || value === undefined) {
        return "-";
    }
    const format = col.format;
    if (!format) {
        return String(value);
    }
    // Add handling for action type
    if (col.type === "action" && Array.isArray(value)) {
        const actions = value; // Type assertion here is safe because we've verified the column type
        return ((0, jsx_runtime_1.jsx)("div", { className: "flex gap-2", children: actions.map((action, index) => ((0, jsx_runtime_1.jsx)("button", { onClick: action.onClick, className: `px-2 py-1 text-sm rounded ${action.variant === "primary"
                    ? "bg-blue-500 text-white"
                    : "bg-gray-200 text-gray-700"}`, children: action.label }, index))) }));
    }
    // Handle reference type separately
    if (col.type === "reference" && isReferenceValue(value)) {
        const labelField = format.reference?.labelField;
        return labelField && value[labelField]
            ? String(value[labelField]) // Ensure string conversion
            : format.reference?.fallback ?? "-";
    }
    // Handle other types
    const typedValue = value;
    switch (col.type) {
        case "text": {
            const textValue = typedValue;
            if (format.text?.transform) {
                switch (format.text.transform) {
                    case "uppercase":
                        return textValue.toUpperCase();
                    case "lowercase":
                        return textValue.toLowerCase();
                    case "capitalize":
                        return textValue.charAt(0).toUpperCase() + textValue.slice(1);
                }
            }
            if (format.text?.truncate && textValue.length > format.text.truncate) {
                return `${textValue.slice(0, format.text.truncate)}...`;
            }
            return textValue;
        }
        case "number": {
            const numValue = typedValue;
            if (format.number) {
                return new Intl.NumberFormat(undefined, {
                    minimumFractionDigits: format.number.precision,
                    notation: format.number.notation,
                    style: format.number.currency ? "currency" : "decimal",
                    currency: format.number.currency,
                }).format(numValue);
            }
            return numValue.toString();
        }
        case "date": {
            const dateValue = typedValue instanceof Date
                ? typedValue
                : new Date(typedValue);
            // Validate the date before formatting
            if (isNaN(dateValue.getTime())) {
                return "-";
            }
            if (format?.date) {
                if (format.date.relative) {
                    return new Intl.RelativeTimeFormat().format(Math.floor((dateValue.getTime() - Date.now()) / 86400000), "days");
                }
                return new Intl.DateTimeFormat(undefined, {
                    dateStyle: "medium",
                    timeZone: format.date.timezone,
                }).format(dateValue);
            }
            return dateValue.toLocaleDateString();
        }
        case "boolean": {
            const boolValue = typedValue;
            if (format.boolean) {
                return boolValue
                    ? format.boolean.trueText ?? "Yes"
                    : format.boolean.falseText ?? "No";
            }
            return boolValue ? "Yes" : "No";
        }
        case "array": {
            const arrayValue = typedValue;
            if (format.array) {
                const items = format.array.maxItems
                    ? arrayValue.slice(0, format.array.maxItems)
                    : arrayValue;
                const formatted = items.map((item) => format.array?.itemFormatter?.(item) ?? String(item));
                if (format.array.maxItems &&
                    arrayValue.length > format.array.maxItems) {
                    formatted.push(format.array.more ??
                        `+${arrayValue.length - format.array.maxItems} more`);
                }
                return formatted.join(format.array.separator ?? ", ");
            }
            return arrayValue.join(", ");
        }
        default:
            return String(value);
    }
};
const getTypeSortingFn = (col) => {
    switch (col.type) {
        case "reference":
            return (rowA, rowB, columnId) => {
                const a = rowA.getValue(columnId);
                const b = rowB.getValue(columnId);
                const labelField = col.format?.reference?.labelField;
                const aValue = a?.[labelField] ?? "";
                const bValue = b?.[labelField] ?? "";
                return aValue.localeCompare(bValue);
            };
        case "date":
            return (rowA, rowB, columnId) => {
                const aValue = rowA.getValue(columnId);
                const bValue = rowB.getValue(columnId);
                // Convert to Date objects if they're strings
                const a = aValue instanceof Date ? aValue : new Date(aValue);
                const b = bValue instanceof Date ? bValue : new Date(bValue);
                // Handle invalid dates
                const aTime = isNaN(a.getTime()) ? 0 : a.getTime();
                const bTime = isNaN(b.getTime()) ? 0 : b.getTime();
                return aTime - bTime;
            };
        case "number":
            return (rowA, rowB, columnId) => {
                const a = rowA.getValue(columnId);
                const b = rowB.getValue(columnId);
                return (a ?? 0) - (b ?? 0);
            };
        case "boolean":
            return (rowA, rowB, columnId) => {
                const a = rowA.getValue(columnId);
                const b = rowB.getValue(columnId);
                return a === b ? 0 : a ? -1 : 1;
            };
        case "array":
            return (rowA, rowB, columnId) => {
                const a = rowA.getValue(columnId);
                const b = rowB.getValue(columnId);
                const format = col.format?.array;
                // If there's a custom item formatter, use it for sorting
                if (format?.itemFormatter) {
                    const aStr = (a ?? [])
                        .map((item) => format.itemFormatter(item))
                        .join(",");
                    const bStr = (b ?? [])
                        .map((item) => format.itemFormatter(item))
                        .join(",");
                    return aStr.localeCompare(bStr);
                }
                // Default array sorting
                return (a ?? []).join(",").localeCompare((b ?? []).join(","));
            };
        case "text":
        default:
            return (rowA, rowB, columnId) => {
                const a = String(rowA.getValue(columnId) ?? "");
                const b = String(rowB.getValue(columnId) ?? "");
                // Apply text transformations if specified
                const transform = col.format?.text?.transform;
                if (transform) {
                    switch (transform) {
                        case "uppercase":
                            return a.toUpperCase().localeCompare(b.toUpperCase());
                        case "lowercase":
                            return a.toLowerCase().localeCompare(b.toLowerCase());
                        case "capitalize":
                            return a
                                .charAt(0)
                                .toUpperCase()
                                .localeCompare(b.charAt(0).toUpperCase());
                    }
                }
                return a.localeCompare(b);
            };
    }
};
// Strictly typed filter function generator
const getColumnFilterFn = (col) => {
    switch (col.type) {
        case "text": {
            const filterFn = (row, columnId, filterValue) => {
                const value = row.getValue(columnId);
                return String(value)
                    .toLowerCase()
                    .includes(String(filterValue).toLowerCase());
            };
            return filterFn;
        }
        case "number": {
            const filterFn = (row, columnId, filterValue) => {
                const value = row.getValue(columnId);
                const [min, max] = filterValue || [];
                // If both bounds are empty/invalid, show all records
                if (min === undefined && max === undefined)
                    return true;
                if (min === undefined)
                    return value <= max;
                if (max === undefined)
                    return value >= min;
                return value >= min && value <= max;
            };
            return filterFn;
        }
        case "date": {
            const filterFn = (row, columnId, filterValue) => {
                try {
                    const value = row.getValue(columnId);
                    const [start, end] = filterValue || [];
                    // Early return if no filter
                    if (!start && !end)
                        return true;
                    // Safely convert to Date, handling both Date objects and strings
                    const dateValue = value instanceof Date ? value : new Date(value);
                    // Validate the date value
                    if (isNaN(dateValue.getTime()))
                        return false;
                    // Handle start date
                    if (start) {
                        const startDate = new Date(start);
                        if (isNaN(startDate.getTime()))
                            return false;
                        // Set to start of day in UTC
                        startDate.setUTCHours(0, 0, 0, 0);
                        if (dateValue < startDate)
                            return false;
                    }
                    // Handle end date
                    if (end) {
                        const endDate = new Date(end);
                        if (isNaN(endDate.getTime()))
                            return false;
                        // Set to end of day in UTC
                        endDate.setUTCHours(23, 59, 59, 999);
                        if (dateValue > endDate)
                            return false;
                    }
                    return true;
                }
                catch (error) {
                    console.error("Date filtering error:", error);
                    return false;
                }
            };
            return filterFn;
        }
        case "action":
            // Action columns typically don't need filtering
            return () => true;
        case "array": {
            const filterFn = (row, columnId, filterValue) => {
                if (!filterValue?.length)
                    return true;
                const value = row.getValue(columnId);
                if (!Array.isArray(value))
                    return false;
                // Format array items using the column's formatter if available
                const format = col.format?.array;
                const formatItem = (item) => format?.itemFormatter ? format.itemFormatter(item) : String(item);
                const rowValues = value.map(formatItem);
                // Check if any of the filter values match any of the row values
                return filterValue.some((filter) => rowValues.some((val) => val === filter));
            };
            return filterFn;
        }
        default: {
            const filterFn = (row, columnId, filterValue) => {
                const value = row.getValue(columnId);
                return String(value)
                    .toLowerCase()
                    .includes(String(filterValue).toLowerCase());
            };
            return filterFn;
        }
    }
};
const DynamicList = ({ schema, queryKey, queryFn, className, initialRowSelection, }) => {
    const theme = (0, ListThemeContext_1.useListTheme)();
    const columnHelper = (0, react_table_1.createColumnHelper)();
    const [sorting, setSorting] = (0, react_1.useState)([]);
    const [grouping, setGrouping] = (0, react_1.useState)(schema.options?.groupBy ? [schema.options.groupBy.field] : []);
    const [columnFilters, setColumnFilters] = (0, react_1.useState)([]);
    // Data fetching with react-query
    const { data = [], isLoading, error } = (0, react_query_1.useQuery)({
        queryKey,
        queryFn,
    });
    const initialExpanded = react_1.default.useMemo(() => {
        if (!schema.options?.groupBy?.expanded)
            return {};
        // Create a map of all unique group values
        const groupMap = {};
        const groupField = schema.options.groupBy.field;
        data.forEach((row) => {
            const value = row[schema.options.groupBy.field];
            if (isReferenceValue(value)) {
                // For reference types, use the name field as the group value
                groupMap[`${groupField}:${value.name}`] = true;
            }
            else {
                groupMap[`${groupField}:${String(value)}`] = true;
            }
        });
        return groupMap;
    }, [data, schema.options?.groupBy]);
    const [expanded, setExpanded] = (0, react_1.useState)(initialExpanded);
    // Configure table columns from schema
    const columns = (0, react_1.useMemo)(() => {
        const cols = [];
        // Add selection column if enabled
        if (schema.options?.selection?.enabled) {
            cols.push(columnHelper.display({
                id: "select",
                header: ({ table }) => ((0, jsx_runtime_1.jsx)("input", { type: "checkbox", checked: table.getIsAllRowsSelected(), onChange: table.getToggleAllRowsSelectedHandler(), className: theme?.selection?.checkbox })),
                cell: ({ row }) => ((0, jsx_runtime_1.jsx)("input", { type: "checkbox", checked: row.getIsSelected(), onChange: row.getToggleSelectedHandler(), className: theme?.selection?.checkbox })),
                enableSorting: false,
                enableGrouping: false,
            }));
        }
        // Add schema-defined columns
        Object.entries(schema.columns).forEach(([key, col]) => {
            const typedCol = col;
            cols.push(columnHelper.accessor((row) => {
                const field = typedCol.field;
                const value = row[field];
                // For reference types, return the entire reference object for proper grouping
                if (typedCol.type === "reference" && isReferenceValue(value)) {
                    return value;
                }
                return value;
            }, {
                id: key,
                header: typedCol.label,
                cell: ({ getValue, row }) => {
                    const value = getValue();
                    return formatCellValue(value, row.original, typedCol);
                },
                enableSorting: typedCol.sortable,
                sortingFn: typedCol.sortable
                    ? getTypeSortingFn(typedCol)
                    : undefined,
                // Only enable grouping for the column specified in schema.options.groupBy
                enableGrouping: schema.options?.groupBy?.field === typedCol.field,
                // Disable aggregation for non-grouped columns by setting to undefined
                aggregationFn: undefined,
                getGroupingValue: schema.options?.groupBy?.field === typedCol.field
                    ? (row) => {
                        const field = typedCol.field;
                        const value = row[field];
                        if (typedCol.type === "reference" &&
                            isReferenceValue(value)) {
                            return value.name;
                        }
                        return value;
                    }
                    : undefined,
                enableColumnFilter: typedCol.filterable ?? false,
                filterFn: getColumnFilterFn(typedCol),
            }));
        });
        return cols;
    }, [
        schema.columns,
        schema.options?.groupBy,
        columnHelper,
        theme?.selection?.checkbox,
    ]);
    (0, react_1.useEffect)(() => {
        if (schema.options?.groupBy?.expanded) {
            setExpanded(initialExpanded);
        }
    }, [initialExpanded, schema.options?.groupBy]);
    // Initialize react-table instance
    const table = (0, react_table_1.useReactTable)({
        data: data ?? [],
        columns,
        state: {
            sorting,
            grouping,
            expanded,
            columnFilters,
        },
        onSortingChange: setSorting,
        onGroupingChange: setGrouping,
        onExpandedChange: setExpanded,
        getExpandedRowModel: (0, react_table_1.getExpandedRowModel)(),
        enableRowSelection: schema.options?.selection?.enabled ?? false,
        enableMultiRowSelection: schema.options?.selection?.type === "multi",
        onColumnFiltersChange: setColumnFilters,
        getCoreRowModel: (0, react_table_1.getCoreRowModel)(),
        getFilteredRowModel: (0, react_table_1.getFilteredRowModel)(),
        getPaginationRowModel: (0, react_table_1.getPaginationRowModel)(),
        getSortedRowModel: (0, react_table_1.getSortedRowModel)(),
        getGroupedRowModel: (0, react_table_1.getGroupedRowModel)(),
        enableGrouping: true,
        enableExpanding: true,
        groupedColumnMode: "reorder",
        initialState: {
            pagination: {
                pageSize: schema.options?.pagination?.pageSize ?? 10,
            },
            grouping: schema.options?.groupBy
                ? [schema.options.groupBy.field]
                : [],
            expanded: schema.options?.groupBy?.expanded ? true : {},
            rowSelection: initialRowSelection ?? {},
        },
    });
    const selectedRows = table.getSelectedRowModel().rows.map(row => row.original);
    const columnFilterOptions = (0, react_1.useMemo)(() => {
        const options = new Map();
        Object.entries(schema.columns).forEach(([key, col]) => {
            const typedCol = col;
            if (typedCol.type === "array" && typedCol.filterable) {
                const column = table.getColumn(key);
                if (!column)
                    return;
                // Get unique values across all rows for this column
                const uniqueItems = new Set();
                data.forEach((row) => {
                    const value = row[typedCol.field];
                    if (Array.isArray(value)) {
                        value.forEach((item) => {
                            // Safely convert items to strings using the formatter or a safe conversion
                            const formatted = typedCol.format?.array?.itemFormatter
                                ? String(typedCol.format.array.itemFormatter(item))
                                : typeof item === "object"
                                    ? JSON.stringify(item)
                                    : String(item);
                            uniqueItems.add(formatted);
                        });
                    }
                });
                options.set(key, {
                    uniqueValues: Array.from(uniqueItems).sort(),
                    selectedValues: column.getFilterValue() || [],
                    onFilterChange: (values) => {
                        column.setFilterValue(values.length ? values : undefined);
                    },
                });
            }
        });
        return options;
    }, [data, schema.columns, table]);
    // Call the onSelect callback when selection changes
    (0, react_1.useEffect)(() => {
        schema.options?.selection?.onSelect?.(selectedRows);
    }, [table.getState().rowSelection]);
    if (isLoading) {
        return (0, jsx_runtime_1.jsx)("div", { className: theme.loading, children: "Loading..." });
    }
    if (error) {
        return (0, jsx_runtime_1.jsx)("div", { className: theme.error, children: error.message });
    }
    return ((0, jsx_runtime_1.jsxs)("div", { className: className, children: [(0, jsx_runtime_1.jsx)(SelectionToolbar_1.SelectionToolbar, { table: table, selectedActions: schema.options?.selectedActions, theme: theme?.selection?.toolbar }), (0, jsx_runtime_1.jsxs)("table", { className: theme.table.container, children: [(0, jsx_runtime_1.jsx)(ListHeader_1.ListHeader, { table: table, showGroupCounts: schema.options?.groupBy?.showCounts, schema: schema, columnFilterOptions: columnFilterOptions }), (0, jsx_runtime_1.jsx)(ListBody_1.ListBody, { table: table, showGroupCounts: schema.options?.groupBy?.showCounts })] }), schema.options?.pagination?.enabled && ((0, jsx_runtime_1.jsxs)("div", { className: theme.pagination.container, children: [(0, jsx_runtime_1.jsx)("button", { onClick: () => table.previousPage(), disabled: !table.getCanPreviousPage(), className: theme.pagination.button, children: "Previous" }), (0, jsx_runtime_1.jsxs)("span", { className: theme.pagination.text, children: ["Page ", table.getState().pagination.pageIndex + 1, " of", " ", table.getPageCount()] }), (0, jsx_runtime_1.jsx)("button", { onClick: () => table.nextPage(), disabled: !table.getCanNextPage(), className: theme.pagination.button, children: "Next" })] }))] }));
};
exports.DynamicList = DynamicList;
//# sourceMappingURL=DynamicList.js.map