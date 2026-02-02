/**
 * Start hydration mode
 */
export declare function startHydration(): void;
/**
 * End hydration mode
 */
export declare function endHydration(): void;
/**
 * Check if hydration is currently enabled
 */
export declare function isHydrationEnabled(): boolean;
/**
 * Create a unique client node ID for hydration matching
 * Format: 6-digit zero-padded number (e.g., "000001", "000002")
 */
export declare function createClientNodeId(): string;
/**
 * Reset the client node counter (used for testing and cleanup)
 */
export declare function resetClientNodeCounter(): void;
