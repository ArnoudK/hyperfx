/**
 * Create a reactive array expression that updates when the signal changes
 * Usage: {reactive(() => featureList().map(...))}
 */
export function reactive(expression) {
    // Mark the function with a special property so hydration can detect it
    const reactiveExpr = expression;
    reactiveExpr.__isReactiveExpression = true;
    return reactiveExpr;
}
/**
 * Type guard to check if a function is a reactive expression
 */
export function isReactiveExpression(fn) {
    return typeof fn === 'function' && '__isReactiveExpression' in fn && fn.__isReactiveExpression === true;
}
//# sourceMappingURL=reactive-helper.js.map