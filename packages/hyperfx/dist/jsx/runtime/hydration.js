// Hydration State - Simplified for Structural Matching
let hydrationEnabled = false;
// Client-side node counter for hydration matching
let clientNodeCounter = 0;
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
/**
 * Create a unique client node ID for hydration matching
 * Format: 6-digit zero-padded number (e.g., "000001", "000002")
 */
export function createClientNodeId() {
    clientNodeCounter++;
    return String(clientNodeCounter).padStart(6, '0');
}
/**
 * Reset the client node counter (used for testing and cleanup)
 */
export function resetClientNodeCounter() {
    clientNodeCounter = 0;
}
//# sourceMappingURL=hydration.js.map