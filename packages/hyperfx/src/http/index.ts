/**
 * HTTP helpers using Effect Platform
 * 
 * This module re-exports Effect's HTTP client for convenience.
 * Requires @effect/platform to be installed as a peer dependency.
 * 
 * @example
 * ```tsx
 * import { Effect } from 'effect'
 * import { HttpClient } from 'hyperfx/http'
 * import { createResource } from 'hyperfx'
 * 
 * const user = createResource(
 *   Effect.gen(function* () {
 *     const http = yield* HttpClient.HttpClient
 *     const response = yield* http.get("/api/user")
 *     return yield* response.json
 *   })
 * )
 * ```
 */

// Re-export HTTP types and functions from Effect Platform
// These will only work if @effect/platform is installed

export { 
  HttpClient, 
  HttpClientRequest, 
  HttpClientResponse, 
  HttpClientError 
} from "@effect/platform"
