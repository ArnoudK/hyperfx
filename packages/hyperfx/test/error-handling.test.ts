import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { createSignal } from '../src/reactive/signal';
import { jsx, cleanupElementSubscriptions } from '../src/jsx/jsx-runtime';

describe('Error Handling for Invalid Signal Values', () => {
  let container: HTMLElement;
  let consoleSpy: { error: any };

  beforeEach(() => {
    container = document.createElement('div');
    document.body.appendChild(container);
    
    // Spy on console methods
    consoleSpy = {
      error: vi.spyOn(console, 'error').mockImplementation(() => {})
    };
  });

  afterEach(() => {
    document.body.removeChild(container);
    consoleSpy.error.mockRestore();
  });

  describe('Invalid Signal Values', () => {
    it('should handle undefined signal values gracefully', () => {
      const undefinedSignal = createSignal<string | undefined>(undefined);
      const element = jsx('div', { 
        title: undefinedSignal,
        'data-test': undefinedSignal 
      }) as HTMLElement;
      
      container.appendChild(element);
      
      expect(element.hasAttribute('title')).toBe(false);
      expect(element.hasAttribute('data-test')).toBe(false);
      
      // Update to defined value
      undefinedSignal('defined');
      expect(element.getAttribute('title')).toBe('defined');
      expect(element.getAttribute('data-test')).toBe('defined');
    });

    it('should handle null signal values gracefully', () => {
      const nullSignal = createSignal<string | null>(null);
      const element = jsx('div', { 
        className: nullSignal,
        id: nullSignal 
      }) as HTMLElement;
      
      container.appendChild(element);
      
      expect(element.hasAttribute('class')).toBe(false);
      expect(element.hasAttribute('id')).toBe(false);
      
      // Update to non-null value
      nullSignal('not-null');
      expect(element.className).toBe('not-null');
      expect(element.id).toBe('not-null');
    });

    it('should handle symbol signal values', () => {
      const symbolSignal = createSignal(Symbol('test'));
      const element = jsx('div', { 
        'data-symbol': symbolSignal 
      }) as HTMLElement;
      
      container.appendChild(element);
      
      // Symbol should be converted to string
      expect(element.getAttribute('data-symbol')).toBeTruthy();
      expect(typeof element.getAttribute('data-symbol')).toBe('string');
    });

    it('should handle function signal values', () => {
      const functionSignal = createSignal(() => 'from-function');
      const element = jsx('div', { 
        'data-function': functionSignal 
      }) as HTMLElement;
      
      container.appendChild(element);
      
      // Function should be converted to string
      expect(element.getAttribute('data-function')).toBe('from-function');
    });

    it('should handle object signal values for non-style attributes', () => {
      const objectSignal = createSignal({ key: 'value', nested: { prop: 'test' } });
      const element = jsx('div', { 
        'data-object': objectSignal 
      }) as HTMLElement;
      
      container.appendChild(element);
      
      // Object should be converted to string for non-style attributes
      expect(element.getAttribute('data-object')).toBeTruthy();
      expect(typeof element.getAttribute('data-object')).toBe('string');
    });
  });

  describe('Signal Execution Errors', () => {
    it('should handle signals that throw during value access', () => {
      const throwingSignal = createSignal('initial');
      
      // Override signal to throw
      Object.defineProperty(throwingSignal, 'get', {
        get: () => {
          if (throwingSignal.peek() === 'error') {
            throw new Error('Signal value access error');
          }
          return throwingSignal.peek();
        },
        configurable: true
      });

      const element = jsx('div', { className: throwingSignal }) as HTMLElement;
      container.appendChild(element);
      
      expect(element.className).toBe('initial');
      
      expect(() => {
        throwingSignal('error');
      }).toThrow('Signal value access error');
      
      // Should log error about attribute update failure
      expect(consoleSpy.error).toHaveBeenCalled();
    });
  });

  describe('Subscription Setup Errors', () => {
    it('should handle signal subscription errors with fallback', () => {
      const problematicSignal = createSignal('test');
      
      // Override subscribe to throw
      const originalSubscribe = problematicSignal.subscribe;
      problematicSignal.subscribe = function(callback) {
        throw new Error('Cannot subscribe to this signal');
      };

      const element = jsx('div', { className: problematicSignal }) as HTMLElement;
      container.appendChild(element);
      
      // Should attempt to set fallback value
      expect(element.getAttribute('class')).toBeTruthy();
      
      // Restore original subscribe
      problematicSignal.subscribe = originalSubscribe;
    });

    it('should cleanup subscription errors gracefully', () => {
      const errorSignal = createSignal('test');
      
      // Override subscribe to return unsubscribe that throws
      errorSignal.subscribe = function(callback) {
        return () => {
          throw new Error('Cannot unsubscribe from this signal');
        };
      };

      const element = jsx('div', { className: errorSignal }) as HTMLElement;
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
      const longSignal = createSignal(longString);
      
      const element = jsx('div', { 'data-long': longSignal }) as HTMLElement;
      container.appendChild(element);
      
      expect(element.getAttribute('data-long')).toBe(longString);
      expect(element.getAttribute('data-long')?.length).toBe(10000);
      
      // Update with even longer string
      const evenLongerString = 'b'.repeat(20000);
      longSignal(evenLongerString);
      
      expect(element.getAttribute('data-long')).toBe(evenLongerString);
      expect(element.getAttribute('data-long')?.length).toBe(20000);
    });

    it('should handle special characters in attribute values', () => {
      const specialChars = '<>"&\'\\n\r\t';
      const specialSignal = createSignal(specialChars);
      
      const element = jsx('div', { 'data-special': specialSignal }) as HTMLElement;
      container.appendChild(element);
      
      // Special characters should be preserved in attribute values
      expect(element.getAttribute('data-special')).toBe(specialChars);
    });

    it('should handle numeric edge cases', () => {
      const numericSignal = createSignal(Number.POSITIVE_INFINITY);
      const element = jsx('div', { 'data-infinity': numericSignal }) as HTMLElement;
      container.appendChild(element);
      
      expect(element.getAttribute('data-infinity')).toBe('Infinity');
      
      // Update with NaN
      numericSignal(Number.NaN);
      expect(element.getAttribute('data-infinity')).toBe('NaN');
      
      // Update with negative infinity
      numericSignal(Number.NEGATIVE_INFINITY);
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
      
      const elements = signals.map((signal, index): HTMLElement =>
        jsx('div', { [`data-invalid-${index}`]: signal }) as HTMLElement
      );
      
      elements.forEach((element): void => {
        container.appendChild(element);
      });
      
      // All elements should handle their invalid values gracefully
      elements.forEach((element, index) => {
        const hasAttribute = element.hasAttribute(`data-invalid-${index}`);
        const value = element.getAttribute(`data-invalid-${index}`);
        
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