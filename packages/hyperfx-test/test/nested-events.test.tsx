import { createSignal } from 'hyperfx';
import { describe, it, expect, beforeEach, afterEach } from 'vitest';

describe('Nested Event Handlers', () => {
  let container: HTMLElement;

  beforeEach(() => {
    container = document.createElement('div');
    document.body.appendChild(container);
  });

  afterEach(() => {
    document.body.removeChild(container);
    container.innerHTML = '';
  });

  it('handles event handlers on nested input elements', () => {
    const name = createSignal('');
    let inputCount = 0;

    const element = (
      <div class="wrapper">
        <input
          type="text"
          value={name()}
          oninput={(e) => {
            inputCount++;
            name((e.target as HTMLInputElement).value);
          }}
        />
        <p>{name}</p>
      </div>
    );

    container.appendChild(element as Node);

    const input = container.querySelector('input') as HTMLInputElement;
    expect(input).toBeTruthy();
    expect(input.value).toBe('');

    // Simulate input event
    input.value = 'Hello';
    input.dispatchEvent(new Event('input', { bubbles: true }));

    expect(inputCount).toBe(1);
    expect(name()).toBe('Hello');
    expect(container.querySelector('p')?.textContent).toBe('Hello');
  });

  it('handles multiple event handlers on nested buttons', () => {
    const count = createSignal(0);
    let incrementClicks = 0;
    let decrementClicks = 0;

    const element = (
      <div>
        <div class="controls">
          <button
            type="button"
            class="increment"
            onclick={() => {
              incrementClicks++;
              count(count() + 1);
            }}
          >
            +1
          </button>
          <button
            type="button"
            class="decrement"
            onclick={() => {
              decrementClicks++;
              count(count() - 1);
            }}
          >
            -1
          </button>
        </div>
        <p class="count">{count}</p>
      </div>
    );

    container.appendChild(element as Node);

    const incrementBtn = container.querySelector('.increment') as HTMLButtonElement;
    const decrementBtn = container.querySelector('.decrement') as HTMLButtonElement;
    const countP = container.querySelector('.count') as HTMLElement;

    expect(count()).toBe(0);
    expect(countP.textContent?.trim()).toBe('0');

    // Click increment
    incrementBtn.click();
    expect(incrementClicks).toBe(1);
    expect(count()).toBe(1);
    expect(countP.textContent?.trim()).toBe('1');

    // Click increment again
    incrementBtn.click();
    expect(incrementClicks).toBe(2);
    expect(count()).toBe(2);

    // Click decrement
    decrementBtn.click();
    expect(decrementClicks).toBe(1);
    expect(count()).toBe(1);
  });

  it('handles deeply nested event handlers', () => {
    const value = createSignal('initial');
    let clickCount = 0;

    const element = (
      <div>
        <div class="level-1">
          <div class="level-2">
            <div class="level-3">
              <button
                type="button"
                onclick={() => {
                  clickCount++;
                  value('clicked');
                }}
              >
                Click me
              </button>
            </div>
          </div>
        </div>
        <span>{value}</span>
      </div>
    );

    container.appendChild(element as Node);

    expect(value()).toBe('initial');

    const button = container.querySelector('button') as HTMLButtonElement;
    button.click();

    expect(clickCount).toBe(1);
    expect(value()).toBe('clicked');
    expect(container.querySelector('span')?.textContent).toBe('clicked');
  });

  it('handles event handlers and reactive attributes on same nested element', () => {
    const inputValue = createSignal('test');
    const isDisabled = createSignal(false);
    let changeCount = 0;

    const element = (
      <div>
        <input
          type="text"
          value={inputValue()}
          disabled={isDisabled()}
          oninput={(e) => {
            changeCount++;
            inputValue((e.target as HTMLInputElement).value);
          }}
        />
      </div>
    );

    container.appendChild(element as Node);

    const input = container.querySelector('input') as HTMLInputElement;
    
    expect(input.value).toBe('test');
    expect(input.disabled).toBe(false);

    // Change value
    input.value = 'new value';
    input.dispatchEvent(new Event('input', { bubbles: true }));

    expect(changeCount).toBe(1);
    expect(inputValue()).toBe('new value');

    // Change disabled state
    isDisabled(true);
    expect(input.disabled).toBe(true);
  });

  it('handles sibling elements with different event handlers', () => {
    const firstName = createSignal('');
    const lastName = createSignal('');
    let firstNameChanges = 0;
    let lastNameChanges = 0;

    const element = (
      <div>
        <div class="form">
          <input
            type="text"
            class="first-name"
            value={firstName()}
            oninput={(e) => {
              firstNameChanges++;
              firstName((e.target as HTMLInputElement).value);
            }}
          />
          <input
            type="text"
            class="last-name"
            value={lastName()}
            oninput={(e) => {
              lastNameChanges++;
              lastName((e.target as HTMLInputElement).value);
            }}
          />
        </div>
        <p class="full-name">{firstName} {lastName}</p>
      </div>
    );

    container.appendChild(element as Node);

    const firstNameInput = container.querySelector('.first-name') as HTMLInputElement;
    const lastNameInput = container.querySelector('.last-name') as HTMLInputElement;
    const fullNameP = container.querySelector('.full-name') as HTMLElement;

    // Change first name
    firstNameInput.value = 'John';
    firstNameInput.dispatchEvent(new Event('input', { bubbles: true }));

    expect(firstNameChanges).toBe(1);
    expect(lastNameChanges).toBe(0);
    expect(firstName()).toBe('John');
    expect(fullNameP.textContent?.trim()).toBe('John');

    // Change last name
    lastNameInput.value = 'Doe';
    lastNameInput.dispatchEvent(new Event('input', { bubbles: true }));

    expect(firstNameChanges).toBe(1);
    expect(lastNameChanges).toBe(1);
    expect(lastName()).toBe('Doe');
    expect(fullNameP.textContent?.trim()).toBe('John Doe');
  });
});
