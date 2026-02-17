/**
 * Template caching and creation
 */

import { LRUCache } from './cache';

type TemplateNode = Node & { t?: string; __ssr?: boolean; cloneNode: (deep?: boolean) => Node };

const TEMPLATE_CACHE_MAX_SIZE = 1000;

// Cache for parsed templates
const templateCache = new LRUCache<Node>(TEMPLATE_CACHE_MAX_SIZE);

/**
 * Create a template from HTML string
 * Templates are cached and cloned for reuse
 * 
 * Note: On server, this creates a mock node structure
 */
export function template(html: string): Node {
  // Server-side: return a simple mock that works with the string-based SSR
  if (typeof document === 'undefined') {
    const mockNode: TemplateNode = {
      t: html,
      __ssr: true,
      cloneNode: function () { return { ...this } as TemplateNode; }
    } as TemplateNode;
    return mockNode;
  }

  // Client-side: use real template caching
  let node = templateCache.get(html);

  if (!node) {
    const template = document.createElement('template');
    template.innerHTML = html;
    node = template.content.firstChild!;
    templateCache.set(html, node);
  }

  return node.cloneNode(true);
}
