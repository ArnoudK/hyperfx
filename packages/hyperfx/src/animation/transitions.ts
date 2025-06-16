import { mount, VNode } from "../elem/elem";
import { ReactiveSignal, createSignal, createEffect } from "../reactive/state";

// Enhanced animation utilities for the hyperfx framework

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

// Predefined easing functions
export const easings = {
  linear: (t: number) => t,
  easeIn: (t: number) => t * t,
  easeOut: (t: number) => t * (2 - t),
  easeInOut: (t: number) => t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t,
  easeInCubic: (t: number) => t * t * t,
  easeOutCubic: (t: number) => (--t) * t * t + 1,
  easeInOutCubic: (t: number) => t < 0.5 ? 4 * t * t * t : (t - 1) * (2 * t - 2) * (2 * t - 2) + 1,
  bounce: (t: number) => {
    if (t < 1 / 2.75) return 7.5625 * t * t;
    if (t < 2 / 2.75) return 7.5625 * (t -= 1.5 / 2.75) * t + 0.75;
    if (t < 2.5 / 2.75) return 7.5625 * (t -= 2.25 / 2.75) * t + 0.9375;
    return 7.5625 * (t -= 2.625 / 2.75) * t + 0.984375;
  }
};

// Create animated value that smoothly transitions between states
export function createAnimatedValue(
  initialValue: number,
  options: AnimationOptions = {}
): ReactiveSignal<number> & { animateTo: (target: number) => Promise<void> } {
  const currentValue = createSignal(initialValue);
  let animationId: number | null = null;
  let isAnimating = false;

  const animateTo = (target: number): Promise<void> => {
    return new Promise((resolve) => {
      if (animationId) {
        cancelAnimationFrame(animationId);
      }

      const start = currentValue();
      const distance = target - start;
      const duration = options.duration || 300;
      const easing = typeof options.easing === 'string' ? 
                     easings[options.easing as keyof typeof easings] || easings.easeInOut :
                     options.easing || easings.easeInOut;

      const startTime = performance.now();
      isAnimating = true;

      const animate = (currentTime: number) => {
        const elapsed = currentTime - startTime;
        const progress = Math.min(elapsed / duration, 1);
        const easedProgress = easing(progress);
        
        currentValue(start + distance * easedProgress);

        if (progress < 1) {
          animationId = requestAnimationFrame(animate);
        } else {
          isAnimating = false;
          animationId = null;
          resolve();
        }
      };

      if (options.delay) {
        setTimeout(() => {
          animationId = requestAnimationFrame(animate);
        }, options.delay);
      } else {
        animationId = requestAnimationFrame(animate);
      }
    });
  };

  const enhancedSignal = currentValue as any;
  enhancedSignal.animateTo = animateTo;
  enhancedSignal.isAnimating = () => isAnimating;

  return enhancedSignal;
}

// Transition element between states
export function Transition(
  show: ReactiveSignal<boolean>,
  children: VNode,
  enterTransition: TransitionOptions = {},
  exitTransition: TransitionOptions = {}
): VNode {
  const isVisible = createSignal(show());
  const isAnimating = createSignal(false);

  const container: VNode = {
    tag: 'div',
    props: {
      style: `transition: ${getTransitionString(enterTransition)}`
    },
    children: []
  };

  createEffect(() => {
    const shouldShow = show();
    
    if (shouldShow && !isVisible()) {
      // Enter animation
      isAnimating(true);
      isVisible(true);
      
      if (container.dom) {
        container.children = [children];
        mount(children, container.dom);
        
        // Apply enter transition
        requestAnimationFrame(() => {
          applyTransition(container.dom as HTMLElement, enterTransition, () => {
            isAnimating(false);
          });
        });
      }
    } else if (!shouldShow && isVisible()) {
      // Exit animation
      isAnimating(true);
      
      if (container.dom) {
        applyTransition(container.dom as HTMLElement, exitTransition, () => {
          isVisible(false);
          isAnimating(false);
          
          // Remove children after exit animation
          while (container.dom!.firstChild) {
            container.dom!.removeChild(container.dom!.firstChild);
          }
          container.children = [];
        });
      }
    }
  });

  return container;
}

function getTransitionString(options: TransitionOptions): string {
  const duration = options.duration || 300;
  const property = options.property || 'all';
  const easing = typeof options.easing === 'string' ? options.easing : 'ease';
  const delay = options.delay || 0;
  
  return `${property} ${duration}ms ${easing} ${delay}ms`;
}

function applyTransition(
  element: HTMLElement,
  options: TransitionOptions,
  onComplete: () => void
): void {
  const { duration = 300, property = 'opacity', from, to } = options;
  
  if (from !== undefined) {
    (element.style as any)[property] = from;
  }
  
  requestAnimationFrame(() => {
    if (to !== undefined) {
      (element.style as any)[property] = to;
    }
    
    setTimeout(onComplete, duration);
  });
}

// Fade in/out transitions
export function FadeTransition(
  show: ReactiveSignal<boolean>,
  children: VNode,
  duration: number = 300
): VNode {
  return Transition(
    show,
    children,
    { property: 'opacity', from: '0', to: '1', duration },
    { property: 'opacity', from: '1', to: '0', duration }
  );
}

// Slide up/down transitions
export function SlideTransition(
  show: ReactiveSignal<boolean>,
  children: VNode,
  duration: number = 300,
  direction: 'up' | 'down' | 'left' | 'right' = 'down'
): VNode {
  const transforms = {
    up: { from: 'translateY(100%)', to: 'translateY(0)' },
    down: { from: 'translateY(-100%)', to: 'translateY(0)' },
    left: { from: 'translateX(100%)', to: 'translateX(0)' },
    right: { from: 'translateX(-100%)', to: 'translateX(0)' }
  };

  const { from, to } = transforms[direction];

  return Transition(
    show,
    children,
    { property: 'transform', from, to, duration },
    { property: 'transform', from: to, to: from, duration }
  );
}

// Scale transition
export function ScaleTransition(
  show: ReactiveSignal<boolean>,
  children: VNode,
  duration: number = 300
): VNode {
  return Transition(
    show,
    children,
    { property: 'transform', from: 'scale(0)', to: 'scale(1)', duration },
    { property: 'transform', from: 'scale(1)', to: 'scale(0)', duration }
  );
}

// Spring physics for natural animations
export function createSpring(
  initialValue: number,
  config: { stiffness?: number; damping?: number; mass?: number } = {}
): ReactiveSignal<number> & { setTarget: (target: number) => void } {
  const { stiffness = 100, damping = 10, mass = 1 } = config;
  const currentValue = createSignal(initialValue);
  
  let velocity = 0;
  let target = initialValue;
  let animationId: number | null = null;

  const animate = () => {
    const current = currentValue();
    const spring = -stiffness * (current - target);
    const damper = -damping * velocity;
    const acceleration = (spring + damper) / mass;
    
    velocity += acceleration * 0.016; // Assume 60fps
    const newValue = current + velocity * 0.016;
    
    currentValue(newValue);
    
    // Continue animation if not settled
    if (Math.abs(velocity) > 0.01 || Math.abs(newValue - target) > 0.01) {
      animationId = requestAnimationFrame(animate);
    } else {
      currentValue(target);
      animationId = null;
    }
  };

  const setTarget = (newTarget: number) => {
    target = newTarget;
    if (!animationId) {
      animationId = requestAnimationFrame(animate);
    }
  };

  const springSignal = currentValue as any;
  springSignal.setTarget = setTarget;
  
  return springSignal;
}

// Stagger animation for lists
export function staggerAnimation(
  elements: NodeListOf<HTMLElement> | HTMLElement[],
  animation: (element: HTMLElement, index: number) => void,
  delay: number = 100
): void {
  Array.from(elements).forEach((element, index) => {
    setTimeout(() => {
      animation(element, index);
    }, index * delay);
  });
}

// Intersection observer for scroll-triggered animations
export function createScrollTrigger(
  target: HTMLElement | string,
  animation: (isVisible: boolean) => void,
  options: IntersectionObserverInit = {}
): () => void {
  const element = typeof target === 'string' ? 
                  document.querySelector(target) as HTMLElement : 
                  target;

  if (!element) {
    console.warn('Scroll trigger target not found:', target);
    return () => {};
  }

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      animation(entry.isIntersecting);
    });
  }, {
    threshold: 0.1,
    ...options
  });

  observer.observe(element);

  return () => observer.disconnect();
}
