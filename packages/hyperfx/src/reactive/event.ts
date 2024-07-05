type eventType = keyof HTMLElementEventMap;

export function WithEventListener<T extends eventType, K extends HTMLElement>(
  el: K,
  eventtype: T,
  listener: (ev: HTMLElementEventMap[T]) => void,
): K {
  el.addEventListener(eventtype, listener);
  return el;
}
