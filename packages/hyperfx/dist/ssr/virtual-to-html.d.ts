/**
 * Convert virtual nodes to HTML strings for SSR
 * Pure string operations - no DOM manipulation
 */
import type { VirtualNode } from "../jsx/runtime/virtual-node";
/**
 * Escape HTML special characters to prevent XSS
 * Pure string-based implementation - no DOM needed
 */
export declare function escapeHtml(text: string): string;
/**
 * Render a virtual node to HTML string
 */
export declare function virtualNodeToHtml(node: VirtualNode): string;
