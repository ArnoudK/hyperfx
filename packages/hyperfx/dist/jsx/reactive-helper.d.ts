export interface ReactiveExpression<T> {
    (): T;
    __isReactiveExpression: true;
}
/**
 * Create a reactive array expression that updates when the signal changes
 * Usage: {reactive(() => featureList().map(...))}
 */
export declare function reactive<T>(expression: () => T): ReactiveExpression<T>;
/**
 * Type guard to check if a function is a reactive expression
 */
export declare function isReactiveExpression<T = any>(fn: unknown): fn is ReactiveExpression<T>;
