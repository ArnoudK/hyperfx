// Batch update system for performance optimization
let batchQueue = new Set<() => void>();
let isBatching = false;

/**
 * Execute multiple updates together to reduce DOM manipulation
 */
export function batchUpdates<T>(fn: () => T): T {
  const wasBatching = isBatching;
  isBatching = true;

  try {
    const result = fn();
    return result;
  } finally {
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
export function addToBatch(updateFn: () => void): void {
  if (isBatching) {
    batchQueue.add(updateFn);
  } else {
    updateFn();
  }
}

/**
 * Execute all queued updates
 */
function flushBatch(): void {
  const updates = Array.from(batchQueue);
  batchQueue.clear();

  updates.forEach(update => {
    try {
      update();
    } catch (error) {
      console.error('Error in batched update:', error);
    }
  });
}