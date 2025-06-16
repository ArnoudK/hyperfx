import { VNode } from "../elem/elem";
import { ReactiveSignal } from "../reactive/state";
export declare const isDev: () => any;
export interface ComponentTreeNode {
    id: string;
    type: string;
    props: Record<string, any>;
    children: ComponentTreeNode[];
    renderTime?: number;
    updateCount?: number;
}
declare class DevTools {
    private componentTree;
    private componentMap;
    private renderCounts;
    private enabled;
    enable(): void;
    disable(): void;
    isEnabled(): boolean;
    trackComponent(id: string, type: string, props: Record<string, any>, parentId?: string): void;
    trackRender(id: string, renderTime: number): void;
    untrackComponent(id: string): void;
    getComponentTree(): ComponentTreeNode | null;
    logComponentTree(): void;
    private logNode;
    getFrequentlyUpdatingComponents(threshold?: number): ComponentTreeNode[];
    analyzePerformance(): void;
}
export declare const devTools: DevTools;
export declare function debugVNode(vnode: VNode, label?: string): VNode;
export declare function debugSignal<T>(signal: ReactiveSignal<T>, label?: string): ReactiveSignal<T>;
export declare function DevBoundary(children: VNode | VNode[]): VNode;
export declare function enableHotReload(): void;
export declare function createDebugOverlay(): HTMLElement;
export {};
