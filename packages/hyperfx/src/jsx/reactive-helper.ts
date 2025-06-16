// Simple reactive array helper for JSX
import { VNode } from "../elem/elem";
import { ReactiveSignal, createEffect } from "../reactive/state";

/**
 * Create a reactive array expression that updates when the signal changes
 * Usage: {reactive(() => featureList().map(...))}
 */
export function reactive<T>(expression: () => T): (() => T) {
  // Mark the function with a special property so hydration can detect it
  const reactiveExpr = expression;
  (reactiveExpr as any).__isReactiveExpression = true;
  return reactiveExpr;
}
