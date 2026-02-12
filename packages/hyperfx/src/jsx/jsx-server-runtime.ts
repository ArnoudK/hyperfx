/**
 * Server-side JSX runtime for HyperFX - Pure String Implementation
 * NO VIRTUAL DOM EVER
 */

export { Fragment, marker } from './runtime/server-factory.js';

function compilerOnlyError(): never {
  throw new Error('HyperFX requires compilation. The runtime JSX factory is not supported.');
}

export function jsx(): never {
  return compilerOnlyError();
}

export function jsxs(): never {
  return compilerOnlyError();
}

export function jsxDEV(): never {
  return compilerOnlyError();
}

export function createElement(): never {
  return compilerOnlyError();
}
