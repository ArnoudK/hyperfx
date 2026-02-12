// Additional JSX Type Utilities
import { Accessor } from '../reactive/signal';
import { JSXChildren, JSXElement, ComponentProps } from './jsx-runtime';

/**
 * Utility type to extract props from a component
 */
export type ComponentPropsOf<T> = T extends (props: infer P) => JSXElement ? P : never;

/**
 * Utility type to make all props optional except children
 */
export type OptionalProps<T> = Partial<T> & { children?: JSXChildren };

/**
 * Utility type for components that require children
 */
export type WithChildren<T = {}> = T & { children: JSXChildren };

/**
 * Utility type for components that explicitly don't accept children
 */
export type WithoutChildren<T = {}> = T & { children?: never };

/**
 * Utility type for components with a key prop
 */
export type WithKey<T = {}> = T & { key?: string | number };

/**
 * Utility type to make a prop reactive
 */
export type Reactive<T> = T | Accessor<T>;

/**
 * Utility type for reactive children that can be used in JSX
 */
export type ReactiveChildren = 
   | JSXChildren
   | Accessor<string>
   | Accessor<number>
   | Accessor<boolean>
   | Accessor<JSXElement>
   | Accessor<JSXElement[]>;

/**
 * Utility type to make all props of an object potentially reactive
 */
export type ReactiveProps<T> = {
   [K in keyof T]: Reactive<T[K]>;
 };

/**
 * Type guard to check if a value is a valid JSX element
 */
export function isJSXElement(value: unknown): value is JSXElement {
   return value instanceof HTMLElement || 
          value instanceof DocumentFragment || 
          value instanceof Text || 
          value instanceof Comment;
 }

/**
 * Type guard to check if a value is valid JSX children
 */
export function isValidJSXChild(value: unknown): value is JSXChildren {
   if (value === null || 
       value === undefined || 
       typeof value === 'boolean') {
     return true;
   }
   
   if (typeof value === 'string' || 
       typeof value === 'number') {
     return true;
   }
   
   if (isJSXElement(value)) {
     return true;
   }
   
   if (typeof value === 'function') {
     // Assume it's a reactive signal
     return true;
   }
   
   if (Array.isArray(value)) {
     return value.every(isValidJSXChild);
   }
   
   return false;
 }

/**
 * Check if children contain reactive signals
 */
export function hasReactiveChildren(children: JSXChildren): boolean {
   if (!children) return false;
   
   if (Array.isArray(children)) {
     return children.some(child => 
       typeof child === 'function' || hasReactiveChildren(child)
     );
   }
   
   return typeof children === 'function';
 }

/**
 * Utility type for event handler props
 */
export type EventHandlerProps<T extends keyof HTMLElementEventMap = keyof HTMLElementEventMap> = {
   [K in T as `on${Capitalize<K>}`]?: (event: HTMLElementEventMap[K]) => void;
 };

/**
 * Utility type for a component that accepts ref
 */
export type WithRef<T, RefType = HTMLElement> = T & {
   ref?: (element: RefType) => void;
 };

/**
 * Utility to create a strongly typed component
 */
export function defineComponent<P>(
   component: (props: ComponentProps<P>) => JSXElement
): (props: ComponentProps<P>) => JSXElement {
   return component;
 }
