import { Table } from '@tanstack/react-table';
import { ListTheme, type ListSchema } from '../types/ListSchema';
type SelectionToolbarProps<T> = {
    table: Table<T>;
    selectedActions?: NonNullable<ListSchema<T>['options']>['selectedActions'];
    theme?: ListTheme['selection']['toolbar'];
};
export declare const SelectionToolbar: <T extends object>({ table, selectedActions, theme, }: SelectionToolbarProps<T>) => import("react/jsx-runtime").JSX.Element | null;
export {};
//# sourceMappingURL=SelectionToolbar.d.ts.map