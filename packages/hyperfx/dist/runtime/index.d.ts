/**
 * Effect Runtime for HyperFX
 * Browser-optimized runtime configuration
 */
import { Effect } from "effect";
/**
 * Browser runtime configuration
 * Uses the default Effect runtime optimized for client-side usage
 */
export declare const BrowserRuntime: {
    /**
     * The default Effect runtime - optimized for browser environments
     */
    readonly default: Effect.Effect<import("effect/Runtime").Runtime<never>, never, never>;
};
/**
 * Run an Effect and return a Promise
 * This is the primary way to execute Effects in the browser
 *
 * @example
 * ```ts
 * const result = await runEffect(
 *   Effect.gen(function* () {
 *     const user = yield* fetchUser("123")
 *     return user
 *   })
 * )
 * ```
 */
export declare function runEffect<A, E>(effect: Effect.Effect<A, E, never>): Promise<A>;
/**
 * Run an Effect synchronously (for non-async Effects only)
 * Throws if the Effect contains async operations
 *
 * @example
 * ```ts
 * const value = runEffectSync(Effect.succeed(42))
 * ```
 */
export declare function runEffectSync<A, E>(effect: Effect.Effect<A, E, never>): A;
/**
 * Run an Effect in the background (fire and forget)
 * Returns a cleanup function to interrupt the fiber
 *
 * Useful for component cleanup and side effects
 *
 * @example
 * ```ts
 * const cleanup = runEffectFork(
 *   Effect.gen(function* () {
 *     while (true) {
 *       yield* Effect.sleep("1 second")
 *       console.log("tick")
 *     }
 *   })
 * )
 *
 * // Later, stop the background task
 * cleanup()
 * ```
 */
export declare function runEffectFork<A, E>(effect: Effect.Effect<A, E, never>): () => void;
/**
 * Run an Effect and ignore the result
 * Errors are logged but not thrown
 *
 * Useful for fire-and-forget operations where you don't care about the result
 */
export declare function runEffectIgnore<A, E>(effect: Effect.Effect<A, E, never>): void;
