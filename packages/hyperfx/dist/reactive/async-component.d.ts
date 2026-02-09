/**
 * Async Component Factory for HyperFX
 *
 * Creates components that return Stream types, where the Stream emits JSX elements
 * for different states (loading, success, error). The user has full control over
 * what JSX is emitted at each stage of the Stream.
 */
import type { JSXElement } from "../jsx/runtime/types";
import { Stream } from "effect";
/**
 * Options for createAsyncComponent
 */
export interface AsyncComponentOptions {
    /**
     * Whether to defer rendering using streaming (SSR optimization)
     * @default false
     */
    deferStream?: boolean;
}
/**
 * Props injected into async components
 */
export interface AsyncComponentInjectedProps {
    /**
     * Manually trigger a refetch of the async data
     */
    refetch: () => Promise<void>;
    /**
     * Invalidate and refetch the data
     */
    invalidate: () => void;
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
export declare function createAsyncComponent<P extends Record<string, unknown> = {}>(fn: (props: P & AsyncComponentInjectedProps) => Stream.Stream<JSXElement, never, never>, options?: AsyncComponentOptions): (props: P) => JSXElement;
/**
 * Type helper to extract props from async component function
 */
export type AsyncComponentProps<T extends (props: Record<string, unknown>) => Stream.Stream<unknown, unknown, unknown>> = T extends (props: infer P) => Stream.Stream<unknown, unknown, unknown> ? Omit<P, keyof AsyncComponentInjectedProps> : never;
