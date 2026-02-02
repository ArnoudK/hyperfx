/**
 * Virtual representation of DOM nodes for server-side rendering
 * These implement DOM-like interfaces so they're type-compatible with real DOM nodes
 * No actual DOM objects - just data structures that can be converted to HTML strings
 */
declare const VIRTUAL_NODE_MARKER: unique symbol;
/**
 * Virtual element node (e.g., <div>, <span>)
 * Implements a subset of HTMLElement interface for type compatibility
 */
export interface VirtualElement {
    readonly [VIRTUAL_NODE_MARKER]: true;
    readonly nodeType: 1;
    readonly nodeName: string;
    readonly tagName: string;
    readonly childNodes: VirtualNode[];
    textContent: string | null;
    readonly _props: Record<string, any>;
}
/**
 * Virtual text node
 * Implements a subset of Text interface for type compatibility
 */
export interface VirtualText {
    readonly [VIRTUAL_NODE_MARKER]: true;
    readonly nodeType: 3;
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
    readonly nodeType: 11;
    readonly nodeName: '#document-fragment';
    readonly childNodes: VirtualNode[];
    textContent: string | null;
}
/**
 * Virtual comment node
 * Implements a subset of Comment interface for type compatibility
 */
export interface VirtualComment {
    readonly [VIRTUAL_NODE_MARKER]: true;
    readonly nodeType: 8;
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
export declare function isVirtualNode(node: any): node is VirtualElement | VirtualText | VirtualFragment | VirtualComment;
/**
 * Helper to get mutable children array from a virtual parent node
 * @internal
 */
export declare function getMutableChildren(node: VirtualElement | VirtualFragment): VirtualNode[];
/**
 * Create a virtual element node
 */
export declare function createVirtualElement(tag: string, props: Record<string, any> | null, children: VirtualNode[]): VirtualElement;
/**
 * Create a virtual text node
 */
export declare function createVirtualText(content: string): VirtualText;
/**
 * Create a virtual fragment
 */
export declare function createVirtualFragment(children: VirtualNode[]): VirtualFragment;
/**
 * Create a virtual comment node
 */
export declare function createVirtualComment(content: string): VirtualComment;
export {};
