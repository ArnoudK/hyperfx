import type { JSXElement, JSXChildren } from "../jsx/jsx-runtime";
/**
 * Context API for HyperFX
 *
 * Provides a way to pass data through the component tree without passing props manually.
 * Since functions execute bottom-up, Providers must execute their children lazily (as functions).
 */
export interface Context<T> {
    id: symbol;
    defaultValue: T;
    Provider: (props: {
        value: T;
        children: JSXChildren | (() => JSXElement);
    }) => JSXElement;
}
/**
 * Create a Context object
 * @param defaultValue Default value to return if no provider is found
 */
export declare function createContext<T>(defaultValue: T): Context<T>;
/**
 * Hook to consume context value
 * @param context The context object
 */
export declare function useContext<T>(context: Context<T>): T;
/**
 * Manually push a context value onto the stack
 * This is useful for SSR where children are pre-evaluated
 * @internal
 */
export declare function pushContext<T>(context: Context<T>, value: T): void;
/**
 * Manually pop a context value from the stack
 * @internal
 */
export declare function popContext<T>(context: Context<T>): void;
