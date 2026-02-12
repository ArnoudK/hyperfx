import { createSignal, Show } from 'hyperfx'
import { describe, it, expect, beforeEach, afterEach } from 'vitest'


describe('Show Component', () => {
  let container: HTMLElement

  beforeEach(() => {
    container = document.createElement('div')
    document.body.appendChild(container)
  })

  afterEach(() => {
    document.body.removeChild(container)
  })

  it('should show children when condition is truthy', () => {
    const [show] = createSignal(true)

    const element = (
      <Show when={show} fallback={<div>Hidden</div>}>
        <div>Shown</div>
      </Show>
    )

    container.appendChild(element as Node)
    expect(container.textContent).toContain('Shown')
  })

  it('should show fallback when condition is falsy', () => {
    const [show] = createSignal(false)

    const element = (
      <Show when={show} fallback={<div>Hidden</div>}>
        <div>Shown</div>
      </Show>
    )

    container.appendChild(element as Node)
    expect(container.textContent).toContain('Hidden')
  })

  it('should update when condition changes', () => {
    const [show, setShow] = createSignal(false)

    const element = (
      <Show when={show} fallback={<div>Hidden</div>}>
        <div>Shown</div>
      </Show>
    )

    container.appendChild(element as Node)
    expect(container.textContent).toContain('Hidden')

    setShow(true)
    expect(container.textContent).toContain('Shown')

    setShow(false)
    expect(container.textContent).toContain('Hidden')
  })

  it('should pass data to children function', () => {
    const [data] = createSignal('test data')

    const element = (
      <Show when={data} fallback={<div>No data</div>}>
        {(val: string) => <div>Data: {val}</div>}
      </Show>
    )

    container.appendChild(element as Node)
    expect(container.textContent).toContain('Data: test data')
  })

  it('should work with static truthy values', () => {
    const element = (
      <Show when="truthy string" fallback={<div>Fallback</div>}>
        {(val: string) => <div>{val}</div>}
      </Show>
    )

    container.appendChild(element as Node)
    expect(container.textContent).toContain('truthy string')
  })

  it('should work with static falsy values', () => {
    const element = (
      <Show when={null} fallback={<div>Hidden</div>}>
        <div>Shown</div>
      </Show>
    )

    container.appendChild(element as Node)
    expect(container.textContent).toContain('Hidden')
  })
})
