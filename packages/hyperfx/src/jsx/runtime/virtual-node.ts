/**
 * Virtual representation of DOM nodes for server-side rendering
 * No actual DOM objects - just data structures that can be converted to HTML strings
 */

export type VirtualNodeType = string | Function;

/**
 * Virtual element node (e.g., <div>, <span>)
 */
export interface VirtualElement {
  type: 'element';
  tag: string;
  props: Record<string, any>;
  children: VirtualNode[];
}

/**
 * Virtual text node
 */
export interface VirtualText {
  type: 'text';
  content: string;
}

/**
 * Virtual fragment (<>...</>)
 */
export interface VirtualFragment {
  type: 'fragment';
  children: VirtualNode[];
}

/**
 * Virtual comment node
 */
export interface VirtualComment {
  type: 'comment';
  content: string;
}

/**
 * Union type of all virtual node types
 */
export type VirtualNode = VirtualElement | VirtualText | VirtualFragment | VirtualComment | null;

/**
 * Create a virtual element node
 */
export function createVirtualElement(
  tag: string,
  props: Record<string, any> | null,
  children: VirtualNode[]
): VirtualElement {
  return {
    type: 'element',
    tag,
    props: props || {},
    children
  };
}

/**
 * Create a virtual text node
 */
export function createVirtualText(content: string): VirtualText {
  return {
    type: 'text',
    content
  };
}

/**
 * Create a virtual fragment
 */
export function createVirtualFragment(children: VirtualNode[]): VirtualFragment {
  return {
    type: 'fragment',
    children
  };
}

/**
 * Create a virtual comment node
 */
export function createVirtualComment(content: string): VirtualComment {
  return {
    type: 'comment',
    content
  };
}
