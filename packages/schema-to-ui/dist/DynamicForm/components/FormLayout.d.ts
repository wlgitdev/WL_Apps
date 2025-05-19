import React from "react";
interface CollapsibleSectionProps {
    title: string;
    defaultOpen?: boolean;
    children: React.ReactNode;
}
export declare const CollapsibleSection: React.FC<CollapsibleSectionProps>;
interface GridContainerProps {
    children: React.ReactNode;
}
export declare const GridContainer: React.FC<GridContainerProps>;
interface FormSectionProps {
    title?: string;
    collapsible?: boolean;
    defaultOpen?: boolean;
    children: React.ReactNode;
}
export declare const FormSection: React.FC<FormSectionProps>;
export {};
//# sourceMappingURL=FormLayout.d.ts.map