/**
 * @vitest-environment jsdom
 */

import { describe, it, expect, vi } from 'vitest'
import { createSignal } from 'hyperfx'
import { createEffect } from 'hyperfx'

describe('createEffect - Dynamic Dependencies', () => {
  it('should update subscriptions when dependencies change', () => {
    const [sig1, setSig1] = createSignal('a')
    const [sig2, setSig2] = createSignal('b')
    const [condition, setCondition] = createSignal(true)

    const effectFn = vi.fn(() => {
      if (condition()) {
        sig1() // Access sig1 when condition is true
      } else {
        sig2() // Access sig2 when condition is false
      }
    })

    createEffect(effectFn)

    // Initial run
    expect(effectFn).toHaveBeenCalledTimes(1)

    // Change sig1 - should trigger effect (condition is true)
    setSig1('a2')
    expect(effectFn).toHaveBeenCalledTimes(2)

    // Change sig2 - should NOT trigger effect (not subscribed yet)
    setSig2('b2')
    expect(effectFn).toHaveBeenCalledTimes(2)

    // Change condition - should trigger effect AND re-subscribe
    setCondition(false)
    expect(effectFn).toHaveBeenCalledTimes(3)

    // Now sig1 changes should NOT trigger effect
    setSig1('a3')
    expect(effectFn).toHaveBeenCalledTimes(3)

    // But sig2 changes SHOULD trigger effect
    setSig2('b3')
    expect(effectFn).toHaveBeenCalledTimes(4)
  })

  it('should handle effects that add and remove dependencies', () => {
    const [count, setCount] = createSignal(0)
    const [multiplier, setMultiplier] = createSignal(2)

    let result = 0
    const effectFn = vi.fn(() => {
      const c = count()
      // Only access multiplier when count > 5
      result = c > 5 ? c * multiplier() : c
    })

    createEffect(effectFn)
    expect(effectFn).toHaveBeenCalledTimes(1)
    expect(result).toBe(0)

    // Changing multiplier should NOT trigger effect (count is 0)
    setMultiplier(3)
    expect(effectFn).toHaveBeenCalledTimes(1)

    // Increase count to 6 - should trigger AND start tracking multiplier
    setCount(6)
    expect(effectFn).toHaveBeenCalledTimes(2)
    expect(result).toBe(18) // 6 * 3

    // Now multiplier changes SHOULD trigger effect
    setMultiplier(4)
    expect(effectFn).toHaveBeenCalledTimes(3)
    expect(result).toBe(24) // 6 * 4

    // Decrease count below 6 - should stop tracking multiplier
    setCount(3)
    expect(effectFn).toHaveBeenCalledTimes(4)
    expect(result).toBe(3)

    // Multiplier changes should NOT trigger effect anymore
    setMultiplier(10)
    expect(effectFn).toHaveBeenCalledTimes(4)
    expect(result).toBe(3)
  })

  it('should not cause infinite loops with circular dependencies', () => {
    const [a, setA] = createSignal(1)
    const [b, setB] = createSignal(1)

    let runCount = 0
    const effectFn = vi.fn(() => {
      runCount++
      // Prevent actual infinite loop in test
      if (runCount > 10) return

      const valA = a()
      // This could cause a loop if not handled properly
      if (valA < 5) {
        setB(valA + 1)
      }
    })

    createEffect(effectFn)

    // Effect should run initially
    expect(effectFn).toHaveBeenCalled()

    // Even with potential circular logic, should not loop infinitely
    // The effect should run a finite number of times
    expect(runCount).toBeLessThan(10)
  })

  it('should call cleanup function before re-running', () => {
    const [sig, setSig] = createSignal(1)
    const cleanups: number[] = []
    const runs: number[] = []

    createEffect(() => {
      const value = sig()
      runs.push(value)

      return () => {
        cleanups.push(value)
      }
    })

    expect(runs).toEqual([1])
    expect(cleanups).toEqual([])

    setSig(2)
    expect(runs).toEqual([1, 2])
    expect(cleanups).toEqual([1]) // Cleanup for first run

    setSig(3)
    expect(runs).toEqual([1, 2, 3])
    expect(cleanups).toEqual([1, 2]) // Cleanups for first and second runs
  })

  it('should handle effects that access no signals', () => {
    let runCount = 0
    const effectFn = vi.fn(() => {
      runCount++
    })

    createEffect(effectFn)

    // Should run once initially
    expect(effectFn).toHaveBeenCalledTimes(1)
    expect(runCount).toBe(1)

    // Should not run again (no dependencies to trigger it)
    const [sig, setSig] = createSignal(1)
    setSig(2)
    expect(effectFn).toHaveBeenCalledTimes(1)
  })

  it('should handle nested signal accesses correctly', () => {
    const [outer, setOuter] = createSignal(true)
    const [inner1, setInner1] = createSignal('a')
    const [inner2, setInner2] = createSignal('b')

    const results: string[] = []
    const effectFn = vi.fn(() => {
      if (outer()) {
        results.push(inner1())
      } else {
        results.push(inner2())
      }
    })

    createEffect(effectFn)

    expect(results).toEqual(['a'])
    expect(effectFn).toHaveBeenCalledTimes(1)

    // Change inner1 - should trigger
    setInner1('a2')
    expect(results).toEqual(['a', 'a2'])
    expect(effectFn).toHaveBeenCalledTimes(2)

    // Switch to inner2 branch
    setOuter(false)
    expect(results).toEqual(['a', 'a2', 'b'])
    expect(effectFn).toHaveBeenCalledTimes(3)

    // inner1 changes should NOT trigger anymore
    setInner1('a3')
    expect(results).toEqual(['a', 'a2', 'b'])
    expect(effectFn).toHaveBeenCalledTimes(3)

    // inner2 changes SHOULD trigger
    setInner2('b2')
    expect(results).toEqual(['a', 'a2', 'b', 'b2'])
    expect(effectFn).toHaveBeenCalledTimes(4)
  })
})
