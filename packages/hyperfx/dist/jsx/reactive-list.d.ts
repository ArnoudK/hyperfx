import { VNode } from '../elem/elem';
import { ReactiveSignal } from '../reactive/state';
export interface ReactiveListProps<T> {
    items: ReactiveSignal<T[]>;
    renderItem: (item: T, index: number) => VNode;
    keyExtractor?: (item: T, index: number) => string | number;
    className?: string;
    id?: string;
}
/**
 * ReactiveList component that properly handles reactive arrays in JSX
 * This component creates a container that automatically updates when the items array changes
 */
export declare function ReactiveList<T>(props: ReactiveListProps<T>): VNode;
