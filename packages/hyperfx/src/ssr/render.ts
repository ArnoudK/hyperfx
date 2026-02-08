// Server-Side Rendering (SSR) module for HyperFX - Pure String Implementation
import { getRegisteredSignals } from "../reactive/signal";

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
    signals?: Record<string, any>;
    resources?: Record<string, any>;
    contexts?: Record<string, any>;
  };
}

/**
 * Hydration data for client-side state restoration
 */
export interface HydrationData {
  state: {
    signals: Record<string, any>;
    resources: Record<string, any>;
    contexts: Record<string, any>;
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
export function renderAttributes(props: Record<string, any>): string {
  let result = '';
  for (const [key, value] of Object.entries(props)) {
    if (key === 'children' || key === 'key' || key === 'ref' || key.startsWith('on')) continue;
    const attrName = key === 'className' ? 'class' : key;
    if (BOOLEAN_ATTRIBUTES.has(attrName)) {
      if (value) result += ` ${attrName}`;
      continue;
    }
    if (attrName === 'style' && typeof value === 'object') {
      const styleStr = Object.entries(value)
        .map(([k, v]) => `${k.replace(/([A-Z])/g, '-$1').toLowerCase()}: ${v}`)
        .join('; ');
      if (styleStr) result += ` style="${escapeHtml(styleStr)}"`;
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
        registeredSignals.get(key)?.set(value);
      }
    }

    // Capture the output
    let result = element;
    if (typeof element === 'function') {
      result = element();
    }

    let html = '';
    if (result && (result as any).__ssr) {
      html = (result as SSRResult).t;
    } else if (typeof result === 'string') {
      html = result;
    } else if (result && typeof result === 'object') {
      // Handle real DOM nodes (for tests with happy-dom/jsdom)
      if ('outerHTML' in result) {
        html = (result as any).outerHTML;
      } else if ('textContent' in result) {
        html = (result as any).textContent || '';
      } else {
        html = String(result || '');
      }
    } else {
      html = String(result || '');
    }

    const state = { signals: {}, resources: {}, contexts: {} } as any;
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
  } finally {
    setSSRMode(prevHydrating);
  }
}

/**
 * Create an SSR result for a tag
 */
export function ssrElement(tag: string, props: Record<string, any>, children: string): SSRResult {
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