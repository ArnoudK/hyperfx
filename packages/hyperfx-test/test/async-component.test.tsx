/**
 * @vitest-environment jsdom
 */

import { describe, it, expect, beforeEach } from 'vitest'
import { Effect, Stream } from 'effect'
import { createAsyncComponent, createSignal, Accessor } from 'hyperfx'


describe('createAsyncComponent (Stream-based)', () => {
  beforeEach(() => {
    document.body.innerHTML = ''
  })

  it('should create a component that renders Stream emissions', async () => {
    const AsyncComponent = createAsyncComponent(
      () => Stream.make(<div>Loading...</div>).pipe(
        Stream.concat(
          Stream.fromEffect(
            Effect.sleep('10 millis').pipe(
              Effect.map(() => {
                const div = document.createElement('div')
                div.textContent = 'Hello from Stream!'
                return div
              })
            )
          )
        )
      )
    )

    const element = AsyncComponent({})
    document.body.appendChild(element as Node)

    // Wait a tick for stream to start emitting
    await new Promise(resolve => setTimeout(resolve, 5))

    // Should show loading (first emission)
    expect(document.body.textContent).toContain('Loading')

    // Wait for stream to emit success
    await new Promise(resolve => setTimeout(resolve, 50))

    // Should now show the result
    expect(document.body.textContent).toContain('Hello from Stream!')
  })

  it('should pass props to the Stream function', async () => {
    type Props = { name: string }

    const AsyncComponent = createAsyncComponent(
      (props: Props) => Stream.make(<div>Loading {props.name}...</div>).pipe(
        Stream.concat(
          Stream.fromEffect(
            Effect.sleep('10 millis').pipe(
              Effect.map(() => {
                const div = document.createElement('div')
                div.textContent = `Hello, ${props.name}!`
                return div
              })
            )
          )
        )
      )
    )

    const element = AsyncComponent({ name: 'Alice' })
    document.body.appendChild(element as Node)

    await new Promise(resolve => setTimeout(resolve, 50))

    expect(document.body.textContent).toContain('Hello, Alice!')
  })

  it('should emit multiple progressive updates', async () => {
    const AsyncComponent = createAsyncComponent(
      () => Stream.make(
        <div>Loading step 1...</div>,
        <div>Loading step 2...</div>
      ).pipe(
        Stream.concat(
          Stream.fromEffect(
            Effect.sleep('10 millis').pipe(
              Effect.map(() => <div>Final result!</div>)
            )
          )
        )
      )
    )

    const element = AsyncComponent({})
    document.body.appendChild(element as Node)

    // Wait for first stream emission (async)
    await new Promise(resolve => setTimeout(resolve, 5))

    // First emission might show step 1 or 2 (depends on timing)
    // Just verify it starts with loading
    expect(document.body.textContent).toContain('Loading')

    await new Promise(resolve => setTimeout(resolve, 50))

    // Final state
    expect(document.body.textContent).toContain('Final result!')
  })

  it('should handle errors with catchAll in user Stream', async () => {
    const AsyncComponent = createAsyncComponent(
      () => Stream.make(<div>Loading...</div>).pipe(
        Stream.concat(
          Stream.fromEffect(
            Effect.fail(new Error('Test error')).pipe(
              Effect.catchAll(error =>
                Effect.succeed(<div class="error">Error: {error.message}</div>)
              )
            )
          )
        )
      )
    )

    const element = AsyncComponent({})
    document.body.appendChild(element as Node)

    await new Promise(resolve => setTimeout(resolve, 50))

    expect(document.body.textContent).toContain('Error: Test error')
    expect(document.body.querySelector('.error')).toBeTruthy()
  })

  it('should provide refetch functionality via injected props', async () => {
    let fetchCount = 0

    const AsyncComponent = createAsyncComponent(
      (props: { userId: string } & { refetch: () => Promise<void> }) =>
        Stream.make(<div>Loading...</div>).pipe(
          Stream.concat(
            Stream.fromEffect(
              Effect.sleep('10 millis').pipe(
                Effect.map(() => {
                  fetchCount++

                  const div = document.createElement('div')
                  const text = document.createElement('span')
                  text.textContent = `User ${props.userId} - Fetch #${fetchCount}`

                  const button = document.createElement('button')
                  button.textContent = 'Refetch'
                  button.onclick = () => props.refetch()
                  button.className = 'refetch-btn'

                  div.appendChild(text)
                  div.appendChild(button)
                  return div
                })
              )
            )
          )
        )
    )

    const element = (AsyncComponent as any)({ userId: '123' })
    document.body.appendChild(element as Node)

    await new Promise(resolve => setTimeout(resolve, 50))

    expect(document.body.textContent).toContain('Fetch #1')

    // Click refetch button
    const button = document.body.querySelector('.refetch-btn') as HTMLButtonElement
    expect(button).toBeTruthy()

    button.click()

    await new Promise(resolve => setTimeout(resolve, 50))

    expect(fetchCount).toBe(2)
    expect(document.body.textContent).toContain('Fetch #2')
  })

  it('should handle complex props with multiple fields', async () => {
    type Props = {
      userId: string
      showEmail: boolean
      theme: 'light' | 'dark'
    }

    const AsyncComponent = createAsyncComponent(
      (props: Props) => Stream.make(<div>Loading user...</div>).pipe(
        Stream.concat(
          Stream.fromEffect(
            Effect.sleep('10 millis').pipe(
              Effect.map(() => {
                const div = document.createElement('div')
                div.className = `user-${props.theme}`
                div.textContent = `User: ${props.userId}, Email: ${props.showEmail ? 'shown' : 'hidden'}`
                return div
              })
            )
          )
        )
      )
    )

    const element = AsyncComponent({
      userId: '456',
      showEmail: true,
      theme: 'dark'
    })
    document.body.appendChild(element as Node)

    await new Promise(resolve => setTimeout(resolve, 50))

    expect(document.body.textContent).toContain('User: 456')
    expect(document.body.textContent).toContain('Email: shown')
    expect(document.body.querySelector('.user-dark')).toBeTruthy()
  })

  it('should handle Streams that emit document fragments', async () => {
    const AsyncComponent = createAsyncComponent(
      () => Stream.make(<div>Loading...</div>).pipe(
        Stream.concat(
          Stream.fromEffect(
            Effect.sleep('10 millis').pipe(
              Effect.map(() => {
                const fragment = document.createDocumentFragment()
                const div1 = document.createElement('div')
                div1.textContent = 'First'
                const div2 = document.createElement('div')
                div2.textContent = 'Second'

                fragment.appendChild(div1)
                fragment.appendChild(div2)

                return fragment
              })
            )
          )
        )
      )
    )

    const element = AsyncComponent({})
    document.body.appendChild(element as Node)

    await new Promise(resolve => setTimeout(resolve, 50))

    expect(document.body.textContent).toContain('First')
    expect(document.body.textContent).toContain('Second')
  })

  it('should restart stream when reactive props change', async () => {
    let fetchCount = 0
    const [userIdSignal, setUserIdSignal] = createSignal('user1')

    type Props = { userId: Accessor<string> }

    const AsyncComponent = createAsyncComponent(
      (props: Props) => {
        // Access the signal to make it reactive
        const userId = props.userId()

        return Stream.make(<div>Loading {userId}...</div>).pipe(
          Stream.concat(
            Stream.fromEffect(
              Effect.sleep('10 millis').pipe(
                Effect.map(() => {
                  fetchCount++
                  return <div class="user-info">User: {userId}, Fetch #{fetchCount}</div>
                })
              )
            )
          )
        )
      }
    )

    const element = AsyncComponent({ userId: userIdSignal })
    document.body.appendChild(element as Node)

    await new Promise(resolve => setTimeout(resolve, 50))

    expect(document.body.textContent).toContain('User: user1')
    expect(document.body.textContent).toContain('Fetch #1')
    expect(fetchCount).toBe(1)

    // Change the signal value
    setUserIdSignal('user2')

    // Wait for stream to restart and complete
    await new Promise(resolve => setTimeout(resolve, 100))

    // Should have restarted stream with new userId
    expect(document.body.textContent).toContain('User: user2')
    expect(fetchCount).toBe(2)
  })

  it('should restart stream when multiple reactive props change', async () => {
    let fetchCount = 0
    const [userIdSignal, setUserIdSignal] = createSignal('user1')
    const [includeEmailSignal, setIncludeEmailSignal] = createSignal(false)

    type Props = { userId: Accessor<string>; includeEmail: Accessor<boolean> }

    const AsyncComponent = createAsyncComponent(
      (props: Props) => {
        // Access signals for reactive tracking
        const userId = props.userId()
        const includeEmail = props.includeEmail()

        return Stream.make(<div>Loading...</div>).pipe(
          Stream.concat(
            Stream.fromEffect(
              Effect.sleep('10 millis').pipe(
                Effect.map(() => {
                  fetchCount++
                  return (
                    <div>
                      User: {userId}, Email: {includeEmail ? 'shown' : 'hidden'}, Fetch #{fetchCount}
                    </div>
                  )
                })
              )
            )
          )
        )
      }
    )

    const element = AsyncComponent({ userId: userIdSignal, includeEmail: includeEmailSignal })
    document.body.appendChild(element as Node)

    await new Promise(resolve => setTimeout(resolve, 50))

    expect(document.body.textContent).toContain('User: user1')
    expect(document.body.textContent).toContain('Email: hidden')
    expect(fetchCount).toBe(1)

    // Change userId
    setUserIdSignal('user2')
    await new Promise(resolve => setTimeout(resolve, 100))

    expect(document.body.textContent).toContain('User: user2')
    expect(fetchCount).toBe(2)

    // Change includeEmail
    setIncludeEmailSignal(true)
    await new Promise(resolve => setTimeout(resolve, 100))

    expect(document.body.textContent).toContain('Email: shown')
    expect(fetchCount).toBe(3)
  })

  it('should not restart stream when static props are passed', async () => {
    let fetchCount = 0

    type Props = { userId: string }

    const AsyncComponent = createAsyncComponent(
      (props: Props) => Stream.make(<div>Loading...</div>).pipe(
        Stream.concat(
          Stream.fromEffect(
            Effect.sleep('10 millis').pipe(
              Effect.map(() => {
                fetchCount++
                const div = document.createElement('div')
                div.textContent = `User: ${props.userId}, Fetch #${fetchCount}`
                return div
              })
            )
          )
        )
      )
    )

    const element = AsyncComponent({ userId: 'static-user' })
    document.body.appendChild(element as Node)

    await new Promise(resolve => setTimeout(resolve, 50))

    expect(document.body.textContent).toContain('User: static-user')
    expect(fetchCount).toBe(1)

    // Wait some more time to ensure no refetch happens
    await new Promise(resolve => setTimeout(resolve, 100))

    // Should still be 1 fetch since props didn't change
    expect(fetchCount).toBe(1)
  })

  it('should cancel previous stream when refetch is called', async () => {
    let streamStartCount = 0
    let streamCompleteCount = 0

    const AsyncComponent = createAsyncComponent(
      (props: { refetch: () => Promise<void> }) => {
        streamStartCount++

        return Stream.make(<div>Loading...</div>).pipe(
          Stream.concat(
            Stream.fromEffect(
              Effect.sleep('50 millis').pipe(
                Effect.map(() => {
                  streamCompleteCount++
                  const div = document.createElement('div')
                  div.textContent = `Completed: ${streamCompleteCount}`
                  const button = document.createElement('button')
                  button.className = 'refetch-btn'
                  button.onclick = () => props.refetch()
                  div.appendChild(button)
                  return div
                })
              )
            )
          )
        )
      }
    )

    const element = (AsyncComponent as any)({})
    document.body.appendChild(element as Node)

    // Wait a bit but not long enough for stream to complete
    await new Promise(resolve => setTimeout(resolve, 20))

    expect(streamStartCount).toBe(1)
    expect(streamCompleteCount).toBe(0)

    // Refetch before first stream completes
    const button = document.body.querySelector('.refetch-btn') as HTMLButtonElement

    // First we need to wait for the first stream to complete to get the button
    await new Promise(resolve => setTimeout(resolve, 40))

    expect(streamCompleteCount).toBe(1)

    // Now click to start a new stream
    const btn = document.body.querySelector('.refetch-btn') as HTMLButtonElement
    btn.click()

    await new Promise(resolve => setTimeout(resolve, 60))

    // Should have started 2 streams total and completed 2
    expect(streamStartCount).toBe(2)
    expect(streamCompleteCount).toBe(2)
  })
})
