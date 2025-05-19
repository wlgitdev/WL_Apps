import { UISchema } from "..";
export type FieldValue = string | number | boolean | Date | string[] | number[] | null | undefined;
export type FormData = Record<string, FieldValue>;
export type TouchedFields = Record<string, boolean>;
export interface FormState {
    values: FormData;
    touched: TouchedFields;
    errors: Record<string, string>;
    dirty: boolean;
    submitting: boolean;
    isValid: boolean;
}
export type FormSubscriber = (state: FormState) => void;
export type FormFieldSubscriber = (value: FieldValue) => void;
export declare class FormStore {
    private state;
    private schema;
    private formSubscribers;
    private fieldSubscribers;
    private referenceData;
    private referenceLoading;
    private referenceLoader?;
    private dependencyHandler;
    private validationService;
    constructor(schema: UISchema, initialValues?: FormData, referenceLoader?: (modelName: string) => Promise<Array<{
        _id: string;
        name: string;
    }>>);
    private transformValidationErrors;
    private validateField;
    validateForm(): boolean;
    submit(): Promise<boolean>;
    /**
     * Subscribe to form state changes
     */
    subscribe(subscriber: FormSubscriber): () => void;
    /**
     * Subscribe to specific field changes
     */
    subscribeToField(field: string, subscriber: FormFieldSubscriber): () => void;
    /**
     * Set a field value
     */
    setFieldValue(field: string, value: FieldValue): Promise<void>;
    /**
     * Set multiple field values
     */
    setValues(values: Partial<FormData>): void;
    /**
     * Reset form to initial values
     */
    reset(values?: FormData): void;
    /**
     * Get current form state
     */
    getState(): FormState;
    private initializeStateWithDependencies;
    private loadReferences;
    getReferenceData(field: string): Array<{
        value: string;
        label: string;
    }> | undefined;
    isReferenceLoading(field: string): boolean;
    private initializeDependencies;
    private evaluateAllDependencies;
    private initializeValues;
    private applyEffectsToState;
    private setState;
    private notifySubscribers;
}
//# sourceMappingURL=FormStore.d.ts.map