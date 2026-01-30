import { Effect, Stream } from 'effect'
import {
  createResource,
  createResourceFn,
  createAsyncComponent,
  type AsyncComponentInjectedProps,
  ErrorBoundary,
  createSignal,
  For
} from 'hyperfx'

/**
 * Effect Demo Page
 * Demonstrates the new EffectTS Stream integration with HyperFX
 */

// Type definitions
type User = {
  id: string
  name: string
  email: string
  role: string
}

type Post = {
  id: string
  userId: string
  title: string
  content: string
}

// Mock API responses (simulating async operations)
const mockUsers: User[] = [
  { id: '1', name: 'Alice', email: 'alice@example.com', role: 'Admin' },
  { id: '2', name: 'Bob', email: 'bob@example.com', role: 'User' },
  { id: '3', name: 'Charlie', email: 'charlie@example.com', role: 'Moderator' },
]

const mockPosts: Post[] = [
  { id: '1', userId: '1', title: 'Hello World', content: 'First post!' },
  { id: '2', userId: '2', title: 'Effect is awesome', content: 'Learning Effect...' },
  { id: '3', userId: '1', title: 'HyperFX + Effect', content: 'Best combo!' },
]

// Simulate network delay
const delay = (ms: number) => Effect.sleep(`${ms} millis`)

/**
 * Fetch all users with simulated network delay
 */
const fetchUsers = Effect.gen(function* () {
  yield* delay(800)

  // Simulate occasional failure
  if (Math.random() > 0.8) {
    yield* Effect.fail(new Error('Network timeout'))
  }

  return mockUsers
}).pipe(
  Effect.retry({ times: 2 }),
  Effect.timeout('3 seconds')
)

/**
 * Fetch user by ID (parameterized resource)
 */
const fetchUserById = (userId: string) =>
  Effect.gen(function* () {
    yield* delay(500)

    const user = mockUsers.find(u => u.id === userId)
    if (!user) {
      yield* Effect.fail(new Error(`User ${userId} not found`))
    }

    return user
  })

/**
 * Fetch posts for a user
 */
const fetchUserPosts = (userId: string) =>
  Effect.gen(function* () {
    yield* delay(600)
    return mockPosts.filter(p => p.userId === userId)
  })

/**
 * Example 1: Basic Async Component with Stream
 * User controls loading and success states
 */
const UserListView = createAsyncComponent(
  (props: AsyncComponentInjectedProps) =>
    Stream.make(
      // First emission: Loading state
      <div>
        <div class="flex items-center gap-2 text-yellow-400 mb-4">
          <div class="animate-spin h-5 w-5 border-2 border-yellow-400 border-t-transparent rounded-full"></div>
          <span>Loading users...</span>
        </div>
      </div>
    ).pipe(
      Stream.concat(
        Stream.fromEffect(
          fetchUsers.pipe(
            Effect.map(users => (
              // Second emission: Success state
              <div>
                <p class="text-green-400 mb-4">Loaded {users.length} users</p>
                <ul class="space-y-2">
                  <For each={users}>{(user: User) => (
                    <li class="bg-gray-700 p-3 rounded">
                      <div class="font-semibold text-white">{user.name}</div>
                      <div class="text-sm text-gray-400">{user.email}</div>
                      <div class="text-xs text-gray-500">{user.role}</div>
                    </li>
                  )}
                  </For>
                </ul>
                <button
                  type="button"
                  onclick={() => props.refetch()}
                  class="mt-4 px-3 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                >
                  Refresh Users
                </button>
              </div>
            )),
            Effect.catchAll(error => Effect.succeed(
              // Error emission
              <div class="bg-red-900/20 border border-red-500 rounded p-4">
                <p class="text-red-400 font-semibold">Error loading users</p>
                <p class="text-red-300 text-sm mt-2">{error.message}</p>
                <button
                  type="button"
                  onclick={() => props.refetch()}
                  class="mt-3 px-3 py-1 bg-red-600 text-white rounded text-sm hover:bg-red-700"
                >
                  Try Again
                </button>
              </div>
            ))
          )
        )
      )
    )
)

function BasicResourceExample(): JSX.Element {
  return (
    <div class="bg-gray-800 p-6 rounded-lg shadow-lg">
      <h2 class="text-2xl font-semibold text-blue-400 mb-4">Basic Async Component (Stream-based)</h2>
      <p class="text-gray-300 mb-4">
        Using <code class="bg-gray-700 px-2 py-1 rounded">createAsyncComponent()</code> with <code class="bg-gray-700 px-2 py-1 rounded">Stream</code>
      </p>
      <p class="text-gray-400 text-sm mb-4">
        The user controls what JSX is emitted at each stage: loading, success, and error.
      </p>

      <UserListView />
    </div>
  )
}

/**
 * Example 2: Parameterized Async Component with Stream
 * Demonstrates components with reactive props
 */
const UserDetailView = createAsyncComponent(
  (props: { userId: string } & AsyncComponentInjectedProps) =>
    Stream.make(
      <div class="text-yellow-400">Loading user details...</div>
    ).pipe(
      Stream.concat(
        Stream.fromEffect(
          fetchUserById(props.userId).pipe(
            Effect.map(user => (
              <div class="bg-gray-700 p-4 rounded">
                <h3 class="text-xl font-semibold text-white mb-2">{user!.name}</h3>
                <p class="text-gray-400">{user!.email}</p>
                <span class="inline-block mt-2 px-3 py-1 bg-purple-600 text-white text-sm rounded">
                  {user!.role}
                </span>
              </div>
            )),
            Effect.catchAll(error => Effect.succeed(
              <div class="text-red-400">Error: {error.message}</div>
            ))
          )
        )
      )
    )
)

function ParameterizedResourceExample(): JSX.Element {
  const selectedUserId = createSignal<string>('1')

  return (
    <div class="bg-gray-800 p-6 rounded-lg shadow-lg">
      <h2 class="text-2xl font-semibold text-purple-400 mb-4">Parameterized Async Component</h2>
      <p class="text-gray-400 text-sm mb-4">
        Stream restarts automatically when props change.
      </p>

      <div class="mb-4">
        <label class="block text-gray-300 mb-2">Select User:</label>
        <select
          value={selectedUserId()}
          onchange={(e) => selectedUserId((e.target as HTMLSelectElement).value)}
          class="px-4 py-2 bg-gray-700 text-white rounded border border-gray-600"
        >
          <option value="1">User 1</option>
          <option value="2">User 2</option>
          <option value="3">User 3</option>
          <option value="999">Non-existent User</option>
        </select>
      </div>

      <UserDetailView userId={selectedUserId()} />
    </div>
  )
}

/**
 * Example 3: Multiple Dependent Async Components
 */
const UserInfoCard = createAsyncComponent(
  (props: { userId: string } & AsyncComponentInjectedProps) =>
    Stream.make(
      <div class="text-gray-400">Loading...</div>
    ).pipe(
      Stream.concat(
        Stream.fromEffect(
          fetchUserById(props.userId).pipe(
            Effect.map(user => (
              <div class="bg-gray-700 p-3 rounded">
                <div class="font-semibold text-white">{user!.name}</div>
                <div class="text-sm text-gray-400">{user!.email}</div>
              </div>
            )),
            Effect.catchAll(error => Effect.succeed(
              <div class="text-red-400">{error.message}</div>
            ))
          )
        )
      )
    )
)

const UserPostsList = createAsyncComponent(
  (props: { userId: string } & AsyncComponentInjectedProps) =>
    Stream.make(
      <div class="text-gray-400">Loading posts...</div>
    ).pipe(
      Stream.concat(
        Stream.fromEffect(
          fetchUserPosts(props.userId).pipe(
            Effect.map(posts => (
              <div>
                <h4 class="text-white font-semibold mb-2">Posts ({posts.length})</h4>
                <ul class="space-y-2">
                  <For each={posts}>{(post: Post) => (
                    <li class="bg-gray-600 p-2 rounded">
                      <div class="text-sm font-medium text-white">{post.title}</div>
                      <div class="text-xs text-gray-400">{post.content}</div>
                    </li>
                  )}
                  </For>
                </ul>
              </div>
            )),
            Effect.catchAll(error => Effect.succeed(
              <div class="text-red-400">Failed to load posts</div>
            ))
          )
        )
      )
    )
)

function DependentResourcesExample(): JSX.Element {
  const selectedUserId = createSignal<string>('1')

  return (
    <div class="bg-gray-800 p-6 rounded-lg shadow-lg">
      <h2 class="text-2xl font-semibold text-green-400 mb-4">Multiple Dependent Components</h2>
      <p class="text-gray-400 text-sm mb-4">
        Each component manages its own Stream independently.
      </p>

      <div class="mb-4">
        <select
          value={selectedUserId()}
          onchange={(e) => selectedUserId((e.target as HTMLSelectElement).value)}
          class="px-4 py-2 bg-gray-700 text-white rounded border border-gray-600"
        >
          <option value="1">Alice</option>
          <option value="2">Bob</option>
          <option value="3">Charlie</option>
        </select>
      </div>

      <div class="grid grid-cols-2 gap-4">
        <div>
          <h3 class="text-lg font-medium text-gray-300 mb-2">User Info</h3>
          <UserInfoCard userId={selectedUserId()} />
        </div>
        <div>
          <h3 class="text-lg font-medium text-gray-300 mb-2">User Posts</h3>
          <UserPostsList userId={selectedUserId()} />
        </div>
      </div>
    </div>
  )
}

/**
 * Example 4: Progressive Loading with Multiple Stream Emissions
 */
const AsyncUserCard = createAsyncComponent(
  (props: { userId: string } & AsyncComponentInjectedProps) =>
    Stream.make(
      // First emission: Initial loading
      <div class="bg-gray-700 p-4 rounded">
        <div class="animate-pulse">
          <div class="h-4 bg-gray-600 rounded w-3/4 mb-2"></div>
          <div class="h-3 bg-gray-600 rounded w-1/2"></div>
        </div>
      </div>,
      // Second emission: Show that we're fetching
      <div class="bg-gray-700 p-4 rounded">
        <p class="text-yellow-400 text-sm">Fetching user data...</p>
      </div>
    ).pipe(
      Stream.concat(
        Stream.fromEffect(
          fetchUserById(props.userId).pipe(
            Effect.map(user => (
              // Final emission: Success
              <div class="bg-gradient-to-r from-purple-700 to-blue-700 p-4 rounded">
                <h3 class="text-xl font-bold text-white mb-2">{user!.name}</h3>
                <p class="text-gray-200">{user!.email}</p>
                <span class="inline-block mt-2 px-3 py-1 bg-white text-purple-700 text-sm rounded font-semibold">
                  {user!.role}
                </span>
              </div>
            )),
            Effect.catchAll(error => Effect.succeed(
              <div class="bg-red-700 p-4 rounded">
                <p class="text-white font-semibold">Error</p>
                <p class="text-red-200 text-sm">{error.message}</p>
              </div>
            ))
          )
        )
      )
    )
)

function ProgressiveLoadingExample(): JSX.Element {
  return (
    <div class="bg-gray-800 p-6 rounded-lg shadow-lg">
      <h2 class="text-2xl font-semibold text-orange-400 mb-4">Progressive Loading</h2>
      <p class="text-gray-400 text-sm mb-4">
        Stream can emit multiple states before the final result.
      </p>

      <div class="space-y-4">
        <AsyncUserCard userId="1" />
        <AsyncUserCard userId="2" />
        <AsyncUserCard userId="3" />
      </div>
    </div>
  )
}

/**
 * Main Demo Page Component
 */
export default function EffectDemoPage(): JSX.Element {
  return (
    <div class="min-h-screen bg-gray-900 text-white p-8">
      <div class="max-w-6xl mx-auto">
        <h1 class="text-4xl font-bold mb-2 bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent">
          HyperFX + Effect Integration (Stream-based)
        </h1>
        <p class="text-gray-400 mb-8">
          Demonstrating async components with Effect Streams
        </p>

        <div class="space-y-8">
          <BasicResourceExample />
          <ParameterizedResourceExample />
          <DependentResourcesExample />
          <ProgressiveLoadingExample />
        </div>

        <div class="mt-12 p-6 bg-gray-800 rounded-lg">
          <h2 class="text-2xl font-semibold text-cyan-400 mb-4">Key Concepts</h2>
          <ul class="space-y-3 text-gray-300">
            <li>
              ✅ <code class="bg-gray-700 px-2 py-1 rounded">createAsyncComponent()</code> - Components that handle async state with Streams
            </li>
            <li>
              ✅ <code class="bg-gray-700 px-2 py-1 rounded">Stream.make()</code> - Emit loading states
            </li>
            <li>
              ✅ <code class="bg-gray-700 px-2 py-1 rounded">Stream.fromEffect()</code> - Convert Effects to Streams
            </li>
            <li>
              ✅ <code class="bg-gray-700 px-2 py-1 rounded">Effect.catchAll()</code> - Handle errors explicitly
            </li>
            <li>
              ✅ <code class="bg-gray-700 px-2 py-1 rounded">props.refetch()</code> - Manually restart streams
            </li>
            <li>
              ✅ Reactive props automatically restart streams
            </li>
          </ul>
        </div>
      </div>
    </div>
  )
}
