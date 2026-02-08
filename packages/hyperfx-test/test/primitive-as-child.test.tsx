
import { createComputed, createSignal, For, JSXChild } from 'hyperfx';
import { describe, it, expect, beforeEach, afterEach } from 'vitest';


function ComponentWithPrimitiveChild(props: { children: JSXChild }) {
    return <div class="wrapper">
        <div>{props.children}</div>
    </div>
}

describe('Direct child primitive', () => {
    let container: HTMLElement;

    beforeEach(() => {
        container = document.createElement('div');
        document.body.appendChild(container);
    });

    afterEach(() => {
        document.body.removeChild(container);
        container.innerHTML = '';
    });

    it('should render primitive child directly', () => {
        const element = (
            <ComponentWithPrimitiveChild>
                {'Hello World'}
            </ComponentWithPrimitiveChild>
        );
        container.appendChild(element as Node);

        const wrapper = container.querySelector('.wrapper');
        expect(wrapper).toBeTruthy();
        expect(wrapper?.textContent.trim()).toBe('Hello World');
    });

    it('should update primitive child when signal changes', () => {
        const text = createSignal('Initial Text');

        const element = (
            <ComponentWithPrimitiveChild>
                {text}
            </ComponentWithPrimitiveChild>
        );
        container.appendChild(element as Node);

        const wrapper = container.querySelector('.wrapper');
        expect(wrapper).toBeTruthy();
        expect(wrapper?.textContent.trim()).toBe('Initial Text');

        // Update signal
        text('Updated Text');

        expect(wrapper?.textContent.trim()).toBe('Updated Text');
    });
    it('should handle numeric primitive child', () => {
        const numberSignal = createSignal(42);

        const element = (
            <ComponentWithPrimitiveChild>
                {numberSignal}
            </ComponentWithPrimitiveChild>
        );
        container.appendChild(element as Node);

        const wrapper = container.querySelector('.wrapper');
        expect(wrapper).toBeTruthy();
        expect(wrapper?.textContent.trim()).toBe('42');

        // Update signal
        numberSignal(100);

        expect(wrapper?.textContent.trim()).toBe('100');
    });

    it('should handle nested primitive children', () => {
        const text1 = createSignal('First');
        const text2 = createSignal('Second');

        const element = (
            <ComponentWithPrimitiveChild>
                {text1} and {text2}
            </ComponentWithPrimitiveChild>
        );
        container.appendChild(element as Node);

        const wrapper = container.querySelector('.wrapper');
        expect(wrapper).toBeTruthy();
        expect(wrapper?.textContent.trim()).toBe('First and Second');

        // Update signals
        text1('1st');
        text2('2nd');

        expect(wrapper?.textContent.trim()).toBe('1st and 2nd');
    });
});
