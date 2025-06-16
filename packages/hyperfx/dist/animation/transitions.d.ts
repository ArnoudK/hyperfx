import { VNode } from "../elem/elem";
import { ReactiveSignal } from "../reactive/state";
export interface AnimationOptions {
    duration?: number;
    easing?: string | ((t: number) => number);
    delay?: number;
    fill?: 'none' | 'forwards' | 'backwards' | 'both';
    direction?: 'normal' | 'reverse' | 'alternate' | 'alternate-reverse';
    iterations?: number | 'infinite';
}
export interface TransitionOptions extends AnimationOptions {
    property?: string;
    from?: string | number;
    to?: string | number;
}
export declare const easings: {
    linear: (t: number) => number;
    easeIn: (t: number) => number;
    easeOut: (t: number) => number;
    easeInOut: (t: number) => number;
    easeInCubic: (t: number) => number;
    easeOutCubic: (t: number) => number;
    easeInOutCubic: (t: number) => number;
    bounce: (t: number) => number;
};
export declare function createAnimatedValue(initialValue: number, options?: AnimationOptions): ReactiveSignal<number> & {
    animateTo: (target: number) => Promise<void>;
};
export declare function Transition(show: ReactiveSignal<boolean>, children: VNode, enterTransition?: TransitionOptions, exitTransition?: TransitionOptions): VNode;
export declare function FadeTransition(show: ReactiveSignal<boolean>, children: VNode, duration?: number): VNode;
export declare function SlideTransition(show: ReactiveSignal<boolean>, children: VNode, duration?: number, direction?: 'up' | 'down' | 'left' | 'right'): VNode;
export declare function ScaleTransition(show: ReactiveSignal<boolean>, children: VNode, duration?: number): VNode;
export declare function createSpring(initialValue: number, config?: {
    stiffness?: number;
    damping?: number;
    mass?: number;
}): ReactiveSignal<number> & {
    setTarget: (target: number) => void;
};
export declare function staggerAnimation(elements: NodeListOf<HTMLElement> | HTMLElement[], animation: (element: HTMLElement, index: number) => void, delay?: number): void;
export declare function createScrollTrigger(target: HTMLElement | string, animation: (isVisible: boolean) => void, options?: IntersectionObserverInit): () => void;
