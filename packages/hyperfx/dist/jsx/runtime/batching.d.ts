/**
 * Execute multiple updates together to reduce DOM manipulation
 */
export declare function batchUpdates<T>(fn: () => T): T;
/**
 * Add an update function to the batch queue
 */
export declare function addToBatch(updateFn: () => void): void;
