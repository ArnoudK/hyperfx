import { createSignal, createComputed } from 'hyperfx';
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
    const [thing, setThing] = createSignal(false);
    
    function MyComponent() {
      return createComputed(() => {
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
    setThing(true);
    

    expect(container.querySelector('div.wrapper span')).toBeTruthy();
    expect(container.querySelector('div.wrapper span')?.textContent).toBe('Span content');
    expect(container.querySelector('div.wrapper div:not(.wrapper)')).toBeNull();

    // Toggle back to false - should render div again
    setThing(false);
    
    expect(container.querySelector('div.wrapper div:not(.wrapper)')).toBeTruthy();
    expect(container.querySelector('div.wrapper div:not(.wrapper)')?.textContent).toBe('Div content');
    expect(container.querySelector('div.wrapper span')).toBeNull();
  });

  it('should handle component returning memo with text nodes', () => {
    const [count, setCount] = createSignal(0);
    
    function Counter() {
      return createComputed(() => {
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
    setCount(5);

    expect(container.querySelector('.counter')?.textContent?.trim()).toBe('Count: 5');
  });

  it('should handle nested components returning memos', () => {
    const [show, setShow] = createSignal(true);
    
    function Inner() {
      return createComputed(() => {
        return <span class="inner">Inner content</span>;
      });
    }
    
    function Outer() {
      return createComputed(() => {
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
    setShow(false);
    
    expect(container.querySelector('.outer-empty')).toBeTruthy();
    expect(container.querySelector('.outer-empty')?.textContent).toBe('Empty');
    expect(container.querySelector('.inner')).toBeNull();
  });

  it('should handle component returning memo with dynamic attributes', () => {
    const [isActive, setIsActive] = createSignal(false);
    const [text, setText] = createSignal('initial');
    
    function DynamicComponent() {
      const memo = createComputed(() => {
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
    
    setIsActive(true);
    setText('updated');
   
    
    const updatedDiv = container.querySelector('div:not(.container)');
    expect(updatedDiv?.classList.contains('active')).toBe(true);
    expect(updatedDiv?.getAttribute('data-text')).toBe('updated');
    expect(updatedDiv?.textContent?.includes('Active')).toBe(true);
  });

  it('should handle component returning memo that can be null', () => {
    const [show, setShow] = createSignal(true);
    
    function OptionalComponent() {
      return createComputed(() => {
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
    setShow(false);
    
    expect(container.querySelector('.visible')).toBeNull();
    expect(container.querySelector('.wrapper')?.children.length).toBe(0);

    // Show again
    setShow(true);
    
    expect(container.querySelector('.visible')).toBeTruthy();
    expect(container.querySelector('.visible')?.textContent).toBe('Visible');
  });

  it('should not recompute computed with stale values', async () => {
    const [count, setCount] = createSignal(0);
    const isEven = createComputed(() => count() % 2 === 0);
    const recomputed: number[] = [];

    const evenOddText = createComputed(() => {
      const c = count();
      recomputed.push(c);
      if (c === 0) return 'N/A';
      return isEven() ? 'Even' : 'Odd';
    });

    const element = (
      <div>
        {evenOddText}
      </div>
    ) as HTMLDivElement;

    container.appendChild(element as Node);

    expect(recomputed.length).toBe(1);
    expect(recomputed[0]).toBe(0);

    setCount(1);
    await new Promise(resolve => setTimeout(resolve, 0));

    expect(recomputed.length).toBe(2);
    expect(recomputed[1]).toBe(1);
    expect(element.textContent).toBe('Odd');
  });
});
