/**
 * Resource - Bridge between Effect and Signal
 * 
 * This module provides `createResource` which creates a Signal that automatically
 * updates when an Effect completes, providing seamless integration between
 * Effect's async capabilities and HyperFX's reactive DOM updates.
 */

import { Effect } from "effect"
import { createSignal, Signal } from "./signal"
import { ResourceState, idle, loading, success, failure } from "./resource-state"
import { runEffect } from "../runtime"

/**
 * Extended Signal that holds ResourceState and provides refetch/invalidate
 */
export interface EffectSignal<A, E = unknown> extends Signal<ResourceState<A, E>> {
  /** Trigger a refetch of the resource */
  refetch: () => Promise<void>
  /** Mark data as stale and trigger refetch */
  invalidate: () => void
  /** Get the underlying Effect (for composition) */
  readonly effect: Effect.Effect<A, E, never>
  /** Current state accessor (alias for calling the signal) */
  readonly state: () => ResourceState<A, E>
}

/**
 * Options for createResource
 */
export interface ResourceOptions<A, E> {
  /** Initial data (starts in Success state) */
  initialData?: A
  /** Keep previous data while loading (useful for smooth transitions) */
  keepPrevious?: boolean
  /** Auto-fetch on creation (default: true) */
  autoFetch?: boolean
  /** Callback on successful fetch */
  onSuccess?: (data: A) => void
  /** Callback on failed fetch */
  onFailure?: (error: E) => void
  /** Callback when loading starts */
  onLoading?: () => void
}

/**
 * Create a resource from an Effect
 * 
 * The resource is a Signal that automatically updates when the Effect resolves.
 * This is the primary way to integrate async Effect operations with the reactive DOM.
 * 
 * @example
 * ```tsx
 * // Create a resource that fetches user data
 * const user = createResource(
 *   Effect.gen(function* () {
 *     const http = yield* HttpClient.HttpClient
 *     const response = yield* http.get("/api/user")
 *     return yield* response.json
 *   }),
 *   {
 *     keepPrevious: true, // Show stale data while refetching
 *     onSuccess: (data) => console.log("User loaded:", data)
 *   }
 * )
 * 
 * // Use in JSX
 * <div>
 *   {user()._ tag === "Success" && user().data.name}
 * </div>
 * 
 * // Or refetch manually
 * <button onClick={() => user.refetch()}>Refresh</button>
 * ```
 * 
 * @template A - The success data type
 * @template E - The error type (defaults to unknown)
 * @param effect - The Effect to execute
 * @param options - Configuration options
 * @returns An EffectSignal that updates when the Effect completes
 */
export function createResource<A, E = unknown>(
  effect: Effect.Effect<A, E, never>,
  options: ResourceOptions<A, E> = {}
): EffectSignal<A, E> {
  const {
    initialData,
    keepPrevious = false,
    autoFetch = true,
    onSuccess,
    onFailure,
    onLoading
  } = options

  // Create underlying signal
  const state = createSignal<ResourceState<A, E>>(
    initialData !== undefined ? success(initialData) : idle()
  )

  // Track if currently fetching
  let isFetching = false

  const fetch = async (): Promise<void> => {
    // Prevent concurrent fetches
    if (isFetching) {
      return
    }

    isFetching = true

    // Get previous data for keepPrevious
    const currentState = state()
    const previousData = keepPrevious && currentState._tag === "Success"
      ? currentState.data
      : undefined

    // Set loading state
    state(loading(previousData))
    onLoading?.()

    try {
      // Run the effect
      const result = await runEffect(effect)

      // Update to success state
      state(success(result))
      onSuccess?.(result)
    } catch (error) {
      // Update to failure state
      state(failure(error as E))
      onFailure?.(error as E)
    } finally {
      isFetching = false
    }
  }

  const invalidate = (): void => {
    fetch()
  }

  // Create the EffectSignal by extending the base signal
  const effectSignal = Object.assign(state, {
    refetch: fetch,
    invalidate,
    effect,
    get state() {
      return state
    }
  }) as EffectSignal<A, E>

  // Auto-fetch if enabled
  if (autoFetch) {
    fetch()
  }

  return effectSignal
}

/**
 * Create a resource from a function that returns an Effect
 * 
 * Useful for parameterized resources where you need to pass arguments.
 * 
 * @example
 * ```tsx
 * const fetchUser = createResourceFn((userId: string) =>
 *   Effect.gen(function* () {
 *     const http = yield* HttpClient.HttpClient
 *     const response = yield* http.get(`/api/users/${userId}`)
 *     return yield* response.json
 *   })
 * )
 * 
 * // Create resource for specific user
 * const user = fetchUser("123")
 * ```
 */
export function createResourceFn<Args extends any[], A, E = unknown>(
  fn: (...args: Args) => Effect.Effect<A, E, never>,
  options?: ResourceOptions<A, E>
): (...args: Args) => EffectSignal<A, E> {
  return (...args: Args) => createResource(fn(...args), options)
}

/**
 * Create a lazy resource that doesn't auto-fetch
 * 
 * Useful when you want to trigger the fetch manually (e.g., on button click).
 * 
 * @example
 * ```tsx
 * const searchResults = createLazyResource(
 *   Effect.gen(function* () {
 *     const http = yield* HttpClient.HttpClient
 *     return yield* http.get("/api/search?q=...")
 *   })
 * )
 * 
 * // Later, trigger the fetch
 * <button onClick={() => searchResults.refetch()}>Search</button>
 * ```
 */
export function createLazyResource<A, E = unknown>(
  effect: Effect.Effect<A, E, never>,
  options?: Omit<ResourceOptions<A, E>, 'autoFetch'>
): EffectSignal<A, E> {
  return createResource(effect, { ...options, autoFetch: false })
}

/**
 * Combine multiple resources into a single resource
 * 
 * The combined resource is in Success state only when all resources are successful.
 * If any resource is Loading, the combined resource is Loading.
 * If any resource is Failure, the combined resource is Failure.
 * 
 * @example
 * ```tsx
 * const userResource = createResource(fetchUser)
 * const postsResource = createResource(fetchPosts)
 * 
 * const combined = combineResources({ user: userResource, posts: postsResource })
 * 
 * // Use the combined data
 * {combined()._ tag === "Success" && (
 *   <div>
 *     {combined().data.user.name} has {combined().data.posts.length} posts
 *   </div>
 * )}
 * ```
 */
export function combineResources<T extends Record<string, Signal<any>>>(
  resources: T
): Signal<ResourceState<
  { [K in keyof T]: T[K] extends Signal<ResourceState<infer A, any>> ? A : never },
  unknown
>> {
  const combined = createSignal<ResourceState<any, unknown>>(idle())

  // Helper to recompute combined state
  const recompute = () => {
    const states = Object.entries(resources).map(([key, resource]) => ({
      key,
      state: resource()
    }))

    // Check if any are loading
    const anyLoading = states.some(({ state }) => state._tag === "Loading")
    if (anyLoading) {
      // Get previous data if all had data before
      const allHadData = states.every(({ state }) =>
        state._tag === "Success" || (state._tag === "Loading" && state.previous)
      )

      if (allHadData) {
        const previousData: any = {}
        for (const { key, state } of states) {
          if (state._tag === "Success") {
            previousData[key] = state.data
          } else if (state._tag === "Loading" && state.previous) {
            previousData[key] = state.previous
          }
        }
        combined(loading(previousData))
      } else {
        combined(loading())
      }
      return
    }

    // Check if any failed
    const firstFailure = states.find(({ state }) => state._tag === "Failure")
    if (firstFailure) {
      combined(failure(firstFailure.state._tag === "Failure" ? firstFailure.state.error : 'Unknown error'))
      return
    }

    // Check if all are successful
    const allSuccess = states.every(({ state }) => state._tag === "Success")
    if (allSuccess) {
      const data: any = {}
      for (const { key, state } of states) {
        if (state._tag === "Success") {
          data[key] = state.data
        }
      }
      combined(success(data))
      return
    }

    // Otherwise idle
    combined(idle())
  }

  // Subscribe to all resources
  for (const resource of Object.values(resources)) {
    resource.subscribe(() => recompute())
  }

  // Initial computation
  recompute()

  return combined
}
