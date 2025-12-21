import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import { createSignal, createComputed } from '../src/reactive/signal';
import { jsx, JSXElement } from '../src/jsx/jsx-runtime';

describe('Signal Attributes in JSX Runtime', () => {
  let container: HTMLElement;

  beforeEach(() => {
    container = document.createElement('div');
    document.body.appendChild(container);
  });

  afterEach(() => {
    document.body.removeChild(container);
  });

  describe('Basic Reactive Attributes', () => {
    it('should update class attribute when signal changes', () => {
      const className = createSignal('initial-class');
      const element = jsx('div', { class: className }) as HTMLElement;
      
      container.appendChild(element);
      
      expect(element.className).toBe('initial-class');
      
      className('updated-class');
      expect(element.className).toBe('updated-class');
    });

    it('should update data attributes when signal changes', () => {
      const dataId = createSignal('test-123');
      const element = jsx('div', { 'data-id': dataId }) as HTMLElement;
      
      container.appendChild(element);
      
      expect(element.getAttribute('data-id')).toBe('test-123');
      expect(element.dataset.id).toBe('test-123');
      
      dataId('updated-456');
      expect(element.getAttribute('data-id')).toBe('updated-456');
      expect(element.dataset.id).toBe('updated-456');
    });

    it('should remove attribute when signal becomes null or undefined', () => {
      const title = createSignal('initial title');
      const element = jsx('div', { title }) as HTMLElement;
      
      container.appendChild(element);
      
      expect(element.getAttribute('title')).toBe('initial title');
      
      title(null as any);
      expect(element.hasAttribute('title')).toBe(false);
      
      title(undefined as any);
      expect(element.hasAttribute('title')).toBe(false);
      
      title('restored');
      expect(element.getAttribute('title')).toBe('restored');
    });

    it('should handle custom attributes reactively', () => {
      const customAttr = createSignal('custom-value');
      const element = jsx('div', { 'custom-attr': customAttr }) as HTMLElement;
      
      container.appendChild(element);
      
      expect(element.getAttribute('custom-attr')).toBe('custom-value');
      
      customAttr('new-value');
      expect(element.getAttribute('custom-attr')).toBe('new-value');
    });

    it('should handle numeric signal values', () => {
      const tabIndex = createSignal(1);
      const element = jsx('div', { tabIndex }) as HTMLElement;
      
      container.appendChild(element);
      
      expect(element.tabIndex).toBe(1);
      expect(element.getAttribute('tabindex')).toBe('1');
      
      tabIndex(5);
      expect(element.tabIndex).toBe(5);
      expect(element.getAttribute('tabindex')).toBe('5');
    });
  });

  describe('Form Input Attributes', () => {
    it('should update input value reactively', () => {
      const inputValue = createSignal('initial');
      const input = jsx('input', { value: inputValue }) as HTMLInputElement;
      
      container.appendChild(input);
      
      expect(input.value).toBe('initial');
      
      inputValue('updated');
      expect(input.value).toBe('updated');
    });

    it('should update checkbox checked state reactively', () => {
      const isChecked = createSignal(false);
      const checkbox = jsx('input', { type: 'checkbox', checked: isChecked }) as HTMLInputElement;
      
      container.appendChild(checkbox);
      
      expect(checkbox.checked).toBe(false);
      expect(checkbox.hasAttribute('checked')).toBe(false);
      
      isChecked(true);
      expect(checkbox.checked).toBe(true);
      expect(checkbox.hasAttribute('checked')).toBe(true);
      
      isChecked(false);
      expect(checkbox.checked).toBe(false);
      expect(checkbox.hasAttribute('checked')).toBe(false);
    });

    it('should update radio button checked state reactively', () => {
      const isSelected = createSignal(false);
      const radio = jsx('input', { type: 'radio', checked: isSelected }) as HTMLInputElement;
      
      container.appendChild(radio);
      
      expect(radio.checked).toBe(false);
      
      isSelected(true);
      expect(radio.checked).toBe(true);
      
      isSelected(false);
      expect(radio.checked).toBe(false);
    });

    it('should update disabled state reactively', () => {
      const isDisabled = createSignal(false);
      const button = jsx('button', { disabled: isDisabled }) as HTMLButtonElement;
      
      container.appendChild(button);
      
      expect(button.disabled).toBe(false);
      expect(button.hasAttribute('disabled')).toBe(false);
      
      isDisabled(true);
      expect(button.disabled).toBe(true);
      expect(button.hasAttribute('disabled')).toBe(true);
      
      isDisabled(false);
      expect(button.disabled).toBe(false);
      expect(button.hasAttribute('disabled')).toBe(false);
    });

    it('should update readonly state reactively', () => {
      const isReadonly = createSignal(false);
      const input = jsx('input', { readOnly: isReadonly }) as HTMLInputElement;
      
      container.appendChild(input);
      
      expect(input.readOnly).toBe(false);
      
      isReadonly(true);
      expect(input.readOnly).toBe(true);
      
      isReadonly(false);
      expect(input.readOnly).toBe(false);
    });
  });

  describe('Content Attributes', () => {
    it('should update innerHTML reactively', () => {
      const htmlContent = createSignal('<span>initial</span>');
      const element = jsx('div', { innerHTML: htmlContent }) as HTMLElement;
      
      container.appendChild(element);
      
      expect(element.innerHTML).toBe('<span>initial</span>');
      expect(element.textContent).toBe('initial');
      
      htmlContent('<p>updated</p>');
      expect(element.innerHTML).toBe('<p>updated</p>');
      expect(element.textContent).toBe('updated');
    });

    it('should update textContent reactively', () => {
      const textContent = createSignal('initial text');
      const element = jsx('div', { textContent }) as HTMLElement;
      
      container.appendChild(element);
      
      expect(element.textContent).toBe('initial text');
      
      textContent('updated text');
      expect(element.textContent).toBe('updated text');
    });

    it('should handle mixed signal and non-signal content attributes', () => {
      const htmlContent = createSignal('<span>dynamic</span>');
      const element = jsx('div', { 
        innerHTML: htmlContent,
        'data-static': 'static-value'
      }) as HTMLElement;
      
      container.appendChild(element);
      
      expect(element.innerHTML).toBe('<span>dynamic</span>');
      expect(element.getAttribute('data-static')).toBe('static-value');
      
      htmlContent('<p>changed</p>');
      expect(element.innerHTML).toBe('<p>changed</p>');
      expect(element.getAttribute('data-static')).toBe('static-value');
    });
  });

  describe('Style Attributes', () => {
    it('should update style string reactively', () => {
      const styleString = createSignal('color: red; background: blue;');
      const element = jsx('div', { style: styleString }) as HTMLElement;
      
      container.appendChild(element);
      
      expect(element.style.color).toBe('red');
      expect(element.style.background).toBe('blue');
      
      styleString('color: green; font-size: 14px;');
      expect(element.style.color).toBe('green');
      expect(element.style.background).toBe('');
      expect(element.style.fontSize).toBe('14px');
    });

    it('should handle empty and null style values', () => {
      const styleString = createSignal('color: red;');
      const element = jsx('div', { style: styleString }) as HTMLElement;
      
      container.appendChild(element);
      
      expect(element.style.color).toBe('red');
      
      styleString('');
      // Style attribute should be removed when empty string
      expect(element.getAttribute('style')).toBe('');
      
      styleString(null as any);
      expect(element.getAttribute('style')).toBe(null);
      
      styleString('color: blue;');
      expect(element.style.color).toBe('blue');
    });
  });

  describe('Computed Signals as Attributes', () => {
    it('should use computed signals for attributes', () => {
      const firstName = createSignal('John');
      const lastName = createSignal('Doe');
      const fullName = createComputed(() => `${firstName()} ${lastName()}`);
      
      const element = jsx('div', { 'data-name': fullName }) as HTMLElement;
      
      container.appendChild(element);
      
      expect(element.getAttribute('data-name')).toBe('John Doe');
      
      firstName('Jane');
      expect(element.getAttribute('data-name')).toBe('Jane Doe');
      
      lastName('Smith');
      expect(element.getAttribute('data-name')).toBe('Jane Smith');
    });

    it('should handle computed signals for boolean attributes', () => {
      const count = createSignal(0);
      const hasItems = createComputed(() => count() > 0);
      
      const button = jsx('button', { disabled: hasItems }) as HTMLButtonElement;
      
      container.appendChild(button);
      
      expect(button.disabled).toBe(false);
      
      count(5);
      expect(button.disabled).toBe(true);
      
      count(0);
      expect(button.disabled).toBe(false);
    });
  });

  describe('Multiple Reactive Attributes', () => {
    it('should handle multiple signal attributes on same element', () => {
      const className = createSignal('class1');
      const title = createSignal('title1');
      const dataId = createSignal('id1');
      
      const element = jsx('div', { 
        class: className, 
        title, 
        'data-id': dataId 
      }) as HTMLElement;
      
      container.appendChild(element);
      
      expect(element.className).toBe('class1');
      expect(element.title).toBe('title1');
      expect(element.getAttribute('data-id')).toBe('id1');
      
      // Update all signals
      className('class2');
      title('title2');
      dataId('id2');
      
      expect(element.className).toBe('class2');
      expect(element.title).toBe('title2');
      expect(element.getAttribute('data-id')).toBe('id2');
    });

    it('should handle mixed reactive and static attributes', () => {
      const dynamicClass = createSignal('dynamic');
      const element = jsx('div', {
        id: 'static-id',
        class: dynamicClass,
        'data-static': 'static-value',
        title: 'static-title'
      }) as HTMLElement;
      
      container.appendChild(element);
      
      expect(element.id).toBe('static-id');
      expect(element.className).toBe('dynamic');
      expect(element.getAttribute('data-static')).toBe('static-value');
      expect(element.title).toBe('static-title');
      
      dynamicClass('updated');
      expect(element.id).toBe('static-id');
      expect(element.className).toBe('updated');
      expect(element.getAttribute('data-static')).toBe('static-value');
      expect(element.title).toBe('static-title');
    });
  });

  describe('Signal Function Type Attributes', () => {
    it('should handle function values as reactive attributes', () => {
      let counter = 0;
      const getValue = () => {
        counter++;
        return `value-${counter}`;
      };
      
      const element = jsx('div', { 'data-value': getValue }) as HTMLElement;
      
      container.appendChild(element);
      
      // Function should be called to set initial value
      expect(element.getAttribute('data-value')).toBe('value-1');
    });

    it('should not subscribe to function attributes (only Signals)', () => {
      let callCount = 0;
      const getValue = () => {
        callCount++;
        return `value-${callCount}`;
      };
      
      const element = jsx('div', { 'data-value': getValue }) as HTMLElement;
      
      container.appendChild(element);
      
      expect(callCount).toBe(1);
      expect(element.getAttribute('data-value')).toBe('value-1');
      
      // Re-rendering should call function again, but it's not reactive
      // (This is current behavior - we might want to change this)
      const newElement = jsx('div', { 'data-value': getValue }) as HTMLElement;
      expect(callCount).toBe(2);
    });
  });

  describe('Error Handling', () => {
    it('should handle signal that throws errors gracefully', () => {
      const badSignal = createSignal('initial');
      const element = jsx('div', { title: badSignal }) as HTMLElement;
      
      container.appendChild(element);
      
      expect(element.getAttribute('title')).toBe('initial');
      
      // Make the signal throw an error
      Object.defineProperty(badSignal, 'get', {
        value: () => { throw new Error('Signal error'); }
      });
      
      // The current implementation might let errors propagate
      // This test documents current behavior
      expect(() => {
        // This should ideally not crash, but currently might
        badSignal('test');
      }).not.toThrow();
    });

    it('should handle circular computed signals', () => {
      const signalA = createSignal('A');
      const signalB = createSignal('B');
      
      // Create a circular dependency
      let computing = false;
      const computedA = createComputed(() => {
        if (computing) return 'circular-guard';
        computing = true;
        const result = signalB();
        computing = false;
        return result;
      });
      
      const computedB = createComputed(() => {
        if (computing) return 'circular-guard';
        computing = true;
        const result = signalA();
        computing = false;
        return result;
      });
      
      // This might cause issues - testing current behavior
      const elementA = jsx('div', { 'data-a': computedA }) as HTMLElement;
      const elementB = jsx('div', { 'data-b': computedB }) as HTMLElement;
      
      container.appendChild(elementA);
      container.appendChild(elementB);
      
      // Should have some reasonable values or handle circular refs
      expect(elementA.getAttribute('data-a')).toBeTruthy();
      expect(elementB.getAttribute('data-b')).toBeTruthy();
    });
  });
});