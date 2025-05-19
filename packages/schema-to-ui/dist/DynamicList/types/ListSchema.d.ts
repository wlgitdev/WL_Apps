import { z } from 'zod';
import { ReactNode } from 'react';
export interface ListTheme {
    table: {
        container: string;
        header: {
            container: string;
            cell: string;
            sortIcon: string;
            filterInput: string;
            select?: {
                container?: string;
                control?: string;
                menu?: string;
                option?: string;
                multiValue?: string;
                placeholder?: string;
                input?: string;
            };
        };
        row: string;
        cell: string;
        groupRow: {
            cell: string;
            count: string;
            expandIcon: string;
        };
    };
    pagination: {
        container: string;
        button: string;
        text: string;
    };
    selection: {
        checkbox: string;
        toolbar: {
            container: string;
            count: string;
            actions: string;
            button: string;
        };
    };
    loading: string;
    error: string;
}
export type ColumnFilterOptions = {
    uniqueValues: string[];
    selectedValues: string[];
    onFilterChange: (values: string[]) => void;
};
export type ActionItem = {
    label: string;
    variant?: "primary" | "secondary" | "text" | "link";
    icon?: string;
    onClick: () => void;
};
export type PrimitiveType = string | number | boolean | Date;
export type DataType = PrimitiveType | PrimitiveType[] | ActionItem[];
export interface BaseFormat<T> {
    formatter?: (value: T, row: unknown) => ReactNode;
}
export interface ColumnFormat<T = unknown> {
    text?: {
        truncate?: number;
        transform?: "uppercase" | "lowercase" | "capitalize";
    };
    number?: {
        precision?: number;
        notation?: "standard" | "scientific" | "engineering" | "compact";
        currency?: string;
    };
    date?: {
        format?: string;
        relative?: boolean;
        timezone?: string;
    };
    boolean?: {
        trueText?: string;
        falseText?: string;
        trueIcon?: string;
        falseIcon?: string;
    };
    array?: {
        separator?: string;
        maxItems?: number;
        more?: string;
        itemFormatter?: (item: unknown) => ReactNode;
        filter?: {
            isMulti?: boolean;
            placeholder?: string;
            noOptionsMessage?: string;
            isClearable?: boolean;
            isSearchable?: boolean;
            maxMenuHeight?: number;
        };
    };
    reference?: {
        labelField: string;
        fallback?: ReactNode;
    };
    action?: {
        label?: string;
        variant?: "primary" | "secondary" | "text" | "link";
        icon?: string;
        disabled?: boolean | ((row: T) => boolean);
        hidden?: boolean | ((row: T) => boolean);
    };
}
export type ColumnType = "text" | "number" | "date" | "boolean" | "array" | "reference" | "action";
export interface ColumnDefinition<T = unknown> {
    label: string;
    field: keyof T;
    type: ColumnType;
    width?: number | string;
    sortable: boolean;
    filterable?: boolean;
    visible?: boolean | ((row: T) => boolean);
    className?: string | ((row: T) => string);
    format?: ColumnFormat<T>;
    enableGrouping?: boolean;
    reference?: {
        queryKey: readonly unknown[];
        collection: string;
        valueField?: string;
    };
}
export interface ListSchema<T = unknown> {
    columns: {
        [K in keyof T]?: ColumnDefinition<T>;
    };
    options?: {
        pagination?: {
            enabled: boolean;
            pageSize?: number;
            pageSizeOptions?: number[];
        };
        selection?: {
            enabled: boolean;
            type: "single" | "multi";
            onSelect?: (selectedRows: T[]) => void;
        };
        groupBy?: {
            field: keyof T;
            expanded?: boolean;
            showCounts?: boolean;
        };
        defaultSort?: {
            field: keyof T;
            direction: "asc" | "desc";
        };
        rowActions?: {
            onClick?: (row: T) => void;
            onDoubleClick?: (row: T) => void;
        };
        selectedActions?: Array<{
            label: string;
            onClick: (selectedRows: T[]) => void;
            disabled?: boolean | ((selectedRows: T[]) => boolean);
        }>;
    };
}
export declare const listSchemaValidator: z.ZodObject<{
    columns: z.ZodRecord<z.ZodString, z.ZodObject<{
        label: z.ZodString;
        field: z.ZodString;
        type: z.ZodEnum<["text", "number", "date", "boolean", "array", "reference", "action"]>;
        width: z.ZodOptional<z.ZodUnion<[z.ZodNumber, z.ZodString]>>;
        sortable: z.ZodOptional<z.ZodBoolean>;
        filterable: z.ZodOptional<z.ZodBoolean>;
        visible: z.ZodOptional<z.ZodUnion<[z.ZodBoolean, z.ZodFunction<z.ZodTuple<[], z.ZodUnknown>, z.ZodUnknown>]>>;
        className: z.ZodOptional<z.ZodUnion<[z.ZodString, z.ZodFunction<z.ZodTuple<[], z.ZodUnknown>, z.ZodUnknown>]>>;
        format: z.ZodOptional<z.ZodObject<{}, "strip", z.ZodTypeAny, {}, {}>>;
    }, "strip", z.ZodTypeAny, {
        field: string;
        type: "number" | "boolean" | "text" | "date" | "array" | "reference" | "action";
        label: string;
        className?: string | ((...args: unknown[]) => unknown) | undefined;
        width?: string | number | undefined;
        sortable?: boolean | undefined;
        filterable?: boolean | undefined;
        visible?: boolean | ((...args: unknown[]) => unknown) | undefined;
        format?: {} | undefined;
    }, {
        field: string;
        type: "number" | "boolean" | "text" | "date" | "array" | "reference" | "action";
        label: string;
        className?: string | ((...args: unknown[]) => unknown) | undefined;
        width?: string | number | undefined;
        sortable?: boolean | undefined;
        filterable?: boolean | undefined;
        visible?: boolean | ((...args: unknown[]) => unknown) | undefined;
        format?: {} | undefined;
    }>>;
    options: z.ZodOptional<z.ZodObject<{
        pagination: z.ZodOptional<z.ZodObject<{
            enabled: z.ZodBoolean;
            pageSize: z.ZodOptional<z.ZodNumber>;
            pageSizeOptions: z.ZodOptional<z.ZodArray<z.ZodNumber, "many">>;
        }, "strip", z.ZodTypeAny, {
            enabled: boolean;
            pageSize?: number | undefined;
            pageSizeOptions?: number[] | undefined;
        }, {
            enabled: boolean;
            pageSize?: number | undefined;
            pageSizeOptions?: number[] | undefined;
        }>>;
        selection: z.ZodOptional<z.ZodObject<{
            enabled: z.ZodBoolean;
            type: z.ZodEnum<["single", "multi"]>;
            onSelect: z.ZodOptional<z.ZodFunction<z.ZodTuple<[], z.ZodUnknown>, z.ZodUnknown>>;
        }, "strip", z.ZodTypeAny, {
            type: "single" | "multi";
            enabled: boolean;
            onSelect?: ((...args: unknown[]) => unknown) | undefined;
        }, {
            type: "single" | "multi";
            enabled: boolean;
            onSelect?: ((...args: unknown[]) => unknown) | undefined;
        }>>;
        groupBy: z.ZodOptional<z.ZodObject<{
            field: z.ZodString;
            expanded: z.ZodOptional<z.ZodBoolean>;
            showCounts: z.ZodOptional<z.ZodBoolean>;
        }, "strip", z.ZodTypeAny, {
            field: string;
            expanded?: boolean | undefined;
            showCounts?: boolean | undefined;
        }, {
            field: string;
            expanded?: boolean | undefined;
            showCounts?: boolean | undefined;
        }>>;
        selectedActions: z.ZodOptional<z.ZodArray<z.ZodObject<{
            label: z.ZodString;
            onClick: z.ZodFunction<z.ZodTuple<[], z.ZodUnknown>, z.ZodUnknown>;
            disabled: z.ZodOptional<z.ZodUnion<[z.ZodBoolean, z.ZodFunction<z.ZodTuple<[], z.ZodUnknown>, z.ZodUnknown>]>>;
        }, "strip", z.ZodTypeAny, {
            label: string;
            onClick: (...args: unknown[]) => unknown;
            disabled?: boolean | ((...args: unknown[]) => unknown) | undefined;
        }, {
            label: string;
            onClick: (...args: unknown[]) => unknown;
            disabled?: boolean | ((...args: unknown[]) => unknown) | undefined;
        }>, "many">>;
    }, "strip", z.ZodTypeAny, {
        pagination?: {
            enabled: boolean;
            pageSize?: number | undefined;
            pageSizeOptions?: number[] | undefined;
        } | undefined;
        selection?: {
            type: "single" | "multi";
            enabled: boolean;
            onSelect?: ((...args: unknown[]) => unknown) | undefined;
        } | undefined;
        groupBy?: {
            field: string;
            expanded?: boolean | undefined;
            showCounts?: boolean | undefined;
        } | undefined;
        selectedActions?: {
            label: string;
            onClick: (...args: unknown[]) => unknown;
            disabled?: boolean | ((...args: unknown[]) => unknown) | undefined;
        }[] | undefined;
    }, {
        pagination?: {
            enabled: boolean;
            pageSize?: number | undefined;
            pageSizeOptions?: number[] | undefined;
        } | undefined;
        selection?: {
            type: "single" | "multi";
            enabled: boolean;
            onSelect?: ((...args: unknown[]) => unknown) | undefined;
        } | undefined;
        groupBy?: {
            field: string;
            expanded?: boolean | undefined;
            showCounts?: boolean | undefined;
        } | undefined;
        selectedActions?: {
            label: string;
            onClick: (...args: unknown[]) => unknown;
            disabled?: boolean | ((...args: unknown[]) => unknown) | undefined;
        }[] | undefined;
    }>>;
}, "strip", z.ZodTypeAny, {
    columns: Record<string, {
        field: string;
        type: "number" | "boolean" | "text" | "date" | "array" | "reference" | "action";
        label: string;
        className?: string | ((...args: unknown[]) => unknown) | undefined;
        width?: string | number | undefined;
        sortable?: boolean | undefined;
        filterable?: boolean | undefined;
        visible?: boolean | ((...args: unknown[]) => unknown) | undefined;
        format?: {} | undefined;
    }>;
    options?: {
        pagination?: {
            enabled: boolean;
            pageSize?: number | undefined;
            pageSizeOptions?: number[] | undefined;
        } | undefined;
        selection?: {
            type: "single" | "multi";
            enabled: boolean;
            onSelect?: ((...args: unknown[]) => unknown) | undefined;
        } | undefined;
        groupBy?: {
            field: string;
            expanded?: boolean | undefined;
            showCounts?: boolean | undefined;
        } | undefined;
        selectedActions?: {
            label: string;
            onClick: (...args: unknown[]) => unknown;
            disabled?: boolean | ((...args: unknown[]) => unknown) | undefined;
        }[] | undefined;
    } | undefined;
}, {
    columns: Record<string, {
        field: string;
        type: "number" | "boolean" | "text" | "date" | "array" | "reference" | "action";
        label: string;
        className?: string | ((...args: unknown[]) => unknown) | undefined;
        width?: string | number | undefined;
        sortable?: boolean | undefined;
        filterable?: boolean | undefined;
        visible?: boolean | ((...args: unknown[]) => unknown) | undefined;
        format?: {} | undefined;
    }>;
    options?: {
        pagination?: {
            enabled: boolean;
            pageSize?: number | undefined;
            pageSizeOptions?: number[] | undefined;
        } | undefined;
        selection?: {
            type: "single" | "multi";
            enabled: boolean;
            onSelect?: ((...args: unknown[]) => unknown) | undefined;
        } | undefined;
        groupBy?: {
            field: string;
            expanded?: boolean | undefined;
            showCounts?: boolean | undefined;
        } | undefined;
        selectedActions?: {
            label: string;
            onClick: (...args: unknown[]) => unknown;
            disabled?: boolean | ((...args: unknown[]) => unknown) | undefined;
        }[] | undefined;
    } | undefined;
}>;
//# sourceMappingURL=ListSchema.d.ts.map