import { ReactiveSignal } from "../reactive/state";
export interface PerformanceMetrics {
    renderCount: number;
    lastRenderTime: number;
    averageRenderTime: number;
    totalRenderTime: number;
    componentCount: number;
    memoryUsage?: number;
}
declare class PerformanceMonitor {
    private metrics;
    private renderStartTime;
    private enabled;
    enable(): void;
    disable(): void;
    startRender(): void;
    endRender(): void;
    incrementComponentCount(): void;
    decrementComponentCount(): void;
    getMetrics(): PerformanceMetrics;
    reset(): void;
    logMetrics(): void;
}
export declare const performanceMonitor: PerformanceMonitor;
export declare function throttle<T extends (...args: any[]) => any>(func: T, delay: number): T;
export declare function debounce<T extends (...args: any[]) => any>(func: T, delay: number): T;
declare class UpdateBatcher {
    private updates;
    private isScheduled;
    add(update: () => void): void;
    private schedule;
    private flush;
}
export declare const updateBatcher: UpdateBatcher;
export declare function createBatchedSignal<T>(initialValue: T): ReactiveSignal<T> & {
    setBatched: (newValue: T | ((prev: T) => T)) => void;
};
export interface VirtualScrollOptions {
    itemHeight: number;
    containerHeight: number;
    overscan?: number;
}
export declare function createVirtualScroll<T>(items: ReactiveSignal<T[]>, options: VirtualScrollOptions): {
    visibleItems: ReactiveSignal<{
        item: T;
        index: number;
    }[]>;
    scrollTop: ReactiveSignal<number>;
    totalHeight: () => number;
    visibleRange: ReactiveSignal<{
        start: number;
        end: number;
    }>;
    onScroll: (event: Event) => void;
};
export declare function withProfiler<T extends (...args: any[]) => any>(component: T, name: string): T;
export {};
