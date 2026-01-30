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
