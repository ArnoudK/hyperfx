/**
 * Resource - Bridge between Effect and Signal
 *
 * This module provides `createResource` which creates a Signal that automatically
 * updates when an Effect completes, providing seamless integration between
 * Effect's async capabilities and HyperFX's reactive DOM updates.
 */
import { Effect } from "effect";
import { Signal } from "./signal";
import { ResourceState } from "./resource-state";
/**
 * Extended Signal that holds ResourceState and provides refetch/invalidate
 */
export interface EffectSignal<A, E = unknown> extends Signal<ResourceState<A, E>> {
    /** Trigger a refetch of the resource */
    refetch: () => Promise<void>;
    /** Mark data as stale and trigger refetch */
    invalidate: () => void;
    /** Get the underlying Effect (for composition) */
    readonly effect: Effect.Effect<A, E, never>;
    /** Current state accessor (alias for calling the signal) */
    readonly state: () => ResourceState<A, E>;
}
/**
 * Options for createResource
 */
export interface ResourceOptions<A, E> {
    /** Initial data (starts in Success state) */
    initialData?: A;
    /** Keep previous data while loading (useful for smooth transitions) */
    keepPrevious?: boolean;
    /** Auto-fetch on creation (default: true) */
    autoFetch?: boolean;
    /** Callback on successful fetch */
    onSuccess?: (data: A) => void;
    /** Callback on failed fetch */
    onFailure?: (error: E) => void;
    /** Callback when loading starts */
    onLoading?: () => void;
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
export declare function createResource<A, E = unknown>(effect: Effect.Effect<A, E, never>, options?: ResourceOptions<A, E>): EffectSignal<A, E>;
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
export declare function createResourceFn<Args extends any[], A, E = unknown>(fn: (...args: Args) => Effect.Effect<A, E, never>, options?: ResourceOptions<A, E>): (...args: Args) => EffectSignal<A, E>;
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
export declare function createLazyResource<A, E = unknown>(effect: Effect.Effect<A, E, never>, options?: Omit<ResourceOptions<A, E>, 'autoFetch'>): EffectSignal<A, E>;
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
export declare function combineResources<T extends Record<string, EffectSignal<any, any>>>(resources: T): Signal<ResourceState<{
    [K in keyof T]: T[K] extends EffectSignal<infer A, any> ? A : never;
}, unknown>>;
