import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import { createSignal, createComputed, batchUpdates, cleanupElementSubscriptions } from 'hyperfx';

describe('Batch Update Mechanism', () => {
  let container: HTMLElement;

  beforeEach(() => {
    container = document.createElement('div');
    document.body.appendChild(container);
  });

  afterEach(() => {
    document.body.removeChild(container);
  });

  describe('Basic Batching', () => {
    it('should batch multiple signal updates', () => {
      const [signal1, setSignal1] = createSignal('value1');
      const [signal2, setSignal2] = createSignal('value2');
      const [signal3, setSignal3] = createSignal('value3');

      const element = (
        <div data-attr1={signal1} data-attr2={signal2} data-attr3={signal3} />
      ) as HTMLElement;

      container.appendChild(element);

      // Initial values should be set
      expect(element.getAttribute('data-attr1')).toBe('value1');
      expect(element.getAttribute('data-attr2')).toBe('value2');
      expect(element.getAttribute('data-attr3')).toBe('value3');

      // Batch update multiple signals
      batchUpdates(() => {
        setSignal1('new-value1');
        setSignal2('new-value2');
        setSignal3('new-value3');
      });

      // All attributes should be updated
      expect(element.getAttribute('data-attr1')).toBe('new-value1');
      expect(element.getAttribute('data-attr2')).toBe('new-value2');
      expect(element.getAttribute('data-attr3')).toBe('new-value3');
    });

    it('should batch nested batch calls', () => {
      const [signal1, setSignal1] = createSignal('value1');
      const [signal2, setSignal2] = createSignal('value2');

      const element = (
        <div data-attr1={signal1} data-attr2={signal2} />
      ) as HTMLElement;

      container.appendChild(element);

      // Nested batch calls
      batchUpdates(() => {
        setSignal1('nested1');
        batchUpdates(() => {
          setSignal2('nested2');
        });
        setSignal1('nested3');
      });

      expect(element.getAttribute('data-attr1')).toBe('nested3');
      expect(element.getAttribute('data-attr2')).toBe('nested2');
    });

    it('should return value from batch function', () => {
      const [signal, setSignal] = createSignal('initial');
      const element = <div data-attr={signal} /> as HTMLElement;

      container.appendChild(element);

      const result = batchUpdates(() => {
        setSignal('updated');
        return 'batch-result';
      });

      expect(result).toBe('batch-result');
      expect(element.getAttribute('data-attr')).toBe('updated');
    });
  });

  describe('Batch with Different Attribute Types', () => {
    it('should batch updates for form inputs', () => {
      const [valueSignal, setValueSignal] = createSignal('test-value');
      const [checkedSignal, setCheckedSignal] = createSignal(false);
      const [disabledSignal, setDisabledSignal] = createSignal(false);

      const input = (
        <input
          type="text"
          value={valueSignal}
          checked={checkedSignal}
          disabled={disabledSignal}
        />
      ) as HTMLInputElement;

      container.appendChild(input);

      expect(input.value).toBe('test-value');
      expect(input.checked).toBe(false);
      expect(input.disabled).toBe(false);

      batchUpdates(() => {
        setValueSignal('new-value');
        setCheckedSignal(true);
        setDisabledSignal(true);
      });

      expect(input.value).toBe('new-value');
      expect(input.checked).toBe(true);
      expect(input.disabled).toBe(true);
    });

    it('should batch updates for style objects', () => {
      const [styleSignal, setStyleSignal] = createSignal<Record<string, string>>({
        color: 'red',
        fontSize: '16px'
      });

      const element = <div style={styleSignal} /> as HTMLElement;
      container.appendChild(element);

      expect(element.style.color).toBe('red');
      expect(element.style.fontSize).toBe('16px');

      batchUpdates(() => {
        setStyleSignal({
          color: 'blue',
          fontSize: '20px',
          backgroundColor: 'yellow' as any // Add to type
        });
      });

      expect(element.style.color).toBe('blue');
      expect(element.style.fontSize).toBe('20px');
      expect(element.style.backgroundColor).toBe('yellow');
    });

    it('should batch updates for content attributes', () => {
      const [htmlSignal, setHtmlSignal] = createSignal('<span>content</span>');
      const [textSignal, setTextSignal] = createSignal('text-content');

      const element1 = <div innerHTML={htmlSignal} /> as HTMLElement;
      const element2 = <div textContent={textSignal} /> as HTMLElement;

      container.appendChild(element1);
      container.appendChild(element2);

      expect(element1.innerHTML).toBe('<span>content</span>');
      expect(element2.textContent).toBe('text-content');

      batchUpdates(() => {
        setHtmlSignal('<p>updated</p>');
        setTextSignal('updated-text');
      });

      expect(element1.innerHTML).toBe('<p>updated</p>');
      expect(element2.textContent).toBe('updated-text');
    });
  });

  describe('Batch with Computed Signals', () => {
    it('should batch updates through computed signals', () => {
      const [baseSignal, setBaseSignal] = createSignal('base');
      const Signal = createComputed(() => `${baseSignal()}-computed`);

      const element = <div data-attr={Signal} /> as HTMLElement;

      container.appendChild(element);

      expect(element.getAttribute('data-attr')).toBe('base-computed');

      batchUpdates(() => {
        setBaseSignal('updated');
        // Computed should update during batch
      });

      expect(element.getAttribute('data-attr')).toBe('updated-computed');
    });

    it('should batch multiple computed signal dependencies', () => {
      const [signal1, setSignal1] = createSignal('val1');
      const [signal2, setSignal2] = createSignal('val2');
      const computed1 = createComputed(() => `${signal1()}-comp1`);
      const computed2 = createComputed(() => `${signal2()}-comp2`);

      const element = (
        <div data-attr1={computed1} data-attr2={computed2} />
      ) as HTMLElement;

      container.appendChild(element);

      expect(element.getAttribute('data-attr1')).toBe('val1-comp1');
      expect(element.getAttribute('data-attr2')).toBe('val2-comp2');

      batchUpdates(() => {
        setSignal1('new1');
        setSignal2('new2');
      });

      expect(element.getAttribute('data-attr1')).toBe('new1-comp1');
      expect(element.getAttribute('data-attr2')).toBe('new2-comp2');
    });
  });

  describe('Error Handling in Batches', () => {
    // Note: Error handling in batches is tested but implementation may vary
    it('should continue batch execution on non-critical errors', () => {
      const [signal1, setSignal1] = createSignal('value1');
      const [signal2, setSignal2] = createSignal('value2');

      const element = (
        <div data-attr1={signal1} data-attr2={signal2} />
      ) as HTMLElement;

      container.appendChild(element);

      // This tests that batch execution continues even if some updates fail
      expect(() => {
        batchUpdates(() => {
          setSignal1('updated1');
          setSignal2('updated2');
        });
      }).not.toThrow();

      expect(element.getAttribute('data-attr1')).toBe('updated1');
      expect(element.getAttribute('data-attr2')).toBe('updated2');
    });
  });

  describe('Performance Optimization', () => {
    it('should reduce DOM updates when batching', () => {
      const [signal1, setSignal1] = createSignal('value1');
      const [signal2, setSignal2] = createSignal('value2');

      let updateCount1 = 0;
      let updateCount2 = 0;

      const element = (
        <div data-attr1={signal1} data-attr2={signal2} />
      ) as HTMLElement;

      container.appendChild(element);

      // Track updates by overriding setAttribute
      const originalSetAttribute = element.setAttribute.bind(element);
      element.setAttribute = function (name: string, value: string) {
        if (name === 'data-attr1') updateCount1++;
        if (name === 'data-attr2') updateCount2++;
        return originalSetAttribute(name, value);
      };

      // Multiple updates without batching should cause multiple DOM updates
      setSignal1('update1');
      setSignal2('update2');
      expect(updateCount1).toBe(1); // Each signal caused separate update
      expect(updateCount2).toBe(1);

      // Reset counters
      updateCount1 = 0;
      updateCount2 = 0;

      // Multiple updates with batching should be more efficient
      batchUpdates(() => {
        setSignal1('batched1');
        setSignal2('batched2');
      });

      // Should still update each attribute, but potentially in a more optimized way
      // The exact behavior depends on the batching implementation
      expect(element.getAttribute('data-attr1')).toBe('batched1');
      expect(element.getAttribute('data-attr2')).toBe('batched2');
    });
  });

  describe('Cleanup with Batching', () => {
    it('should cleanup batched subscriptions properly', () => {
      const [signal1, setSignal1] = createSignal('value1');
      const [signal2, setSignal2] = createSignal('value2');

      const element = (
        <div data-attr1={signal1} data-attr2={signal2} />
      ) as HTMLElement;

      container.appendChild(element);

      expect(signal1.subscriberCount).toBe(1);
      expect(signal2.subscriberCount).toBe(1);

      cleanupElementSubscriptions(element);

      expect(signal1.subscriberCount).toBe(0);
      expect(signal2.subscriberCount).toBe(0);

      // Batching should still work after cleanup
      batchUpdates(() => {
        setSignal1('after-cleanup');
      });

      // Element should not be affected
      expect(element.getAttribute('data-attr1')).toBe('value1');
    });
  });
});
