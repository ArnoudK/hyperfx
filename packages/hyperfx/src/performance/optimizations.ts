import { ReactiveSignal, createSignal, createEffect } from "../reactive/state";

// Performance monitoring and optimization utilities

export interface PerformanceMetrics {
  renderCount: number;
  lastRenderTime: number;
  averageRenderTime: number;
  totalRenderTime: number;
  componentCount: number;
  memoryUsage?: number;
}

class PerformanceMonitor {
  private metrics: PerformanceMetrics = {
    renderCount: 0,
    lastRenderTime: 0,
    averageRenderTime: 0,
    totalRenderTime: 0,
    componentCount: 0
  };

  private renderStartTime = 0;
  private enabled = false;

  enable(): void {
    this.enabled = true;
  }

  disable(): void {
    this.enabled = false;
  }

  startRender(): void {
    if (!this.enabled) return;
    this.renderStartTime = performance.now();
  }

  endRender(): void {
    if (!this.enabled || this.renderStartTime === 0) return;
    
    const renderTime = performance.now() - this.renderStartTime;
    this.metrics.renderCount++;
    this.metrics.lastRenderTime = renderTime;
    this.metrics.totalRenderTime += renderTime;
    this.metrics.averageRenderTime = this.metrics.totalRenderTime / this.metrics.renderCount;
    
    // Get memory usage if available
    if ('memory' in performance) {
      this.metrics.memoryUsage = (performance as any).memory.usedJSHeapSize;
    }
    
    this.renderStartTime = 0;
  }

  incrementComponentCount(): void {
    if (this.enabled) {
      this.metrics.componentCount++;
    }
  }

  decrementComponentCount(): void {
    if (this.enabled) {
      this.metrics.componentCount = Math.max(0, this.metrics.componentCount - 1);
    }
  }

  getMetrics(): PerformanceMetrics {
    return { ...this.metrics };
  }

  reset(): void {
    this.metrics = {
      renderCount: 0,
      lastRenderTime: 0,
      averageRenderTime: 0,
      totalRenderTime: 0,
      componentCount: 0
    };
  }

  logMetrics(): void {
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
export function throttle<T extends (...args: any[]) => any>(
  func: T,
  delay: number
): T {
  let timeoutId: ReturnType<typeof setTimeout> | null = null;
  let lastExecTime = 0;
  
  return ((...args: Parameters<T>) => {
    const currentTime = Date.now();
    
    if (currentTime - lastExecTime > delay) {
      func(...args);
      lastExecTime = currentTime;
    } else {
      if (timeoutId) {
        clearTimeout(timeoutId);
      }
      timeoutId = setTimeout(() => {
        func(...args);
        lastExecTime = Date.now();
        timeoutId = null;
      }, delay - (currentTime - lastExecTime));
    }
  }) as T;
}

// Debounce function for performance optimization
export function debounce<T extends (...args: any[]) => any>(
  func: T,
  delay: number
): T {
  let timeoutId: ReturnType<typeof setTimeout> | null = null;
  
  return ((...args: Parameters<T>) => {
    if (timeoutId) {
      clearTimeout(timeoutId);
    }
    timeoutId = setTimeout(() => {
      func(...args);
      timeoutId = null;
    }, delay);
  }) as T;
}

// Memoization for expensive computations
export function memo<T extends (...args: any[]) => any>(
  fn: T,
  keyFn?: (...args: Parameters<T>) => string
): T {
  const cache = new Map<string, ReturnType<T>>();
  
  return ((...args: Parameters<T>) => {
    const key = keyFn ? keyFn(...args) : JSON.stringify(args);
    
    if (cache.has(key)) {
      return cache.get(key)!;
    }
    
    const result = fn(...args);
    cache.set(key, result);
    
    // Prevent memory leaks by limiting cache size
    if (cache.size > 100) {
      const firstKey = cache.keys().next().value;
      if (firstKey !== undefined) {
        cache.delete(firstKey);
      }
    }
    
    return result;
  }) as T;
}

// Batch updates for better performance
class UpdateBatcher {
  private updates: (() => void)[] = [];
  private isScheduled = false;

  add(update: () => void): void {
    this.updates.push(update);
    if (!this.isScheduled) {
      this.schedule();
    }
  }

  private schedule(): void {
    this.isScheduled = true;
    // Use scheduler if available, otherwise fallback to setTimeout
    if (typeof MessageChannel !== 'undefined') {
      const channel = new MessageChannel();
      channel.port1.onmessage = () => this.flush();
      channel.port2.postMessage(null);
    } else {
      setTimeout(() => this.flush(), 0);
    }
  }

  private flush(): void {
    performanceMonitor.startRender();
    
    const updates = this.updates.splice(0);
    updates.forEach(update => {
      try {
        update();
      } catch (error) {
        console.error('Error in batched update:', error);
      }
    });
    
    performanceMonitor.endRender();
    this.isScheduled = false;
  }
}

export const updateBatcher = new UpdateBatcher();

// Reactive signal with batched updates
export function createBatchedSignal<T>(initialValue: T): ReactiveSignal<T> & { setBatched: (newValue: T | ((prev: T) => T)) => void } {
  const signal = createSignal(initialValue);
  
  const batchedSetter = (newValue: T | ((prev: T) => T)) => {
    updateBatcher.add(() => {
      (signal as any)(newValue);
    });
  };
  
  // Return signal with batched setter
  const batchedSignal = signal as any;
  batchedSignal.setBatched = batchedSetter;
  
  return batchedSignal;
}

// Virtual scrolling for large lists
export interface VirtualScrollOptions {
  itemHeight: number;
  containerHeight: number;
  overscan?: number; // Number of items to render outside visible area
}

export function createVirtualScroll<T>(
  items: ReactiveSignal<T[]>,
  options: VirtualScrollOptions
) {
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
  
  const visibleItems = createSignal<{ item: T; index: number }[]>([]);
  
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
    onScroll: (event: Event) => {
      const target = event.target as HTMLElement;
      scrollTop(target.scrollTop);
    }
  };
}

// Component profiler
export function withProfiler<T extends (...args: any[]) => any>(
  component: T,
  name: string
): T {
  return ((...args: Parameters<T>) => {
    const start = performance.now();
    performanceMonitor.incrementComponentCount();
    
    try {
      const result = component(...args);
      return result;
    } finally {
      const end = performance.now();
      console.debug(`Component ${name} rendered in ${(end - start).toFixed(2)}ms`);
      performanceMonitor.decrementComponentCount();
    }
  }) as T;
}
