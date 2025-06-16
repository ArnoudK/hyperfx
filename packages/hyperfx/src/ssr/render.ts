// Server-Side Rendering (SSR) module for HyperFX
import { VNode, FRAGMENT_TAG, resolveReactiveValue } from "../elem/elem";
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
/**
 * Hydration context for tracking elements with event handlers during SSR
 */
export interface HydrationMarker {
  index: number;
  tag: string;
  props: Record<string, any>;
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
 * Escape HTML special characters to prevent XSS
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
 * Escape HTML attribute values
 */
function escapeAttribute(value: string): string {
  return value
    .replace(/&/g, '&amp;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

/**
 * Render VNode attributes to HTML string
 */
function renderAttributes(props: Record<string, any>): string {
  const attributes: string[] = [];
  
  for (const [key, value] of Object.entries(props)) {
    // Skip event handlers and other non-HTML attributes
    if (key.startsWith('on') || key === 'key' || key === 'ref') {
      continue;
    }
    
    // Resolve reactive values
    const resolvedValue = resolveReactiveValue(value);
    
    // Handle boolean attributes
    if (BOOLEAN_ATTRIBUTES.has(key)) {
      if (resolvedValue === true || resolvedValue === '' || resolvedValue === key) {
        attributes.push(key);
      }
      continue;
    }
    
    // Handle regular attributes
    if (resolvedValue != null && resolvedValue !== false) {
      const attrValue = String(resolvedValue);
      attributes.push(`${key}="${escapeAttribute(attrValue)}"`);
    }
  }
  
  return attributes.length > 0 ? ` ${attributes.join(' ')}` : '';
}

/**
 * Render children to HTML string
 */
function renderChildren(children: (VNode | string | ReactiveSignal<string>)[]): string {
  const result = children
    .map((child, index) => {
      const rendered = renderToString(child);
      return rendered;
    })
    .join('');
  
  return result;
}

/**
 * Render a VNode, string, or reactive signal to HTML string
 */
export function renderToString(vnode: VNode | string | ReactiveSignal<string>): string {
  // Handle reactive signals
  if (typeof vnode === 'function') {
    const resolvedValue = resolveReactiveValue(vnode);
    return escapeHtml(String(resolvedValue));
  }
  
  // Handle plain strings
  if (typeof vnode === 'string') {
    return escapeHtml(vnode);
  }
  
  // Handle VNodes
  const { tag, props, children } = vnode;
  
  // Handle fragments
  if (tag === FRAGMENT_TAG) {
    return renderChildren(children);
  }
  
  // Handle regular elements
  const tagName = String(tag);
  const attributes = renderAttributes(props);
  const childrenHtml = renderChildren(children);
  
  // Handle void elements
  if (VOID_ELEMENTS.has(tagName)) {
    return `<${tagName}${attributes} />`;
  }
  
  // Handle regular elements
  return `<${tagName}${attributes}>${childrenHtml}</${tagName}>`;
}

/**
 * Render multiple VNodes to HTML string
 */
export function renderArrayToString(vnodes: (VNode | string | ReactiveSignal<string>)[]): string {
  return vnodes.map(vnode => renderToString(vnode)).join('');
}

/**
 * Generate a complete HTML document with the rendered VNode
 */
export interface HtmlDocumentOptions {
  title?: string;
  lang?: string;
  charset?: string;
  viewport?: string;
  description?: string;
  stylesheets?: string[];
  scripts?: string[];
  inlineStyles?: string;
  inlineScripts?: string;
  bodyAttributes?: Record<string, string>;
  htmlAttributes?: Record<string, string>;
}

export function renderToDocument(
  vnode: VNode | VNode[],
  options: HtmlDocumentOptions = {}
): string {
  const {
    title = 'HyperFX App',
    lang = 'en',
    charset = 'UTF-8',
    viewport = 'width=device-width, initial-scale=1.0',
    description,
    stylesheets = [],
    scripts = [],
    inlineStyles,
    inlineScripts,
    bodyAttributes = {},
    htmlAttributes = {}
  } = options;

  const htmlAttrs = renderAttributes(htmlAttributes);
  const bodyAttrs = renderAttributes(bodyAttributes);
  
  const head = [
    `<meta charset="${charset}">`,
    `<meta name="viewport" content="${viewport}">`,
    `<title>${escapeHtml(title)}</title>`,
    description ? `<meta name="description" content="${escapeAttribute(description)}">` : '',
    ...stylesheets.map(href => `<link rel="stylesheet" href="${escapeAttribute(href)}">`),
    inlineStyles ? `<style>${inlineStyles}</style>` : '',
    ...scripts.map(src => `<script src="${escapeAttribute(src)}"></script>`),
    inlineScripts ? `<script>${inlineScripts}</script>` : ''
  ].filter(Boolean).join('\n  ');

  const bodyContent = Array.isArray(vnode) 
    ? renderArrayToString(vnode)
    : renderToString(vnode);

  return `<!DOCTYPE html>
<html${htmlAttrs} lang="${lang}">
<head>
  ${head}
</head>
<body${bodyAttrs}>
  ${bodyContent}
</body>
</html>`;
}

/**
 * Create a streaming HTML renderer (useful for large documents)
 */
export class StreamRenderer {
  private chunks: string[] = [];

  write(chunk: string): void {
    this.chunks.push(chunk);
  }

  renderVNode(vnode: VNode | string | ReactiveSignal<string>): void {
    this.write(renderToString(vnode));
  }

  renderArray(vnodes: (VNode | string | ReactiveSignal<string>)[]): void {
    vnodes.forEach(vnode => this.renderVNode(vnode));
  }

  getResult(): string {
    return this.chunks.join('');
  }

  clear(): void {
    this.chunks = [];
  }
}

/**
 * Generate hydration markers for client-side mounting
 * Only tracks elements that actually need hydration (have event handlers or reactive props)
 */
export function renderWithHydration(vnode: VNode): { html: string; hydrationData: HydrationData } {
  const hydrationMarkers: HydrationMarker[] = [];
  let markerIndex = 0;

  function addHydrationMarker(vnodeData: VNode): string {
    const hasEventHandlers = Object.keys(vnodeData.props).some(key => key.startsWith('on'));
    const hasReactiveProps = !!vnodeData.reactiveProps;
    const needsHydration = hasEventHandlers || hasReactiveProps;
    
    if (needsHydration) {
      const marker: HydrationMarker = {
        index: markerIndex,
        tag: String(vnodeData.tag),
        props: vnodeData.props,
        hasReactiveProps,
        hasEventHandlers
      };
      
      hydrationMarkers.push(marker);
      const result = hasEventHandlers ? `data-hyperfx-hydrate="${markerIndex}"` : '';
      markerIndex++;
      return result;
    }
    
    return '';
  }

  function renderWithMarkers(node: VNode | string | ReactiveSignal<string>): string {
    if (typeof node === 'string' || typeof node === 'function') {
      return renderToString(node);
    }

    const { tag, props, children } = node;
    
    if (tag === FRAGMENT_TAG) {
      return children.map(child => renderWithMarkers(child)).join('');
    }

    // Handle reactive array containers (For components)
    if (props && props['data-reactive-for'] === 'true') {
      // Use the pre-computed children from the For component instead of re-executing the reactive function
      if (children && Array.isArray(children)) {
        const arrayHtml = children.map(child => renderWithMarkers(child)).join('');
        // This is a reactive container, so it needs hydration
        const hydrationMarker = addHydrationMarker(node);
        const tagName = String(tag);
        const baseAttributes = renderAttributes(props);
        const attributes = hydrationMarker ? `${baseAttributes} ${hydrationMarker}` : baseAttributes;
        return `<${tagName}${attributes}>${arrayHtml}</${tagName}>`;
      }
      // Fallback to empty container
      const hydrationMarker = addHydrationMarker(node);
      const tagName = String(tag);
      const baseAttributes = renderAttributes(props);
      const attributes = hydrationMarker ? `${baseAttributes} ${hydrationMarker}` : baseAttributes;
      return `<${tagName}${attributes}></${tagName}>`;
    }

    // Handle reactive expression containers
    if (props && props['data-reactive-expr'] === 'true' && (node as any).__reactiveExprFn) {
      // This is a reactive container, so it needs hydration
      const hydrationMarker = addHydrationMarker(node);
      const tagName = String(tag);
      const baseAttributes = renderAttributes(props);
      const attributes = hydrationMarker ? `${baseAttributes} ${hydrationMarker}` : baseAttributes;
      const childrenHtml = children.map(child => renderWithMarkers(child)).join('');
      return `<${tagName}${attributes}>${childrenHtml}</${tagName}>`;
    }

    // For regular elements, only add markers if they need hydration
    const hydrationMarker = addHydrationMarker(node);
    const tagName = String(tag);
    const baseAttributes = renderAttributes(props);
    const attributes = hydrationMarker ? `${baseAttributes} ${hydrationMarker}` : baseAttributes;
    const childrenHtml = children.map(child => renderWithMarkers(child)).join('');

    if (VOID_ELEMENTS.has(tagName)) {
      return `<${tagName}${attributes} />`;
    }

    return `<${tagName}${attributes}>${childrenHtml}</${tagName}>`;
  }

  const html = renderWithMarkers(vnode);
  
  return {
    html,
    hydrationData: {
      markers: hydrationMarkers,
      version: '1.0'
    }
  };
}
