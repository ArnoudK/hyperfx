import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import { createSignal } from '../src/reactive/signal';
import { jsx, cleanupElementSubscriptions } from '../src/jsx/jsx-runtime';

describe('Subscription Cleanup for Signal Attributes', () => {
  let container: HTMLElement;

  beforeEach(() => {
    container = document.createElement('div');
    document.body.appendChild(container);
  });

  afterEach(() => {
    document.body.removeChild(container);
  });

  it('should allow manual cleanup of element subscriptions', () => {
    const signal1 = createSignal('value1');
    const signal2 = createSignal('value2');

    const element = jsx('div', {
      class: signal1,
      title: signal2
    }) as HTMLElement;

    container.appendChild(element);

    expect(signal1.subscriberCount).toBe(1);
    expect(signal2.subscriberCount).toBe(1);

    // Manual cleanup
    cleanupElementSubscriptions(element);

    // Subscriptions should be cleaned up immediately
    expect(signal1.subscriberCount).toBe(0);
    expect(signal2.subscriberCount).toBe(0);

    // Element should still be in DOM but no longer reactive
    expect(element.parentNode).toBe(container);
    
    // Changing signals should not affect element
    signal1('new-value');
    expect(element.className).toBe('value1'); // Should not update
  });

  it('should handle cleanup for elements with form input signals', () => {
    const valueSignal = createSignal('initial');
    const checkedSignal = createSignal(false);
    const disabledSignal = createSignal(false);

    const input = jsx('input', {
      value: valueSignal,
      checked: checkedSignal,
      disabled: disabledSignal,
      type: 'checkbox'
    }) as HTMLInputElement;

    container.appendChild(input);

    expect(valueSignal.subscriberCount).toBe(1);
    expect(checkedSignal.subscriberCount).toBe(1);
    expect(disabledSignal.subscriberCount).toBe(1);

    // Manual cleanup
    cleanupElementSubscriptions(input);

    expect(valueSignal.subscriberCount).toBe(0);
    expect(checkedSignal.subscriberCount).toBe(0);
    expect(disabledSignal.subscriberCount).toBe(0);
  });

  it('should handle cleanup for elements with content signals', () => {
    const htmlSignal = createSignal('<span>content</span>');
    const textSignal = createSignal('text content');

    const element = jsx('div', {
      innerHTML: htmlSignal,
      textContent: textSignal
    }) as HTMLElement;

    container.appendChild(element);

    expect(htmlSignal.subscriberCount).toBe(1);
    expect(textSignal.subscriberCount).toBe(1);

    cleanupElementSubscriptions(element);

    expect(htmlSignal.subscriberCount).toBe(0);
    expect(textSignal.subscriberCount).toBe(0);
  });

  it('should handle cleanup for multiple signal attributes', () => {
    const signals = Array.from({ length: 10 }, (_, i) => 
      createSignal(`value${i}`)
    );

    // Create element with multiple signals
    const props: Record<string, unknown> = {};
    signals.forEach((signal, index) => {
      props[`attr${index}`] = signal;
    });

    const element = jsx('div', props) as HTMLElement;
    container.appendChild(element);

    // All signals should have subscribers
    signals.forEach(signal => {
      expect(signal.subscriberCount).toBe(1);
    });

    cleanupElementSubscriptions(element);

    // All subscriptions should be cleaned up
    signals.forEach(signal => {
      expect(signal.subscriberCount).toBe(0);
    });
  });

  it('should handle cleanup for function attributes (non-reactive)', () => {
    let callCount = 0;
    const getValue = () => {
      callCount++;
      return `value-${callCount}`;
    };

    const element = jsx('div', {
      'data-value': getValue
    }) as HTMLElement;

    container.appendChild(element);

    // Function should have been called once during element creation
    expect(callCount).toBe(1);
    expect(element.getAttribute('data-value')).toBe('value-1');

    // No subscriptions to clean up for function attributes
    cleanupElementSubscriptions(element);

    // Function should not be called again during cleanup
    expect(callCount).toBe(1);
    expect(element.getAttribute('data-value')).toBe('value-1');
  });

  it('should handle multiple cleanup calls safely', () => {
    const signal = createSignal('value');
    const element = jsx('div', { class: signal }) as HTMLElement;

    container.appendChild(element);

    expect(signal.subscriberCount).toBe(1);

    // First cleanup
    cleanupElementSubscriptions(element);
    expect(signal.subscriberCount).toBe(0);

    // Second cleanup should be safe
    cleanupElementSubscriptions(element);
    expect(signal.subscriberCount).toBe(0);
  });

  it('should handle cleanup for elements without subscriptions', () => {
    const element = jsx('div', { 
      class: 'static-class',
      title: 'static-title' 
    }) as HTMLElement;

    container.appendChild(element);

    // Cleanup should be safe even with no subscriptions
    expect(() => {
      cleanupElementSubscriptions(element);
    }).not.toThrow();

    expect(element.className).toBe('static-class');
    expect(element.title).toBe('static-title');
  });
});