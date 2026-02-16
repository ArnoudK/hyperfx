import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import { createSignal, createComputed, cleanupElementSubscriptions, batchUpdates } from 'hyperfx';

describe('Memory Management for Signal Subscriptions', () => {
  let container: HTMLElement;

  beforeEach(() => {
    container = document.createElement('div');
    document.body.appendChild(container);
  });

  afterEach(() => {
    document.body.removeChild(container);
  });

  describe('Subscription Memory Leaks', () => {
    it('should not leak subscriptions when elements are removed', async () => {
      const signals = Array.from({ length: 50 }, (_, i) =>
        createSignal(`value${i}`)
      );

      // Create many elements with signals
      const elements = signals.map(([getter], index) => (
        <div id={`element-${index}`} class={getter} title={`title-${index}`} />
      )) as unknown as HTMLElement[];

      // Add all elements to DOM
      elements.forEach((element): void => {
        container.appendChild(element);
      });

      // All signals should have subscribers
      signals.forEach(([getter]): void => {
        expect(getter.subscriberCount).toBe(1);
      });

      // Remove all elements
      container.innerHTML = '';

      // Wait for cleanup to happen
      await new Promise(resolve => setTimeout(resolve, 10));

      // All subscriptions should be cleaned up
      signals.forEach(([getter]): void => {
        expect(getter.subscriberCount).toBe(0);
      });
    });

    it('should handle rapid element creation and destruction', async () => {
      const [signal] = createSignal('test-value');
      let creationCount = 0;
      let destructionCount = 0;

      // Create and destroy elements rapidly
      for (let i = 0; i < 20; i++) {
        const element = <div class={signal} /> as HTMLElement;
        container.appendChild(element);

        creationCount++;

        // Immediately remove
        element.remove();
        destructionCount++;
      }

      expect(creationCount).toBe(20);
      expect(destructionCount).toBe(20);

      // Wait for cleanup
      await new Promise(resolve => setTimeout(resolve, 10));

      // Final subscription count should be 0
      expect(signal.subscriberCount).toBe(0);
    });
  });

  describe('Computed Signal Memory', () => {
    it('should clean up computed signal dependencies when destroyed', async () => {
      const [baseSignal] = createSignal('base');
      const signals = Array.from({ length: 10 }, (_, i) => {
        const Signal = createComputed(() => `${baseSignal()}-computed-${i}`);
        const element = <div class={Signal} /> as HTMLElement;
        container.appendChild(element);
        return { signal: Signal, element };
      });

      // Base signal should have many subscribers (one for each computed)
      expect(baseSignal.subscriberCount).toBe(10);

      // All computed signals should have subscribers
      signals.forEach(({ signal }): void => {
        expect(signal.subscriberCount).toBe(1);
      });

      // Remove all elements
      signals.forEach(({ element }): void => {
        element.remove();
      });
      container.innerHTML = '';

      // Wait for cleanup to occur
      await new Promise(resolve => setTimeout(resolve, 10));

      // Computed signal subscriptions should be cleaned up
      signals.forEach(({ signal }): void => {
        expect(signal.subscriberCount).toBe(0);
      });

      // Base signal subscriptions should be cleaned up with computed cleanup
      expect(baseSignal.subscriberCount).toBe(0);
    });
  });

  describe('Batch Updates Memory', () => {
    it('should not accumulate batch queue', () => {
      const [signal1, setSignal1] = createSignal('value1');
      const [signal2, setSignal2] = createSignal('value2');

      const element = <div class={signal1} title={signal2} /> as HTMLElement;

      container.appendChild(element);

      // Multiple batch operations should not accumulate
      for (let i = 0; i < 20; i++) {
        batchUpdates(() => {
          setSignal1(`update-${i}`);
          setSignal2(`title-${i}`);
        });
      }

      // Subscriptions should remain at 1 each
      expect(signal1.subscriberCount).toBe(1);
      expect(signal2.subscriberCount).toBe(1);
    });
  });

  describe('Edge Cases', () => {
    it('should handle signal reuse across elements', async () => {
      const [sharedSignal] = createSignal('shared');

      const element1 = <div class={sharedSignal} /> as HTMLElement;
      const element2 = <div class={sharedSignal} /> as HTMLElement;

      container.appendChild(element1);
      container.appendChild(element2);

      // Signal should have 2 subscribers
      expect(sharedSignal.subscriberCount).toBe(2);

      // Remove one element
      element1.remove();

      // Wait for cleanup
      await new Promise(resolve => setTimeout(resolve, 10));

      // Should have 1 subscriber left
      expect(sharedSignal.subscriberCount).toBe(1);

      // Remove second element
      element2.remove();

      // Wait for cleanup
      await new Promise(resolve => setTimeout(resolve, 10));

      // Should have 0 subscribers
      expect(sharedSignal.subscriberCount).toBe(0);
    });

    it('should handle elements with no signals', () => {
      const element = (
        <div id="static-element" class="static-class" title="static-title" />
      ) as HTMLElement;

      container.appendChild(element);

      // Manual cleanup should be safe
      expect(() => {
        cleanupElementSubscriptions(element);
      }).not.toThrow();

      // Element should still be in DOM
      expect(element.parentNode).toBe(container);
    });

    it('should handle repeated cleanup calls', () => {
      const [signal] = createSignal('test');
      const element = <div class={signal} /> as HTMLElement;

      container.appendChild(element);

      expect(signal.subscriberCount).toBe(1);

      // Multiple cleanup calls should be safe
      cleanupElementSubscriptions(element);
      cleanupElementSubscriptions(element);
      cleanupElementSubscriptions(element);

      expect(signal.subscriberCount).toBe(0);
    });
  });

  describe('Performance Impact', () => {
    it('should maintain performance with many subscriptions', async () => {
      const signals = Array.from({ length: 100 }, (_, i) =>
        createSignal(`value${i}`)
      );

      const startTime = performance.now();

      // Create many elements with signals
      const elements = signals.map(([getter], index) => (
        <div id={`perf-${index}`} class={getter} />
      )) as unknown as HTMLElement[];

      const createEndTime = performance.now();
      const createTime = createEndTime - startTime;

      // Adding elements to DOM
      elements.forEach((element): void => {
        container.appendChild(element);
      });
      const addEndTime = performance.now();
      const addTime = addEndTime - createEndTime;

      // Update all signals
      const updateStartTime = performance.now();
      signals.forEach(([, setSignal], index): void => {
        setSignal(`updated-${index}`);
      });
      const updateEndTime = performance.now();
      const updateTime = updateEndTime - updateStartTime;

      // Cleanup
      const cleanupStartTime = performance.now();
      container.innerHTML = '';
      const cleanupEndTime = performance.now();
      const cleanupTime = cleanupEndTime - cleanupStartTime;

      // Wait for async cleanup
      await new Promise(resolve => setTimeout(resolve, 10));

      // Performance should be reasonable
      expect(createTime).toBeLessThan(100); // 0.1 second to create
      expect(addTime).toBeLessThan(100);    // 0.1 second to add to DOM
      expect(updateTime).toBeLessThan(50);   // 0.05 seconds for 100 updates
      expect(cleanupTime).toBeLessThan(50);   // 0.05 seconds for cleanup

      // All subscriptions should be cleaned up
      signals.forEach(([getter]): void => {
        expect(getter.subscriberCount).toBe(0);
      });
    });
  });
});
