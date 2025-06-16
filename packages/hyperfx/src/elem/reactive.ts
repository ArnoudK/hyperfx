import { VNode, el } from "./elem";
import { ReactiveSignal, createEffect } from "../reactive/state";
import { AttributesForElement } from "./attr";

// Create a reactive text element that automatically updates when signal changes
export function reactiveText(signal: ReactiveSignal<string>, tag: keyof HTMLElementTagNameMap = 'span'): VNode {
  const vnode: VNode = {
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
export function reactiveElement<K extends keyof HTMLElementTagNameMap>(
  tag: K,
  staticAttrs: AttributesForElement<K> = {} as AttributesForElement<K>,
  reactiveAttrs: Record<string, ReactiveSignal<any>> = {},
  children?: (VNode | string | ReactiveSignal<string>)[]
): VNode<K> {
  const vnode: VNode<K> = {
    tag,
    props: staticAttrs as any, // Cast to the general ElementAttributes type
    children: children || [],
    reactiveProps: reactiveAttrs
  };

  return vnode;
}

// Create a reactive button with onClick handler
export function reactiveButton(
  textSignal: ReactiveSignal<string>,
  onClickSignal: ReactiveSignal<() => void>,
  staticAttrs: AttributesForElement<'button'> = {}
): VNode<'button'> {
  return reactiveElement('button', staticAttrs, {
    textContent: textSignal,
    onclick: onClickSignal
  });
}

// Create a reactive input with value binding
export function reactiveInput(
  valueSignal: ReactiveSignal<string>,
  onInputSignal: ReactiveSignal<(event: Event) => void>,
  staticAttrs: AttributesForElement<'input'> = {}
): VNode<'input'> {
  return reactiveElement('input', staticAttrs, {
    value: valueSignal,
    oninput: onInputSignal
  });
}

// Create a reactive div with dynamic content
export function reactiveDiv(
  contentSignal: ReactiveSignal<string>,
  staticAttrs: AttributesForElement<'div'> = {},
  reactiveAttrs: Record<string, ReactiveSignal<any>> = {}
): VNode<'div'> {
  return reactiveElement('div', staticAttrs, {
    textContent: contentSignal,
    ...reactiveAttrs
  });
}

// Helper to bind a signal directly as a child (for reactive text content)
export function bindSignal(signal: ReactiveSignal<string>): ReactiveSignal<string> {
  return signal;
}
