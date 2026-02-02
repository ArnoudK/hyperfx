// Server-Side Rendering (SSR) module for HyperFX - Virtual Node Implementation
import type { VirtualNode } from "../jsx/runtime/virtual-node";
import { virtualNodeToHtml, setNodeIdGenerator } from "./virtual-to-html";
import { ReactiveSignal } from "../reactive/state";
import { enableSSRMode, disableSSRMode, getRegisteredSignals } from "../reactive/signal";
import { isSignal } from "../reactive/signal";

// Node counter for generating unique hydration IDs
let nodeCounter = 0;

/**
 * Create a unique node ID for hydration
 * Format: 6-digit zero-padded number (e.g., "000001", "000002")
 */
export function createNodeId(): string {
  nodeCounter++;
  return String(nodeCounter).padStart(6, '0');
}

/**
 * Reset the node counter (used for testing and server-side rendering cleanup)
 */
export function resetNodeCounter(): void {
  nodeCounter = 0;
}

// HTML void elements that should not have closing tags
const VOID_ELEMENTS = new Set([
  'area', 'base', 'br', 'col', 'embed', 'hr', 'img', 'input',
  'link', 'meta', 'param', 'source', 'track', 'wbr'
]);

// HTML boolean attributes that should be rendered without values
const BOOLEAN_ATTRIBUTES = new Set([
  'autofocus', 'autoplay', 'async', 'checked', 'controls', 'defer',
  'disabled', 'hidden', 'loop', 'multiple', 'muted', 'open',
  'readonly', 'required', 'reversed', 'selected'
]);

/**
 * SSR Options for renderToString
 */
export interface SSROptions {
  /**
   * Enable SSR hydration features (signal/resource/context serialization)
   * @default false
   */
  ssrHydration?: boolean;
  
  /**
   * Initial state to restore before rendering
   * Useful for stateful SSR (e.g., loading from database)
   */
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
 * Escape HTML special characters to prevent XSS
 * Note: This is re-exported from virtual-to-html for backward compatibility
 */
function escapeHtml(text: string): string {
  return text
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

/**
 * Check if a value is a reactive signal
 */
function isReactiveSignal(value: unknown): value is ReactiveSignal<unknown> {
  return typeof value === 'function' &&
    'subscribe' in value &&
    typeof (value as ReactiveSignal<unknown>).subscribe === 'function';
}

/**
 * Render a virtual node (JSX element) to HTML string for SSR
 * Handles both new VirtualNode format and legacy HTMLElement mocks
 */
export function renderToString(
  element: VirtualNode | any,  // Accept any for backward compat with mock elements
  options: SSROptions = {}
): { html: string; hydrationData: HydrationData } {
  const { ssrHydration = false, initialState } = options;

  // Note: enableSSRMode() should already be called in server code before component creation

  // Restore initial state if provided (for stateful SSR)
  if (ssrHydration && initialState) {
    if (initialState.signals) {
      const registeredSignals = getRegisteredSignals();
      for (const [key, value] of Object.entries(initialState.signals)) {
        const signal = registeredSignals.get(key);
        if (signal) {
          signal.set(value);
        }
      }
    }
    // TODO: Restore resources and contexts when implemented
  }

  let html: string;

  // Always enable node ID generation for hydration attributes (backward compatibility)
  // Hydration IDs are needed for proper client-side hydration
  setNodeIdGenerator(createNodeId);

  try {
    // Check if this is a VirtualNode (has nodeType property) or a legacy mock element
    if (element && typeof element === 'object' && 'nodeType' in element) {
      // New VirtualNode format (DOM-compatible)
      html = virtualNodeToHtml(element);
    } else if (element && typeof element === 'object' && ('tagName' in element || 'innerHTML' in element)) {
      // Legacy mock HTMLElement format (from createSafeElement or template())
      if ('innerHTML' in element && element.innerHTML) {
        // Mock from template() - just use the innerHTML directly
        html = element.innerHTML;
      } else {
        // Mock from createSafeElement
        html = mockElementToHtml(element);
      }
    } else {
      html = '';
    }
  } finally {
    // Disable node ID generation after rendering
    setNodeIdGenerator(null);
  }

  // Collect serialized state only if hydration is enabled
  const state = {
    signals: {},
    resources: {},
    contexts: {}
  } as {
    signals: Record<string, any>;
    resources: Record<string, any>;
    contexts: Record<string, any>;
  };

  if (ssrHydration) {
    // Collect signal values
    const registeredSignals = getRegisteredSignals();
    for (const [key, signal] of registeredSignals) {
      try {
        state.signals[key] = signal.peek();
      } catch (e) {
        console.warn(`[SSR] Failed to serialize signal "${key}":`, e);
      }
    }

    // TODO: Collect resource values when implemented
    // TODO: Collect context values when implemented
  }

  const hydrationData: HydrationData = {
    state,
    version: '1.0.0'
  };

  return { html, hydrationData };
}

/**
 * Convert legacy mock HTMLElement to HTML string
 * This handles elements created with createSafeElement() 
 */
function mockElementToHtml(element: any): string {
  const tagName = (element.tagName || 'div').toLowerCase();
  let html = `<${tagName}`;

  // Add className as class attribute
  if (element.className) {
    html += ` class="${escapeHtml(element.className)}"`;
  }

  // Add href for links
  if (element.href) {
    html += ` href="${escapeHtml(element.href)}"`;
  }

  // Add other common attributes
  if (element.id) {
    html += ` id="${escapeHtml(element.id)}"`;
  }

  // Handle style object
  if (element.style && typeof element.style === 'object') {
    const styleStr = Object.entries(element.style)
      .filter(([_, v]) => v !== '')
      .map(([k, v]) => `${k}: ${v}`)
      .join('; ');
    if (styleStr) {
      html += ` style="${escapeHtml(styleStr)}"`;
    }
  }

  html += '>';

  // Add text content
  if (element.textContent) {
    html += escapeHtml(element.textContent);
  }

  // Add children
  if (element.childNodes && Array.isArray(element.childNodes)) {
    for (const child of element.childNodes) {
      if (typeof child === 'object' && 'nodeType' in child) {
        // VirtualNode child
        html += virtualNodeToHtml(child);
      } else if (typeof child === 'object' && 'tagName' in child) {
        // Mock element child
        html += mockElementToHtml(child);
      } else if (typeof child === 'string') {
        html += escapeHtml(child);
      }
    }
  }

  html += `</${tagName}>`;
  return html;
}

/**
 * Render hydration data as inline script that sets window global
 */
export function renderHydrationData(hydrationData: HydrationData): string {
  const jsonData = JSON.stringify(hydrationData);
  return `<script>window.__HYPERFX_HYDRATION_DATA__ = ${jsonData};</script>`;
}

/**
 * Full SSR rendering with hydration data included
 */
export function renderWithHydration(element: VirtualNode): string {
  const { html, hydrationData } = renderToString(element);
  return html + renderHydrationData(hydrationData);
}

/**
 * Stream rendering interface for large components
 * Note: Currently simplified for virtual node implementation
 */
export function createSSRStream(element: VirtualNode): {
  html: AsyncIterable<string>;
  hydrationData: Promise<HydrationData>;
} {
  async function* generateHTML(): AsyncIterable<string> {
    // For now, just yield the entire HTML
    // TODO: Implement true streaming for large virtual node trees
    yield virtualNodeToHtml(element);
  }

  const hydrationData = Promise.resolve({
    state: {
      signals: {}, // TODO: Implement signal collection for streaming
      resources: {},
      contexts: {}
    },
    version: '1.0.0'
  } as HydrationData);

  return {
    html: generateHTML(),
    hydrationData
  };
}