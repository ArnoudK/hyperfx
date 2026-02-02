// Hydration State - Simplified for Structural Matching
let hydrationEnabled = false;

// Client-side node counter for hydration matching
let clientNodeCounter = 0;

/**
 * Start hydration mode
 */
export function startHydration(): void {
  hydrationEnabled = true;
}

/**
 * End hydration mode
 */
export function endHydration(): void {
  hydrationEnabled = false;
}

/**
 * Check if hydration is currently enabled
 */
export function isHydrationEnabled(): boolean {
  return hydrationEnabled;
}

/**
 * Create a unique client node ID for hydration matching
 * Format: 6-digit zero-padded number (e.g., "000001", "000002")
 */
export function createClientNodeId(): string {
  clientNodeCounter++;
  return String(clientNodeCounter).padStart(6, '0');
}

/**
 * Reset the client node counter (used for testing and cleanup)
 */
export function resetClientNodeCounter(): void {
  clientNodeCounter = 0;
}
