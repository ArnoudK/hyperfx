import { VNode } from "../elem/elem";
import { ReactiveSignal } from "../reactive/state";
export interface ForProps<T> {
    each: ReactiveSignal<T[]> | T[];
    children: (item: T, index: number) => VNode;
    fallback?: VNode;
}
export declare function For<T>(props: ForProps<T>): VNode;
