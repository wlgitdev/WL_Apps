import { Table } from "@tanstack/react-table";
import { ColumnFilterOptions, ListSchema } from "../types";
interface ListHeaderProps<T> {
    table: Table<T>;
    showGroupCounts?: boolean;
    schema: ListSchema<T>;
    columnFilterOptions: Map<string, ColumnFilterOptions>;
}
export declare const ListHeader: <T extends object>({ table, showGroupCounts, schema, columnFilterOptions, }: ListHeaderProps<T>) => import("react/jsx-runtime").JSX.Element;
export {};
//# sourceMappingURL=ListHeader.d.ts.map