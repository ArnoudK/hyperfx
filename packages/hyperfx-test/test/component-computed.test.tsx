import { createSignal, createMemo } from 'hyperfx';
import { describe, it, expect, beforeEach, afterEach } from 'vitest';

describe('Component returning computed', () => {
  let container: HTMLElement;

  beforeEach(() => {
    container = document.createElement('div');
    document.body.appendChild(container);
  });

  afterEach(() => {
    document.body.removeChild(container);
    container.innerHTML = '';
  });

  it('should render component that returns a memo switching between elements', () => {
    const thing = createSignal(false);
    
    function MyComponent() {
      return createMemo(() => {
        const b = thing();
        if (b) {
          return <span>Span content</span>;
        } else {
          return <div>Div content</div>;
        }
      });
    }

    const element = (
      <div class="wrapper">
        <MyComponent />
      </div>
    );

    container.appendChild(element as Node);

    
    
    // Initially should render div
    expect(container.querySelector('div.wrapper div')).toBeTruthy();
    expect(container.querySelector('div.wrapper div')?.textContent).toBe('Div content');
    expect(container.querySelector('div.wrapper span')).toBeNull();

    // Toggle to true - should render span
    thing(true);
    

    expect(container.querySelector('div.wrapper span')).toBeTruthy();
    expect(container.querySelector('div.wrapper span')?.textContent).toBe('Span content');
    expect(container.querySelector('div.wrapper div:not(.wrapper)')).toBeNull();

    // Toggle back to false - should render div again
    thing(false);
    
    expect(container.querySelector('div.wrapper div:not(.wrapper)')).toBeTruthy();
    expect(container.querySelector('div.wrapper div:not(.wrapper)')?.textContent).toBe('Div content');
    expect(container.querySelector('div.wrapper span')).toBeNull();
  });

  it('should handle component returning memo with text nodes', () => {
    const count = createSignal(0);
    
    function Counter() {
      return createMemo(() => {
        const c = count();
        return <div class="counter">Count: {c}</div>;
      });
    }

    const element = (
      <div class="app">
        <Counter />
      </div>
    );

    container.appendChild(element as Node);

    const counterDiv = container.querySelector('.counter');
    expect(counterDiv).toBeTruthy();
    expect(counterDiv?.textContent?.trim()).toBe('Count: 0');

    // Update count
    count(5);

    expect(container.querySelector('.counter')?.textContent?.trim()).toBe('Count: 5');
  });

  // TODO: Fix reactive attributes inside memo-returned JSX
  it.skip('should handle nested components returning memos', () => {
    const show = createSignal(true);
    
    function Inner() {
      return createMemo(() => {
        return <span class="inner">Inner content</span>;
      });
    }
    
    function Outer() {
      return createMemo(() => {
        if (show()) {
          return (
            <div class="outer">
              <Inner />
            </div>
          );
        } else {
          return <div class="outer-empty">Empty</div>;
        }
      });
    }

    const element = (
      <div class="root">
        <Outer />
      </div>
    );

    container.appendChild(element as Node);
    
    // Initially should show inner component
    expect(container.querySelector('.outer')).toBeTruthy();
    expect(container.querySelector('.inner')).toBeTruthy();
    expect(container.querySelector('.inner')?.textContent).toBe('Inner content');

    // Toggle to false
    show(false);
    
    expect(container.querySelector('.outer-empty')).toBeTruthy();
    expect(container.querySelector('.outer-empty')?.textContent).toBe('Empty');
    expect(container.querySelector('.inner')).toBeNull();
  });

  // TODO: Fix reactive attributes inside memo-returned JSX  
  it.skip('should handle component returning memo with dynamic attributes', () => {
    const isActive = createSignal(false);
    const text = createSignal('initial');
    
    function DynamicComponent() {
      const memo = createMemo(() => {
        const active = isActive();
        const textValue = text();
        const element = (
          <div 
            class={active ? 'active' : 'inactive'}
            data-text={textValue}
          >
            Status: {active ? 'Active' : 'Inactive'}
          </div>
        );
        return element;
      });
      return memo;
    }

    const element = (
      <div class="container">
        <DynamicComponent />
      </div>
    );

    container.appendChild(element as Node);

   
    
    const dynamicDiv = container.querySelector('div:not(.container)');
    expect(dynamicDiv).toBeTruthy();
    expect(dynamicDiv?.classList.contains('inactive')).toBe(true);
    expect(dynamicDiv?.getAttribute('data-text')).toBe('initial');
    expect(dynamicDiv?.textContent?.includes('Inactive')).toBe(true);

    // Update signals
    
    isActive(true);
    text('updated');
   
    
    const updatedDiv = container.querySelector('div:not(.container)');
    expect(updatedDiv?.classList.contains('active')).toBe(true);
    expect(updatedDiv?.getAttribute('data-text')).toBe('updated');
    expect(updatedDiv?.textContent?.includes('Active')).toBe(true);
  });

  it('should handle component returning memo that can be null', () => {
    const show = createSignal(true);
    
    function OptionalComponent() {
      return createMemo(() => {
        if (show()) {
          return <div class="visible">Visible</div>;
        }
        return null;
      });
    }

    const element = (
      <div class="wrapper">
        <OptionalComponent />
      </div>
    );

    container.appendChild(element as Node);

    expect(container.querySelector('.visible')).toBeTruthy();
    expect(container.querySelector('.visible')?.textContent).toBe('Visible');

    // Hide component
    show(false);
    
    expect(container.querySelector('.visible')).toBeNull();
    expect(container.querySelector('.wrapper')?.children.length).toBe(0);

    // Show again
    show(true);
    
    expect(container.querySelector('.visible')).toBeTruthy();
    expect(container.querySelector('.visible')?.textContent).toBe('Visible');
  });
});
