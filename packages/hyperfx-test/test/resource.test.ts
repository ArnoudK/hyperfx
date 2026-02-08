import { describe, it, expect, beforeEach, vi } from 'vitest'
import { Effect } from 'effect'
import { createResource, createLazyResource, createResourceFn, combineResources } from 'hyperfx'
import * as RS from 'hyperfx'

// Helper to wait for async updates
const wait = (ms: number = 0) => new Promise(resolve => setTimeout(resolve, ms))

describe('createResource', () => {
  describe('Basic Functionality', () => {
    it('should start in idle state by default', () => {
      const resource = createResource(
        Effect.succeed(42),
        { autoFetch: false }
      )

      expect(RS.isIdle(resource())).toBe(true)
    })

    it('should start in success state with initialData', () => {
      const resource = createResource(
        Effect.succeed(42),
        { initialData: 100, autoFetch: false }
      )

      const state = resource()
      expect(RS.isSuccess(state)).toBe(true)
      if (RS.isSuccess(state)) {
        expect(state.data).toBe(100)
      }
    })

    it('should auto-fetch by default', async () => {
      const resource = createResource(Effect.succeed(42))

      // Should immediately be loading
      expect(RS.isLoading(resource()) || RS.isSuccess(resource())).toBe(true)

      // Wait for effect to complete
      await wait(10)

      const state = resource()
      expect(RS.isSuccess(state)).toBe(true)
      if (RS.isSuccess(state)) {
        expect(state.data).toBe(42)
      }
    })

    it('should transition from Loading to Success', async () => {
      const resource = createResource(
        Effect.gen(function* () {
          yield* Effect.sleep("5 millis")
          return "success"
        })
      )

      // Should start loading
      expect(RS.isLoading(resource())).toBe(true)

      // Wait for completion
      await wait(50)

      const state = resource()
      expect(RS.isSuccess(state)).toBe(true)
      if (RS.isSuccess(state)) {
        expect(state.data).toBe("success")
      }
    })

    it('should transition from Loading to Failure on error', async () => {
      const error = new Error("Failed!")
      const resource = createResource(
        Effect.fail(error)
      )

      // Wait for failure
      await wait(10)

      const state = resource()
      expect(RS.isFailure(state)).toBe(true)
      if (RS.isFailure(state)) {
        // Effect wraps errors, so just check the error exists
        expect(state.error).toBeTruthy()
      }
    })
  })

  describe('Options', () => {
    it('should call onSuccess callback', async () => {
      const onSuccess = vi.fn()

      createResource(Effect.succeed(42), { onSuccess })

      await wait(10)

      expect(onSuccess).toHaveBeenCalledWith(42)
      expect(onSuccess).toHaveBeenCalledTimes(1)
    })

    it('should call onFailure callback', async () => {
      const onFailure = vi.fn()
      const error = new Error("Failed")

      createResource(Effect.fail(error), { onFailure })

      await wait(10)

      // Effect wraps errors, so just check it was called
      expect(onFailure).toHaveBeenCalled()
      expect(onFailure).toHaveBeenCalledTimes(1)
    })

    it('should call onLoading callback', async () => {
      const onLoading = vi.fn()

      createResource(
        Effect.gen(function* () {
          yield* Effect.sleep("5 millis")
          return 42
        }),
        { onLoading }
      )

      await wait(5)

      expect(onLoading).toHaveBeenCalled()
    })

    it('should keep previous data when keepPrevious is true', async () => {
      const resource = createResource(
        Effect.succeed(42),
        { keepPrevious: true }
      )

      // Wait for initial load
      await wait(10)
      expect(RS.isSuccess(resource())).toBe(true)

      // Refetch
      resource.refetch()

      // Should be loading with previous data
      const loadingState = resource()
      expect(RS.isLoading(loadingState)).toBe(true)
      if (RS.isLoading(loadingState)) {
        expect(loadingState.previous).toBe(42)
      }
    })

    it('should not auto-fetch when autoFetch is false', async () => {
      const resource = createResource(
        Effect.succeed(42),
        { autoFetch: false }
      )

      await wait(10)

      expect(RS.isIdle(resource())).toBe(true)
    })
  })

  describe('Methods', () => {
    it('refetch should trigger a new fetch', async () => {
      let callCount = 0
      const resource = createResource(
        Effect.sync(() => ++callCount),
        { autoFetch: false }
      )

      expect(RS.isIdle(resource())).toBe(true)

      // First fetch
      await resource.refetch()
      await wait(10)

      const state1 = resource()
      expect(RS.isSuccess(state1)).toBe(true)
      if (RS.isSuccess(state1)) {
        expect(state1.data).toBe(1)
      }

      // Second fetch
      await resource.refetch()
      await wait(10)

      const state2 = resource()
      if (RS.isSuccess(state2)) {
        expect(state2.data).toBe(2)
      }
    })

    it('invalidate should trigger refetch', async () => {
      let value = 1
      const resource = createResource(
        Effect.sync(() => value),
        { autoFetch: false }
      )

      await resource.refetch()
      await wait(10)

      const state1 = resource()
      if (RS.isSuccess(state1)) {
        expect(state1.data).toBe(1)
      }

      value = 2
      resource.invalidate()
      await wait(10)

      const state2 = resource()
      if (RS.isSuccess(state2)) {
        expect(state2.data).toBe(2)
      }
    })

    it('should prevent concurrent fetches', async () => {
      let fetchCount = 0
      const resource = createResource(
        Effect.gen(function* () {
          fetchCount++
          yield* Effect.sleep("20 millis")
          return fetchCount
        })
      )

      // Trigger multiple refetches
      resource.refetch()
      resource.refetch()
      resource.refetch()

      await wait(100)

      // Should only fetch twice (initial + one refetch, others ignored due to in-progress)
      expect(fetchCount).toBeLessThanOrEqual(2)
    })
  })

  describe('Reactivity', () => {
    it('should trigger signal subscribers on state change', async () => {
      const resource = createResource(
        Effect.gen(function* () {
          yield* Effect.sleep("10 millis")
          return 42
        })
      )

      const states: string[] = []

      // Subscribe immediately to catch loading state
      const initialState = resource()
      states.push(initialState._tag)

      resource.subscribe((state) => {
        states.push(state._tag)
      })

      await wait(50)

      // Should have seen Success (loading might be caught in initial)
      expect(states).toContain('Success')
    })
  })
})

describe('createLazyResource', () => {
  it('should not auto-fetch', async () => {
    const resource = createLazyResource(Effect.succeed(42))

    await wait(10)

    expect(RS.isIdle(resource())).toBe(true)
  })

  it('should fetch when refetch is called', async () => {
    const resource = createLazyResource(Effect.succeed(42))

    await resource.refetch()
    await wait(10)

    const state = resource()
    expect(RS.isSuccess(state)).toBe(true)
    if (RS.isSuccess(state)) {
      expect(state.data).toBe(42)
    }
  })
})

describe('createResourceFn', () => {
  it('should create parameterized resource', async () => {
    const fetchUser = createResourceFn((id: number) =>
      Effect.succeed({ id, name: `User ${id}` })
    )

    const user1 = fetchUser(1)
    const user2 = fetchUser(2)

    await wait(10)

    expect(RS.isSuccess(user1())).toBe(true)
    expect(RS.isSuccess(user2())).toBe(true)

    const state1 = user1()
    const state2 = user2()
    if (RS.isSuccess(state1) && RS.isSuccess(state2)) {
      expect(state1.data.id).toBe(1)
      expect(state2.data.id).toBe(2)
    }
  })

  it('should pass options to created resources', async () => {
    const onSuccess = vi.fn()
    const fetchUser = createResourceFn(
      (id: number) => Effect.succeed(id),
      { onSuccess }
    )

    fetchUser(123)
    await wait(10)

    expect(onSuccess).toHaveBeenCalledWith(123)
  })
})

describe('combineResources', () => {
  it('should combine multiple successful resources', async () => {
    const user = createResource(Effect.succeed({ name: "Alice" }))
    const posts = createResource(Effect.succeed([1, 2, 3]))

    const combined = combineResources({ user, posts })

    await wait(10)

    const state = combined()
    expect(RS.isSuccess(state)).toBe(true)
    if (RS.isSuccess(state)) {
      expect(state.data.user.name).toBe("Alice")
      expect(state.data.posts).toEqual([1, 2, 3])
    }
  })

  it('should be Loading if any resource is Loading', async () => {
    const fast = createResource(Effect.succeed(1))
    const slow = createResource(
      Effect.gen(function* () {
        yield* Effect.sleep("50 millis")
        return 2
      })
    )

    const combined = combineResources({ fast, slow })

    await wait(10)

    expect(RS.isLoading(combined())).toBe(true)
  })

  it('should be Failure if any resource fails', async () => {
    const success = createResource(Effect.succeed(1))
    const failure = createResource(Effect.fail("error"))

    const combined = combineResources({ success, failure })

    await wait(10)

    expect(RS.isFailure(combined())).toBe(true)
  })

  it('should update when any resource updates', async () => {
    const user = createResource(Effect.succeed({ count: 1 }), { autoFetch: false })
    const posts = createResource(Effect.succeed([1]), { autoFetch: false })

    const combined = combineResources({ user, posts })

    let updateCount = 0
    combined.subscribe(() => updateCount++)

    await user.refetch()
    await wait(10)

    await posts.refetch()
    await wait(10)

    expect(updateCount).toBeGreaterThan(0)
  })
})
