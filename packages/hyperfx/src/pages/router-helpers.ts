/**
 * Universal Router Helpers for SSR and Client-Side Rendering
 * 
 * This module provides abstractions over DOM operations that work in both
 * server (virtual nodes) and client (real DOM) environments.
 */

import type { 
  VirtualNode, 
  VirtualFragment, 
  VirtualComment, 
  VirtualText,
  VirtualElement 
} from '../jsx/runtime/virtual-node';
import { 
  createVirtualFragment, 
  createVirtualComment, 
  createVirtualText 
} from '../jsx/runtime/virtual-node';

/**
 * Detect if we're in SSR mode (no document API available)
 */
export function isSSR(): boolean {
  return typeof document === 'undefined';
}

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
export function isVirtualNode(node: any): node is VirtualNode {
  return node && typeof node === 'object' && 'type' in node && 
    (node.type === 'element' || node.type === 'text' || node.type === 'fragment' || node.type === 'comment');
}

/**
 * Type guard to check if a node is a virtual fragment
 */
export function isVirtualFragment(node: any): node is VirtualFragment {
  return node && typeof node === 'object' && node.type === 'fragment';
}

/**
 * Type guard to check if a node is a virtual element
 */
export function isVirtualElement(node: any): node is VirtualElement {
  return node && typeof node === 'object' && node.type === 'element';
}

/**
 * Create a fragment
 * - Client: DocumentFragment
 * - Server: VirtualFragment
 */
export function createRouterFragment(): UniversalFragment {
  if (isSSR()) {
    return createVirtualFragment([]);
  }
  return document.createDocumentFragment();
}

/**
 * Create a comment node
 * - Client: Comment
 * - Server: VirtualComment
 */
export function createRouterComment(text: string): UniversalComment {
  if (isSSR()) {
    return createVirtualComment(text);
  }
  return document.createComment(text);
}

/**
 * Create a text node
 * - Client: Text
 * - Server: VirtualText
 */
export function createRouterText(text: string): UniversalText {
  if (isSSR()) {
    return createVirtualText(text);
  }
  return document.createTextNode(text);
}

/**
 * Append child to parent
 * 
 * @param parent - Parent container
 * @param child - Child node to append
 * @param dissolveFragments - If true, dissolve fragments (add children directly)
 */
export function appendChild(
  parent: UniversalContainer,
  child: UniversalNode,
  dissolveFragments = false
): void {
  if (isSSR()) {
    const virtualParent = parent as VirtualFragment | VirtualElement;
    const virtualChild = child as VirtualNode;
    
    if (!virtualParent.children) {
      virtualParent.children = [];
    }
    
    // Context-dependent fragment handling
    if (dissolveFragments && virtualChild && isVirtualFragment(virtualChild)) {
      // Dissolve: add fragment's children directly to parent
      virtualParent.children.push(...virtualChild.children);
    } else {
      // Keep as container or it's not a fragment
      virtualParent.children.push(virtualChild);
    }
  } else {
    // Client: DOM API handles dissolution automatically
    (parent as Node).appendChild(child as Node);
  }
}

/**
 * Insert node before reference node in parent
 * 
 * @param parent - Parent container
 * @param node - Node to insert
 * @param reference - Reference node to insert before
 */
export function insertBefore(
  parent: UniversalContainer,
  node: UniversalNode,
  reference: UniversalNode
): void {
  if (isSSR()) {
    const virtualParent = parent as VirtualFragment | VirtualElement;
    const virtualNode = node as VirtualNode;
    const virtualRef = reference as VirtualNode;
    
    if (!virtualParent.children) {
      virtualParent.children = [];
    }
    
    const refIndex = virtualParent.children.indexOf(virtualRef);
    if (refIndex === -1) {
      // Reference not found, append to end
      virtualParent.children.push(virtualNode);
    } else {
      // Insert before reference
      virtualParent.children.splice(refIndex, 0, virtualNode);
    }
  } else {
    // Client: use DOM API
    (parent as Node).insertBefore(node as Node, reference as Node);
  }
}

/**
 * Remove child from parent
 * 
 * @param parent - Parent container
 * @param child - Child node to remove
 */
export function removeChild(
  parent: UniversalContainer,
  child: UniversalNode
): void {
  if (isSSR()) {
    const virtualParent = parent as VirtualFragment | VirtualElement;
    const virtualChild = child as VirtualNode;
    
    if (virtualParent.children) {
      const index = virtualParent.children.indexOf(virtualChild);
      if (index !== -1) {
        virtualParent.children.splice(index, 1);
      }
    }
  } else {
    // Client: use DOM API
    (parent as Node).removeChild(child as Node);
  }
}

/**
 * Get parent node
 * 
 * Note: On server, virtual nodes don't track parents automatically.
 * Returns null in SSR mode - parent tracking must be done manually.
 * 
 * @param node - Node to get parent of
 * @returns Parent node or null
 */
export function getParentNode(node: UniversalNode): UniversalContainer | null {
  if (isSSR()) {
    // On server, we can't track parents without additional bookkeeping
    // Return null - caller must track parent manually
    return null;
  }
  return (node as Node).parentNode as UniversalContainer | null;
}

/**
 * Check if a node has a parent
 * 
 * @param node - Node to check
 * @returns True if node has a parent
 */
export function hasParent(node: UniversalNode): boolean {
  if (isSSR()) {
    // On server, we can't determine this without manual tracking
    return false;
  }
  return !!(node as Node).parentNode;
}

/**
 * Find index of node in parent's children
 * 
 * @param parent - Parent container
 * @param node - Node to find
 * @returns Index of node, or -1 if not found
 */
export function indexOfChild(
  parent: UniversalContainer,
  node: UniversalNode
): number {
  if (isSSR()) {
    const virtualParent = parent as VirtualFragment | VirtualElement;
    const virtualNode = node as VirtualNode;
    
    if (!virtualParent.children) {
      return -1;
    }
    
    return virtualParent.children.indexOf(virtualNode);
  } else {
    // Client: use DOM API
    const domParent = parent as Node & ParentNode;
    const domNode = node as ChildNode;
    
    return Array.from(domParent.childNodes).indexOf(domNode as ChildNode);
  }
}
