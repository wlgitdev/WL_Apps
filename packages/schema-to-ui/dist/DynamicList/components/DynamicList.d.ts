import { ListSchema } from "../types/ListSchema";
type DynamicListProps<T extends object> = {
    schema: ListSchema<T>;
    queryKey: readonly unknown[];
    queryFn: () => Promise<T[]>;
    className?: string;
    initialRowSelection?: Record<string, boolean>;
};
export declare const DynamicList: <T extends object>({ schema, queryKey, queryFn, className, initialRowSelection, }: DynamicListProps<T>) => import("react/jsx-runtime").JSX.Element;
export {};
//# sourceMappingURL=DynamicList.d.ts.map