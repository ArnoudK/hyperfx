import { createSignal, createEffect } from "../reactive/state";
class PerformanceMonitor {
    constructor() {
        this.metrics = {
            renderCount: 0,
            lastRenderTime: 0,
            averageRenderTime: 0,
            totalRenderTime: 0,
            componentCount: 0
        };
        this.renderStartTime = 0;
        this.enabled = false;
    }
    enable() {
        this.enabled = true;
    }
    disable() {
        this.enabled = false;
    }
    startRender() {
        if (!this.enabled)
            return;
        this.renderStartTime = performance.now();
    }
    endRender() {
        if (!this.enabled || this.renderStartTime === 0)
            return;
        const renderTime = performance.now() - this.renderStartTime;
        this.metrics.renderCount++;
        this.metrics.lastRenderTime = renderTime;
        this.metrics.totalRenderTime += renderTime;
        this.metrics.averageRenderTime = this.metrics.totalRenderTime / this.metrics.renderCount;
        // Get memory usage if available
        if ('memory' in performance) {
            this.metrics.memoryUsage = performance.memory.usedJSHeapSize;
        }
        this.renderStartTime = 0;
    }
    incrementComponentCount() {
        if (this.enabled) {
            this.metrics.componentCount++;
        }
    }
    decrementComponentCount() {
        if (this.enabled) {
            this.metrics.componentCount = Math.max(0, this.metrics.componentCount - 1);
        }
    }
    getMetrics() {
        return { ...this.metrics };
    }
    reset() {
        this.metrics = {
            renderCount: 0,
            lastRenderTime: 0,
            averageRenderTime: 0,
            totalRenderTime: 0,
            componentCount: 0
        };
    }
    logMetrics() {
        console.group('🚀 HyperFX Performance Metrics');
        console.log('Render Count:', this.metrics.renderCount);
        console.log('Last Render Time:', `${this.metrics.lastRenderTime.toFixed(2)}ms`);
        console.log('Average Render Time:', `${this.metrics.averageRenderTime.toFixed(2)}ms`);
        console.log('Total Render Time:', `${this.metrics.totalRenderTime.toFixed(2)}ms`);
        console.log('Active Components:', this.metrics.componentCount);
        if (this.metrics.memoryUsage) {
            console.log('Memory Usage:', `${(this.metrics.memoryUsage / 1024 / 1024).toFixed(2)}MB`);
        }
        console.groupEnd();
    }
}
export const performanceMonitor = new PerformanceMonitor();
// Throttle function for performance optimization
export function throttle(func, delay) {
    let timeoutId = null;
    let lastExecTime = 0;
    return ((...args) => {
        const currentTime = Date.now();
        if (currentTime - lastExecTime > delay) {
            func(...args);
            lastExecTime = currentTime;
        }
        else {
            if (timeoutId) {
                clearTimeout(timeoutId);
            }
            timeoutId = setTimeout(() => {
                func(...args);
                lastExecTime = Date.now();
                timeoutId = null;
            }, delay - (currentTime - lastExecTime));
        }
    });
}
// Debounce function for performance optimization
export function debounce(func, delay) {
    let timeoutId = null;
    return ((...args) => {
        if (timeoutId) {
            clearTimeout(timeoutId);
        }
        timeoutId = setTimeout(() => {
            func(...args);
            timeoutId = null;
        }, delay);
    });
}
// // Memoization for expensive computations
// export function memo<T extends (...args: any[]) => any>(
//   fn: T,
//   keyFn?: (...args: Parameters<T>) => string
// ): T {
//   const cache = new Map<string, ReturnType<T>>();
//   return ((...args: Parameters<T>) => {
//     const key = keyFn ? keyFn(...args) : JSON.stringify(args);
//     if (cache.has(key)) {
//       return cache.get(key)!;
//     }
//     const result = fn(...args);
//     cache.set(key, result);
//     // Prevent memory leaks by limiting cache size
//     if (cache.size > 100) {
//       const firstKey = cache.keys().next().value;
//       if (firstKey !== undefined) {
//         cache.delete(firstKey);
//       }
//     }
//     return result;
//   }) as T;
//}
// Batch updates for better performance
class UpdateBatcher {
    constructor() {
        this.updates = [];
        this.isScheduled = false;
    }
    add(update) {
        this.updates.push(update);
        if (!this.isScheduled) {
            this.schedule();
        }
    }
    schedule() {
        this.isScheduled = true;
        // Use scheduler if available, otherwise fallback to setTimeout
        if (typeof MessageChannel !== 'undefined') {
            const channel = new MessageChannel();
            channel.port1.onmessage = () => this.flush();
            channel.port2.postMessage(null);
        }
        else {
            setTimeout(() => this.flush(), 0);
        }
    }
    flush() {
        performanceMonitor.startRender();
        const updates = this.updates.splice(0);
        updates.forEach(update => {
            try {
                update();
            }
            catch (error) {
                console.error('Error in batched update:', error);
            }
        });
        performanceMonitor.endRender();
        this.isScheduled = false;
    }
}
export const updateBatcher = new UpdateBatcher();
// Reactive signal with batched updates
export function createBatchedSignal(initialValue) {
    const signal = createSignal(initialValue);
    const batchedSetter = (newValue) => {
        updateBatcher.add(() => {
            signal(newValue);
        });
    };
    // Return signal with batched setter
    const batchedSignal = signal;
    batchedSignal.setBatched = batchedSetter;
    return batchedSignal;
}
export function createVirtualScroll(items, options) {
    const { itemHeight, containerHeight, overscan = 5 } = options;
    const scrollTop = createSignal(0);
    const visibleRange = createSignal({ start: 0, end: 0 });
    // Calculate visible range based on scroll position
    createEffect(() => {
        const currentScrollTop = scrollTop();
        const itemCount = items().length;
        const visibleCount = Math.ceil(containerHeight / itemHeight);
        const start = Math.max(0, Math.floor(currentScrollTop / itemHeight) - overscan);
        const end = Math.min(itemCount, start + visibleCount + overscan * 2);
        visibleRange({ start, end });
    });
    const visibleItems = createSignal([]);
    createEffect(() => {
        const { start, end } = visibleRange();
        const allItems = items();
        const visible = [];
        for (let i = start; i < end; i++) {
            const item = allItems[i];
            if (item !== undefined) {
                visible.push({ item, index: i });
            }
        }
        visibleItems(visible);
    });
    return {
        visibleItems,
        scrollTop,
        totalHeight: () => items().length * itemHeight,
        visibleRange,
        onScroll: (event) => {
            const target = event.target;
            scrollTop(target.scrollTop);
        }
    };
}
// Component profiler
export function withProfiler(component, name) {
    return ((...args) => {
        const start = performance.now();
        performanceMonitor.incrementComponentCount();
        try {
            const result = component(...args);
            return result;
        }
        finally {
            const end = performance.now();
            console.debug(`Component ${name} rendered in ${(end - start).toFixed(2)}ms`);
            performanceMonitor.decrementComponentCount();
        }
    });
}
//# sourceMappingURL=optimizations.js.map