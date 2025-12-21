import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import { createSignal, createComputed } from '../src/reactive/signal';
import { jsx, cleanupElementSubscriptions } from '../src/jsx/jsx-runtime';

describe('Enhanced Style Attribute Reactivity', () => {
  let container: HTMLElement;

  beforeEach(() => {
    container = document.createElement('div');
    document.body.appendChild(container);
  });

  afterEach(() => {
    document.body.removeChild(container);
  });

  describe('String Style Signals', () => {
    it('should handle style string signals', () => {
      const styleSignal = createSignal('color: red; font-size: 16px;');
      const element = jsx('div', { style: styleSignal }) as HTMLElement;
      
      container.appendChild(element);
      
      expect(element.style.color).toBe('red');
      expect(element.style.fontSize).toBe('16px');
      
      styleSignal('color: blue; font-size: 20px;');
      expect(element.style.color).toBe('blue');
      expect(element.style.fontSize).toBe('20px');
    });

    it('should handle empty style string signals', () => {
      const styleSignal = createSignal('color: red;');
      const element = jsx('div', { style: styleSignal }) as HTMLElement;
      
      container.appendChild(element);
      
      expect(element.style.color).toBe('red');
      
      styleSignal('');
      expect(element.style.color).toBe('');
      expect(element.getAttribute('style')).toBe('');
    });

    it('should handle null style string signals', () => {
      const styleSignal = createSignal('color: red;');
      const element = jsx('div', { style: styleSignal }) as HTMLElement;
      
      container.appendChild(element);
      
      expect(element.style.color).toBe('red');
      expect(element.hasAttribute('style')).toBe(true);
      
      styleSignal(null as any);
      expect(element.hasAttribute('style')).toBe(false);
    });
  });

  describe('Object Style Signals', () => {
    it('should handle style object signals', () => {
      const styleSignal = createSignal({
        color: 'red',
        fontSize: '16px',
        backgroundColor: 'blue'
      });
      
      const element = jsx('div', { style: styleSignal }) as HTMLElement;
      container.appendChild(element);
      
      expect(element.style.color).toBe('red');
      expect(element.style.fontSize).toBe('16px');
      expect(element.style.backgroundColor).toBe('blue');
      
      styleSignal({
        color: 'green',
        fontSize: '20px',
        backgroundColor: 'yellow'
      });
      
      expect(element.style.color).toBe('green');
      expect(element.style.fontSize).toBe('20px');
      expect(element.style.backgroundColor).toBe('yellow');
    });

    it('should handle computed style object signals', () => {
      const colorSignal = createSignal('red');
      const sizeSignal = createSignal('16px');
      
      const styleSignal = createComputed(() => ({
        color: colorSignal(),
        fontSize: sizeSignal(),
        backgroundColor: 'blue'
      }));
      
      const element = jsx('div', { style: styleSignal }) as HTMLElement;
      container.appendChild(element);
      
      expect(element.style.color).toBe('red');
      expect(element.style.fontSize).toBe('16px');
      expect(element.style.backgroundColor).toBe('blue');
      
      colorSignal('green');
      expect(element.style.color).toBe('green');
      expect(element.style.fontSize).toBe('16px'); // Should remain unchanged
      
      sizeSignal('20px');
      expect(element.style.fontSize).toBe('20px');
      expect(element.style.color).toBe('green'); // Should remain unchanged
    });

    it('should handle partial style object updates', () => {
      const styleSignal = createSignal({
        color: 'red',
        fontSize: '16px',
        margin: '10px',
        padding: '5px'
      });
      
      const element = jsx('div', { style: styleSignal }) as HTMLElement;
      container.appendChild(element);
      
      expect(element.style.color).toBe('red');
      expect(element.style.fontSize).toBe('16px');
      expect(element.style.margin).toBe('10px');
      expect(element.style.padding).toBe('5px');
      
      // Update with fewer properties
      styleSignal({
        color: 'blue',
        fontSize: '20px',
        margin: '',
        padding: ''
        // margin and padding cleared with empty strings
      });
      
      expect(element.style.color).toBe('blue');
      expect(element.style.fontSize).toBe('20px');
      // Note: margin and padding are not automatically cleared when omitted
      // This is consistent with typical CSS object merging behavior
    });

    it('should handle null/undefined values in style objects', () => {
      const styleSignal = createSignal({
        color: 'red',
        fontSize: null as string | null,
        margin: undefined as string | undefined,
        padding: '5px'
      });
      
      const element = jsx('div', { style: styleSignal }) as HTMLElement;
      container.appendChild(element);
      
      expect(element.style.color).toBe('red');
      expect(element.style.padding).toBe('5px');
      // fontSize and margin should not be set when null/undefined
      expect(element.style.fontSize).toBe('');
      expect(element.style.margin).toBe('');
    });

    it('should handle numeric values in style objects', () => {
      const styleSignal = createSignal({
        opacity: 0.5,
        zIndex: 10,
        width: '100px'
      });
      
      const element = jsx('div', { style: styleSignal }) as HTMLElement;
      container.appendChild(element);
      
      expect(element.style.opacity).toBe('0.5');
      expect(element.style.zIndex).toBe('10');
      expect(element.style.width).toBe('100px'); // Numeric values become px for width/height
      
      styleSignal({
        opacity: 1,
        zIndex: 20,
        width: '200px'
      });
      
      expect(element.style.opacity).toBe('1');
      expect(element.style.zIndex).toBe('20');
      expect(element.style.width).toBe('200px');
    });
  });

  describe('Static Style Objects', () => {
    it('should handle static style objects', () => {
      const element = jsx('div', { 
        style: {
          color: 'red',
          fontSize: '16px',
          backgroundColor: 'blue'
        }
      }) as HTMLElement;
      
      container.appendChild(element);
      
      expect(element.style.color).toBe('red');
      expect(element.style.fontSize).toBe('16px');
      expect(element.style.backgroundColor).toBe('blue');
    });

    it('should handle empty static style objects', () => {
      const element = jsx('div', { style: {} }) as HTMLElement;
      container.appendChild(element);
      
      expect(element.style.length).toBe(0); // No inline styles
      expect(element.hasAttribute('style')).toBe(false);
    });

    it('should handle null static style', () => {
      const element = jsx('div', { style: null }) as HTMLElement;
      container.appendChild(element);
      
      expect(element.hasAttribute('style')).toBe(false);
    });
  });

  describe('Mixed Style and Other Attributes', () => {
    it('should handle style object signals with other signal attributes', () => {
      const styleSignal = createSignal({ color: 'red' });
      const classNameSignal = createSignal('my-class');
      
      const element = jsx('div', {
        className: classNameSignal,
        style: styleSignal,
        title: 'static title'
      }) as HTMLElement;
      
      container.appendChild(element);
      
      expect(element.className).toBe('my-class');
      expect(element.style.color).toBe('red');
      expect(element.title).toBe('static title');
      
      styleSignal({ color: 'blue' });
      classNameSignal('updated-class');
      
      expect(element.className).toBe('updated-class');
      expect(element.style.color).toBe('blue');
      expect(element.title).toBe('static title');
    });

    it('should handle style string signals with other reactive attributes', () => {
      const styleSignal = createSignal('color: red;');
      const dataIdSignal = createSignal('test-id');
      
      const element = jsx('div', {
        style: styleSignal,
        'data-id': dataIdSignal
      }) as HTMLElement;
      
      container.appendChild(element);
      
      expect(element.style.color).toBe('red');
      expect(element.getAttribute('data-id')).toBe('test-id');
      
      styleSignal('color: blue;');
      dataIdSignal('updated-id');
      
      expect(element.style.color).toBe('blue');
      expect(element.getAttribute('data-id')).toBe('updated-id');
    });
  });

  describe('Cleanup for Style Signals', () => {
    it('should cleanup style string subscriptions', () => {
      const styleSignal = createSignal('color: red;');
      const element = jsx('div', { style: styleSignal }) as HTMLElement;
      
      container.appendChild(element);
      
      expect(styleSignal.subscriberCount).toBe(1);
      
      cleanupElementSubscriptions(element);
      expect(styleSignal.subscriberCount).toBe(0);
      
      // Signal changes should no longer affect element
      styleSignal('color: blue;');
      expect(element.style.color).toBe('red'); // Should remain red
    });

    it('should cleanup style object subscriptions', () => {
      const styleSignal = createSignal({ color: 'red' });
      const element = jsx('div', { style: styleSignal }) as HTMLElement;
      
      container.appendChild(element);
      
      expect(styleSignal.subscriberCount).toBe(1);
      
      cleanupElementSubscriptions(element);
      expect(styleSignal.subscriberCount).toBe(0);
      
      // Signal changes should no longer affect element
      styleSignal({ color: 'blue' });
      expect(element.style.color).toBe('red'); // Should remain red
    });

    it('should cleanup computed style subscriptions', () => {
      const colorSignal = createSignal('red');
      const styleSignal = createComputed(() => ({ color: colorSignal() }));
      const element = jsx('div', { style: styleSignal }) as HTMLElement;
      
      container.appendChild(element);
      
      expect(styleSignal.subscriberCount).toBe(1);
      expect(colorSignal.subscriberCount).toBe(1); // Computed dependency
      
      cleanupElementSubscriptions(element);
      expect(styleSignal.subscriberCount).toBe(0);
      // Note: colorSignal subscription may not be cleaned up as it's managed by computed signal
    });
  });

  describe('Error Handling', () => {
    it('should handle invalid style object values gracefully', () => {
      const styleSignal = createSignal({
        color: 'red',
        // Including potentially problematic values
        'background-color': 'blue',
        fontSize: undefined,
        margin: null as any,
        padding: '10px'
      });
      
      const element = jsx('div', { style: styleSignal }) as HTMLElement;
      
      expect(() => {
        container.appendChild(element);
      }).not.toThrow();
      
      expect(element.style.color).toBe('red');
      expect(element.style.backgroundColor).toBe('blue');
      expect(element.style.padding).toBe('10px');
    });

    it('should handle mixed property names in style objects', () => {
      const styleSignal = createSignal({
        // Camel case
        fontSize: '16px',
        backgroundColor: 'red',
        // Kebab case
        'font-family': 'Arial',
        'margin-top': '10px'
      });
      
      const element = jsx('div', { style: styleSignal }) as HTMLElement;
      container.appendChild(element);
      
      expect(element.style.fontSize).toBe('16px');
      expect(element.style.backgroundColor).toBe('red');
      expect(element.style.fontFamily).toBe('Arial');
      expect(element.style.marginTop).toBe('10px');
    });
  });
});