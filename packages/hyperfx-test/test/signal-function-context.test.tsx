
import { describe, it, expect, beforeEach } from 'vitest';
import { createSignal } from 'hyperfx';

describe('Signal Function Context', () => {
    let container: HTMLElement;

    beforeEach(() => {
        container = document.createElement('div');
        document.body.appendChild(container);
    });

    it('should render signal values correctly in text content', () => {
        const [count] = createSignal(5);
        
        const Component = () => {
            return <button>+{count}</button>;
        };

        container.appendChild(<Component /> as any);
        const button = container.querySelector('button');
        expect(button?.textContent).toBe('+5');
    });

    it('should handle signals in onclick handlers correctly', () => {
        const [count, setCount] = createSignal(0);
        const [step] = createSignal(2);
        let clickCount = 0;

        const Component = () => {
            return (
                <button onclick={() => {
                    clickCount++;
                    setCount(count() + step());
                }}>
                    +{step}
                </button>
            );
        };

        container.appendChild(<Component /> as any);
        const button = container.querySelector('button');
        
        expect(button?.textContent?.trim()).toBe('+2');
        
        button?.click();
        expect(clickCount).toBe(1);
        expect(count()).toBe(2);
        
        button?.click();
        expect(clickCount).toBe(2);
        expect(count()).toBe(4);
    });

    it('should handle signals in function children with proper reactivity', () => {
        const [step, setStep] = createSignal(3);
        
        const Component = () => {
            return (
                <button onclick={() => setStep(step() + 1)}>
                    +{step}
                </button>
            );
        };

        container.appendChild(<Component /> as any);
        const button = container.querySelector('button');
        
        // Initial value
        expect(button?.textContent?.trim()).toBe('+3');
        
        // Update signal via click
        button?.click();
        expect(button?.textContent?.trim()).toBe('+4');
        
        button?.click();
        expect(button?.textContent?.trim()).toBe('+5');
    });

    it('should preserve signal calls in function contexts', () => {
        const [step, setStep] = createSignal(5);
        let lastStepValue: number | undefined;

        const Component = () => {
            return (
                <button onclick={() => {
                    lastStepValue = step();
                }}>
                    +{step}
                </button>
            );
        };

        container.appendChild(<Component /> as any);
        const button = container.querySelector('button');
        
        expect(button?.textContent?.trim()).toBe('+5');
        
        button?.click();
        expect(lastStepValue).toBe(5);
        
        // Update signal
        setStep(10);
        button?.click();
        expect(lastStepValue).toBe(10);
    });
});
