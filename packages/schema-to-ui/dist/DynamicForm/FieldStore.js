"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.FieldStore = void 0;
const __1 = require("..");
class FieldStore {
    constructor(definition, initialValue) {
        this.transformer = new __1.FieldTransformer(definition);
        this.definition = definition;
        this.subscribers = new Set();
        this.dependencyFields = new Set();
        // Initialize state
        this.state = {
            value: initialValue !== undefined
                ? this.transformer.fromDisplay(initialValue)
                : this.getDefaultValue(),
            error: null,
            touched: false,
            dirty: false,
            dependent: false,
        };
        // Setup dependencies
        this.setupDependencies();
    }
    // Public API
    /**
     * Subscribe to field state changes
     */
    subscribe(subscriber) {
        this.subscribers.add(subscriber);
        subscriber(this.state);
        return () => this.subscribers.delete(subscriber);
    }
    /**
     * Set field value
     */
    async setValue(value) {
        const transformedValue = this.transformer.fromDisplay(value);
        this.setState({
            ...this.state,
            value: transformedValue,
            touched: true,
            dirty: true,
        });
    }
    getValue() {
        return this.transformer.toDisplay(this.state.value);
    }
    /**
     * Set field error
     */
    setError(error) {
        this.setState({
            ...this.state,
            error,
        });
    }
    /**
     * Reset field state
     */
    reset(value) {
        this.setState({
            value: value ?? this.getDefaultValue(),
            error: null,
            touched: false,
            dirty: false,
            dependent: this.state.dependent,
        });
    }
    /**
     * Get current field state
     */
    getState() {
        return this.state;
    }
    /**
     * Get dependency fields
     */
    getDependencyFields() {
        return this.dependencyFields;
    }
    /**
     * Update field based on dependency changes
     */
    updateFromDependencies(dependentValues) {
        if (!this.definition.dependencies)
            return;
        let shouldUpdate = false;
        let newState = { ...this.state };
        for (const rule of this.definition.dependencies) {
            const dependentValue = dependentValues[rule.field];
            // Check if rule conditions are met
            const conditionMet = this.evaluateDependencyRule(rule, dependentValue);
            if (conditionMet) {
                // Apply rule effects
                if (rule.effect.hide !== undefined) {
                    newState.dependent = true;
                    shouldUpdate = true;
                }
                if (rule.effect.setValue !== undefined) {
                    newState.value = rule.effect.setValue;
                    newState.dependent = true;
                    shouldUpdate = true;
                }
                if (rule.effect.clearValue) {
                    newState.value = this.getDefaultValue();
                    newState.dependent = true;
                    shouldUpdate = true;
                }
            }
        }
        if (shouldUpdate) {
            this.setState(newState);
        }
    }
    // Private methods
    setupDependencies() {
        if (!this.definition.dependencies)
            return;
        for (const rule of this.definition.dependencies) {
            this.dependencyFields.add(rule.field);
        }
    }
    getDefaultValue() {
        if (this.definition.defaultValue !== undefined) {
            return this.definition.defaultValue;
        }
        switch (this.definition.type) {
            case "text":
                return "";
            case "number":
                return 0;
            case "checkbox":
                return false;
            case "date":
                return "";
            case "select":
                return "";
            case "multiselect":
            case "list":
                return [];
            default:
                return "";
        }
    }
    evaluateDependencyRule(rule, dependentValue) {
        switch (rule.operator) {
            case "equals":
                return dependentValue === rule.value;
            case "notEquals":
                return dependentValue !== rule.value;
            case "contains":
                return String(dependentValue).includes(String(rule.value));
            case "notContains":
                return !String(dependentValue).includes(String(rule.value));
            case "greaterThan":
                return Number(dependentValue) > Number(rule.value);
            case "lessThan":
                return Number(dependentValue) < Number(rule.value);
            case "isNull":
                return dependentValue === null || dependentValue === undefined;
            case "isNotNull":
                return dependentValue !== null && dependentValue !== undefined;
            default:
                return false;
        }
    }
    setState(newState) {
        this.state = newState;
        this.notifySubscribers();
    }
    notifySubscribers() {
        this.subscribers.forEach((subscriber) => {
            subscriber(this.state);
        });
    }
}
exports.FieldStore = FieldStore;
//# sourceMappingURL=FieldStore.js.map