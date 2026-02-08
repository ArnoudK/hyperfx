/**
 * Universal node creation helpers for SSR and client-side rendering
 * NO VIRTUAL DOM EVER
 */
import { SSRNode } from "../../ssr/render";
/**
 * Detect if we're in SSR mode
 */
export declare function isSSR(): boolean;
/**
 * Universal types that work on both client and server
 */
export type UniversalFragment = DocumentFragment | SSRNode;
export type UniversalComment = Comment | SSRNode;
export type UniversalText = Text | SSRNode;
/**
 * Create a fragment
 */
export declare function createUniversalFragment(): UniversalFragment;
/**
 * Create a comment
 */
export declare function createUniversalComment(text: string): UniversalComment;
/**
 * Create a text node
 */
export declare function createUniversalText(text: string): UniversalText;
