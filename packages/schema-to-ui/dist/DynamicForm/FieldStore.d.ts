import { UIFieldDefinition, FieldValue } from "..";
export interface FieldState {
    value: FieldValue;
    error: string | null;
    touched: boolean;
    dirty: boolean;
    dependent: boolean;
}
export type FieldSubscriber = (state: FieldState) => void;
export declare class FieldStore {
    private transformer;
    private state;
    private definition;
    private subscribers;
    private dependencyFields;
    constructor(definition: UIFieldDefinition, initialValue?: FieldValue);
    /**
     * Subscribe to field state changes
     */
    subscribe(subscriber: FieldSubscriber): () => void;
    /**
     * Set field value
     */
    setValue(value: FieldValue): Promise<void>;
    getValue(): FieldValue;
    /**
     * Set field error
     */
    setError(error: string | null): void;
    /**
     * Reset field state
     */
    reset(value?: FieldValue): void;
    /**
     * Get current field state
     */
    getState(): FieldState;
    /**
     * Get dependency fields
     */
    getDependencyFields(): Set<string>;
    /**
     * Update field based on dependency changes
     */
    updateFromDependencies(dependentValues: Record<string, FieldValue>): void;
    private setupDependencies;
    private getDefaultValue;
    private evaluateDependencyRule;
    private setState;
    private notifySubscribers;
}
//# sourceMappingURL=FieldStore.d.ts.map