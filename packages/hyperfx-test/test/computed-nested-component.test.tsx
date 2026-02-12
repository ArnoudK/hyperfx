import { createComputed, createSignal } from 'hyperfx';
import { describe, it, expect, beforeEach, afterEach } from 'vitest';

describe('Computed nested component', () => {
  let container: HTMLElement;

  beforeEach(() => {
    container = document.createElement('div');
    document.body.appendChild(container);
  });

  afterEach(() => {
    document.body.removeChild(container);
    container.innerHTML = '';
  });

  it('does not recompute with stale values after events', async () => {
    const [count, setCount] = createSignal(0);
    const [step, setStep] = createSignal(1);
    const isEven = createComputed(() => count() % 2 === 0);
    const recomputed: number[] = [];

    const evenOddText = createComputed(() => {
      const c = count();
      recomputed.push(c);
      if (c === 0) return 'N/A';
      return isEven() ? 'Even' : 'Odd';
    });

    const Component = () => {
      const view = createComputed(() => (
        <div>
          <button type="button" class="inc" onclick={() => setCount(count() + step())}>
            inc
          </button>
          <button type="button" class="step" onclick={() => setStep(step() + 1)}>
            step
          </button>
          <span class="even-odd">{evenOddText}</span>
          <span class="step-value">{step()}</span>
        </div>
      ));
      return view;
    };

    const element = (
      <div>
        <Component />
      </div>
    ) as HTMLDivElement;

    container.appendChild(element as Node);

    await new Promise(resolve => setTimeout(resolve, 0));

    expect(recomputed).toEqual([0]);

    const incButton = container.querySelector('.inc') as HTMLButtonElement | null;
    expect(incButton).not.toBeNull();
    if (!incButton) return;
    incButton.click();
    await new Promise(resolve => setTimeout(resolve, 0));
    await new Promise(resolve => setTimeout(resolve, 0));

    expect(recomputed).toEqual([0, 1]);
    expect(container.querySelector('.even-odd')?.textContent).toBe('Odd');

    const stepButton = container.querySelector('.step') as HTMLButtonElement | null;
    expect(stepButton).not.toBeNull();
    if (!stepButton) return;
    stepButton.click();
    await new Promise(resolve => setTimeout(resolve, 0));

    expect(recomputed).toEqual([0, 1]);
  });
});
