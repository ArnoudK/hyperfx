/**
 * Universal node creation helpers for SSR and client-side rendering
 * NO VIRTUAL DOM EVER
 */

import { escapeHtml, SSRNode } from "../../ssr/render";

/**
 * Detect if we're in SSR mode
 */
export function isSSR(): boolean {
  return typeof document === 'undefined';
}

/**
 * Universal types that work on both client and server
 */
export type UniversalFragment = DocumentFragment | SSRNode;
export type UniversalComment = Comment | SSRNode;
export type UniversalText = Text | SSRNode;

/**
 * Create a fragment
 */
export function createUniversalFragment(): UniversalFragment {
  if (isSSR()) {
    const fragment: SSRNode = {
      t: '',
      __ssr: true,
      childNodes: [] as SSRNode[],
      appendChild(n: SSRNode) {
        this.childNodes!.push(n);
        this.t += (n && n.__ssr) ? n.t : escapeHtml(String(n));
        return n;
      },
      removeChild(n: SSRNode) {
        const idx = this.childNodes!.indexOf(n);
        if (idx !== -1) {
          this.childNodes!.splice(idx, 1);
          // Rebuild t
          this.t = this.childNodes!.map((c) => (c && c.__ssr) ? c.t : escapeHtml(String(c))).join('');
        }
        return n;
      },
      insertBefore(newNode: SSRNode, referenceNode: SSRNode | null) {
        if (referenceNode) {
          const index = this.childNodes!.indexOf(referenceNode);
          if (index !== -1) {
            this.childNodes!.splice(index, 0, newNode);
          } else {
            this.childNodes!.push(newNode);
          }
        } else {
          this.childNodes!.push(newNode);
        }
        // Rebuild t
        this.t = this.childNodes!.map((c) => (c && c.__ssr) ? c.t : escapeHtml(String(c))).join('');
        return newNode;
      },
      cloneNode() {
        return {
          ...this,
          childNodes: this.childNodes ? [...this.childNodes] : []
        };
      }
    };
    return fragment;
  }
  return document.createDocumentFragment();
}

/**
 * Create a comment
 */
export function createUniversalComment(text: string): UniversalComment {
  if (isSSR()) {
    return {
      t: `<!--${escapeHtml(text)}-->`,
      __ssr: true,
      textContent: text,
      nodeType: 8,
      cloneNode() { return { ...this }; }
    } as SSRNode;
  }
  return document.createComment(text);
}

/**
 * Create a text node
 */
export function createUniversalText(text: string): UniversalText {
  if (isSSR()) {
    return {
      t: escapeHtml(text),
      __ssr: true,
      textContent: text,
      nodeType: 3,
      cloneNode() { return { ...this }; }
    } as SSRNode;
  }
  return document.createTextNode(text);
}
