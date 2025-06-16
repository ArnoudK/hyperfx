import { VNode } from "./elem";
import { ReactiveSignal } from "../reactive/state";
import { AttributesForElement } from "./attr";
export declare function reactiveText(signal: ReactiveSignal<string>, tag?: keyof HTMLElementTagNameMap): VNode;
export declare function reactiveElement<K extends keyof HTMLElementTagNameMap>(tag: K, staticAttrs?: AttributesForElement<K>, reactiveAttrs?: Record<string, ReactiveSignal<any>>, children?: (VNode | string | ReactiveSignal<string>)[]): VNode<K>;
export declare function reactiveButton(textSignal: ReactiveSignal<string>, onClickSignal: ReactiveSignal<() => void>, staticAttrs?: AttributesForElement<'button'>): VNode<'button'>;
export declare function reactiveInput(valueSignal: ReactiveSignal<string>, onInputSignal: ReactiveSignal<(event: Event) => void>, staticAttrs?: AttributesForElement<'input'>): VNode<'input'>;
export declare function reactiveDiv(contentSignal: ReactiveSignal<string>, staticAttrs?: AttributesForElement<'div'>, reactiveAttrs?: Record<string, ReactiveSignal<any>>): VNode<'div'>;
export declare function bindSignal(signal: ReactiveSignal<string>): ReactiveSignal<string>;
