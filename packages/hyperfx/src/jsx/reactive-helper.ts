// Simple reactive array helper for JSX with improved types
import { VNode } from "../elem/elem";
import { ReactiveSignal, ComputedSignal, createEffect } from "../reactive/state";

// Type for reactive expressions that can be detected during hydration
export interface ReactiveExpression<T> {
  (): T;
  __isReactiveExpression: true;
}

/**
 * Create a reactive array expression that updates when the signal changes
 * Usage: {reactive(() => featureList().map(...))}
 */
export function reactive<T>(expression: () => T): ReactiveExpression<T> {
  // Mark the function with a special property so hydration can detect it
  const reactiveExpr = expression as ReactiveExpression<T>;
  reactiveExpr.__isReactiveExpression = true;
  return reactiveExpr;
}

/**
 * Type guard to check if a function is a reactive expression
 */
export function isReactiveExpression<T = any>(fn: unknown): fn is ReactiveExpression<T> {
  return typeof fn === 'function' && '__isReactiveExpression' in fn && fn.__isReactiveExpression === true;
}
