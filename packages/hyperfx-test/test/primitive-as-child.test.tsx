
import { createComputed, createSignal, JSXChild } from 'hyperfx';
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
        const [text, setText] = createSignal('Initial Text');

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
        setText('Updated Text');

        expect(wrapper?.textContent.trim()).toBe('Updated Text');
    });
    it('should handle numeric primitive child', () => {
        const [numberSignal, setNumberSignal] = createSignal(42);

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
        setNumberSignal(100);

        expect(wrapper?.textContent.trim()).toBe('100');
    });

    it('should handle nested primitive children', () => {
        const [text1, setText1] = createSignal('First');
        const [text2, setText2] = createSignal('Second');

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
        setText1('1st');
        setText2('2nd');

        expect(wrapper?.textContent.trim()).toBe('1st and 2nd');
    });

    it('should update when component returns memo', () => {
        const [count, setCount] = createSignal(1);
        const Component = () => {
            const memo = createComputed(() => count());
            return <div>{memo}</div>;
        };

        const element = Component() as HTMLDivElement;
        container.appendChild(element as Node);

        expect(element.textContent).toBe('1');

        setCount(2);
        expect(element.textContent).toBe('2');
    });

    it('should update when child returns function value', () => {
        const [count, setCount] = createSignal(1);
        const Component = () => <div>{() => count()}</div>;

        const element = Component() as HTMLDivElement;
        container.appendChild(element as Node);

        expect(element.textContent).toBe('1');

        setCount(2);
        expect(element.textContent).toBe('2');
    });
});
