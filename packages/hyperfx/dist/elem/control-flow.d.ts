import { VNode } from "./elem";
import { ReactiveSignal } from "../reactive/state";
export declare function If(condition: ReactiveSignal<boolean> | boolean, thenVNode: VNode | (() => VNode), elseVNode?: VNode | (() => VNode)): VNode;
export declare function Show(condition: ReactiveSignal<boolean> | boolean, children: VNode | (() => VNode)): VNode;
export interface SwitchCase<T> {
    when: T | ((value: T) => boolean);
    then: VNode | (() => VNode);
}
export declare function Switch<T>(value: ReactiveSignal<T> | T, cases: SwitchCase<T>[], defaultCase?: VNode | (() => VNode)): VNode;
export declare function For<T>(items: ReactiveSignal<T[]> | T[], renderItem: (item: T, index: number) => VNode, keyFn?: (item: T, index: number) => string | number): VNode;
export declare function Portal(children: VNode | VNode[], target: HTMLElement | string): VNode;
export declare function Lazy(loader: () => Promise<VNode>, fallback?: VNode): VNode;
export declare function ErrorBoundary(children: VNode | VNode[], fallback: (error: Error) => VNode): VNode;
