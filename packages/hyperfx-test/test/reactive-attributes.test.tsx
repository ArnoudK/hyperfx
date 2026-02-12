import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import { createSignal, createComputed } from 'hyperfx';


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
      const [className, setClassName] = createSignal('initial-class');
      const element = <div class={className} /> as HTMLElement;

      container.appendChild(element);

      expect(element.className).toBe('initial-class');

      setClassName('updated-class');
      expect(element.className).toBe('updated-class');
    });

    it('should update data attributes when signal changes', () => {
      const [dataId, setDataId] = createSignal('test-123');
      const element = <div data-id={dataId} /> as HTMLElement;

      container.appendChild(element);

      expect(element.getAttribute('data-id')).toBe('test-123');
      expect(element.dataset.id).toBe('test-123');

      setDataId('updated-456');
      expect(element.getAttribute('data-id')).toBe('updated-456');
      expect(element.dataset.id).toBe('updated-456');
    });

    it('should remove attribute when signal becomes null or undefined', () => {
      const [title, setTitle] = createSignal('initial title');
      const element = <div title={title} /> as HTMLElement;

      container.appendChild(element);

      expect(element.getAttribute('title')).toBe('initial title');

      setTitle(null as any);
      expect(element.hasAttribute('title')).toBe(false);

      setTitle(undefined as any);
      expect(element.hasAttribute('title')).toBe(false);

      setTitle('restored');
      expect(element.getAttribute('title')).toBe('restored');
    });

    it('should handle custom attributes reactively', () => {
      const [customAttr, setCustomAttr] = createSignal('custom-value');
      const element = <div custom-attr={customAttr} /> as HTMLElement;

      container.appendChild(element);

      expect(element.getAttribute('custom-attr')).toBe('custom-value');

      setCustomAttr('new-value');
      expect(element.getAttribute('custom-attr')).toBe('new-value');
    });

    it('should handle numeric signal values', () => {
      const [tabIndex, setTabIndex] = createSignal(1);
      const element = <div tabindex={tabIndex} /> as HTMLElement;

      container.appendChild(element);

      expect(element.tabIndex).toBe(1);
      expect(element.getAttribute('tabindex')).toBe('1');

      setTabIndex(5);
      expect(element.tabIndex).toBe(5);
      expect(element.getAttribute('tabindex')).toBe('5');
    });

    it('should update class from computed expression', () => {
      const [count, setCount] = createSignal(0);
      const element = (
        <button class={`btn ${count() > 0 ? 'active' : 'idle'}`} />
      ) as HTMLButtonElement;

      container.appendChild(element);

      expect(element.className).toBe('btn idle');

      setCount(1);
      expect(element.className).toBe('btn active');
    });
  });

  describe('Form Input Attributes', () => {
    it('should update input value reactively', () => {
      const [inputValue, setInputValue] = createSignal('initial');
      const input = <input value={inputValue} /> as HTMLInputElement;

      container.appendChild(input);

      expect(input.value).toBe('initial');

      setInputValue('updated');
      expect(input.value).toBe('updated');
    });

    it('should update checkbox checked state reactively', () => {
      const [isChecked, setIsChecked] = createSignal(false);
      const checkbox = <input type="checkbox" checked={isChecked} /> as HTMLInputElement;

      container.appendChild(checkbox);

      expect(checkbox.checked).toBe(false);
      expect(checkbox.hasAttribute('checked')).toBe(false);

      setIsChecked(true);
      expect(checkbox.checked).toBe(true);
      expect(checkbox.hasAttribute('checked')).toBe(true);

      setIsChecked(false);
      expect(checkbox.checked).toBe(false);
      expect(checkbox.hasAttribute('checked')).toBe(false);
    });

    it('should update radio button checked state reactively', () => {
      const [isSelected, setIsSelected] = createSignal(false);
      const radio = <input type="radio" checked={isSelected} /> as HTMLInputElement;

      container.appendChild(radio);

      expect(radio.checked).toBe(false);

      setIsSelected(true);
      expect(radio.checked).toBe(true);

      setIsSelected(false);
      expect(radio.checked).toBe(false);
    });

    it('should update disabled state reactively', () => {
      const [isDisabled, setIsDisabled] = createSignal(false);
      const button = <button disabled={isDisabled} /> as HTMLButtonElement;

      container.appendChild(button);

      expect(button.disabled).toBe(false);
      expect(button.hasAttribute('disabled')).toBe(false);

      setIsDisabled(true);
      expect(button.disabled).toBe(true);
      expect(button.hasAttribute('disabled')).toBe(true);

      setIsDisabled(false);
      expect(button.disabled).toBe(false);
      expect(button.hasAttribute('disabled')).toBe(false);
    });

    it('should update readonly state reactively', () => {
      const [isReadonly, setIsReadonly] = createSignal(false);
      const input = <input readonly={isReadonly} /> as HTMLInputElement;

      container.appendChild(input);

      expect(input.readOnly).toBe(false);

      setIsReadonly(true);
      expect(input.readOnly).toBe(true);

      setIsReadonly(false);
      expect(input.readOnly).toBe(false);
    });
  });

  describe('Content Attributes', () => {
    it('should update innerHTML reactively', () => {
      const [htmlContent, setHtmlContent] = createSignal('<span>initial</span>');
      const element = <div innerHTML={htmlContent} /> as HTMLElement;

      container.appendChild(element);

      expect(element.innerHTML).toBe('<span>initial</span>');
      expect(element.textContent).toBe('initial');

      setHtmlContent('<p>updated</p>');
      expect(element.innerHTML).toBe('<p>updated</p>');
      expect(element.textContent).toBe('updated');
    });

    it('should update textContent reactively', () => {
      const [textContent, setTextContent] = createSignal('initial text');
      const element = <div textContent={textContent} /> as HTMLElement;

      container.appendChild(element);

      expect(element.textContent).toBe('initial text');

      setTextContent('updated text');
      expect(element.textContent).toBe('updated text');
    });

    it('should handle mixed signal and non-signal content attributes', () => {
      const [htmlContent, setHtmlContent] = createSignal('<span>dynamic</span>');
      const element = <div innerHTML={htmlContent} data-static="static-value" /> as HTMLElement;

      container.appendChild(element);

      expect(element.innerHTML).toBe('<span>dynamic</span>');
      expect(element.getAttribute('data-static')).toBe('static-value');

      setHtmlContent('<p>changed</p>');
      expect(element.innerHTML).toBe('<p>changed</p>');
      expect(element.getAttribute('data-static')).toBe('static-value');
    });
  });

  describe('Style Attributes', () => {
    it('should update style string reactively', () => {
      const [styleString, setStyleString] = createSignal('color: red; background: blue;');
      const element = <div style={styleString} /> as HTMLElement;

      container.appendChild(element);

      expect(element.style.color).toBe('red');
      expect(element.style.background).toBe('blue');

      setStyleString('color: green; font-size: 14px;');
      expect(element.style.color).toBe('green');
      expect(element.style.background).toBe('');
      expect(element.style.fontSize).toBe('14px');
    });

    it('should handle empty and null style values', () => {
      const [styleString, setStyleString] = createSignal('color: red;');
      const element = <div style={styleString} /> as HTMLElement;

      container.appendChild(element);

      expect(element.style.color).toBe('red');

      setStyleString('');
      // Style attribute should be removed when empty string
      expect(element.getAttribute('style')).toBe('');

      setStyleString(null as any);
      expect(element.getAttribute('style')).toBe(null);

      setStyleString('color: blue;');
      expect(element.style.color).toBe('blue');
    });
  });

  describe('Computed Signals as Attributes', () => {
    it('should use computed signals for attributes', () => {
      const [firstName, setFirstName] = createSignal('John');
      const [lastName, setLastName] = createSignal('Doe');
      const fullName = createComputed(() => `${firstName()} ${lastName()}`);

      const element = <div data-name={fullName} /> as HTMLElement;

      container.appendChild(element);

      expect(element.getAttribute('data-name')).toBe('John Doe');

      setFirstName('Jane');
      expect(element.getAttribute('data-name')).toBe('Jane Doe');

      setLastName('Smith');
      expect(element.getAttribute('data-name')).toBe('Jane Smith');
    });

    it('should handle computed signals for boolean attributes', () => {
      const [count, setCount] = createSignal(0);
      const hasItems = createComputed(() => count() > 0);

      const button = <button disabled={hasItems} /> as HTMLButtonElement;

      container.appendChild(button);

      expect(button.disabled).toBe(false);

      setCount(5);
      expect(button.disabled).toBe(true);

      setCount(0);
      expect(button.disabled).toBe(false);
    });
  });

  describe('Multiple Reactive Attributes', () => {
    it('should handle multiple signal attributes on same element', () => {
      const [className, setClassName] = createSignal('class1');
      const [title, setTitle] = createSignal('title1');
      const [dataId, setDataId] = createSignal('id1');

      const element = <div class={className} title={title} data-id={dataId} /> as HTMLElement;

      container.appendChild(element);

      expect(element.className).toBe('class1');
      expect(element.title).toBe('title1');
      expect(element.getAttribute('data-id')).toBe('id1');

      // Update all signals
      setClassName('class2');
      setTitle('title2');
      setDataId('id2');

      expect(element.className).toBe('class2');
      expect(element.title).toBe('title2');
      expect(element.getAttribute('data-id')).toBe('id2');
    });

    it('should handle mixed reactive and static attributes', () => {
      const [dynamicClass, setDynamicClass] = createSignal('dynamic');
      const element = (
        <div
          id="static-id"
          class={dynamicClass}
          data-static="static-value"
          title="static-title"
        />
      ) as HTMLElement;

      container.appendChild(element);

      expect(element.id).toBe('static-id');
      expect(element.className).toBe('dynamic');
      expect(element.getAttribute('data-static')).toBe('static-value');
      expect(element.title).toBe('static-title');

      setDynamicClass('updated');
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

      const element = <div data-value={getValue} /> as HTMLElement;

      container.appendChild(element);

      // Function should be called to set initial value
      expect(element.getAttribute('data-value')).toBe('value-1');
    });

    it('should subscribe to function attributes', () => {
      let callCount = 0;
      const getValue = () => {
        callCount++;
        return `value-${callCount}`;
      };

      const element = <div data-value={getValue} /> as HTMLElement;

      container.appendChild(element);

      expect(callCount).toBe(1);
      expect(element.getAttribute('data-value')).toBe('value-1');

      // Re-rendering should call function again
      const newElement = <div data-value={getValue} /> as HTMLElement;
      expect(callCount).toBe(2);
    });
  });

  describe('Error Handling', () => {
    it('should handle signal that throws errors gracefully', () => {
      const [badSignal, setBadSignal] = createSignal('initial');
      const element = <div title={badSignal} /> as HTMLElement;

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
        setBadSignal('test');
      }).not.toThrow();
    });

    it('should handle circular computed signals', () => {
      const [signalA, setSignalA] = createSignal('A');
      const [signalB, setSignalB] = createSignal('B');

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
      const elementA = <div data-a={computedA} /> as HTMLElement;
      const elementB = <div data-b={computedB} /> as HTMLElement;

      container.appendChild(elementA);
      container.appendChild(elementB);

      // Should have some reasonable values or handle circular refs
      expect(elementA.getAttribute('data-a')).toBeTruthy();
      expect(elementB.getAttribute('data-b')).toBeTruthy();
    });
  });
});
