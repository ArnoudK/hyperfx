// Batch update system for performance optimization
let batchQueue = new Set();
let isBatching = false;
/**
 * Execute multiple updates together to reduce DOM manipulation
 */
export function batchUpdates(fn) {
    const wasBatching = isBatching;
    isBatching = true;
    try {
        const result = fn();
        return result;
    }
    finally {
        if (!wasBatching) {
            // Flush the batch
            isBatching = false;
            flushBatch();
        }
    }
}
/**
 * Add an update function to the batch queue
 */
export function addToBatch(updateFn) {
    if (isBatching) {
        batchQueue.add(updateFn);
    }
    else {
        updateFn();
    }
}
/**
 * Execute all queued updates
 */
function flushBatch() {
    const updates = Array.from(batchQueue);
    batchQueue.clear();
    updates.forEach(update => {
        try {
            update();
        }
        catch (error) {
            console.error('Error in batched update:', error);
        }
    });
}
//# sourceMappingURL=batching.js.map