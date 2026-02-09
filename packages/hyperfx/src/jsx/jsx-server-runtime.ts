/**
 * Server-side JSX runtime for HyperFX - Pure String Implementation
 * NO VIRTUAL DOM EVER
 */

export { jsx, jsxs, createElement, Fragment, marker } from './runtime/server-factory.js';

// jsxDEV is the same as jsx for server runtime
export { jsx as jsxDEV } from './runtime/server-factory.js';
