import { UIFieldDefinition, FieldValue } from "../index";
export interface TransformerConfig {
    toDisplay: (value: FieldValue) => any;
    fromDisplay: (value: any) => FieldValue;
}
export declare class FieldTransformer {
    private definition;
    constructor(definition: UIFieldDefinition);
    toDisplay(value: FieldValue): any;
    fromDisplay(value: any): FieldValue;
    private transformBitFlagsToDisplay;
    private transformBitFlagsFromDisplay;
    private transformOptionGroupsToDisplay;
    private transformOptionGroupsFromDisplay;
    private defaultToDisplay;
    private defaultFromDisplay;
    private getDefaultDisplayValue;
}
//# sourceMappingURL=fieldTransformers.d.ts.map