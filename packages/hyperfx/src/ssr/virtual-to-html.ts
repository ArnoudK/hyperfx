/**
 * Convert virtual nodes to HTML strings for SSR
 * Pure string operations - no DOM manipulation
 */

import type { VirtualNode, VirtualElement } from "../jsx/runtime/virtual-node";

// HTML void elements that should not have closing tags
const VOID_ELEMENTS = new Set([
  'area', 'base', 'br', 'col', 'embed', 'hr', 'img', 'input',
  'link', 'meta', 'param', 'source', 'track', 'wbr'
]);

// HTML boolean attributes
const BOOLEAN_ATTRIBUTES = new Set([
  'autofocus', 'autoplay', 'async', 'checked', 'controls', 'defer',
  'disabled', 'hidden', 'loop', 'multiple', 'muted', 'open',
  'readonly', 'required', 'reversed', 'selected'
]);

/**
 * Escape HTML special characters to prevent XSS
 * Pure string-based implementation - no DOM needed
 */
export function escapeHtml(text: string): string {
  return text
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

/**
 * Check if an attribute is an event handler
 */
function isEventHandler(attr: string): boolean {
  return attr.startsWith('on') && attr.length > 2;
}

/**
 * Convert style object to CSS string
 */
function styleToString(style: Record<string, string | number> | string): string {
  if (typeof style === 'string') {
    return style;
  }

  return Object.entries(style)
    .map(([key, value]) => {
      // Convert camelCase to kebab-case
      const cssKey = key.replace(/([A-Z])/g, '-$1').toLowerCase();
      return `${cssKey}: ${value}`;
    })
    .join('; ');
}

/**
 * Render props/attributes to HTML string
 */
function renderAttributes(props: Record<string, any>): string {
  let result = '';

  for (const [key, value] of Object.entries(props)) {
    // Skip special props
    if (key === 'children' || key === 'key' || key === 'ref') {
      continue;
    }

    // Skip event handlers in SSR (they'll be reattached on client)
    if (isEventHandler(key)) {
      continue;
    }

    // Handle className -> class conversion
    const attrName = key === 'className' ? 'class' : key;

    // Handle boolean attributes
    if (BOOLEAN_ATTRIBUTES.has(attrName)) {
      if (value) {
        result += ` ${attrName}`;
      }
      continue;
    }

    // Handle style attribute
    if (attrName === 'style' && typeof value === 'object') {
      const styleStr = styleToString(value);
      if (styleStr) {
        result += ` style="${escapeHtml(styleStr)}"`;
      }
      continue;
    }

    // Render attribute with value
    if (value != null && value !== false) {
      const attrValue = String(value);
      result += ` ${attrName}="${escapeHtml(attrValue)}"`;
    }
  }

  return result;
}

/**
 * Render a virtual node to HTML string
 */
export function virtualNodeToHtml(node: VirtualNode): string {
  if (node == null) {
    return '';
  }

  switch (node.type) {
    case 'text':
      return escapeHtml(node.content);

    case 'comment':
      return `<!--${escapeHtml(node.content)}-->`;

    case 'fragment':
      return node.children.map(virtualNodeToHtml).join('');

    case 'element': {
      const { tag, props, children } = node;
      const tagLower = tag.toLowerCase();

      // Start tag
      let html = `<${tagLower}`;

      // Attributes
      html += renderAttributes(props);

      // Self-closing/void elements
      if (VOID_ELEMENTS.has(tagLower)) {
        html += '>';
        return html;
      }

      html += '>';

      // Children
      html += children.map(virtualNodeToHtml).join('');

      // Close tag
      html += `</${tagLower}>`;

      return html;
    }

    default:
      return '';
  }
}
