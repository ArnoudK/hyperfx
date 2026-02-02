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
  createVirtualText,
  isVirtualNode,
  getMutableChildren
} from '../jsx/runtime/virtual-node';

/**
 * Detect if we're in SSR mode (no document API available)
 */
export function isSSR(): boolean {
  return typeof document === 'undefined';
}

/**
 * Universal types that work on both client and server
 * Since VirtualNodes implement DOM interfaces, these can be simplified
 */
export type UniversalFragment = DocumentFragment;
export type UniversalComment = Comment;
export type UniversalText = Text;
export type UniversalElement = HTMLElement;
export type UniversalNode = Node | null;
export type UniversalContainer = (Node & ParentNode);

/**
 * Type guard to check if a node is a virtual fragment
 */
export function isVirtualFragment(node: any): node is VirtualFragment {
  return node && typeof node === 'object' && node.nodeType === 11;
}

/**
 * Type guard to check if a node is a virtual element
 */
export function isVirtualElement(node: any): node is VirtualElement {
  return node && typeof node === 'object' && node.nodeType === 1;
}

/**
 * Create a fragment
 * - Client: DocumentFragment
 * - Server: VirtualFragment (DOM-compatible)
 */
export function createRouterFragment(): UniversalFragment {
  if (isSSR()) {
    return createVirtualFragment([]) as unknown as DocumentFragment;
  }
  return document.createDocumentFragment();
}

/**
 * Create a comment node
 * - Client: Comment
 * - Server: VirtualComment (DOM-compatible)
 */
export function createRouterComment(text: string): UniversalComment {
  if (isSSR()) {
    return createVirtualComment(text) as unknown as Comment;
  }
  return document.createComment(text);
}

/**
 * Create a text node
 * - Client: Text
 * - Server: VirtualText (DOM-compatible)
 */
export function createRouterText(text: string): UniversalText {
  if (isSSR()) {
    return createVirtualText(text) as unknown as Text;
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
    const virtualParent = parent as unknown as VirtualFragment | VirtualElement;
    const virtualChild = child as VirtualNode;
    
    const parentChildren = getMutableChildren(virtualParent);
    
    // Context-dependent fragment handling
    if (dissolveFragments && virtualChild && isVirtualFragment(virtualChild)) {
      // Dissolve: add fragment's children directly to parent
      const fragmentChildren = getMutableChildren(virtualChild as VirtualFragment);
      for (let i = 0; i < fragmentChildren.length; i++) {
        const child = fragmentChildren[i];
        if (child !== undefined) {
          parentChildren.push(child);
        }
      }
    } else {
      // Keep as container or it's not a fragment
      parentChildren.push(virtualChild);
    }
  } else {
    // Client: DOM API handles dissolution automatically
    parent.appendChild(child as Node);
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
    const virtualParent = parent as unknown as VirtualFragment | VirtualElement;
    const virtualNode = node as VirtualNode;
    const virtualRef = reference as VirtualNode;
    
    const children = getMutableChildren(virtualParent);
    
    const refIndex = children.indexOf(virtualRef);
    if (refIndex === -1) {
      // Reference not found, append to end
      children.push(virtualNode);
    } else {
      // Insert before reference
      children.splice(refIndex, 0, virtualNode);
    }
  } else {
    // Client: use DOM API
    parent.insertBefore(node as Node, reference as Node);
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
    const virtualParent = parent as unknown as VirtualFragment | VirtualElement;
    const virtualChild = child as VirtualNode;
    
    const children = getMutableChildren(virtualParent);
    const index = children.indexOf(virtualChild);
    if (index !== -1) {
      children.splice(index, 1);
    }
  } else {
    // Client: use DOM API
    parent.removeChild(child as Node);
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
    const virtualParent = parent as unknown as VirtualFragment | VirtualElement;
    const virtualNode = node as VirtualNode;
    
    const children = getMutableChildren(virtualParent);
    return children.indexOf(virtualNode);
  } else {
    // Client: use DOM API
    const domParent = parent as Node & ParentNode;
    const domNode = node as ChildNode;
    
    return Array.from(domParent.childNodes).indexOf(domNode as ChildNode);
  }
}

// Re-export isVirtualNode from virtual-node for convenience
export { isVirtualNode };
