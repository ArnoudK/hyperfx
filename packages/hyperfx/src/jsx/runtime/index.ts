// Re-export all common runtime functionality
export * from './types.js';
export * from './batching.js';
export * from './reactive.js';
export * from './attributes.js';
export * from './hydration.js';
export * from './elements.js';
export * from './children.js';
export * from './constants.js';

// Default to the client-side factory - curated exports to avoid conflicts (like Fragment)
export { jsx, jsxs, jsxDEV, createJSXElement, createElement } from './factory.js';