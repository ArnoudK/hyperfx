type eventType = keyof HTMLElementEventMap;
export declare function WithEventListener<T extends eventType, K extends HTMLElement>(el: K, eventtype: T, listener: (ev: HTMLElementEventMap[T]) => void): K;
export {};
//# sourceMappingURL=event.d.ts.map