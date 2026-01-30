# Breaking Changes - EffectTS Integration

## Overview

HyperFX now integrates **EffectTS** for async operations, error handling, and loading states. This provides a more robust, type-safe approach to async state management while maintaining the existing Signal-based reactive system for synchronous operations.

---

## Breaking Changes

### 1. Removed: `fetcher.ts` HTTP Client

**What Changed:**
- The old `fetcher.ts` HTTP client has been removed
- No more `fetcher.get()`, `fetcher.post()`, etc.

**Migration Path:**
```tsx
// ❌ OLD (no longer works)
import { fetcher } from 'hyperfx'

const data = await fetcher.get('/api/user')

// ✅ NEW (using Effect + createResource)
import { Effect } from 'effect'
import { HttpClient } from 'hyperfx/http'
import { createResource } from 'hyperfx'

const fetchUser = Effect.gen(function* () {
  const http = yield* HttpClient.HttpClient
  const response = yield* http.get('/api/user')
  return yield* response.json
})

const user = createResource(fetchUser)

// In JSX
<Show when={user} fallback={<div>Loading...</div>}>
  {data => <div>{data.name}</div>}
</Show>
```

---

## New Features

### 1. `createResource()` - Async State Management

Creates a reactive Signal that manages async operations with automatic loading/error states.

```tsx
import { Effect } from 'effect'
import { createResource } from 'hyperfx'

const user = createResource(
  Effect.promise(() => fetch('/api/user').then(r => r.json())),
  {
    keepPrevious: true,  // Show stale data while refetching
    onSuccess: (data) => console.log('Loaded:', data),
    onFailure: (error) => console.error('Failed:', error)
  }
)

// Access current state
user() // ResourceState<User, Error>

// Manual refetch
user.refetch()

// Invalidate and refetch
user.invalidate()
```

### 2. `ResourceState<A, E>` - Type-Safe Async States

```tsx
type ResourceState<A, E> =
  | { _tag: 'Idle' }
  | { _tag: 'Loading', previous?: A }
  | { _tag: 'Success', data: A }
  | { _tag: 'Failure', error: E }
```

Utilities:
- `isIdle()`, `isLoading()`, `isSuccess()`, `isFailure()` - Type guards
- `getData()`, `getError()` - Safe accessors
- `map()`, `mapError()` - Transformations
- `match()` - Pattern matching

### 3. `<Match>` Component - Pattern Matching for Resources

```tsx
import { Match } from 'hyperfx'

<Match value={user()}>
  <Match.Idle>Not started yet</Match.Idle>
  
  <Match.Loading>
    {previous => previous ? `Refreshing ${previous.name}...` : 'Loading...'}
  </Match.Loading>
  
  <Match.Success>
    {data => <div>Hello {data.name}!</div>}
  </Match.Success>
  
  <Match.Failure>
    {error => <div>Error: {error.message}</div>}
  </Match.Failure>
</Match>
```

### 4. Enhanced `<Show>` Component

`<Show>` now automatically detects `ResourceState`:

```tsx
import { Show } from 'hyperfx'

// Automatically handles ResourceState
<Show when={user} fallback={<div>Loading or error...</div>}>
  {data => <div>Hello {data.name}!</div>}
</Show>

// Still works with regular booleans
<Show when={isLoggedIn()} fallback={<Login />}>
  <Dashboard />
</Show>
```

### 5. `<ErrorBoundary>` Component

```tsx
import { ErrorBoundary } from 'hyperfx'

<ErrorBoundary 
  fallback={(error, reset) => (
    <div>
      Error: {error.message}
      <button onClick={reset}>Retry</button>
    </div>
  )}
  onError={(error) => console.error(error)}
>
  <YourComponent />
</ErrorBoundary>
```

### 6. Lazy & Parameterized Resources

```tsx
// Lazy (manual fetch)
const user = createLazyResource(fetchUserEffect)
user.refetch() // Trigger manually

// Parameterized (factory function)
const fetchUser = createResourceFn((id: string) =>
  Effect.promise(() => fetch(`/api/users/${id}`).then(r => r.json()))
)

const user123 = fetchUser("123")
const user456 = fetchUser("456")
```

### 7. Combine Multiple Resources

```tsx
const user = createResource(fetchUser)
const posts = createResource(fetchPosts)

const combined = combineResources({ user, posts })

// Access combined state
combined() // ResourceState<{ user: User, posts: Post[] }, Error>
```

---

## Migration Examples

### Example 1: Simple GET Request

```tsx
// ❌ OLD
import { fetcher } from 'hyperfx'

const [user, setUser] = createSignal(null)
const [loading, setLoading] = createSignal(true)
const [error, setError] = createSignal(null)

async function loadUser() {
  try {
    setLoading(true)
    const data = await fetcher.get('/api/user')
    setUser(data)
  } catch (e) {
    setError(e)
  } finally {
    setLoading(false)
  }
}

onMount(() => loadUser())

// ✅ NEW
import { Effect } from 'effect'
import { createResource } from 'hyperfx'

const user = createResource(
  Effect.promise(() => fetch('/api/user').then(r => r.json()))
)

// Automatic loading/error handling, auto-fetches on mount
```

### Example 2: POST with Error Handling

```tsx
// ❌ OLD
import { fetcher } from 'hyperfx'

async function saveUser(data) {
  try {
    const result = await fetcher.post('/api/user', {
      body: JSON.stringify(data)
    })
    return result
  } catch (error) {
    console.error('Failed to save:', error)
    throw error
  }
}

// ✅ NEW
import { Effect } from 'effect'

const saveUser = (data: User) =>
  Effect.gen(function* () {
    const response = yield* Effect.tryPromise({
      try: () => fetch('/api/user', {
        method: 'POST',
        body: JSON.stringify(data)
      }).then(r => r.json()),
      catch: (error) => new Error(`Failed to save: ${error}`)
    })
    return response
  }).pipe(
    Effect.retry({ times: 3 }),
    Effect.timeout('5 seconds')
  )

// Use with createResource for reactive state
const saveResult = createLazyResource(saveUser(userData))
```

### Example 3: Using with HttpClient

```tsx
// ✅ NEW - Recommended approach
import { Effect } from 'effect'
import { HttpClient, HttpClientRequest } from 'hyperfx/http'
import { createResource } from 'hyperfx'

const fetchUser = Effect.gen(function* () {
  const http = yield* HttpClient.HttpClient
  const request = HttpClientRequest.get('/api/user')
  const response = yield* http.execute(request)
  return yield* response.json
}).pipe(
  Effect.retry({ times: 3, schedule: Schedule.exponential('100 millis') }),
  Effect.timeout('10 seconds'),
  Effect.catchTag('TimeoutException', () => 
    Effect.fail(new Error('Request timed out'))
  )
)

const user = createResource(fetchUser, {
  keepPrevious: true,
  onFailure: (error) => {
    console.error('Failed to load user:', error)
  }
})
```

---

## Dependencies

### New Dependencies

```json
{
  "dependencies": {
    "effect": "^3.11.0"
  },
  "peerDependencies": {
    "@effect/platform": "^0.94.0"
  }
}
```

**Note:** `@effect/platform` is optional. Only needed if you want to use `HttpClient` from `hyperfx/http`. You can use Effect without it.

---

## TypeScript Changes

All new exports are fully typed:

```tsx
import type { 
  ResourceState,
  EffectSignal,
  ResourceOptions 
} from 'hyperfx'
```

---

## Backwards Compatibility

### What Still Works
- All existing Signal APIs (`createSignal`, `createMemo`, etc.)
- All existing JSX (`<For>`, `<Show>`, etc.) - enhanced, not replaced
- All existing reactivity and component patterns
- SSR and hydration

### What Broke
- `fetcher.get/post/put/delete/patch` - use Effect instead
- Any direct imports from `'hyperfx/fetcher'` - module removed

---

## Performance Impact

**No performance regression for existing code:**
- Signal reactivity is unchanged
- Effect only runs for async operations
- `createResource` uses Signals under the hood
- No overhead if you don't use Effect features

---

## Questions?

See the full documentation:
- `/packages/hyperfx/src/reactive/resource.ts` - createResource API
- `/packages/hyperfx/src/reactive/resource-state.ts` - ResourceState utilities
- `/packages/hyperfx/src/jsx/control-flow.tsx` - Match and ErrorBoundary components

---

## Timeline

- **Current Version:** 0.0.2
- **Effect Integration:** ✅ Complete
- **Next Steps:** Update examples and create migration guides
