import { VNode } from "./elem";
import { ReactiveSignal } from "../reactive/state";
export interface KeyedListItem<T> {
    key: string | number;
    data: T;
    vnode?: VNode;
    domNode?: Node;
}
export interface KeyedListOptions<T> {
    trackBy?: (item: T, index: number) => string | number;
    onItemAdded?: (item: T, index: number) => void;
    onItemRemoved?: (item: T, index: number) => void;
    onItemMoved?: (item: T, oldIndex: number, newIndex: number) => void;
}
export declare function createKeyedList<T>(containerTag: keyof HTMLElementTagNameMap | undefined, itemRenderer: (item: T, index: number) => VNode, options?: KeyedListOptions<T>): {
    render: (newData: T[]) => VNode;
    mount: (parentElement: HTMLElement) => Node;
    update: (newData: T[]) => void;
    getItems: () => KeyedListItem<T>[];
    getContainer: () => VNode<string | symbol> | null;
};
export declare function reactiveKeyedList<T>(dataSignal: ReactiveSignal<T[]>, containerTag: keyof HTMLElementTagNameMap | undefined, itemRenderer: (item: T, index: number) => VNode, options?: KeyedListOptions<T>): VNode;
