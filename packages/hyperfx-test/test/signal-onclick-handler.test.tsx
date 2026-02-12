
import { describe, it, expect, beforeEach } from 'vitest';
import { createSignal } from 'hyperfx';

describe('Signal in onclick handler with JSX', () => {
    let container: HTMLElement;

    beforeEach(() => {
        container = document.createElement('div');
        document.body.appendChild(container);
    });

    it('should handle count(count() + 1) in onclick with JSX', () => {
        const [count, setCount] = createSignal(0);
        let clickCount = 0;

        const Component = () => {
            return (
                <button onclick={() => {
                    clickCount++;
                    setCount(count() + 1);
                }}>
                    inc {count}
                </button>
            );
        };

        container.appendChild(<Component /> as any);
        const button = container.querySelector('button');

        expect(button?.textContent?.trim()).toBe('inc 0');

        button?.click();
        expect(clickCount).toBe(1);
        expect(count()).toBe(1);
        expect(button?.textContent?.trim()).toBe('inc 1');

        button?.click();
        expect(clickCount).toBe(2);
        expect(count()).toBe(2);
        expect(button?.textContent?.trim()).toBe('inc 2');
    });

    it('should preserve signal calls in onclick handlers', () => {
        const [count, setCount] = createSignal(0);
        let lastValue = -1;

        const Component = () => {
            return (
                <button onclick={() => {
                    lastValue = count();
                    setCount(count() + 1);
                }}>
                    Click me
                </button>
            );
        };

        container.appendChild(<Component /> as any);
        const button = container.querySelector('button');

        expect(count()).toBe(0);

        button?.click();
        expect(lastValue).toBe(0);
        expect(count()).toBe(1);

        button?.click();
        expect(lastValue).toBe(1);
        expect(count()).toBe(2);
    });
});
