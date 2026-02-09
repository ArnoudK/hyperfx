// Server-Side Rendering (SSR) module for HyperFX - Pure String Implementation
import { getRegisteredSignals } from "../reactive/signal";
import { isSSRMode, setSSRMode, clearSSRState, createNodeId } from "../jsx/runtime/hydration";
export { isSSRMode, setSSRMode, clearSSRState, createNodeId };
/**
 * Escape HTML special characters
 */
export function escapeHtml(text) {
    if (typeof text !== 'string')
        return String(text);
    return text
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#39;');
}
function domNodeToString(node) {
    if (node.nodeType === 1) {
        return String(node.outerHTML ?? '');
    }
    if (node.nodeType === 3) {
        return String(node.data ?? '');
    }
    if (node.nodeType === 8) {
        return `<!--${String(node.data ?? '')}-->`;
    }
    if (node.nodeType === 11) {
        const fragment = node;
        const wrapper = document.createElement('div');
        wrapper.appendChild(fragment.cloneNode(true));
        return wrapper.innerHTML;
    }
    return '';
}
/**
 * HTML void elements
 */
const VOID_ELEMENTS = new Set([
    'area', 'base', 'br', 'col', 'embed', 'hr', 'img', 'input',
    'link', 'meta', 'param', 'source', 'track', 'wbr'
]);
/**
 * HTML boolean attributes
 */
const BOOLEAN_ATTRIBUTES = new Set([
    'autofocus', 'autoplay', 'async', 'checked', 'controls', 'defer',
    'disabled', 'hidden', 'loop', 'multiple', 'muted', 'open',
    'readonly', 'required', 'reversed', 'selected'
]);
/**
 * Render properties to HTML string
 */
export function renderAttributes(props) {
    let result = '';
    if (!props)
        return result;
    for (const [key, value] of Object.entries(props)) {
        if (key === 'children' || key === 'key' || key === 'ref' || key.startsWith('on'))
            continue;
        const attrName = key === 'className' ? 'class' : key;
        if (BOOLEAN_ATTRIBUTES.has(attrName)) {
            if (value)
                result += ` ${attrName}`;
            continue;
        }
        if (attrName === 'style' && typeof value === 'object' && value !== null) {
            const styleStr = Object.entries(value)
                .map(([k, v]) => `${k.replace(/([A-Z])/g, '-$1').toLowerCase()}: ${v}`)
                .join('; ');
            if (styleStr)
                result += ` style="${escapeHtml(styleStr)}"`;
            continue;
        }
        if (value != null && value !== false) {
            result += ` ${attrName}="${escapeHtml(String(value))}"`;
        }
    }
    return result;
}
/**
 * Main entry point for SSR
 */
export function renderToString(element, options = {}) {
    const { ssrHydration = false, initialState } = options;
    // Reset for new render
    const prevHydrating = isSSRMode();
    clearSSRState(); // Reset state
    setSSRMode(ssrHydration || prevHydrating);
    try {
        // Restore initial state if provided
        if (ssrHydration && initialState?.signals) {
            const registeredSignals = getRegisteredSignals();
            for (const [key, value] of Object.entries(initialState.signals)) {
                registeredSignals.get(key)?.set(value);
            }
        }
        // Capture the output
        let result = element;
        if (typeof element === 'function') {
            result = element();
        }
        let html = '';
        if (result && result.__ssr) {
            html = result.t;
        }
        else if (typeof result === 'string') {
            html = result;
        }
        else if (typeof Node !== 'undefined' && result instanceof Node) {
            html = domNodeToString(result);
        }
        else {
            if (result && typeof result === 'object' && Array.isArray(result.childNodes)) {
                const nodes = result.childNodes;
                let buffer = '';
                for (const node of nodes) {
                    if (node && node.__ssr) {
                        buffer += node.t;
                    }
                    else {
                        buffer += escapeHtml(String(node));
                    }
                }
                html = buffer;
            }
            else {
                html = String(result || '');
            }
        }
        const state = { signals: {}, resources: {}, contexts: {} };
        if (ssrHydration) {
            const registeredSignals = getRegisteredSignals();
            for (const [key, signal] of registeredSignals) {
                state.signals[key] = signal.peek();
            }
        }
        return {
            html,
            hydrationData: { state, version: '1.0.0' }
        };
    }
    finally {
        setSSRMode(prevHydrating);
    }
}
/**
 * Create an SSR result for a tag
 */
export function ssrElement(tag, props, children) {
    const t = tag.toLowerCase();
    let html = `<${t}`;
    // Inject hydration ID - Removed for ID-less hydration
    // if (isSSRMode()) {
    //   html += ` data-hfxh="${createNodeId()}"`;
    // }
    html += renderAttributes(props);
    if (VOID_ELEMENTS.has(t)) {
        html += '>';
        return { t: html, __ssr: true };
    }
    html += `>${children}</${t}>`;
    return { t: html, __ssr: true };
}
export function renderHydrationData(hydrationData) {
    return `<script>window.__HYPERFX_HYDRATION_DATA__ = ${JSON.stringify(hydrationData)};</script>`;
}
export function renderWithHydration(element) {
    const { html, hydrationData } = renderToString(element, { ssrHydration: true });
    return html + renderHydrationData(hydrationData);
}
//# sourceMappingURL=render.js.map