import { JSXElement } from "../jsx/jsx-runtime";
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
export declare function animateElement(element: HTMLElement, properties: Record<string, number>, options?: AnimationOptions): Promise<void>;
export declare function transition(element: HTMLElement, properties: Record<string, string | number>, options?: TransitionOptions): Promise<void>;
export declare function fadeIn(element: HTMLElement, options?: AnimationOptions): Promise<void>;
export declare function fadeOut(element: HTMLElement, options?: AnimationOptions): Promise<void>;
export declare function slideIn(element: HTMLElement, direction?: 'left' | 'right' | 'up' | 'down', options?: AnimationOptions): Promise<void>;
export declare function slideOut(element: HTMLElement, direction?: 'left' | 'right' | 'up' | 'down', options?: AnimationOptions): Promise<void>;
export declare function animateListItems(container: HTMLElement, items: HTMLElement[], entrance?: 'fade' | 'slide', stagger?: number, options?: AnimationOptions): Promise<void>;
export declare function AnimatedComponent(children: JSXElement, animationOptions?: AnimationOptions & {
    entrance?: 'fade' | 'slide' | 'none';
    direction?: 'left' | 'right' | 'up' | 'down';
}): JSXElement;
export declare function createPerformanceMonitor(): {
    measureAnimation<T>(name: string, animation: () => Promise<T>): Promise<T>;
    getMetrics(): Record<string, {
        duration: number;
        count: number;
    }>;
    reset(): void;
};
