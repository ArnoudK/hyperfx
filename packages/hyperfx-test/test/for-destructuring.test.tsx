import { createComputed, For } from 'hyperfx';
import { describe, it, expect, beforeEach, afterEach } from 'vitest';

describe('For Component with Destructuring', () => {
  let container: HTMLElement;

  beforeEach(() => {
    container = document.createElement('div');
    document.body.appendChild(container);
  });

  afterEach(() => {
    document.body.removeChild(container);
    container.innerHTML = '';
  });

  it('handles object destructuring in children function', () => {
    const items = createComputed(() => [
      { id: 1, name: 'Alice', age: 30 },
      { id: 2, name: 'Bob', age: 25 }
    ]);

    const element = (
      <div>
        <For each={items}>
          {({ id, name, age }) => (
            <div class="item">{name}-{age}</div>
          )}
        </For>
      </div>
    );

    container.appendChild(element as Node);

    // Check that destructuring worked correctly
    const itemDivs = container.querySelectorAll('.item');
    expect(itemDivs).toHaveLength(2);
    expect(itemDivs[0]?.textContent).toBe('Alice-30');
    expect(itemDivs[1]?.textContent).toBe('Bob-25');
  });

  it('handles partial object destructuring', () => {
    const items = createComputed(() => [
      { id: 1, name: 'Alice', age: 30, city: 'NYC' },
      { id: 2, name: 'Bob', age: 25, city: 'LA' }
    ]);

    const element = (
      <div>
        <For each={items}>
          {({ name, city }) => (
            <div class="item">{name} in {city}</div>
          )}
        </For>
      </div>
    );

    container.appendChild(element as Node);

    const itemDivs = container.querySelectorAll('.item');
    expect(itemDivs[0]?.textContent).toBe('Alice in NYC');
    expect(itemDivs[1]?.textContent).toBe('Bob in LA');
  });

  it('handles array destructuring', () => {
    const pairs = createComputed(() => [
      [1, 'one'],
      [2, 'two'],
      [3, 'three']
    ]);

    const element = (
      <div>
        <For each={pairs}>
          {([num, text]) => (
            <div class="item">{num}:{text}</div>
          )}
        </For>
      </div>
    );

    container.appendChild(element as Node);

    const itemDivs = container.querySelectorAll('.item');
    expect(itemDivs).toHaveLength(3);
    expect(itemDivs[0]?.textContent).toBe('1:one');
    expect(itemDivs[1]?.textContent).toBe('2:two');
    expect(itemDivs[2]?.textContent).toBe('3:three');
  });

  it('handles destructuring with rest element', () => {
    const items = createComputed(() => [
      { id: 1, name: 'Alice', age: 30, city: 'NYC', country: 'USA' },
      { id: 2, name: 'Bob', age: 25, city: 'LA', country: 'USA' }
    ]);

    const element = (
      <div>
        <For each={items}>
          {({ name, ...rest }) => (
            <div class="item" data-id={rest.id}>{name}</div>
          )}
        </For>
      </div>
    );

    container.appendChild(element as Node);

    const itemDivs = container.querySelectorAll('.item');
    expect(itemDivs[0]?.textContent).toBe('Alice');
    expect(itemDivs[0]?.getAttribute('data-id')).toBe('1');
    expect(itemDivs[1]?.textContent).toBe('Bob');
    expect(itemDivs[1]?.getAttribute('data-id')).toBe('2');
  });

  it('handles destructuring with default values', () => {
    const items = createComputed(() => [
      { id: 1, name: 'Alice' },
      { id: 2, name: 'Bob', status: 'active' }
    ]);

    const element = (
      <div>
        <For each={items}>
          {({ name, status = 'inactive' }) => (
            <div class="item">{name}:{status}</div>
          )}
        </For>
      </div>
    );

    container.appendChild(element as Node);

    const itemDivs = container.querySelectorAll('.item');
    expect(itemDivs[0]?.textContent).toBe('Alice:inactive');
    expect(itemDivs[1]?.textContent).toBe('Bob:active');
  });

  it('handles nested destructuring', () => {
    const items = createComputed(() => [
      { id: 1, user: { name: 'Alice', email: 'alice@example.com' } },
      { id: 2, user: { name: 'Bob', email: 'bob@example.com' } }
    ]);

    const element = (
      <div>
        <For each={items}>
          {({ user: { name, email } }) => (
            <div class="item">{name} - {email}</div>
          )}
        </For>
      </div>
    );

    container.appendChild(element as Node);

    const itemDivs = container.querySelectorAll('.item');
    expect(itemDivs[0]?.textContent).toBe('Alice - alice@example.com');
    expect(itemDivs[1]?.textContent).toBe('Bob - bob@example.com');
  });

  it('handles object destructuring with TypeScript as expression', () => {
    const items = createComputed(() => [
      { value: 1, isActive: true },
      { value: 2, isActive: false }
    ]);

    const element = (
      <div>
        <For each={items}>
          {({ value, isActive }) => (
            <button
              type="button"
              class={isActive ? 'active' : 'inactive'}
            >
              {value}
            </button>
          )}
        </For>
      </div>
    );

    container.appendChild(element as Node);

    const buttons = container.querySelectorAll('button');
    expect(buttons).toHaveLength(2);
    expect(buttons[0]?.textContent?.trim()).toBe('1');
    expect(buttons[0]?.className).toBe('active');
    expect(buttons[1]?.textContent?.trim()).toBe('2');
    expect(buttons[1]?.className).toBe('inactive');
  });
});
