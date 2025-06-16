// Developer tools and debugging utilities for hyperfx
import { performanceMonitor } from "../performance/optimizations";
// Development mode flag
export const isDev = () => process.env.NODE_ENV === 'development' ||
    typeof window !== 'undefined' && window.__HYPERFX_DEV__;
class DevTools {
    constructor() {
        this.componentTree = null;
        this.componentMap = new Map();
        this.renderCounts = new Map();
        this.enabled = false;
    }
    enable() {
        this.enabled = true;
        if (typeof window !== 'undefined') {
            window.__HYPERFX_DEVTOOLS__ = this;
            console.log('🚀 HyperFX DevTools enabled');
        }
    }
    disable() {
        this.enabled = false;
        if (typeof window !== 'undefined') {
            delete window.__HYPERFX_DEVTOOLS__;
        }
    }
    isEnabled() {
        return this.enabled && isDev();
    }
    // Track component in the tree
    trackComponent(id, type, props, parentId) {
        if (!this.isEnabled())
            return;
        const node = {
            id,
            type,
            props: { ...props },
            children: [],
            updateCount: this.renderCounts.get(id) || 0
        };
        this.componentMap.set(id, node);
        if (parentId) {
            const parent = this.componentMap.get(parentId);
            if (parent) {
                parent.children.push(node);
            }
        }
        else {
            this.componentTree = node;
        }
    }
    // Update component render count
    trackRender(id, renderTime) {
        if (!this.isEnabled())
            return;
        const count = this.renderCounts.get(id) || 0;
        this.renderCounts.set(id, count + 1);
        const node = this.componentMap.get(id);
        if (node) {
            node.renderTime = renderTime;
            node.updateCount = count + 1;
        }
    }
    // Remove component from tracking
    untrackComponent(id) {
        if (!this.isEnabled())
            return;
        this.componentMap.delete(id);
        this.renderCounts.delete(id);
    }
    // Get component tree
    getComponentTree() {
        return this.componentTree;
    }
    // Log component tree to console
    logComponentTree() {
        if (!this.isEnabled())
            return;
        console.group('🌲 Component Tree');
        this.logNode(this.componentTree, 0);
        console.groupEnd();
    }
    logNode(node, depth) {
        if (!node)
            return;
        const indent = '  '.repeat(depth);
        const renderInfo = node.renderTime ? ` (${node.renderTime.toFixed(2)}ms)` : '';
        const updateInfo = node.updateCount ? ` [${node.updateCount} updates]` : '';
        console.log(`${indent}${node.type}#${node.id}${renderInfo}${updateInfo}`, node.props);
        node.children.forEach(child => this.logNode(child, depth + 1));
    }
    // Find components that render frequently
    getFrequentlyUpdatingComponents(threshold = 10) {
        const frequent = [];
        this.componentMap.forEach(node => {
            if ((node.updateCount || 0) > threshold) {
                frequent.push(node);
            }
        });
        return frequent.sort((a, b) => (b.updateCount || 0) - (a.updateCount || 0));
    }
    // Performance analysis
    analyzePerformance() {
        if (!this.isEnabled())
            return;
        console.group('📊 Performance Analysis');
        // Overall metrics
        performanceMonitor.logMetrics();
        // Frequently updating components
        const frequent = this.getFrequentlyUpdatingComponents();
        if (frequent.length > 0) {
            console.warn('Components with high update frequency:');
            frequent.forEach(node => {
                console.warn(`${node.type}#${node.id}: ${node.updateCount} updates`);
            });
        }
        // Slow rendering components
        const slow = Array.from(this.componentMap.values())
            .filter(node => (node.renderTime || 0) > 16) // Slower than 60fps
            .sort((a, b) => (b.renderTime || 0) - (a.renderTime || 0));
        if (slow.length > 0) {
            console.warn('Components with slow render times:');
            slow.forEach(node => {
                console.warn(`${node.type}#${node.id}: ${node.renderTime?.toFixed(2)}ms`);
            });
        }
        console.groupEnd();
    }
}
export const devTools = new DevTools();
// Initialize in development
if (isDev()) {
    devTools.enable();
}
// Debugging utilities
export function debugVNode(vnode, label) {
    if (!isDev())
        return vnode;
    const originalVNode = { ...vnode };
    console.group(`🔍 ${label || 'VNode Debug'}`);
    console.log('Tag:', vnode.tag);
    console.log('Props:', vnode.props);
    console.log('Children:', vnode.children);
    if (vnode.reactiveProps) {
        console.log('Reactive Props:', Object.keys(vnode.reactiveProps));
    }
    if (vnode.dom) {
        console.log('DOM:', vnode.dom);
    }
    console.groupEnd();
    return originalVNode;
}
export function debugSignal(signal, label) {
    if (!isDev())
        return signal;
    const originalSignal = signal;
    // Wrap the signal to log value changes
    const debugSignal = ((...args) => {
        if (args.length === 0) {
            // Getter
            const value = originalSignal();
            console.log(`📡 Signal ${label || 'read'}:`, value);
            return value;
        }
        else {
            // Setter
            const newValue = args[0];
            console.log(`📡 Signal ${label || 'write'}:`, newValue);
            return originalSignal(newValue);
        }
    });
    return debugSignal;
}
// Component boundary for error catching in development
export function DevBoundary(children) {
    if (!isDev()) {
        return Array.isArray(children) ?
            { tag: 'div', props: {}, children } :
            children;
    }
    const container = {
        tag: 'div',
        props: {
            style: 'border: 2px dashed #ff6b6b; padding: 8px; margin: 4px;',
            'data-dev-boundary': 'true'
        },
        children: Array.isArray(children) ? children : [children]
    };
    return container;
}
// Hot reload support
export function enableHotReload() {
    if (!isDev() || typeof module === 'undefined')
        return;
    if (module.hot) {
        module.hot.accept(() => {
            console.log('🔥 Hot reloading HyperFX components...');
            // Trigger re-render of all tracked components
            devTools.getComponentTree() && window.location.reload();
        });
    }
}
// Visual debugging overlay
export function createDebugOverlay() {
    if (!isDev()) {
        return document.createElement('div');
    }
    const overlay = document.createElement('div');
    overlay.style.cssText = `
    position: fixed;
    top: 10px;
    right: 10px;
    background: rgba(0, 0, 0, 0.8);
    color: white;
    padding: 10px;
    border-radius: 5px;
    font-family: monospace;
    font-size: 12px;
    z-index: 10000;
    max-width: 300px;
  `;
    const updateOverlay = () => {
        const metrics = performanceMonitor.getMetrics();
        const componentCount = devTools.getComponentTree() ?
            Array.from(devTools.getComponentTree().children).length : 0;
        overlay.innerHTML = `
      <div><strong>HyperFX Debug</strong></div>
      <div>Components: ${componentCount}</div>
      <div>Renders: ${metrics.renderCount}</div>
      <div>Avg Time: ${metrics.averageRenderTime.toFixed(2)}ms</div>
      <div>Memory: ${metrics.memoryUsage ?
            (metrics.memoryUsage / 1024 / 1024).toFixed(2) + 'MB' : 'N/A'}</div>
    `;
    };
    updateOverlay();
    setInterval(updateOverlay, 1000);
    return overlay;
}
// Export utilities for browser console
if (typeof window !== 'undefined' && isDev()) {
    window.HyperFXDebug = {
        devTools,
        performanceMonitor,
        debugVNode,
        debugSignal,
        createDebugOverlay
    };
}
//# sourceMappingURL=dev-tools.js.map