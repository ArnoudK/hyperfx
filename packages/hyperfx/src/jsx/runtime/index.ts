// Re-export all common runtime functionality
export * from './types.js';
export * from './batching.js';
export * from './reactive.js';
export * from './attributes.js';
export * from './hydration.js';
export * from './elements.js';
export * from './children.js';
export * from './constants.js';

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

export function createJSXElement(): never {
  return compilerOnlyError();
}

export function createElement(): never {
  return compilerOnlyError();
}
