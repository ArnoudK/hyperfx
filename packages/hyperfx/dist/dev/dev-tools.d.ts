import { JSXElement } from "../jsx/jsx-runtime";
export declare const isDev: () => any;
export interface ComponentTreeNode {
    id: string;
    type: string;
    props: Record<string, unknown>;
    children: ComponentTreeNode[];
    renderTime?: number;
    updateCount?: number;
}
export declare const enableDevTools: () => void;
export declare const disableDevTools: () => void;
export declare const trackComponent: (id: string, type: string, props: Record<string, unknown>, children: JSXElement[], renderTime?: number) => void;
export declare const getComponentInfo: (id: string) => ComponentTreeNode | null;
export declare const getAllComponents: () => ComponentTreeNode[];
export declare const clearComponentTracking: () => void;
