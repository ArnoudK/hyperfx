/**
 * ResourceState - Type-safe state representation for async operations
 *
 * This provides a discriminated union type similar to the RemoteData pattern,
 * making it easy to handle loading, success, and error states in the UI.
 */
/**
 * Create initial idle state
 * Resource hasn't started loading yet
 */
export const idle = () => ({
    _tag: "Idle"
});
/**
 * Create loading state, optionally preserving previous data
 * Useful for showing stale data while refetching
 */
export const loading = (previous) => previous !== undefined
    ? { _tag: "Loading", previous }
    : { _tag: "Loading" };
/**
 * Create success state with data
 * Automatically adds timestamp for cache invalidation
 */
export const success = (data) => ({
    _tag: "Success",
    data,
    timestamp: Date.now()
});
/**
 * Create failure state with error
 * Automatically adds timestamp for retry logic
 */
export const failure = (error) => ({
    _tag: "Failure",
    error,
    timestamp: Date.now()
});
/**
 * Type guard: Check if state is Idle
 */
export const isIdle = (state) => state._tag === "Idle";
/**
 * Type guard: Check if state is Loading
 */
export const isLoading = (state) => state._tag === "Loading";
/**
 * Type guard: Check if state is Success
 */
export const isSuccess = (state) => state._tag === "Success";
/**
 * Type guard: Check if state is Failure
 */
export const isFailure = (state) => state._tag === "Failure";
/**
 * Get data from state (if available)
 * Returns data from Success state, or previous data from Loading state
 */
export const getData = (state) => {
    if (isSuccess(state))
        return state.data;
    if (isLoading(state))
        return state.previous;
    return undefined;
};
/**
 * Get error from state (if available)
 */
export const getError = (state) => {
    return isFailure(state) ? state.error : undefined;
};
/**
 * Check if resource has data (success or loading with previous)
 */
export const hasData = (state) => {
    return isSuccess(state) || (isLoading(state) && state.previous !== undefined);
};
/**
 * Check if resource is in a pending state (idle or loading)
 */
export const isPending = (state) => {
    return isIdle(state) || isLoading(state);
};
/**
 * Check if resource is in a settled state (success or failure)
 */
export const isSettled = (state) => {
    return isSuccess(state) || isFailure(state);
};
/**
 * Map data in success state
 * Leaves other states unchanged
 */
export const map = (state, fn) => {
    if (isSuccess(state)) {
        return success(fn(state.data));
    }
    if (isLoading(state) && state.previous) {
        return loading(fn(state.previous));
    }
    return state;
};
/**
 * Map error in failure state
 * Leaves other states unchanged
 */
export const mapError = (state, fn) => {
    if (isFailure(state)) {
        return failure(fn(state.error));
    }
    return state;
};
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
export const match = (state, patterns) => {
    switch (state._tag) {
        case "Idle":
            return patterns.Idle();
        case "Loading":
            return patterns.Loading(state.previous);
        case "Success":
            return patterns.Success(state.data);
        case "Failure":
            return patterns.Failure(state.error);
    }
};
/**
 * Partial match - only handle specific states
 * Returns undefined for unmatched states
 */
export const matchPartial = (state, patterns) => {
    switch (state._tag) {
        case "Idle":
            return patterns.Idle?.();
        case "Loading":
            return patterns.Loading?.(state.previous);
        case "Success":
            return patterns.Success?.(state.data);
        case "Failure":
            return patterns.Failure?.(state.error);
    }
};
/**
 * Get a default value if resource is not in success state
 */
export const getOrElse = (state, defaultValue) => {
    return isSuccess(state) ? state.data : defaultValue;
};
/**
 * Get a default value from a function if resource is not in success state
 */
export const getOrElseLazy = (state, getDefault) => {
    return isSuccess(state) ? state.data : getDefault();
};
/**
 * Convert ResourceState to Option-like type
 */
export const toOption = (state) => {
    const data = getData(state);
    return data !== undefined ? { isSome: true, value: data } : { isSome: false };
};
/**
 * Refresh a state to loading while keeping previous data
 */
export const refresh = (state) => {
    const currentData = getData(state);
    return currentData !== undefined ? loading(currentData) : loading();
};
//# sourceMappingURL=resource-state.js.map