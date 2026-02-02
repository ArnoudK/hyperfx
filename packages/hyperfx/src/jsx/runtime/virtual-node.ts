/**
 * Virtual representation of DOM nodes for server-side rendering
 * These implement DOM-like interfaces so they're type-compatible with real DOM nodes
 * No actual DOM objects - just data structures that can be converted to HTML strings
 */

// Internal marker to identify virtual nodes
const VIRTUAL_NODE_MARKER = Symbol.for('hyperfx.virtual');

/**
 * Virtual element node (e.g., <div>, <span>)
 * Implements a subset of HTMLElement interface for type compatibility
 */
export interface VirtualElement {
  readonly [VIRTUAL_NODE_MARKER]: true;
  readonly nodeType: 1; // ELEMENT_NODE
  readonly nodeName: string;
  readonly tagName: string;
  // childNodes appears readonly from outside, but internally mutable
  readonly childNodes: VirtualNode[];
  textContent: string | null;
  // Internal properties for rendering
  readonly _props: Record<string, any>;
}

/**
 * Virtual text node
 * Implements a subset of Text interface for type compatibility
 */
export interface VirtualText {
  readonly [VIRTUAL_NODE_MARKER]: true;
  readonly nodeType: 3; // TEXT_NODE
  readonly nodeName: '#text';
  textContent: string;
  data: string;
}

/**
 * Virtual fragment (<>...</>)
 * Implements a subset of DocumentFragment interface for type compatibility
 */
export interface VirtualFragment {
  readonly [VIRTUAL_NODE_MARKER]: true;
  readonly nodeType: 11; // DOCUMENT_FRAGMENT_NODE
  readonly nodeName: '#document-fragment';
  // childNodes appears readonly from outside, but internally mutable
  readonly childNodes: VirtualNode[];
  textContent: string | null;
}

/**
 * Virtual comment node
 * Implements a subset of Comment interface for type compatibility
 */
export interface VirtualComment {
  readonly [VIRTUAL_NODE_MARKER]: true;
  readonly nodeType: 8; // COMMENT_NODE
  readonly nodeName: '#comment';
  textContent: string;
  data: string;
}

/**
 * Union type of all virtual node types
 * Now compatible with Node | null type
 */
export type VirtualNode = VirtualElement | VirtualText | VirtualFragment | VirtualComment | null;

/**
 * Type guard to check if a node is a virtual node (only works at runtime on server)
 */
export function isVirtualNode(node: any): node is VirtualElement | VirtualText | VirtualFragment | VirtualComment {
  return node && typeof node === 'object' && VIRTUAL_NODE_MARKER in node;
}

/**
 * Helper to get mutable children array from a virtual parent node
 * @internal
 */
export function getMutableChildren(node: VirtualElement | VirtualFragment): VirtualNode[] {
  return node.childNodes as VirtualNode[];
}

/**
 * Create a virtual element node
 */
export function createVirtualElement(
  tag: string,
  props: Record<string, any> | null,
  children: VirtualNode[]
): VirtualElement {
  const tagUpper = tag.toUpperCase();
  const element: VirtualElement = {
    [VIRTUAL_NODE_MARKER]: true,
    nodeType: 1,
    nodeName: tagUpper,
    tagName: tagUpper,
    childNodes: children,
    _props: props || {},
    get textContent(): string | null {
      return this.childNodes.map(child => {
        if (!child) return '';
        if ('textContent' in child) return child.textContent || '';
        return '';
      }).join('');
    },
    set textContent(_value: string | null) {
      // Readonly for virtual nodes
    }
  };
  return element;
}

/**
 * Create a virtual text node
 */
export function createVirtualText(content: string): VirtualText {
  return {
    [VIRTUAL_NODE_MARKER]: true,
    nodeType: 3,
    nodeName: '#text',
    textContent: content,
    data: content
  };
}

/**
 * Create a virtual fragment
 */
export function createVirtualFragment(children: VirtualNode[]): VirtualFragment {
  const fragment: VirtualFragment = {
    [VIRTUAL_NODE_MARKER]: true,
    nodeType: 11,
    nodeName: '#document-fragment',
    childNodes: children,
    get textContent(): string | null {
      return this.childNodes.map(child => {
        if (!child) return '';
        if ('textContent' in child) return child.textContent || '';
        return '';
      }).join('');
    },
    set textContent(_value: string | null) {
      // Readonly for virtual nodes
    }
  };
  return fragment;
}

/**
 * Create a virtual comment node
 */
export function createVirtualComment(content: string): VirtualComment {
  return {
    [VIRTUAL_NODE_MARKER]: true,
    nodeType: 8,
    nodeName: '#comment',
    textContent: content,
    data: content
  };
}
