/**
 * Universal node creation helpers for SSR and client-side rendering
 * NO VIRTUAL DOM EVER
 */
import { escapeHtml } from "../../ssr/render";
/**
 * Detect if we're in SSR mode
 */
export function isSSR() {
    return typeof document === 'undefined';
}
/**
 * Create a fragment
 */
export function createUniversalFragment() {
    if (isSSR()) {
        const fragment = {
            t: '',
            __ssr: true,
            childNodes: [],
            appendChild(n) {
                this.childNodes.push(n);
                this.t += (n && n.__ssr) ? n.t : escapeHtml(String(n));
                return n;
            },
            removeChild(n) {
                const idx = this.childNodes.indexOf(n);
                if (idx !== -1) {
                    this.childNodes.splice(idx, 1);
                    // Rebuild t
                    this.t = this.childNodes.map((c) => (c && c.__ssr) ? c.t : escapeHtml(String(c))).join('');
                }
                return n;
            },
            insertBefore(newNode, referenceNode) {
                if (referenceNode) {
                    const index = this.childNodes.indexOf(referenceNode);
                    if (index !== -1) {
                        this.childNodes.splice(index, 0, newNode);
                    }
                    else {
                        this.childNodes.push(newNode);
                    }
                }
                else {
                    this.childNodes.push(newNode);
                }
                // Rebuild t
                this.t = this.childNodes.map((c) => (c && c.__ssr) ? c.t : escapeHtml(String(c))).join('');
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
export function createUniversalComment(text) {
    if (isSSR()) {
        return {
            t: `<!--${escapeHtml(text)}-->`,
            __ssr: true,
            textContent: text,
            nodeType: 8,
            cloneNode() { return { ...this }; }
        };
    }
    return document.createComment(text);
}
/**
 * Create a text node
 */
export function createUniversalText(text) {
    if (isSSR()) {
        return {
            t: escapeHtml(text),
            __ssr: true,
            textContent: text,
            nodeType: 3,
            cloneNode() { return { ...this }; }
        };
    }
    return document.createTextNode(text);
}
//# sourceMappingURL=universal-node.js.map