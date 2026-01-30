/**
 * Universal Router Helpers for SSR and Client-Side Rendering
 *
 * This module provides abstractions over DOM operations that work in both
 * server (virtual nodes) and client (real DOM) environments.
 */
import type { VirtualNode, VirtualFragment, VirtualComment, VirtualText, VirtualElement } from '../jsx/runtime/virtual-node';
/**
 * Detect if we're in SSR mode (no document API available)
 */
export declare function isSSR(): boolean;
/**
 * Universal types that work on both client and server
 */
export type UniversalFragment = DocumentFragment | VirtualFragment;
export type UniversalComment = Comment | VirtualComment;
export type UniversalText = Text | VirtualText;
export type UniversalElement = HTMLElement | VirtualElement;
export type UniversalNode = Node | VirtualNode;
export type UniversalContainer = (Node & ParentNode) | VirtualFragment | VirtualElement;
/**
 * Type guard to check if a node is a virtual node
 */
export declare function isVirtualNode(node: any): node is VirtualNode;
/**
 * Type guard to check if a node is a virtual fragment
 */
export declare function isVirtualFragment(node: any): node is VirtualFragment;
/**
 * Type guard to check if a node is a virtual element
 */
export declare function isVirtualElement(node: any): node is VirtualElement;
/**
 * Create a fragment
 * - Client: DocumentFragment
 * - Server: VirtualFragment
 */
export declare function createRouterFragment(): UniversalFragment;
/**
 * Create a comment node
 * - Client: Comment
 * - Server: VirtualComment
 */
export declare function createRouterComment(text: string): UniversalComment;
/**
 * Create a text node
 * - Client: Text
 * - Server: VirtualText
 */
export declare function createRouterText(text: string): UniversalText;
/**
 * Append child to parent
 *
 * @param parent - Parent container
 * @param child - Child node to append
 * @param dissolveFragments - If true, dissolve fragments (add children directly)
 */
export declare function appendChild(parent: UniversalContainer, child: UniversalNode, dissolveFragments?: boolean): void;
/**
 * Insert node before reference node in parent
 *
 * @param parent - Parent container
 * @param node - Node to insert
 * @param reference - Reference node to insert before
 */
export declare function insertBefore(parent: UniversalContainer, node: UniversalNode, reference: UniversalNode): void;
/**
 * Remove child from parent
 *
 * @param parent - Parent container
 * @param child - Child node to remove
 */
export declare function removeChild(parent: UniversalContainer, child: UniversalNode): void;
/**
 * Get parent node
 *
 * Note: On server, virtual nodes don't track parents automatically.
 * Returns null in SSR mode - parent tracking must be done manually.
 *
 * @param node - Node to get parent of
 * @returns Parent node or null
 */
export declare function getParentNode(node: UniversalNode): UniversalContainer | null;
/**
 * Check if a node has a parent
 *
 * @param node - Node to check
 * @returns True if node has a parent
 */
export declare function hasParent(node: UniversalNode): boolean;
/**
 * Find index of node in parent's children
 *
 * @param parent - Parent container
 * @param node - Node to find
 * @returns Index of node, or -1 if not found
 */
export declare function indexOfChild(parent: UniversalContainer, node: UniversalNode): number;
