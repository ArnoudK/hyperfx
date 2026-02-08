
import { describe, it, expect, vi } from 'vitest';
import { createSignal, createEffect, isSignal } from 'hyperfx';
import { jsx } from 'hyperfx';

// Helper to render a component
function render(component: any) {
    const el = component();
    return el;
}

describe('Reactive Props', () => {
    it('should auto-unwrap signals in props', () => {
        const count = createSignal(1);
        let receivedValue;

        const Component = (props: any) => {
            // value should be unwrapped automatically
            receivedValue = props.value;
            // Should NOT be a signal function anymore
            expect(typeof props.value).toBe('number');
            expect(isSignal(props.value)).toBe(false);
            return document.createElement('div');
        };

        jsx(Component, { value: count });

        expect(receivedValue).toBe(1);
    });

    it('should track signals when accessed in effects', () => {
        const count = createSignal(1);
        let renderCount = 0;
        let lastValue = 0;

        const Component = (props: any) => {
            createEffect(() => {
                renderCount++;
                lastValue = props.value; // Should trigger subscription
            });
            return document.createElement('div');
        };

        const el = jsx(Component, { value: count });

        expect(renderCount).toBe(1);
        expect(lastValue).toBe(1);

        // Update signal
        count(2);

        expect(renderCount).toBe(2);
        expect(lastValue).toBe(2);
    });

    it('should handle regular values correctly', () => {
        const Component = (props: any) => {
            expect(props.value).toBe(123);
            return document.createElement('div');
        };

        jsx(Component, { value: 123 });
    });

    it('should still allow access to other props', () => {
        const count = createSignal(1);

        const Component = (props: any) => {
            expect(props.other).toBe('static');
            expect(props.value).toBe(1);
            return document.createElement('div');
        };

        jsx(Component, { value: count, other: 'static' });
    });
});
