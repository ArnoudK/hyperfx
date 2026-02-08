import { createSignal, jsx, Show } from 'hyperfx'
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
    const show = createSignal(true)

    const element = jsx(Show, {
      when: show,
      children: jsx('div', { children: 'Shown' }),
      fallback: jsx('div', { children: 'Hidden' })
    })

    container.appendChild(element as Node)
    expect(container.textContent).toContain('Shown')
  })

  it('should show fallback when condition is falsy', () => {
    const show = createSignal(false)

    const element = jsx(Show, {
      when: show,
      children: jsx('div', { children: 'Shown' }),
      fallback: jsx('div', { children: 'Hidden' })
    })

    container.appendChild(element as Node)
    expect(container.textContent).toContain('Hidden')
  })

  it('should update when condition changes', () => {
    const show = createSignal(false)

    const element = jsx(Show, {
      when: show,
      children: jsx('div', { children: 'Shown' }),
      fallback: jsx('div', { children: 'Hidden' })
    })

    container.appendChild(element as Node)
    expect(container.textContent).toContain('Hidden')

    show(true)
    expect(container.textContent).toContain('Shown')

    show(false)
    expect(container.textContent).toContain('Hidden')
  })

  it('should pass data to children function', () => {
    const data = createSignal('test data')

    const element = jsx(Show, {
      when: data,
      children: (val: string) => jsx('div', { children: `Data: ${val}` }),
      fallback: jsx('div', { children: 'No data' })
    })

    container.appendChild(element as Node)
    expect(container.textContent).toContain('Data: test data')
  })

  it('should work with static truthy values', () => {
    const element = jsx(Show, {
      when: 'truthy string',
      children: (val: string) => jsx('div', { children: val }),
      fallback: jsx('div', { children: 'Fallback' })
    })

    container.appendChild(element as Node)
    expect(container.textContent).toContain('truthy string')
  })

  it('should work with static falsy values', () => {
    const element = jsx(Show, {
      when: null,
      children: jsx('div', { children: 'Shown' }),
      fallback: jsx('div', { children: 'Hidden' })
    })

    container.appendChild(element as Node)
    expect(container.textContent).toContain('Hidden')
  })
})
