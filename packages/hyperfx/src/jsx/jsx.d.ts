/// <reference path="jsx-runtime.ts" />

import { VNode } from "../elem/elem";
import { JSXChildren, EventHandlers, ReactiveHtmlAttributes } from "./jsx-runtime";
import { AttributesForElement } from "../elem/attr";

declare global {
  namespace JSX {
    interface Element extends VNode {}

    interface IntrinsicElements {
      [elemName: string]: AttributesForElement<any> & EventHandlers & ReactiveHtmlAttributes & { children?: JSXChildren };
    }

    interface ElementChildrenAttribute {
      children: JSXChildren;
    }
  }
}

export { };
