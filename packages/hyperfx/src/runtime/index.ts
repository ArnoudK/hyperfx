/**
 * Effect Runtime for HyperFX
 * Browser-optimized runtime configuration
 */

import { Effect } from "effect"

/**
 * Browser runtime configuration
 * Uses the default Effect runtime optimized for client-side usage
 */
export const BrowserRuntime = {
  /**
   * The default Effect runtime - optimized for browser environments
   */
  default: Effect.runtime()
} as const

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
export function runEffect<A, E>(
  effect: Effect.Effect<A, E, never>
): Promise<A> {
  return Effect.runPromise(effect)
}

/**
 * Run an Effect synchronously (for non-async Effects only)
 * Throws if the Effect contains async operations
 * 
 * @example
 * ```ts
 * const value = runEffectSync(Effect.succeed(42))
 * ```
 */
export function runEffectSync<A, E>(
  effect: Effect.Effect<A, E, never>
): A {
  return Effect.runSync(effect)
}

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
export function runEffectFork<A, E>(
  effect: Effect.Effect<A, E, never>
): () => void {
  const fiber = Effect.runFork(effect)
  return () => {
    Effect.runFork(fiber.interruptAsFork(fiber.id()))
  }
}

/**
 * Run an Effect and ignore the result
 * Errors are logged and rethrown asynchronously
 * 
 * Useful for fire-and-forget operations where you don't care about the result
 */
export function runEffectIgnore<A, E>(
  effect: Effect.Effect<A, E, never>
): void {
  Effect.runPromise(effect).catch((error) => {
    console.error("[HyperFX] Effect error:", error)
    if (typeof queueMicrotask === 'function') {
      queueMicrotask(() => {
        throw error
      })
    } else {
      setTimeout(() => {
        throw error
      }, 0)
    }
  })
}
