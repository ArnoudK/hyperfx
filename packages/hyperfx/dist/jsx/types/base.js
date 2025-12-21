// ========================================
// TYPE GUARDS & UTILITIES
// ========================================
/** Type guard to check if a value is reactive */
export function isReactive(value) {
    return typeof value === 'object' && value !== null && 'subscribe' in value;
}
/** Type guard to check if a value is a reactive signal */
export function isSignal(value) {
    return isReactive(value) && typeof value.subscribe === 'function';
}
//# sourceMappingURL=base.js.map