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
export type ResourceState<A, E = unknown> =
  | { readonly _tag: "Idle" }
  | { readonly _tag: "Loading"; readonly previous?: A }
  | { readonly _tag: "Success"; readonly data: A; readonly timestamp: number }
  | { readonly _tag: "Failure"; readonly error: E; readonly timestamp: number }

/**
 * Create initial idle state
 * Resource hasn't started loading yet
 */
export const idle = <A, E = unknown>(): ResourceState<A, E> => ({
  _tag: "Idle"
})

/**
 * Create loading state, optionally preserving previous data
 * Useful for showing stale data while refetching
 */
export const loading = <A, E = unknown>(previous?: A): ResourceState<A, E> => 
  previous !== undefined
    ? { _tag: "Loading", previous }
    : { _tag: "Loading" }

/**
 * Create success state with data
 * Automatically adds timestamp for cache invalidation
 */
export const success = <A, E = unknown>(data: A): ResourceState<A, E> => ({
  _tag: "Success",
  data,
  timestamp: Date.now()
})

/**
 * Create failure state with error
 * Automatically adds timestamp for retry logic
 */
export const failure = <A, E = unknown>(error: E): ResourceState<A, E> => ({
  _tag: "Failure",
  error,
  timestamp: Date.now()
})

/**
 * Type guard: Check if state is Idle
 */
export const isIdle = <A, E>(
  state: ResourceState<A, E>
): state is Extract<ResourceState<A, E>, { _tag: "Idle" }> =>
  state._tag === "Idle"

/**
 * Type guard: Check if state is Loading
 */
export const isLoading = <A, E>(
  state: ResourceState<A, E>
): state is Extract<ResourceState<A, E>, { _tag: "Loading" }> =>
  state._tag === "Loading"

/**
 * Type guard: Check if state is Success
 */
export const isSuccess = <A, E>(
  state: ResourceState<A, E>
): state is Extract<ResourceState<A, E>, { _tag: "Success" }> =>
  state._tag === "Success"

/**
 * Type guard: Check if state is Failure
 */
export const isFailure = <A, E>(
  state: ResourceState<A, E>
): state is Extract<ResourceState<A, E>, { _tag: "Failure" }> =>
  state._tag === "Failure"

/**
 * Get data from state (if available)
 * Returns data from Success state, or previous data from Loading state
 */
export const getData = <A, E>(state: ResourceState<A, E>): A | undefined => {
  if (isSuccess(state)) return state.data
  if (isLoading(state)) return state.previous
  return undefined
}

/**
 * Get error from state (if available)
 */
export const getError = <A, E>(state: ResourceState<A, E>): E | undefined => {
  return isFailure(state) ? state.error : undefined
}

/**
 * Check if resource has data (success or loading with previous)
 */
export const hasData = <A, E>(state: ResourceState<A, E>): boolean => {
  return isSuccess(state) || (isLoading(state) && state.previous !== undefined)
}

/**
 * Check if resource is in a pending state (idle or loading)
 */
export const isPending = <A, E>(state: ResourceState<A, E>): boolean => {
  return isIdle(state) || isLoading(state)
}

/**
 * Check if resource is in a settled state (success or failure)
 */
export const isSettled = <A, E>(state: ResourceState<A, E>): boolean => {
  return isSuccess(state) || isFailure(state)
}

/**
 * Map data in success state
 * Leaves other states unchanged
 */
export const map = <A, B, E>(
  state: ResourceState<A, E>,
  fn: (a: A) => B
): ResourceState<B, E> => {
  if (isSuccess(state)) {
    return success(fn(state.data))
  }
  if (isLoading(state) && state.previous) {
    return loading(fn(state.previous))
  }
  return state as ResourceState<B, E>
}

/**
 * Map error in failure state
 * Leaves other states unchanged
 */
export const mapError = <A, E, F>(
  state: ResourceState<A, E>,
  fn: (e: E) => F
): ResourceState<A, F> => {
  if (isFailure(state)) {
    return failure(fn(state.error))
  }
  return state as ResourceState<A, F>
}

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
export const match = <A, E, R>(
  state: ResourceState<A, E>,
  patterns: {
    Idle: () => R
    Loading: (previous?: A) => R
    Success: (data: A) => R
    Failure: (error: E) => R
  }
): R => {
  switch (state._tag) {
    case "Idle":
      return patterns.Idle()
    case "Loading":
      return patterns.Loading(state.previous)
    case "Success":
      return patterns.Success(state.data)
    case "Failure":
      return patterns.Failure(state.error)
  }
}

/**
 * Partial match - only handle specific states
 * Returns undefined for unmatched states
 */
export const matchPartial = <A, E, R>(
  state: ResourceState<A, E>,
  patterns: Partial<{
    Idle: () => R
    Loading: (previous?: A) => R
    Success: (data: A) => R
    Failure: (error: E) => R
  }>
): R | undefined => {
  switch (state._tag) {
    case "Idle":
      return patterns.Idle?.()
    case "Loading":
      return patterns.Loading?.(state.previous)
    case "Success":
      return patterns.Success?.(state.data)
    case "Failure":
      return patterns.Failure?.(state.error)
  }
}

/**
 * Get a default value if resource is not in success state
 */
export const getOrElse = <A, E>(
  state: ResourceState<A, E>,
  defaultValue: A
): A => {
  return isSuccess(state) ? state.data : defaultValue
}

/**
 * Get a default value from a function if resource is not in success state
 */
export const getOrElseLazy = <A, E>(
  state: ResourceState<A, E>,
  getDefault: () => A
): A => {
  return isSuccess(state) ? state.data : getDefault()
}

/**
 * Convert ResourceState to Option-like type
 */
export const toOption = <A, E>(
  state: ResourceState<A, E>
): { isSome: boolean; value?: A } => {
  const data = getData(state)
  return data !== undefined ? { isSome: true, value: data } : { isSome: false }
}

/**
 * Refresh a state to loading while keeping previous data
 */
export const refresh = <A, E>(
  state: ResourceState<A, E>
): ResourceState<A, E> => {
  const currentData = getData(state)
  return currentData !== undefined ? loading(currentData) : loading()
}
