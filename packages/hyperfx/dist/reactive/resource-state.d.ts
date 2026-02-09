/**
 * ResourceState - Type-safe state representation for async operations
 *
 * This provides a discriminated union type similar to the RemoteData pattern,
 * making it easy to handle loading, success, and error states in the UI.
 */
/**
 * State of an async resource
 *
 * @template A - The success data type
 * @template E - The error type (defaults to unknown)
 */
export type ResourceState<A, E = unknown> = {
    readonly _tag: "Idle";
} | {
    readonly _tag: "Loading";
    readonly previous?: A;
} | {
    readonly _tag: "Success";
    readonly data: A;
    readonly timestamp: number;
} | {
    readonly _tag: "Failure";
    readonly error: E;
    readonly timestamp: number;
};
/**
 * Create initial idle state
 * Resource hasn't started loading yet
 */
export declare const idle: <A, E = unknown>() => ResourceState<A, E>;
/**
 * Create loading state, optionally preserving previous data
 * Useful for showing stale data while refetching
 */
export declare const loading: <A, E = unknown>(previous?: A) => ResourceState<A, E>;
/**
 * Create success state with data
 * Automatically adds timestamp for cache invalidation
 */
export declare const success: <A, E = unknown>(data: A) => ResourceState<A, E>;
/**
 * Create failure state with error
 * Automatically adds timestamp for retry logic
 */
export declare const failure: <A, E = unknown>(error: E) => ResourceState<A, E>;
/**
 * Type guard: Check if state is Idle
 */
export declare const isIdle: <A, E>(state: ResourceState<A, E>) => state is Extract<ResourceState<A, E>, {
    _tag: "Idle";
}>;
/**
 * Type guard: Check if state is Loading
 */
export declare const isLoading: <A, E>(state: ResourceState<A, E>) => state is Extract<ResourceState<A, E>, {
    _tag: "Loading";
}>;
/**
 * Type guard: Check if state is Success
 */
export declare const isSuccess: <A, E>(state: ResourceState<A, E>) => state is Extract<ResourceState<A, E>, {
    _tag: "Success";
}>;
/**
 * Type guard: Check if state is Failure
 */
export declare const isFailure: <A, E>(state: ResourceState<A, E>) => state is Extract<ResourceState<A, E>, {
    _tag: "Failure";
}>;
/**
 * Get data from state (if available)
 * Returns data from Success state, or previous data from Loading state
 */
export declare const getData: <A, E>(state: ResourceState<A, E>) => A | undefined;
/**
 * Get error from state (if available)
 */
export declare const getError: <A, E>(state: ResourceState<A, E>) => E | undefined;
/**
 * Check if resource has data (success or loading with previous)
 */
export declare const hasData: <A, E>(state: ResourceState<A, E>) => boolean;
/**
 * Check if resource is in a pending state (idle or loading)
 */
export declare const isPending: <A, E>(state: ResourceState<A, E>) => boolean;
/**
 * Check if resource is in a settled state (success or failure)
 */
export declare const isSettled: <A, E>(state: ResourceState<A, E>) => boolean;
/**
 * Map data in success state
 * Leaves other states unchanged
 */
export declare const map: <A, B, E>(state: ResourceState<A, E>, fn: (a: A) => B) => ResourceState<B, E>;
/**
 * Map error in failure state
 * Leaves other states unchanged
 */
export declare const mapError: <A, E, F>(state: ResourceState<A, E>, fn: (e: E) => F) => ResourceState<A, F>;
/**
 * Match pattern for ResourceState
 * Provides exhaustive pattern matching over all states
 *
 * @example
 * ```ts
 * const ui = match(userResource, {
 *   Idle: () => <div>Not started</div>,
 *   Loading: (prev) => prev ? <div>Refreshing {prev.name}...</div> : <div>Loading...</div>,
 *   Success: (user) => <div>Hello {user.name}</div>,
 *   Failure: (error) => <div>Error: {error.message}</div>
 * })
 * ```
 */
export declare const match: <A, E, R>(state: ResourceState<A, E>, patterns: {
    Idle: () => R;
    Loading: (previous?: A) => R;
    Success: (data: A) => R;
    Failure: (error: E) => R;
}) => R;
/**
 * Partial match - only handle specific states
 * Returns undefined for unmatched states
 */
export declare const matchPartial: <A, E, R>(state: ResourceState<A, E>, patterns: Partial<{
    Idle: () => R;
    Loading: (previous?: A) => R;
    Success: (data: A) => R;
    Failure: (error: E) => R;
}>) => R | undefined;
/**
 * Get a default value if resource is not in success state
 */
export declare const getOrElse: <A, E>(state: ResourceState<A, E>, defaultValue: A) => A;
/**
 * Get a default value from a function if resource is not in success state
 */
export declare const getOrElseLazy: <A, E>(state: ResourceState<A, E>, getDefault: () => A) => A;
/**
 * Convert ResourceState to Option-like type
 */
export declare const toOption: <A, E>(state: ResourceState<A, E>) => {
    isSome: boolean;
    value?: A;
};
/**
 * Refresh a state to loading while keeping previous data
 */
export declare const refresh: <A, E>(state: ResourceState<A, E>) => ResourceState<A, E>;
