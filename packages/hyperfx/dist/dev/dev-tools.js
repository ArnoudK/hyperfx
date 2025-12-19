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
            this.createDevToolsUI();
        }
    }
    disable() {
        this.enabled = false;
        if (typeof window !== 'undefined') {
            delete window.__HYPERFX_DEVTOOLS__;
            this.removeDevToolsUI();
        }
    }
    // Track component rendering
    trackComponent(id, type, props, children, renderTime) {
        if (!this.enabled)
            return;
        // Update render count
        const currentCount = this.renderCounts.get(id) || 0;
        this.renderCounts.set(id, currentCount + 1);
        // Create component node
        const node = {
            id,
            type,
            props: this.sanitizeProps(props),
            children: this.analyzeChildren(children),
            renderTime,
            updateCount: currentCount + 1
        };
        this.componentMap.set(id, node);
        this.updateComponentTree();
        this.refreshDevToolsUI();
    }
    // Clean props for display (remove circular references)
    sanitizeProps(props) {
        const sanitized = {};
        for (const [key, value] of Object.entries(props)) {
            if (typeof value === 'function') {
                sanitized[key] = '[Function]';
            }
            else if (value instanceof HTMLElement) {
                sanitized[key] = `[HTMLElement: ${value.tagName}]`;
            }
            else if (value && typeof value === 'object') {
                try {
                    // Try to serialize to check for circular references
                    JSON.stringify(value);
                    sanitized[key] = value;
                }
                catch {
                    sanitized[key] = '[Object]';
                }
            }
            else {
                sanitized[key] = value;
            }
        }
        return sanitized;
    }
    // Analyze children for the component tree
    analyzeChildren(children) {
        const result = [];
        for (const child of children) {
            if (child instanceof HTMLElement) {
                result.push({
                    id: `dom-${child.tagName.toLowerCase()}-${Date.now()}-${Math.random()}`,
                    type: child.tagName.toLowerCase(),
                    props: this.getElementAttributes(child),
                    children: this.analyzeDOMChildren(child)
                });
            }
            else if (child instanceof DocumentFragment) {
                result.push({
                    id: `fragment-${Date.now()}-${Math.random()}`,
                    type: 'DocumentFragment',
                    props: {},
                    children: this.analyzeDOMChildren(child)
                });
            }
            else if (child instanceof Text) {
                result.push({
                    id: `text-${Date.now()}-${Math.random()}`,
                    type: 'Text',
                    props: { content: child.textContent },
                    children: []
                });
            }
        }
        return result;
    }
    // Get element attributes as props object
    getElementAttributes(element) {
        const props = {};
        for (const attr of element.attributes) {
            props[attr.name] = attr.value;
        }
        return props;
    }
    // Analyze DOM children recursively
    analyzeDOMChildren(element) {
        const children = [];
        for (const child of element.children) {
            children.push(child);
        }
        return this.analyzeChildren(children);
    }
    // Update the main component tree
    updateComponentTree() {
        // Find root nodes (nodes without parents in the map)
        const allNodes = Array.from(this.componentMap.values());
        const childIds = new Set();
        allNodes.forEach(node => {
            node.children.forEach(child => childIds.add(child.id));
        });
        const rootNodes = allNodes.filter(node => !childIds.has(node.id));
        this.componentTree = {
            id: 'root',
            type: 'Application',
            props: {},
            children: rootNodes
        };
    }
    // Create dev tools UI
    createDevToolsUI() {
        if (document.getElementById('hyperfx-devtools'))
            return;
        const devTools = document.createElement('div');
        devTools.id = 'hyperfx-devtools';
        devTools.style.cssText = `
      position: fixed;
      top: 0;
      right: 0;
      width: 400px;
      height: 300px;
      background: #1e1e1e;
      color: #fff;
      font-family: monospace;
      font-size: 12px;
      border-left: 1px solid #444;
      border-bottom: 1px solid #444;
      z-index: 10000;
      display: none;
      overflow: auto;
    `;
        const header = document.createElement('div');
        header.style.cssText = `
      background: #333;
      padding: 8px;
      border-bottom: 1px solid #444;
      display: flex;
      justify-content: space-between;
      align-items: center;
    `;
        header.innerHTML = '<span>HyperFX DevTools</span>';
        const closeBtn = document.createElement('button');
        closeBtn.textContent = '×';
        closeBtn.style.cssText = `
      background: none;
      border: none;
      color: #fff;
      font-size: 16px;
      cursor: pointer;
    `;
        closeBtn.onclick = () => {
            devTools.style.display = 'none';
        };
        header.appendChild(closeBtn);
        const content = document.createElement('div');
        content.id = 'hyperfx-devtools-content';
        content.style.cssText = `
      padding: 10px;
    `;
        devTools.appendChild(header);
        devTools.appendChild(content);
        document.body.appendChild(devTools);
        // Add toggle button
        const toggleBtn = document.createElement('button');
        toggleBtn.id = 'hyperfx-devtools-toggle';
        toggleBtn.textContent = 'DevTools';
        toggleBtn.style.cssText = `
      position: fixed;
      top: 10px;
      right: 410px;
      background: #1e1e1e;
      color: #fff;
      border: 1px solid #444;
      padding: 5px 10px;
      cursor: pointer;
      z-index: 10000;
      font-family: monospace;
      font-size: 12px;
    `;
        toggleBtn.onclick = () => {
            const isVisible = devTools.style.display !== 'none';
            devTools.style.display = isVisible ? 'none' : 'block';
            toggleBtn.style.right = isVisible ? '410px' : '10px';
        };
        document.body.appendChild(toggleBtn);
    }
    // Remove dev tools UI
    removeDevToolsUI() {
        const devTools = document.getElementById('hyperfx-devtools');
        const toggleBtn = document.getElementById('hyperfx-devtools-toggle');
        if (devTools)
            devTools.remove();
        if (toggleBtn)
            toggleBtn.remove();
    }
    // Refresh dev tools UI
    refreshDevToolsUI() {
        const content = document.getElementById('hyperfx-devtools-content');
        if (!content || !this.componentTree)
            return;
        // Display performance metrics
        const metrics = performanceMonitor.getMetrics();
        let html = `
      <div style="margin-bottom: 20px;">
        <h4 style="margin: 0 0 5px 0; color: #4CAF50;">Performance Metrics</h4>
        <pre style="margin: 0; font-size: 11px;">${JSON.stringify(metrics, null, 2)}</pre>
      </div>
    `;
        // Display component tree
        html += `
      <div>
        <h4 style="margin: 0 0 5px 0; color: #2196F3;">Component Tree</h4>
        <pre style="margin: 0; font-size: 11px;">${JSON.stringify(this.componentTree, null, 2)}</pre>
      </div>
    `;
        content.innerHTML = html;
    }
    // Get component info for debugging
    getComponentInfo(id) {
        return this.componentMap.get(id) || null;
    }
    // Get all components
    getAllComponents() {
        return Array.from(this.componentMap.values());
    }
    // Clear component tracking
    clearTracking() {
        this.componentMap.clear();
        this.renderCounts.clear();
        this.componentTree = null;
        this.refreshDevToolsUI();
    }
}
// Global dev tools instance
const devTools = new DevTools();
// Export public API
export const enableDevTools = () => devTools.enable();
export const disableDevTools = () => devTools.disable();
export const trackComponent = (id, type, props, children, renderTime) => devTools.trackComponent(id, type, props, children, renderTime);
export const getComponentInfo = (id) => devTools.getComponentInfo(id);
export const getAllComponents = () => devTools.getAllComponents();
export const clearComponentTracking = () => devTools.clearTracking();
// Auto-enable in development
if (isDev()) {
    if (typeof window !== 'undefined') {
        // Enable dev tools after a short delay to ensure DOM is ready
        setTimeout(() => {
            devTools.enable();
        }, 100);
    }
}
//# sourceMappingURL=dev-tools.js.map