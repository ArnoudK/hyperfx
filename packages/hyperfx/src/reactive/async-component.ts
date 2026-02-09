/**
 * Async Component Factory for HyperFX
 * 
 * Creates components that return Stream types, where the Stream emits JSX elements
 * for different states (loading, success, error). The user has full control over
 * what JSX is emitted at each stage of the Stream.
 */

import type { JSXElement } from "../jsx/runtime/types"
import { Effect, Stream } from "effect"
import { createEffect, createMemo } from "../reactive/state"
import { untrack } from "../reactive/signal"
import { runEffectFork } from "../runtime"

/**
 * Options for createAsyncComponent
 */
export interface AsyncComponentOptions {
  /**
   * Whether to defer rendering using streaming (SSR optimization)
   * @default false
   */
  deferStream?: boolean
}

/**
 * Props injected into async components
 */
export interface AsyncComponentInjectedProps {
  /**
   * Manually trigger a refetch of the async data
   */
  refetch: () => Promise<void>

  /**
   * Invalidate and refetch the data
   */
  invalidate: () => void
}

/**
 * Create an async component from a Stream-returning function
 * 
 * The function receives props (including refetch/invalidate) and returns a Stream
 * that emits JSX elements. The Stream typically emits a loading state first, then
 * success or error states. The user has complete control over what JSX is rendered
 * at each stage.
 * 
 * @example Basic usage with loading and success states
 * ```tsx
 * import { Stream, Effect } from "effect"
 * 
 * const UserProfile = createAsyncComponent<{ userId: string }>(
 *   (props) => Stream.make(<div>Loading...</div>).pipe(
 *     Stream.concat(
 *       Stream.fromEffect(
 *         fetchUser(props.userId).pipe(
 *           Effect.map(user => <div>{user.name}</div>)
 *         )
 *       )
 *     )
 *   )
 * )
 * 
 * // Usage
 * <UserProfile userId="123" />
 * ```
 * 
 * @example With error handling
 * ```tsx
 * const UserProfile = createAsyncComponent<{ userId: string }>(
 *   (props) => Stream.make(<div>Loading user {props.userId}...</div>).pipe(
 *     Stream.concat(
 *       Stream.fromEffect(
 *         fetchUser(props.userId).pipe(
 *           Effect.map(user => <div>{user.name}</div>),
 *           Effect.catchAll(error => Effect.succeed(
 *             <div>Error: {error.message}</div>
 *           ))
 *         )
 *       )
 *     )
 *   )
 * )
 * ```
 * 
 * @example With refetch button
 * ```tsx
 * const UserProfile = createAsyncComponent<{ userId: string }>(
 *   (props) => Stream.make(<div>Loading...</div>).pipe(
 *     Stream.concat(
 *       Stream.fromEffect(
 *         fetchUser(props.userId).pipe(
 *           Effect.map(user => (
 *             <div>
 *               <h1>{user.name}</h1>
 *               <button onclick={() => props.refetch()}>Refresh</button>
 *             </div>
 *           )),
 *           Effect.catchAll(error => Effect.succeed(
 *             <div>
 *               Error: {error.message}
 *               <button onclick={() => props.refetch()}>Retry</button>
 *             </div>
 *           ))
 *         )
 *       )
 *     )
 *   )
 * )
 * ```
 */
export function createAsyncComponent<P extends Record<string, unknown> = {}>(
  fn: (props: P & AsyncComponentInjectedProps) => Stream.Stream<JSXElement, never, never>,
  options: AsyncComponentOptions = {}
): (props: P) => JSXElement {
  const {
    deferStream = false
  } = options

  // Return a component function
  return (props: P): JSXElement => {
    // Create injected props that we'll pass to the stream function
    let refetchFn: () => Promise<void> = async () => { }
    let invalidateFn: () => void = () => { }

    // Add injected props directly to the props object
    // This avoids creating a new object that would lose signal tracking
    const propsWithInjected = props as P & AsyncComponentInjectedProps
    Object.defineProperties(propsWithInjected, {
      refetch: {
        get: () => refetchFn,
        enumerable: true
      },
      invalidate: {
        get: () => invalidateFn,
        enumerable: true
      }
    })

    // For SSR with deferStream (future enhancement)
    if (deferStream && typeof window === 'undefined') {
      // SSR streaming placeholder
      const comment = document.createComment('defer-stream')
      const fragment = document.createDocumentFragment()
      fragment.appendChild(comment)
      return fragment
    }

    // Create a container and marker for reactive updates
    const fragment = document.createDocumentFragment()
    const marker = document.createComment('async-component-stream')
    fragment.appendChild(marker)

    let currentContent: Node | null = null
    let streamCleanup: (() => void) | null = null

    // Wrap the stream creation in a memo to track reactive prop dependencies
    // When a signal accessed inside fn() changes, this memo will re-compute
    const currentStream = createMemo(() => fn(propsWithInjected))

    // Function to run the stream and update DOM on each emission
    const runStream = (forceRefresh = false) => {
      // Cancel previous stream if running
      if (streamCleanup) {
        streamCleanup()
      }

      // Get the stream - either call fn() directly (for refetch) or use memo (for reactive tracking)
      const stream = forceRefresh ? untrack(() => fn(propsWithInjected)) : currentStream()

      // Subscribe to stream and update DOM for each emission
      streamCleanup = runEffectFork(
        Stream.runForEach(stream, (jsxElement) =>
          Effect.sync(() => {
            // Update DOM with new JSX element
            // Note: async-component only runs on client, so jsxElement is always a DOM Node
            const element = jsxElement as Node;
            if (currentContent && currentContent.parentNode) {
              currentContent.parentNode.replaceChild(element, currentContent)
            } else if (marker.parentNode) {
              // First emission - insert after marker
              marker.parentNode.insertBefore(element, marker.nextSibling)
            }
            currentContent = element
          })
        )
      )
    }

    // Implement refetch - restart the stream with a fresh function call
    refetchFn = async () => {
      runStream(true)
    }

    // Implement invalidate - restart the stream with a fresh function call
    invalidateFn = () => {
      runStream(true)
    }

    // Track when the stream function changes (due to reactive props) and restart stream
    // Use a flag to prevent infinite loops from createEffect
    let isFirstRun = true
    let lastStreamValue: unknown = null
    createEffect(() => {
      const streamFn = currentStream()

      // Skip first run (stream already started below)
      if (isFirstRun) {
        isFirstRun = false
        lastStreamValue = streamFn
        return
      }

      // Check if the stream function actually changed (prevent loops)
      if (streamFn === lastStreamValue) {
        return
      }
      lastStreamValue = streamFn

      // Props changed - restart stream
      untrack(() => runStream())
    })

    // Initial stream run
    runStream()

    return fragment
  }
}

/**
 * Type helper to extract props from async component function
 */
export type AsyncComponentProps<
  T extends (props: Record<string, unknown>) => Stream.Stream<unknown, unknown, unknown>
> = T extends (props: infer P) => Stream.Stream<unknown, unknown, unknown>
  ? Omit<P, keyof AsyncComponentInjectedProps>
  : never
