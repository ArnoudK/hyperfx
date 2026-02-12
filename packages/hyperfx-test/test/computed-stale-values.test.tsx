import { createComputed, createSignal } from 'hyperfx';
import { describe, it, expect, beforeEach, afterEach } from 'vitest';

describe('Computed stale values', () => {
  let container: HTMLElement;

  beforeEach(() => {
    container = document.createElement('div');
    document.body.appendChild(container);
  });

  afterEach(() => {
    document.body.removeChild(container);
    container.innerHTML = '';
  });

  it('does not recompute with old values after update', async () => {
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
    await new Promise(resolve => setTimeout(resolve, 0));

    expect(recomputed.length).toBe(2);
    expect(recomputed[1]).toBe(1);
    expect(element.textContent).toBe('Odd');
  });
});
