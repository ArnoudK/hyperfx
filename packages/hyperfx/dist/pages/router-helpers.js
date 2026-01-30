/**
 * Universal Router Helpers for SSR and Client-Side Rendering
 *
 * This module provides abstractions over DOM operations that work in both
 * server (virtual nodes) and client (real DOM) environments.
 */
import { createVirtualFragment, createVirtualComment, createVirtualText } from '../jsx/runtime/virtual-node';
/**
 * Detect if we're in SSR mode (no document API available)
 */
export function isSSR() {
    return typeof document === 'undefined';
}
/**
 * Type guard to check if a node is a virtual node
 */
export function isVirtualNode(node) {
    return node && typeof node === 'object' && 'type' in node &&
        (node.type === 'element' || node.type === 'text' || node.type === 'fragment' || node.type === 'comment');
}
/**
 * Type guard to check if a node is a virtual fragment
 */
export function isVirtualFragment(node) {
    return node && typeof node === 'object' && node.type === 'fragment';
}
/**
 * Type guard to check if a node is a virtual element
 */
export function isVirtualElement(node) {
    return node && typeof node === 'object' && node.type === 'element';
}
/**
 * Create a fragment
 * - Client: DocumentFragment
 * - Server: VirtualFragment
 */
export function createRouterFragment() {
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
export function createRouterComment(text) {
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
export function createRouterText(text) {
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
export function appendChild(parent, child, dissolveFragments = false) {
    if (isSSR()) {
        const virtualParent = parent;
        const virtualChild = child;
        if (!virtualParent.children) {
            virtualParent.children = [];
        }
        // Context-dependent fragment handling
        if (dissolveFragments && virtualChild && isVirtualFragment(virtualChild)) {
            // Dissolve: add fragment's children directly to parent
            virtualParent.children.push(...virtualChild.children);
        }
        else {
            // Keep as container or it's not a fragment
            virtualParent.children.push(virtualChild);
        }
    }
    else {
        // Client: DOM API handles dissolution automatically
        parent.appendChild(child);
    }
}
/**
 * Insert node before reference node in parent
 *
 * @param parent - Parent container
 * @param node - Node to insert
 * @param reference - Reference node to insert before
 */
export function insertBefore(parent, node, reference) {
    if (isSSR()) {
        const virtualParent = parent;
        const virtualNode = node;
        const virtualRef = reference;
        if (!virtualParent.children) {
            virtualParent.children = [];
        }
        const refIndex = virtualParent.children.indexOf(virtualRef);
        if (refIndex === -1) {
            // Reference not found, append to end
            virtualParent.children.push(virtualNode);
        }
        else {
            // Insert before reference
            virtualParent.children.splice(refIndex, 0, virtualNode);
        }
    }
    else {
        // Client: use DOM API
        parent.insertBefore(node, reference);
    }
}
/**
 * Remove child from parent
 *
 * @param parent - Parent container
 * @param child - Child node to remove
 */
export function removeChild(parent, child) {
    if (isSSR()) {
        const virtualParent = parent;
        const virtualChild = child;
        if (virtualParent.children) {
            const index = virtualParent.children.indexOf(virtualChild);
            if (index !== -1) {
                virtualParent.children.splice(index, 1);
            }
        }
    }
    else {
        // Client: use DOM API
        parent.removeChild(child);
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
export function getParentNode(node) {
    if (isSSR()) {
        // On server, we can't track parents without additional bookkeeping
        // Return null - caller must track parent manually
        return null;
    }
    return node.parentNode;
}
/**
 * Check if a node has a parent
 *
 * @param node - Node to check
 * @returns True if node has a parent
 */
export function hasParent(node) {
    if (isSSR()) {
        // On server, we can't determine this without manual tracking
        return false;
    }
    return !!node.parentNode;
}
/**
 * Find index of node in parent's children
 *
 * @param parent - Parent container
 * @param node - Node to find
 * @returns Index of node, or -1 if not found
 */
export function indexOfChild(parent, node) {
    if (isSSR()) {
        const virtualParent = parent;
        const virtualNode = node;
        if (!virtualParent.children) {
            return -1;
        }
        return virtualParent.children.indexOf(virtualNode);
    }
    else {
        // Client: use DOM API
        const domParent = parent;
        const domNode = node;
        return Array.from(domParent.childNodes).indexOf(domNode);
    }
}
//# sourceMappingURL=router-helpers.js.map