import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { cleanupElementSubscriptions, createSignal } from 'hyperfx'

describe('Error Handling for Invalid Signal Values', () => {
  let container: HTMLElement;
  let consoleSpy: { error: any };

  beforeEach(() => {
    container = document.createElement('div');
    document.body.appendChild(container);

    // Spy on console methods
    consoleSpy = {
      error: vi.spyOn(console, 'error').mockImplementation(() => { })
    };
  });

  afterEach(() => {
    document.body.removeChild(container);
    consoleSpy.error.mockRestore();
  });

  describe('Invalid Signal Values', () => {
    it('should handle undefined signal values gracefully', () => {
      const [undefinedSignal, setUndefinedSignal] = createSignal<string | undefined>(undefined);
      const element = (
        <div title={undefinedSignal as any} data-test={undefinedSignal as any} />
      ) as HTMLElement;

      container.appendChild(element);

      expect(element.hasAttribute('title')).toBe(false);
      expect(element.hasAttribute('data-test')).toBe(false);

      // Update to defined value
      setUndefinedSignal('defined');
      expect(element.getAttribute('title')).toBe('defined');
      expect(element.getAttribute('data-test')).toBe('defined');
    });

    it('should handle null signal values gracefully', () => {
      const [nullSignal, setNullSignal] = createSignal<string | null>(null);
      const element = <div class={nullSignal as any} id={nullSignal as any} /> as HTMLElement;

      container.appendChild(element);

      expect(element.hasAttribute('class')).toBe(false);
      expect(element.hasAttribute('id')).toBe(false);

      // Update to non-null value
      setNullSignal('not-null');
      expect(element.className).toBe('not-null');
      expect(element.id).toBe('not-null');
    });

    it('should handle symbol signal values', () => {
      const [symbolSignal] = createSignal(Symbol('test'));
      const element = <div data-symbol={symbolSignal} /> as HTMLElement;

      container.appendChild(element);

      // Symbol should be converted to string
      expect(element.getAttribute('data-symbol')).toBeTruthy();
      expect(typeof element.getAttribute('data-symbol')).toBe('string');
    });

    it('should handle function signal values', () => {
      const [functionSignal] = createSignal(() => 'from-function');
      const element = <div data-function={functionSignal} /> as HTMLElement;

      container.appendChild(element);

      // Function should be converted to string (function toString shows source)
      const attrValue = element.getAttribute('data-function');
      expect(attrValue).toContain('from-function');
      expect(typeof attrValue).toBe('string');
    });

    it('should handle object signal values for non-style attributes', () => {
      const [objectSignal] = createSignal({ key: 'value', nested: { prop: 'test' } });
      const element = <div data-object={objectSignal} /> as HTMLElement;

      container.appendChild(element);

      // Object should be converted to string for non-style attributes
      expect(element.getAttribute('data-object')).toBeTruthy();
      expect(typeof element.getAttribute('data-object')).toBe('string');
    });
  });

  describe('Signal Execution Errors', () => {
    it('should handle signals that throw during value access', () => {
      const [throwingSignal, setThrowingSignal] = createSignal('initial');

      // Override signal to throw
      Object.defineProperty(throwingSignal, 'get', {
        get: () => {
          if ((throwingSignal as any).peek() === 'error') {
            throw new Error('Signal value access error');
          }
          return (throwingSignal as any).peek();
        },
        configurable: true
      });

      const element = <div class={throwingSignal} /> as HTMLElement;
      container.appendChild(element);

      expect(element.className).toBe('initial');

      // Setting the signal should not throw, but accessing during update should
      setThrowingSignal('error');
    });
  });

  describe('Subscription Setup Errors', () => {
    it('should handle signal subscription errors gracefully', () => {
      const [problematicSignal] = createSignal('test');

      // Override subscribe to throw
      const originalSubscribe = problematicSignal.subscribe;
      problematicSignal.subscribe = function (callback: (v: string) => void) {
        throw new Error('Cannot subscribe to this signal');
      };

      const element = <div class={problematicSignal} /> as HTMLElement;
      
      // Should not throw even if subscription fails
      expect(() => {
        container.appendChild(element);
      }).not.toThrow();

      // Initial value may not be set if subscription setup fails
      expect(element.getAttribute('class')).toBe(null);

      // Restore original subscribe
      problematicSignal.subscribe = originalSubscribe;
    });

    it('should cleanup subscription errors gracefully', () => {
      const [errorSignal] = createSignal('test');

      // Override subscribe to return unsubscribe that throws
      const originalSubscribe = errorSignal.subscribe;
      errorSignal.subscribe = function (callback) {
        const unsubscribe = originalSubscribe.call(this, callback);
        return () => {
          throw new Error('Cannot unsubscribe from this signal');
        };
      };

      const element = <div class={errorSignal} /> as HTMLElement;
      container.appendChild(element);

      expect(errorSignal.subscriberCount).toBeGreaterThan(0);

      // Cleanup should not throw
      expect(() => {
        cleanupElementSubscriptions(element);
      }).not.toThrow();

      // Should log error during cleanup attempt
      expect(consoleSpy.error).toHaveBeenCalled();
    });
  });

  describe('Edge Cases', () => {
    it('should handle extremely long attribute values', () => {
      const longString = 'a'.repeat(10000);
      const [longSignal, setLongSignal] = createSignal(longString);

      const element = <div data-long={longSignal} /> as HTMLElement;
      container.appendChild(element);

      expect(element.getAttribute('data-long')).toBe(longString);
      expect(element.getAttribute('data-long')?.length).toBe(10000);

      // Update with even longer string
      const evenLongerString = 'b'.repeat(20000);
      setLongSignal(evenLongerString);

      expect(element.getAttribute('data-long')).toBe(evenLongerString);
      expect(element.getAttribute('data-long')?.length).toBe(20000);
    });

    it('should handle special characters in attribute values', () => {
      const specialChars = '<>"&\'\\n\r\t';
      const [specialSignal] = createSignal(specialChars);

      const element = <div data-special={specialSignal} /> as HTMLElement;
      container.appendChild(element);

      // Special characters should be preserved in attribute values
      expect(element.getAttribute('data-special')).toBe(specialChars);
    });

    it('should handle numeric edge cases', () => {
      const [numericSignal, setNumericSignal] = createSignal(Number.POSITIVE_INFINITY);
      const element = <div data-infinity={numericSignal} /> as HTMLElement;
      container.appendChild(element);

      expect(element.getAttribute('data-infinity')).toBe('Infinity');

      // Update with NaN
      setNumericSignal(Number.NaN);
      expect(element.getAttribute('data-infinity')).toBe('NaN');

      // Update with negative infinity
      setNumericSignal(Number.NEGATIVE_INFINITY);
      expect(element.getAttribute('data-infinity')).toBe('-Infinity');
    });

    it('should handle mixed invalid values', () => {
      const signals = [
        createSignal(undefined),
        createSignal(null),
        createSignal(''),
        createSignal(0),
        createSignal(false),
        createSignal([]),
        createSignal({})
      ];

      const elements = signals.map(([getter], index) => {
        const el = (<div data-invalid={getter as any} data-index={index} />) as unknown as HTMLElement;
        return el;
      });

      elements.forEach((element): void => {
        container.appendChild(element);
      });

      // All elements should handle their invalid values gracefully
      elements.forEach((element, index) => {
        const hasAttribute = element.hasAttribute('data-invalid');
        const value = element.getAttribute('data-invalid');

        // undefined and null should not have attributes
        if (index < 2) {
          expect(hasAttribute).toBe(false);
          expect(value).toBe(null);
        } else {
          // Empty string, 0, false should have string attributes
          expect(hasAttribute).toBe(true);
          expect(typeof value).toBe('string');
        }
      });
    });
  });
});
