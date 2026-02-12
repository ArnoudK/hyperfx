import { isSignal, getAccessor, isAccessor, isSignalTuple } from "../../reactive/signal";
import type { Accessor } from "../../reactive/signal";
import { renderChildren } from "./children";
import type { JSXChildren } from "./types";



import { FRAGMENT_TAG } from "./constants";

export { FRAGMENT_TAG };



// Create a text node with optional reactive content
function createTextNode(content: string | number | boolean | Accessor<unknown> | [Accessor<unknown>, (v: unknown | ((prev: unknown) => unknown)) => () => void]): Text {
  const textNode = document.createTextNode('');

  const updateText = () => {
    let text = '';
    if (isSignal(content)) {
      const accessor = getAccessor(content);
      text = String(accessor());
    } else {
      text = String(content);
    }
    textNode.textContent = text;
  };

  updateText(); // Set initial content

  if (isAccessor(content) || isSignalTuple(content)) {
    const accessor = getAccessor(content);
    accessor?.subscribe?.(updateText);
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
