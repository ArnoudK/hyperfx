// Re-export client-side JSX runtime
export * from './runtime/index.js';

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
