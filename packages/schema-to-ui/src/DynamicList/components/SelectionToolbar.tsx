import { Table } from '@tanstack/react-table';
import { ListTheme, type ListSchema } from '../types/ListSchema';

type SelectionToolbarProps<T> = {
  table: Table<T>;
  selectedActions?: NonNullable<ListSchema<T>['options']>['selectedActions'];
  theme?: ListTheme['selection']['toolbar'];
};

export const SelectionToolbar = <T extends object>({
  table,
  selectedActions,
  theme,
}: SelectionToolbarProps<T>) => {
  const selectedRows = table.getSelectedRowModel().rows.map(row => row.original);
  
  if (!selectedRows.length || !selectedActions?.length) return null;

  return (
    <div className={theme?.container ?? 'flex gap-2 p-2 bg-gray-100 rounded'}>
      <span className={theme?.count ?? 'text-sm text-gray-600'}>
        {selectedRows.length} item{selectedRows.length !== 1 ? 's' : ''} selected
      </span>
      <div className={theme?.actions ?? 'flex gap-2'}>
        {selectedActions.map((action, index) => {
          const isDisabled = typeof action.disabled === 'function'
            ? action.disabled(selectedRows)
            : action.disabled;

          return (
            <button
              key={index}
              onClick={() => action.onClick(selectedRows)}
              disabled={isDisabled}
              className={theme?.button ?? 'px-3 py-1 text-sm bg-white border rounded hover:bg-gray-50 disabled:opacity-50'}
            >
              {action.label}
            </button>
          );
        })}
      </div>
    </div>
  );
};