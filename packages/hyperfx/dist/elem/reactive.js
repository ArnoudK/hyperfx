// Create a reactive text element that automatically updates when signal changes
export function reactiveText(signal, tag = 'span') {
    const vnode = {
        tag,
        props: {},
        children: [],
        reactiveProps: {
            textContent: signal
        }
    };
    return vnode;
}
// Create an element with reactive attributes
export function reactiveElement(tag, staticAttrs = {}, reactiveAttrs = {}, children) {
    const vnode = {
        tag,
        props: staticAttrs, // Cast to the general ElementAttributes type
        children: children || [],
        reactiveProps: reactiveAttrs
    };
    return vnode;
}
// Create a reactive button with onClick handler
export function reactiveButton(textSignal, onClickSignal, staticAttrs = {}) {
    return reactiveElement('button', staticAttrs, {
        textContent: textSignal,
        onclick: onClickSignal
    });
}
// Create a reactive input with value binding
export function reactiveInput(valueSignal, onInputSignal, staticAttrs = {}) {
    return reactiveElement('input', staticAttrs, {
        value: valueSignal,
        oninput: onInputSignal
    });
}
// Create a reactive div with dynamic content
export function reactiveDiv(contentSignal, staticAttrs = {}, reactiveAttrs = {}) {
    return reactiveElement('div', staticAttrs, {
        textContent: contentSignal,
        ...reactiveAttrs
    });
}
// Helper to bind a signal directly as a child (for reactive text content)
export function bindSignal(signal) {
    return signal;
}
//# sourceMappingURL=reactive.js.map