import { FieldEffect, UIFieldDefinition, FormData } from "../index";
export declare class DependencyHandler {
    private dependencyGraph;
    private fields;
    constructor(fields: Record<string, UIFieldDefinition>);
    getDependentFields(field: string): Set<string>;
    evaluateDependencies(field: string, formData: FormData): Map<string, FieldEffect>;
    private buildDependencyGraph;
    private addDependency;
    private addGroupDependencies;
    private evaluateRule;
    private evaluateFieldDependencies;
    private evaluateCondition;
}
//# sourceMappingURL=DependencyHandler.d.ts.map