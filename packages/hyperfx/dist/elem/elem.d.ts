import { type ElementAttributes as AttrElementAttributes, type AttributesForElement } from "./attr";
import { ReactiveSignal, EffectCleanup } from "../reactive/state";
export interface VNode<TagType extends keyof HTMLElementTagNameMap | string | symbol = string | symbol> {
    tag: TagType;
    props: AttrElementAttributes;
    children: (VNode | string | ReactiveSignal<string>)[];
    key?: string | number;
    dom?: HTMLElement | Text | Comment;
    reactiveProps?: Record<string, ReactiveSignal<any>>;
    effects?: EffectCleanup[];
}
export type VNodeChildren = readonly (VNode | string | ReactiveSignal<string>)[] | undefined;
export declare function resolveReactiveValue<T>(value: T | ReactiveSignal<T>): T;
export declare const el: <K extends keyof HTMLElementTagNameMap>(tagName: K, attributes?: AttributesForElement<K>, children?: VNodeChildren) => VNode<K>;
export declare const Div: (attributes?: AttributesForElement<"div">, children?: VNodeChildren) => VNode<"div">;
/** Render text (the text content inside a tag): now returns a string for VDOM */
export declare function t(text: TemplateStringsArray | string, ...values: (string | unknown)[]): string;
export declare const FRAGMENT_TAG: unique symbol;
export declare const Fragment: (children: VNodeChildren) => VNode<typeof FRAGMENT_TAG>;
export declare const createElement: <K extends keyof HTMLElementTagNameMap>(name: K, attributes: AttrElementAttributes) => VNode<K>;
export declare const createElementWithChildren: <K extends keyof HTMLElementTagNameMap>(name: K, attributes: AttrElementAttributes, // Correctly uses the defined ElementAttributes
children?: VNodeChildren) => VNode<K>;
export declare function mount(vnode: VNode | string | ReactiveSignal<string>, container: Node, anchor?: Node | null): HTMLElement | Comment;
export declare function unmount(vnode: VNode | string | ReactiveSignal<string>): void;
export declare function patch(n1: VNode | string | ReactiveSignal<string> | null, // oldVNode
n2: VNode | string | ReactiveSignal<string> | null, // newVNode
container: Node, // container for mount if n1 is null or types differ
anchor?: Node | null): ChildNode | null | undefined;
/**
 * Renders a VNode tree into a container element.
 * This is the entry point for the VDOM rendering.
 */
export declare const RenderToBody: (vnode: VNode | VNode[]) => void;
