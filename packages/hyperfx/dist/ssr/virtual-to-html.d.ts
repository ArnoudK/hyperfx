/**
 * Convert virtual nodes to HTML strings for SSR
 * Pure string operations - no DOM manipulation
 */
import type { VirtualNode } from "../jsx/runtime/virtual-node";
type NodeIdGenerator = () => string;
/**
 * Set the node ID generator function
 * Used by render.ts to inject createNodeId
 */
export declare function setNodeIdGenerator(generator: NodeIdGenerator | null): void;
/**
 * Escape HTML special characters to prevent XSS
 * Pure string-based implementation - no DOM needed
 */
export declare function escapeHtml(text: string): string;
/**
 * Render a virtual node to HTML string
 * Works with DOM-compatible virtual nodes using nodeType
 */
export declare function virtualNodeToHtml(node: VirtualNode): string;
export {};
