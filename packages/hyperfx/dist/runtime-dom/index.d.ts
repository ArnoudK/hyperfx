/**
 * Runtime DOM helpers for compiled HyperFX code
 *
 * These functions are used by the compiler output to efficiently
 * create and update DOM elements.
 */
type Accessor<T> = () => T;
type SignalLike<T> = Accessor<T> & {
    get: () => T;
    subscribe: (callback: (value: T) => void) => () => void;
};
type InsertableValue = Node | string | number | boolean | null | undefined;
type Insertable = InsertableValue | InsertableValue[] | SignalLike<InsertableValue> | Accessor<InsertableValue>;
type InsertResult = InsertableValue | Node | {
    _node: Text;
    toString: () => string;
    _cleanup?: () => void;
} | InsertResult[] | null;
/**
 * Create a template from HTML string
 * Templates are cached and cloned for reuse
 *
 * Note: On server, this creates a mock node structure
 */
export declare function template(html: string): Node;
/**
 * Insert reactive content into a DOM node
 * Automatically subscribes to signals and updates the content
 */
export declare function insert(parent: Node, accessor: Accessor<InsertableValue> | Insertable, marker?: Node | null, init?: InsertResult): InsertResult;
/**
 * Spread attributes onto an element
 */
export declare function spread<T extends Element>(element: T, accessor: () => Record<string, unknown>, isSVG?: boolean, skipChildren?: boolean): void;
/**
 * Create a delegated event listener
 * Uses document-level delegation for better performance
 */
export declare function delegate<T extends Event>(element: Element, eventName: string, handler: (event: T) => void): void;
/**
 * Remove delegated event listener
 */
export declare function undelegate(element: Element, eventName: string): void;
/**
 * Remove all delegated events for an element
 */
export declare function undelegateAll(element: Element): void;
/**
 * Assign a property to an element
 */
export declare function assign<T extends Element>(element: T, prop: string, value: unknown): void;
/**
 * Set a property on an element with special handling for common attributes
 */
export declare function setProp<T extends Element>(element: T, prop: string, value: unknown): void;
/**
 * Create an effect wrapper (re-export from signal system)
 */
export declare function effect(fn: () => void | (() => void)): () => void;
/**
 * Conditional rendering helper
 * Efficiently switches between two branches based on a condition
 */
export declare function show<T extends Insertable, U extends Insertable>(parent: Node, condition: () => boolean, whenTrue: () => T, whenFalse: () => U, marker?: Node | null): void;
/**
 * List rendering helper with keyed updates
 * Maps an array to DOM elements efficiently
 */
export declare function mapArray<T, U>(parent: Node, accessor: () => readonly T[], mapFn: (item: T, index: () => number) => U, marker?: Node | null): void;
/**
 * Keyed list rendering with efficient diffing
 * Only updates/moves/adds/removes items that changed
 */
export declare function mapArrayKeyed<T, U>(parent: Node, accessor: () => readonly T[], mapFn: (item: T, index: () => number) => U, keyFn: (item: T, index: number) => string | number, marker?: Node | null): void;
/**
 * Optimized For loop with keyed diffing
 * Similar to SolidJS <For> component
 */
export declare function forLoop<T, U>(parent: Node, accessor: () => readonly T[], mapFn: (item: T, index: () => number) => U, options?: {
    fallback?: () => Insertable;
}, marker?: Node | null): void;
/**
 * Find a marker node by its ID (comment content)
 * Uses TreeWalker to traverse deep structures
 */
export declare function findMarker(root: Node, markerId: string): Node | null;
export {};
