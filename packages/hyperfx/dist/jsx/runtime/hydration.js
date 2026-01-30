// Hydration State - Simplified for Structural Matching
let hydrationEnabled = false;
/**
 * Start hydration mode
 */
export function startHydration() {
    hydrationEnabled = true;
}
/**
 * End hydration mode
 */
export function endHydration() {
    hydrationEnabled = false;
}
/**
 * Check if hydration is currently enabled
 */
export function isHydrationEnabled() {
    return hydrationEnabled;
}
//# sourceMappingURL=hydration.js.map