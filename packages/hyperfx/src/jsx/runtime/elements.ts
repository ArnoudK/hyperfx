import { isSignal } from "../../reactive/signal";
import type { Signal } from "../../reactive/signal";
import { renderChildren } from "./children";
import type { JSXChildren } from "./types";



// Fragment symbol
export const FRAGMENT_TAG = Symbol("HyperFX.Fragment");



// Create a text node with optional reactive content
function createTextNode(content: string | number | boolean | Signal<string | number | boolean>): Text {
  const textNode = document.createTextNode('');

  const updateText = () => {
    let text = '';
    if (isSignal(content)) {
      text = String(content());
    } else {
      text = String(content);
    }
    textNode.textContent = text;
  };

  updateText(); // Set initial content

  if (isSignal(content)) {
    content.subscribe(updateText);
  }

  return textNode;
}

// Fragment component
export function Fragment(props: { children?: JSXChildren }): DocumentFragment {
  const fragment = document.createDocumentFragment();
  renderChildren(fragment, props.children);
  return fragment;
}

export { createTextNode };