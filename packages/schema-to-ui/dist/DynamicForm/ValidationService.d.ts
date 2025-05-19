import { UISchema, FormData } from "..";
export interface ValidationError {
    field: string;
    message: string;
}
export declare class ValidationService {
    private schema;
    constructor(schema: UISchema);
    private isFieldValidatable;
    validateField(fieldName: string, value: any): ValidationError | null;
    validateForm(values: FormData): ValidationError[];
    isValid(values: FormData): boolean;
}
//# sourceMappingURL=ValidationService.d.ts.map