import { describe, it, expect } from 'vitest'
import * as RS from '../src/reactive/resource-state'

describe('ResourceState', () => {
  describe('Constructors', () => {
    it('should create idle state', () => {
      const state = RS.idle<string>()
      expect(state._tag).toBe('Idle')
      expect(RS.isIdle(state)).toBe(true)
    })

    it('should create loading state without previous', () => {
      const state = RS.loading<string>()
      expect(state._tag).toBe('Loading')
      expect(RS.isLoading(state)).toBe(true)
      if (RS.isLoading(state)) {
        expect(state.previous).toBeUndefined()
      }
    })

    it('should create loading state with previous data', () => {
      const state = RS.loading('previous value')
      expect(state._tag).toBe('Loading')
      expect(RS.isLoading(state)).toBe(true)
      if (RS.isLoading(state)) {
        expect(state.previous).toBe('previous value')
      }
    })

    it('should create success state', () => {
      const state = RS.success({ id: 1, name: 'Test' })
      expect(state._tag).toBe('Success')
      expect(RS.isSuccess(state)).toBe(true)
      if (RS.isSuccess(state)) {
        expect(state.data).toEqual({ id: 1, name: 'Test' })
        expect(state.timestamp).toBeGreaterThan(0)
      }
    })

    it('should create failure state', () => {
      const error = new Error('Failed')
      const state = RS.failure(error)
      expect(state._tag).toBe('Failure')
      expect(RS.isFailure(state)).toBe(true)
      if (RS.isFailure(state)) {
        expect(state.error).toBe(error)
        expect(state.timestamp).toBeGreaterThan(0)
      }
    })
  })

  describe('Type Guards', () => {
    it('isIdle should correctly identify idle state', () => {
      expect(RS.isIdle(RS.idle())).toBe(true)
      expect(RS.isIdle(RS.loading())).toBe(false)
      expect(RS.isIdle(RS.success(1))).toBe(false)
      expect(RS.isIdle(RS.failure('error'))).toBe(false)
    })

    it('isLoading should correctly identify loading state', () => {
      expect(RS.isLoading(RS.idle())).toBe(false)
      expect(RS.isLoading(RS.loading())).toBe(true)
      expect(RS.isLoading(RS.loading('prev'))).toBe(true)
      expect(RS.isLoading(RS.success(1))).toBe(false)
      expect(RS.isLoading(RS.failure('error'))).toBe(false)
    })

    it('isSuccess should correctly identify success state', () => {
      expect(RS.isSuccess(RS.idle())).toBe(false)
      expect(RS.isSuccess(RS.loading())).toBe(false)
      expect(RS.isSuccess(RS.success(1))).toBe(true)
      expect(RS.isSuccess(RS.failure('error'))).toBe(false)
    })

    it('isFailure should correctly identify failure state', () => {
      expect(RS.isFailure(RS.idle())).toBe(false)
      expect(RS.isFailure(RS.loading())).toBe(false)
      expect(RS.isFailure(RS.success(1))).toBe(false)
      expect(RS.isFailure(RS.failure('error'))).toBe(true)
    })
  })

  describe('Data Accessors', () => {
    it('getData should return data from success state', () => {
      const state = RS.success({ value: 42 })
      expect(RS.getData(state)).toEqual({ value: 42 })
    })

    it('getData should return previous from loading state', () => {
      const state = RS.loading({ value: 42 })
      expect(RS.getData(state)).toEqual({ value: 42 })
    })

    it('getData should return undefined for idle state', () => {
      const state = RS.idle<{ value: number }>()
      expect(RS.getData(state)).toBeUndefined()
    })

    it('getData should return undefined for failure state', () => {
      const state = RS.failure<{ value: number }, string>('error')
      expect(RS.getData(state)).toBeUndefined()
    })

    it('getData should return undefined for loading without previous', () => {
      const state = RS.loading<{ value: number }>()
      expect(RS.getData(state)).toBeUndefined()
    })

    it('getError should return error from failure state', () => {
      const error = new Error('Failed')
      const state = RS.failure(error)
      expect(RS.getError(state)).toBe(error)
    })

    it('getError should return undefined for non-failure states', () => {
      expect(RS.getError(RS.idle())).toBeUndefined()
      expect(RS.getError(RS.loading())).toBeUndefined()
      expect(RS.getError(RS.success(1))).toBeUndefined()
    })
  })

  describe('State Checks', () => {
    it('hasData should return true for success', () => {
      expect(RS.hasData(RS.success(1))).toBe(true)
    })

    it('hasData should return true for loading with previous', () => {
      expect(RS.hasData(RS.loading(1))).toBe(true)
    })

    it('hasData should return false for idle', () => {
      expect(RS.hasData(RS.idle())).toBe(false)
    })

    it('hasData should return false for loading without previous', () => {
      expect(RS.hasData(RS.loading())).toBe(false)
    })

    it('hasData should return false for failure', () => {
      expect(RS.hasData(RS.failure('error'))).toBe(false)
    })

    it('isPending should return true for idle and loading', () => {
      expect(RS.isPending(RS.idle())).toBe(true)
      expect(RS.isPending(RS.loading())).toBe(true)
      expect(RS.isPending(RS.success(1))).toBe(false)
      expect(RS.isPending(RS.failure('error'))).toBe(false)
    })

    it('isSettled should return true for success and failure', () => {
      expect(RS.isSettled(RS.idle())).toBe(false)
      expect(RS.isSettled(RS.loading())).toBe(false)
      expect(RS.isSettled(RS.success(1))).toBe(true)
      expect(RS.isSettled(RS.failure('error'))).toBe(true)
    })
  })

  describe('Transformations', () => {
    it('map should transform success data', () => {
      const state = RS.success(5)
      const mapped = RS.map(state, (x) => x * 2)
      
      expect(RS.isSuccess(mapped)).toBe(true)
      if (RS.isSuccess(mapped)) {
        expect(mapped.data).toBe(10)
      }
    })

    it('map should transform loading previous data', () => {
      const state = RS.loading(5)
      const mapped = RS.map(state, (x) => x * 2)
      
      expect(RS.isLoading(mapped)).toBe(true)
      if (RS.isLoading(mapped)) {
        expect(mapped.previous).toBe(10)
      }
    })

    it('map should leave idle unchanged', () => {
      const state = RS.idle<number>()
      const mapped = RS.map(state, (x) => x * 2)
      
      expect(RS.isIdle(mapped)).toBe(true)
    })

    it('map should leave failure unchanged', () => {
      const state = RS.failure<number, string>('error')
      const mapped = RS.map(state, (x) => x * 2)
      
      expect(RS.isFailure(mapped)).toBe(true)
      if (RS.isFailure(mapped)) {
        expect(mapped.error).toBe('error')
      }
    })

    it('mapError should transform failure error', () => {
      const state = RS.failure('error message')
      const mapped = RS.mapError(state, (e) => new Error(e))
      
      expect(RS.isFailure(mapped)).toBe(true)
      if (RS.isFailure(mapped)) {
        expect(mapped.error).toBeInstanceOf(Error)
        expect(mapped.error.message).toBe('error message')
      }
    })

    it('mapError should leave non-failure states unchanged', () => {
      expect(RS.isIdle(RS.mapError(RS.idle(), (e) => e))).toBe(true)
      expect(RS.isLoading(RS.mapError(RS.loading(), (e) => e))).toBe(true)
      expect(RS.isSuccess(RS.mapError(RS.success(1), (e) => e))).toBe(true)
    })
  })

  describe('Pattern Matching', () => {
    it('match should handle all states', () => {
      const idleResult = RS.match(RS.idle<number>(), {
        Idle: () => 'idle',
        Loading: () => 'loading',
        Success: (n) => `success: ${n}`,
        Failure: (e) => `failure: ${e}`
      })
      expect(idleResult).toBe('idle')

      const loadingResult = RS.match(RS.loading<number>(), {
        Idle: () => 'idle',
        Loading: () => 'loading',
        Success: (n) => `success: ${n}`,
        Failure: (e) => `failure: ${e}`
      })
      expect(loadingResult).toBe('loading')

      const successResult = RS.match(RS.success(42), {
        Idle: () => 'idle',
        Loading: () => 'loading',
        Success: (n) => `success: ${n}`,
        Failure: (e) => `failure: ${e}`
      })
      expect(successResult).toBe('success: 42')

      const failureResult = RS.match(RS.failure<number, string>('oops'), {
        Idle: () => 'idle',
        Loading: () => 'loading',
        Success: (n) => `success: ${n}`,
        Failure: (e) => `failure: ${e}`
      })
      expect(failureResult).toBe('failure: oops')
    })

    it('match should pass previous data in loading state', () => {
      const result = RS.match(RS.loading(100), {
        Idle: () => 'idle',
        Loading: (prev) => prev ? `loading ${prev}` : 'loading',
        Success: (n) => `success: ${n}`,
        Failure: (e) => `failure: ${e}`
      })
      expect(result).toBe('loading 100')
    })

    it('matchPartial should handle partial patterns', () => {
      const result = RS.matchPartial(RS.success(42), {
        Success: (n) => n * 2
      })
      expect(result).toBe(84)

      const noMatch = RS.matchPartial(RS.idle(), {
        Success: (n) => n
      })
      expect(noMatch).toBeUndefined()
    })
  })

  describe('Utility Functions', () => {
    it('getOrElse should return data or default', () => {
      expect(RS.getOrElse(RS.success(42), 0)).toBe(42)
      expect(RS.getOrElse(RS.idle(), 0)).toBe(0)
      expect(RS.getOrElse(RS.loading(), 0)).toBe(0)
      expect(RS.getOrElse(RS.failure('error'), 0)).toBe(0)
    })

    it('getOrElseLazy should return data or compute default', () => {
      expect(RS.getOrElseLazy(RS.success(42), () => 0)).toBe(42)
      expect(RS.getOrElseLazy(RS.idle(), () => 100)).toBe(100)
    })

    it('toOption should convert to option-like type', () => {
      const someResult = RS.toOption(RS.success(42))
      expect(someResult.isSome).toBe(true)
      expect(someResult.value).toBe(42)

      const noneResult = RS.toOption(RS.idle())
      expect(noneResult.isSome).toBe(false)
      expect(noneResult.value).toBeUndefined()
    })

    it('refresh should convert to loading with previous data', () => {
      const fromSuccess = RS.refresh(RS.success(42))
      expect(RS.isLoading(fromSuccess)).toBe(true)
      if (RS.isLoading(fromSuccess)) {
        expect(fromSuccess.previous).toBe(42)
      }

      const fromIdle = RS.refresh(RS.idle())
      expect(RS.isLoading(fromIdle)).toBe(true)
      if (RS.isLoading(fromIdle)) {
        expect(fromIdle.previous).toBeUndefined()
      }
    })
  })
})
