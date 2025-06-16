/**
 * Create a reactive array expression that updates when the signal changes
 * Usage: {reactive(() => featureList().map(...))}
 */
export declare function reactive<T>(expression: () => T): (() => T);
