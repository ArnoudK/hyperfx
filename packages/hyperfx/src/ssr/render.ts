// Server-Side Rendering (SSR) module for HyperFX - Pure String Implementation
import { getRegisteredSignals, getSetter, getAccessor } from "../reactive/signal";

import {
  isSSRMode,
  setSSRMode,
  clearSSRState,
  createNodeId
} from "../jsx/runtime/hydration";
export { isSSRMode, setSSRMode, clearSSRState, createNodeId };

/**
 * Result of server-side rendering
 * This is just a string wrapper to distinguish HTML from plain text
 */
export interface SSRResult {
  t: string; // The HTML text
  __ssr: true;
}

/**
 * Interface for mock nodes used during SSR
 * Mimics minimal DOM Node interface for control flow
 */
export interface SSRNode extends SSRResult {
  nodeType?: number;
  textContent?: string;
  childNodes?: SSRNode[];
  appendChild?(node: SSRNode): SSRNode;
  removeChild?(node: SSRNode): SSRNode;
  insertBefore?(newNode: SSRNode, referenceNode: SSRNode | null): SSRNode;
  cloneNode?(): SSRNode;
}

/**
 * SSR Options for renderToString
 */
export interface SSROptions {
  ssrHydration?: boolean;
  initialState?: {
    signals?: Record<string, unknown>;
    resources?: Record<string, unknown>;
    contexts?: Record<string, unknown>;
  };
}

/**
 * Hydration data for client-side state restoration
 */
export interface HydrationData {
  state: {
    signals: Record<string, unknown>;
    resources: Record<string, unknown>;
    contexts: Record<string, unknown>;
  };
  version: string;
}

/**
 * Escape HTML special characters
 */
export function escapeHtml(text: string): string {
  if (typeof text !== 'string') return String(text);
  return text
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

function domNodeToString(node: Node): string {
  if (node.nodeType === 1) {
    return String((node as Element).outerHTML ?? '');
  }
  if (node.nodeType === 3) {
    return String((node as Text).data ?? '');
  }
  if (node.nodeType === 8) {
    return `<!--${String((node as Comment).data ?? '')}-->`;
  }
  if (node.nodeType === 11) {
    const fragment = node as DocumentFragment;
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
export function renderAttributes(props: Record<string, unknown> | null | undefined): string {
  let result = '';
  if (!props) return result;
  for (const [key, value] of Object.entries(props)) {
    if (key === 'children' || key === 'key' || key === 'ref' || key.startsWith('on')) continue;
    if (BOOLEAN_ATTRIBUTES.has(key)) {
      if (value) result += ` ${key}`;
      continue;
    }
    if (key === 'style' && typeof value === 'object' && value !== null) {
      const styleStr = Object.entries(value as Record<string, unknown>)
        .map(([k, v]) => `${k.replace(/([A-Z])/g, '-$1').toLowerCase()}: ${v}`)
        .join('; ');
      if (styleStr) result += ` style="${escapeHtml(styleStr)}"`;
      continue;
    }
    if (value != null && value !== false) {
      result += ` ${key}="${escapeHtml(String(value))}"`;
    }
  }
  return result;
}


/**
 * Main entry point for SSR
 */
export function renderToString(
  element: SSRNode | string | Function | null | undefined,
  options: SSROptions = {}
): { html: string; hydrationData: HydrationData } {
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
        const sig = registeredSignals.get(key);
        const setter = sig ? getSetter(sig) : undefined;
        if (setter) setter(value);
      }
    }

    // Capture the output
    let result = element;
    if (typeof element === 'function') {
      result = element();
    }

    let html = '';
    if (result && (result as SSRResult).__ssr) {
      html = (result as SSRResult).t;
    } else if (typeof result === 'string') {
      html = result;
    } else if (typeof Node !== 'undefined' && result instanceof Node) {
      html = domNodeToString(result);
    } else {
      if (result && typeof result === 'object' && Array.isArray((result as { childNodes?: SSRNode[] }).childNodes)) {
        const nodes = (result as { childNodes: SSRNode[] }).childNodes;
        let buffer = '';
        for (const node of nodes) {
          if (node && (node as SSRResult).__ssr) {
            buffer += (node as SSRResult).t;
          } else {
            buffer += escapeHtml(String(node));
          }
        }
        html = buffer;
      } else {
        html = String(result || '');
      }
    }

    const state: HydrationData['state'] = { signals: {}, resources: {}, contexts: {} };
    if (ssrHydration) {
      const registeredSignals = getRegisteredSignals();
      for (const [key, signal] of registeredSignals) {
        const acc = getAccessor(signal);
        state.signals[key] = acc ? acc() : undefined;
      }
    }

    return {
      html,
      hydrationData: { state, version: '1.0.0' }
    };
  } finally {
    setSSRMode(prevHydrating);
  }
}

/**
 * Create an SSR result for a tag
 */
export function ssrElement(tag: string, props: Record<string, unknown>, children: string): SSRNode {
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

export function renderHydrationData(hydrationData: HydrationData): string {
  return `<script>window.__HYPERFX_HYDRATION_DATA__ = ${JSON.stringify(hydrationData)};</script>`;
}

export function renderWithHydration(element: SSRNode | string | null | undefined): string {
  const { html, hydrationData } = renderToString(element, { ssrHydration: true });
  return html + renderHydrationData(hydrationData);
}
