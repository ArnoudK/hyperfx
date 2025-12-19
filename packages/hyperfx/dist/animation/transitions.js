import { createSignal } from "../reactive/state";
// Predefined easing functions
export const easings = {
    linear: (t) => t,
    easeIn: (t) => t * t,
    easeOut: (t) => t * (2 - t),
    easeInOut: (t) => t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t,
    easeInCubic: (t) => t * t * t,
    easeOutCubic: (t) => {
        const adjustedT = --t;
        return adjustedT * adjustedT * adjustedT + 1;
    },
    easeInOutCubic: (t) => t < 0.5 ? 4 * t * t * t : (t - 1) * (2 * t - 2) * (2 * t - 2) + 1,
    bounce: (t) => {
        if (t < 1 / 2.75)
            return 7.5625 * t * t;
        if (t < 2 / 2.75) {
            const adjustedT = t - 1.5 / 2.75;
            return 7.5625 * adjustedT * adjustedT + 0.75;
        }
        if (t < 2.5 / 2.75) {
            const adjustedT = t - 2.25 / 2.75;
            return 7.5625 * adjustedT * adjustedT + 0.9375;
        }
        const adjustedT = t - 2.625 / 2.75;
        return 7.5625 * adjustedT * adjustedT + 0.984375;
    }
};
// Create animated value that smoothly transitions between states
export function createAnimatedValue(initialValue, options = {}) {
    const currentValue = createSignal(initialValue);
    let animationId = null;
    let isAnimating = false;
    const animateTo = (target) => {
        return new Promise((resolve) => {
            if (animationId) {
                cancelAnimationFrame(animationId);
            }
            const duration = options.duration || 300;
            const delay = options.delay || 0;
            const easingFn = typeof options.easing === 'function' ? options.easing : easings.linear;
            let startTime = null;
            const animate = (timestamp) => {
                if (!startTime)
                    startTime = timestamp;
                const elapsed = timestamp - startTime;
                if (elapsed < delay) {
                    animationId = requestAnimationFrame(animate);
                    return;
                }
                const progress = Math.min((elapsed - delay) / duration, 1);
                const easedProgress = easingFn(progress);
                const startValue = initialValue;
                const endValue = target;
                const newValue = startValue + (endValue - startValue) * easedProgress;
                currentValue(newValue);
                if (progress < 1) {
                    animationId = requestAnimationFrame(animate);
                }
                else {
                    animationId = null;
                    isAnimating = false;
                    resolve();
                }
            };
            isAnimating = true;
            animationId = requestAnimationFrame(animate);
        });
    };
    return Object.assign(currentValue, { animateTo });
}
// Animate DOM element properties
export function animateElement(element, properties, options = {}) {
    const animations = Object.entries(properties).map(([property, targetValue]) => {
        const currentValue = parseFloat(getComputedStyle(element)[property] || '0');
        const animatedValue = createAnimatedValue(currentValue, options);
        return animatedValue.animateTo(targetValue).then(() => {
            const value = animatedValue();
            element.style[property] = `${value}px`;
        });
    });
    return Promise.all(animations).then(() => { });
}
// CSS transitions for smooth property changes
export function transition(element, properties, options = {}) {
    return new Promise((resolve) => {
        const duration = options.duration || 300;
        const easing = typeof options.easing === 'string' ? options.easing : 'ease';
        // Store original transition
        const originalTransition = element.style.transition;
        // Set transition
        const transitionValue = Object.keys(properties)
            .map(prop => `${prop} ${duration}ms ${easing}`)
            .join(', ');
        element.style.transition = transitionValue;
        // Apply properties
        Object.entries(properties).forEach(([property, value]) => {
            element.style[property] = value;
        });
        // Wait for transition to complete
        const handleTransitionEnd = () => {
            element.style.transition = originalTransition;
            element.removeEventListener('transitionend', handleTransitionEnd);
            resolve();
        };
        element.addEventListener('transitionend', handleTransitionEnd);
        // Fallback timeout
        setTimeout(() => {
            element.removeEventListener('transitionend', handleTransitionEnd);
            element.style.transition = originalTransition;
            resolve();
        }, duration + 50);
    });
}
// Animate element entrance
export function fadeIn(element, options = {}) {
    element.style.opacity = '0';
    element.style.display = '';
    return transition(element, { opacity: 1 }, {
        duration: options.duration || 300,
        easing: options.easing || 'ease-out'
    });
}
export function fadeOut(element, options = {}) {
    return transition(element, { opacity: 0 }, {
        duration: options.duration || 300,
        easing: options.easing || 'ease-out'
    }).then(() => {
        element.style.display = 'none';
    });
}
export function slideIn(element, direction = 'left', options = {}) {
    const transforms = {
        left: 'translateX(-100%)',
        right: 'translateX(100%)',
        up: 'translateY(-100%)',
        down: 'translateY(100%)'
    };
    element.style.transform = transforms[direction];
    element.style.display = '';
    return transition(element, {
        transform: 'translateX(0) translateY(0)'
    }, {
        duration: options.duration || 300,
        easing: options.easing || 'ease-out'
    });
}
export function slideOut(element, direction = 'left', options = {}) {
    const transforms = {
        left: 'translateX(-100%)',
        right: 'translateX(100%)',
        up: 'translateY(-100%)',
        down: 'translateY(100%)'
    };
    return transition(element, { transform: transforms[direction] }, {
        duration: options.duration || 300,
        easing: options.easing || 'ease-out'
    }).then(() => {
        element.style.display = 'none';
    });
}
// Animate list items with staggered timing
export function animateListItems(container, items, entrance = 'fade', stagger = 100, options = {}) {
    const animations = items.map((item, index) => {
        return new Promise((resolve) => {
            setTimeout(() => {
                if (entrance === 'fade') {
                    fadeIn(item, options).then(resolve);
                }
                else {
                    slideIn(item, options.direction || 'left', options).then(resolve);
                }
            }, index * stagger);
        });
    });
    return Promise.all(animations).then(() => { });
}
// Create animated component wrapper
export function AnimatedComponent(children, animationOptions = {}) {
    const container = document.createElement('div');
    if (children instanceof HTMLElement) {
        container.appendChild(children);
    }
    else if (children instanceof DocumentFragment) {
        container.appendChild(children);
    }
    // Apply entrance animation if specified
    if (animationOptions.entrance && animationOptions.entrance !== 'none') {
        // Add to DOM first
        document.body.appendChild(container);
        setTimeout(() => {
            if (animationOptions.entrance === 'fade') {
                fadeIn(container, animationOptions);
            }
            else {
                slideIn(container, animationOptions.direction || 'left', animationOptions);
            }
            // Remove from body and let parent handle it
            if (container.parentNode === document.body) {
                document.body.removeChild(container);
            }
        }, 0);
    }
    return container;
}
// Performance monitoring for animations
export function createPerformanceMonitor() {
    const metrics = {};
    const measureAnimation = async (name, animation) => {
        const startTime = performance.now();
        try {
            const result = await animation();
            const duration = performance.now() - startTime;
            if (!metrics[name]) {
                metrics[name] = { totalDuration: 0, count: 0 };
            }
            metrics[name].totalDuration += duration;
            metrics[name].count += 1;
            return result;
        }
        catch (error) {
            const duration = performance.now() - startTime;
            if (!metrics[name]) {
                metrics[name] = { totalDuration: 0, count: 0 };
            }
            metrics[name].totalDuration += duration;
            metrics[name].count += 1;
            throw error;
        }
    };
    const getMetrics = () => {
        return Object.fromEntries(Object.entries(metrics).map(([name, { totalDuration, count }]) => [
            name,
            { duration: totalDuration / count, count }
        ]));
    };
    const reset = () => {
        Object.keys(metrics).forEach(key => {
            delete metrics[key];
        });
    };
    return { measureAnimation, getMetrics, reset };
}
//# sourceMappingURL=transitions.js.map