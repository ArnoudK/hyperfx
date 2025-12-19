// Server-Side Rendering (SSR) module for HyperFX - Direct DOM Implementation
import { JSXElement } from "../jsx/jsx-runtime";
import { ReactiveSignal } from "../reactive/state";

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
 * Hydration context for tracking elements with event handlers
 */
export interface HydrationMarker {
  index: number;
  nodeId: string;
  tag: string;
  props: Record<string, unknown>;
  hasReactiveProps: boolean;
  hasEventHandlers: boolean;
}

export interface HydrationData {
  markers: HydrationMarker[];
  version: string;
}

/**
 * Create a new hydration context
 */
export function createHydrationContext(): { markers: HydrationMarker[]; currentIndex: number } {
  return {
    markers: [],
    currentIndex: 0
  };
}

/**
 * Global node counter for generating unique node IDs
 */
let globalNodeCounter = 0;

/**
 * Generate a unique node ID for SSR elements
 */
export function createNodeId(): string {
  return String(++globalNodeCounter).padStart(6, '0');
}

/**
 * Reset global node counter (useful for testing)
 */
export function resetNodeCounter(): void {
  globalNodeCounter = 0;
}

/**
 * Escape HTML special characters to prevent XSS
 */
function escapeHtml(text: string): string {
  const div = document.createElement('div');
  div.textContent = text;
  return div.innerHTML;
}

/**
 * Check if an attribute is an event handler
 */
function isEventHandler(attr: string): boolean {
  return attr.startsWith('on') && attr.length > 2;
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
 * Convert DOM element to HTML string
 */
function elementToString(element: HTMLElement, hydrationContext: { markers: HydrationMarker[]; currentIndex: number }): string {
  const tagName = element.tagName.toLowerCase();
  
  // Handle document fragments
  if (element instanceof DocumentFragment) {
    let html = '';
    for (let i = 0; i < element.children.length; i++) {
      html += elementToString(element.children[i] as HTMLElement, hydrationContext);
    }
    return html;
  }

  // Handle text nodes
  if (element instanceof Text) {
    return escapeHtml(element.textContent || '');
  }

  // Handle comment nodes
  if (element instanceof Comment) {
    return `<!--${escapeHtml(element.textContent || '')}-->`;
  }

  // Start opening tag and add unique node ID
  const nodeId = createNodeId();
  let html = `<${tagName} data-hfxh="${nodeId}"`;

  // Process attributes
  const attributes = element.attributes;
  const props: Record<string, unknown> = {};
  let hasReactiveProps = false;
  let hasEventHandlers = false;

  // Extract all properties including non-attribute properties
  for (const key in element) {
    if (Object.prototype.hasOwnProperty.call(element, key) && key !== 'innerHTML' && key !== 'outerHTML') {
      const value = (element as unknown as Record<string, unknown>)[key];
      if (isReactiveSignal(value)) {
        hasReactiveProps = true;
      }
      if (isEventHandler(key) && typeof value === 'function') {
        hasEventHandlers = true;
      }
      props[key] = value;
    }
  }

  // Add DOM attributes
  for (let i = 0; i < attributes.length; i++) {
    const attr = attributes[i];
    if (!attr) continue;
    
    const name = attr.name;
    const value = attr.value;

    if (isEventHandler(name)) {
      hasEventHandlers = true;
      continue; // Skip event handlers in HTML
    }

    if (BOOLEAN_ATTRIBUTES.has(name)) {
      html += ` ${name}`;
    } else if (value !== null && value !== undefined && value !== '') {
      html += ` ${name}="${escapeHtml(String(value))}"`;
    }
  }

  // Add hydration marker if needed
  if (hasReactiveProps || hasEventHandlers) {
    const marker: HydrationMarker = {
      index: hydrationContext.currentIndex++,
      nodeId,
      tag: tagName,
      props,
      hasReactiveProps,
      hasEventHandlers
    };
    hydrationContext.markers.push(marker);
    html += ` data-hfx-hydration="${marker.index}"`;
  }

  // Check if void element
  if (VOID_ELEMENTS.has(tagName)) {
    html += '>';
    return html;
  }

  html += '>';

  // Add children
  for (let i = 0; i < element.childNodes.length; i++) {
    const child = element.childNodes[i];
    if (child instanceof HTMLElement) {
      html += elementToString(child, hydrationContext);
    } else if (child instanceof Text) {
      html += escapeHtml(child.textContent || '');
    } else if (child instanceof Comment) {
      html += `<!--${escapeHtml(child.textContent || '')}-->`;
    }
  }

  // Close tag
  html += `</${tagName}>`;

  return html;
}

/**
 * Render a JSX element to HTML string for SSR
 */
export function renderToString(element: JSXElement): { html: string; hydrationData: HydrationData } {
  const hydrationContext = createHydrationContext();
  
  let html: string;
  
  if (element instanceof HTMLElement) {
    html = elementToString(element, hydrationContext);
  } else if (element instanceof DocumentFragment) {
    html = elementToString(element as unknown as HTMLElement, hydrationContext);
  } else if (element instanceof Text) {
    html = escapeHtml(element.textContent || '');
  } else if (element instanceof Comment) {
    html = `<!--${escapeHtml(element.textContent || '')}-->`;
  } else {
    html = '';
  }

  const hydrationData: HydrationData = {
    markers: hydrationContext.markers,
    version: '1.0.0'
  };

  return { html, hydrationData };
}

/**
 * Render hydration data as JSON script tag
 */
export function renderHydrationData(hydrationData: HydrationData): string {
  return `<script type="application/hyperfx-hydration">${JSON.stringify(hydrationData)}</script>`;
}

/**
 * Full SSR rendering with hydration data included
 */
export function renderWithHydration(element: JSXElement): string {
  const { html, hydrationData } = renderToString(element);
  return html + renderHydrationData(hydrationData);
}

/**
 * Stream rendering interface for large components
 */
export function createSSRStream(element: JSXElement): {
  html: AsyncIterable<string>;
  hydrationData: Promise<HydrationData>;
} {
  const hydrationContext = createHydrationContext();
  
  async function* generateHTML(): AsyncIterable<string> {
    if (element instanceof HTMLElement) {
      const tagName = element.tagName.toLowerCase();
      
      // Start opening tag and add node ID
      const nodeId = createNodeId();
      yield `<${tagName} data-hfxh="${nodeId}"`;
      
      // Process attributes
      const attributes = element.attributes;
      for (let i = 0; i < attributes.length; i++) {
        const attr = attributes[i];
        if (!attr) continue;
        
        const name = attr.name;
        const value = attr.value;
        
        if (!isEventHandler(name)) {
          if (BOOLEAN_ATTRIBUTES.has(name)) {
            yield ` ${name}`;
          } else if (value !== null && value !== undefined && value !== '') {
            yield ` ${name}="${escapeHtml(String(value))}"`;
          }
        }
      }
      
      // Close opening tag
      yield '>';
      
      // Process children
      for (let i = 0; i < element.children.length; i++) {
        yield elementToString(element.children[i] as HTMLElement, hydrationContext);
      }
      
      // Close tag
      if (!VOID_ELEMENTS.has(tagName)) {
        yield `</${tagName}>`;
      }
    }
  }
  
  const hydrationData = Promise.resolve({
    markers: hydrationContext.markers,
    version: '1.0.0'
  } as HydrationData);
  
  return {
    html: generateHTML(),
    hydrationData
  };
}