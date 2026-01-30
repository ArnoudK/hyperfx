/**
 * Server-side JSX runtime for HyperFX
 * 
 * This runtime creates virtual nodes instead of real DOM elements.
 * It completely avoids the need for happy-dom or any DOM polyfills.
 * 
 * The virtual nodes are lightweight JavaScript objects that can be
 * efficiently converted to HTML strings for server-side rendering.
 * 
 * This file is automatically used when running in Node.js thanks to
 * the "node" condition in package.json exports.
 */

export { jsx, jsxs, createElement } from './runtime/server-factory';
export { Fragment } from './runtime/elements';
export type { VirtualNode, VirtualElement, VirtualText, VirtualFragment, VirtualComment } from './runtime/virtual-node';

// jsxDEV is the same as jsx for server runtime (no dev-specific behavior needed)
export { jsx as jsxDEV } from './runtime/server-factory';
