type targetValues = "_self" | "_blank" | "_parent" | "_top" | "_unfencedTop";
/** See: https://developer.mozilla.org/en-US/docs/Web/HTML/Global_attributes
 * These are used on almost all elements allowed in the body
 */
type globalAttrs = {
    /**  See https://webaim.org/techniques/keyboard/accesskey#spec */
    accesskey: string;
    autocapitalize: "none" | "off" | "sentences" | "on" | "words" | "characters";
    autofocus: "autofocus";
    class: string;
    contenteditable: "true" | "false" | "plaintext-only";
    /**  content direction */
    dir: "ltr" | "rtl" | "auto";
    draggable: "true" | "false";
    enterkeyhint: "enter" | "done" | "go" | "next" | "previous" | "search" | "send";
    exportparts: string;
    hidden: "" | "hidden" | "until-found";
    id: string;
    inert: "inert";
    inputmode: "none" | "text" | "decimal" | "numeric" | "tel" | "search" | "email" | "url";
    /**  https://developer.mozilla.org/en-US/docs/Web/HTML/Global_attributes/is */
    is: string;
    /**  https://developer.mozilla.org/en-US/docs/Web/HTML/Global_attributes/itemid */
    itemid: string;
    /** https://developer.mozilla.org/en-US/docs/Web/HTML/Global_attributes/itemprop */
    itemprop: string;
    itemref: string;
    itemscope: string;
    itemtype: string;
    lang: string;
    nonce: string;
    part: string;
    popover: string;
    role: string;
    slot: string;
    spellcheck: "" | "true" | "false";
    style: string;
    /** For now just -1 and 0
      https://developer.mozilla.org/en-US/docs/Web/HTML/Global_attributes/tabindex */
    tabindex: "-1" | "0";
    title: string;
    /** Prevent translation (such as Google translate). Should only be used for names
      https://developer.mozilla.org/en-US/docs/Web/HTML/Global_attributes/translate */
    translate: "" | "yes" | "no";
    /**  https://developer.mozilla.org/en-US/docs/Web/HTML/Global_attributes/virtualkeyboardpolicy */
    virtualkeyboardpolicy: "" | "auto" | "manual";
};
type GlobalAttr = Partial<globalAttrs>;

type BodyChild = HTMLDivElement | HTMLSpanElement | HTMLParagraphElement;
declare function Div(attributes: GlobalAttr, ...children: BodyChild[]): HTMLDivElement;
/** Render text (the text content inside a tag): */
declare const t: (t: string) => Text;
declare const RenderToBody: (el: HTMLElement) => HTMLElement;

/**
    * this file is for Elements with phrasing content that should have text as children
    * Phrasing context:  https://developer.mozilla.org/en-US/docs/Web/HTML/Content_categories#phrasing_content
    But only the ones that are not just semantic divs
    */
declare function Span(attributes: GlobalAttr, text: string): HTMLSpanElement;
type TextChild = Text | HTMLElement;
declare function P(attributes: GlobalAttr, ...children: TextChild[]): HTMLParagraphElement;
declare function Abbr(attributes: GlobalAttr, ...children: Text[]): HTMLElement;
type anchorAttr = Partial<GlobalAttr> & {
    href: string;
    target?: targetValues;
    download?: "download";
    filename?: string;
    hreflang?: string;
    ping?: string;
    referrerpolicy?: "no-referrer" | "no-referrer-when-downgrade" | "origin" | "origin-when-cross-origin" | "same-origin" | "strict-origin" | "strict-origin-when-cross-origin" | "unsafe-url";
    rel?: string;
};
declare function A(attributes: anchorAttr, ...children: TextChild[]): HTMLAnchorElement;
declare function B(attributes: GlobalAttr, ...children: Text[]): HTMLElement;
declare function Bdi(attributes: GlobalAttr, ...children: Text[]): HTMLElement;
declare function Bdo(attributes: GlobalAttr, ...children: Text[]): HTMLElement;
declare function I(attributes: GlobalAttr, ...children: Text[]): HTMLElement;
declare function Cite(attributes: GlobalAttr, ...children: TextChild[]): HTMLElement;

declare const H1: (attributes: GlobalAttr, ...children: Text[]) => HTMLHeadingElement;
declare const H2: (attributes: GlobalAttr, ...children: Text[]) => HTMLHeadingElement;
declare const H3: (attributes: GlobalAttr, ...children: Text[]) => HTMLHeadingElement;
declare const H4: (attributes: GlobalAttr, ...children: Text[]) => HTMLHeadingElement;
declare const H5: (attributes: GlobalAttr, ...children: Text[]) => HTMLHeadingElement;
declare const H6: (attributes: GlobalAttr, ...children: Text[]) => HTMLHeadingElement;

declare function Br(attributes: GlobalAttr): HTMLBRElement;
declare function Hr(attributes: GlobalAttr): HTMLHRElement;

type requiredImgAttr = {
    src: string;
};
type optionImgAttr = {
    alt: string;
    attributionsrc: string;
    crossorigin: "anonymous" | "use-credentials";
    decoding: "sync" | "async" | "auto";
    elementtiming: string;
    fetchpriority: "high" | "low" | "auto";
    height: string;
    width: string;
    loading: "eager" | "lazy";
    referrerpolicy: "no-referrer" | "no-referrer-when-downgrade" | "origin" | "origin-when-cross-origin" | "same-origin" | "strict-origin" | "strict-origin-when-cross-origin" | "unsafe-url";
    sizes: string;
    srcset: string;
};
type imageAttr = requiredImgAttr & GlobalAttr & Partial<optionImgAttr>;
declare function Img(attrs: imageAttr): HTMLImageElement;

type SteppableAttr = {
    value: string;
    max: string;
    min: string;
    step: string;
};
type LengthAble = {
    value: string;
    maxlength: string;
    minlength: string;
};
type InputAttr<inputType> = {
    id: string;
    name: string;
    /**  Tell the browser the input has a valid value before it can be submitted.
      NOT VALID ON: hidden, range, color, and buttons.
      @TODO might be fixed in later version  */
    required?: "required";
} & GlobalAttr & (inputType extends "button" ? {
    type: "button";
    value: string;
} : inputType extends "checkbox" ? {
    type: "checkbox";
    value: string;
    checked?: "checked";
} : inputType extends "color" ? {
    type: "color";
    value?: string;
} : inputType extends "date" ? {
    type: "date";
} & Partial<SteppableAttr> : inputType extends "datetime-local" ? {
    type: "datetime-local";
} & Partial<SteppableAttr> : inputType extends "email" ? {
    type: "email";
    multiple?: "multiple";
    pattern?: string;
    placeholder?: string;
    readonly?: "readonly";
    size?: string;
    list?: string;
} & Partial<LengthAble> : inputType extends "file" ? {
    type: "file";
    value: "";
    accept?: "string";
    capture?: "user" | "environment";
    multiple?: "multiple";
    webkitdirectory?: "webkitdirectory";
} : inputType extends "hidden" ? {
    type: "hidden";
    value: string | "_charset_";
} : inputType extends "image" ? {
    type: "image";
    src?: string;
    alt?: string;
    formaction?: string;
    formenctype?: "application/x-www-form-urlencoded" | "multipart/form-data" | "text/plain";
    formmethod?: "get" | "post" | "dialog";
    formnovalidate?: "formnovalidate";
    formtarget: targetValues;
} : inputType extends "month" ? {
    type: "month";
    readonly?: "readonly";
    list?: string;
} & Partial<SteppableAttr> : inputType extends "nubmer" ? {
    type: "number";
    list?: string;
    placeholder?: string;
    readonly?: "readonly";
} & Partial<SteppableAttr> : inputType extends "password" ? {
    type: "password";
    pattern?: string;
    size?: string;
    readonly?: "readonly";
    placeholder?: string;
    autocomplete?: "on" | "off" | "current-password" | "new-password";
} & Partial<LengthAble> : inputType extends "radio" ? {
    type: "radio";
    checked?: "checked";
} : inputType extends "range" ? {
    type: "range";
    list: string;
    orient?: "horizontal" | "vertical";
} & SteppableAttr : inputType extends "reset" ? {
    type: "reset";
} : inputType extends "search" ? {
    type: "search";
    value?: string;
    list: string;
    pattern: string;
    placeholder: string;
    readonly: "readonly";
    size: string;
    autocorrect?: "on" | "off";
    incremental?: "incremental";
    results?: string;
} & Partial<LengthAble> : inputType extends "submit" ? {
    type: "submit";
    value: string;
    disabled?: "disabled";
    formenctype?: "application/x-www-form-urlencoded" | "multipart/form-data" | "text/plain";
    formmethod?: "get" | "post" | "dialog";
    formnovalidate?: "formnovalidate";
    formtarget: targetValues;
} : inputType extends "tel" ? {
    type: "tel";
    list?: string;
    readonly?: "readonly";
    size?: string;
    pattern?: string;
} & Partial<LengthAble> : inputType extends "text" ? {
    type: "text";
    list?: string;
    pattern?: string;
    readonly?: "readonly";
    placeholder?: string;
} & Partial<LengthAble> : inputType extends "time" ? {
    type: "time";
    list?: string;
    readonly: "readonly";
} & Partial<SteppableAttr> : inputType extends "url" ? {
    type: "url";
    list?: string;
    pattern: string;
    placeholder: string;
    readonly?: "readonly";
} & Partial<LengthAble> : inputType extends "week" ? {
    type: "week";
    readonly?: "readonly";
} & Partial<SteppableAttr> : {
    type: "Error something went wrong ????";
});
declare function Input<inputType>(attrs: InputAttr<inputType>): HTMLInputElement;
type LabelAttr = GlobalAttr & {
    for: string;
};
declare function Label(attrs: LabelAttr, ...children: (HTMLElement | Text)[]): HTMLLabelElement;

/**
 * Sets the document title (this is a void function use it above the return in your render)
 */
declare function Title(title: string): void;

declare function Address(attributes: GlobalAttr, ...children: HTMLElement[]): HTMLElement;
declare function Nav(attributes: GlobalAttr, ...children: HTMLElement[]): HTMLElement;
/** https://developer.mozilla.org/en-US/docs/Web/HTML/Element/article */
declare function Article(attributes: GlobalAttr, ...children: HTMLElement[]): HTMLElement;
/** https://developer.mozilla.org/en-US/docs/Web/HTML/Element/aside */
declare function Aside(attributes: GlobalAttr, ...children: HTMLElement[]): HTMLElement;
declare function Main(attributes: GlobalAttr, ...children: HTMLElement[]): HTMLElement;
declare function Button(attributes: GlobalAttr, ...children: HTMLElement[]): void;
declare function Footer(attributes: GlobalAttr, ...children: HTMLElement[]): HTMLElement;

type WhateverComponent = Comp<any>;
declare class Comp<K extends any> {
    render: (data: K, comp: Comp<K>) => HTMLElement;
    childComps: WhateverComponent[];
    protected parent: WhateverComponent;
    protected data: K;
    protected changed: boolean;
    getParent(): WhateverComponent;
    /**
     * Usefull when updating before the component needs to be rendered!
     */
    UpdateNoRender(data: K): void;
    Update(newData: K): void;
    /** The current dom element*/
    currentRender: HTMLElement;
    /** Get a (shallow) copy of the array of children */
    getChildren(): WhateverComponent[];
    /** Returns the child */
    addChild(c: WhateverComponent): void;
    removeChild(c: WhateverComponent): void;
    Render(force?: boolean): HTMLElement;
    constructor(parent: WhateverComponent, data: K, render: (data: K, comp: Comp<K>) => HTMLElement);
}
declare function RootComponent(): RootComp;
declare class RootComp extends Comp<undefined> {
    constructor();
}
/** A component can be used to Bind a Value to a Render */
declare function Component<K extends any>(parent: WhateverComponent, data: K, render: (data: K, comp: Comp<K>) => HTMLElement): Comp<K>;
type WhateverPageComponent = PageComp<any>;
/**
 *
 * @param pageLoad Function is called when the route-path and matches the route this registered with in the 'pagehandler'. NOTE WHEN USING .Update ON COMPONENT IT WILL RENDER!!! (if you do so use no render)
 */
declare class PageComp<K extends any> extends Comp<K> {
    removeAllChildren(): void;
    onPageLoad: (data: K, comp: PageComp<K>) => void;
    OnPageLoad(): void;
    constructor(parent: WhateverComponent, data: K, render: (data: K, comp: Comp<K>) => HTMLElement, onPageLoad: (data: K, comp: PageComp<K>) => void);
}
declare function PageComponent<K extends any>(parent: WhateverComponent, data: K, render: (data: K, comp: Comp<K>) => HTMLElement, onPageLoad: (data: K, comp: PageComp<K>) => void): PageComp<K>;

type eventType = keyof HTMLElementEventMap;
declare function WithEventListener<T extends eventType, K extends HTMLElement>(el: K, eventtype: T, listener: (ev: HTMLElementEventMap[T]) => void): K;

/**
 * Navigate to a url by pushing it and popstate this allows for soft navigation using HyperFX
 * The URL must be registered in the PageRegister!!!
 */
declare function navigateTo(href: string): void;

type routeItem = {
    path: string;
    route: RegExp;
    comp: WhateverPageComponent;
    params: paramItem[];
};
type paramItem = {
    pos: number;
    name: string;
    value?: string;
};
declare class PageRegister {
    Anchor: HTMLElement;
    routes: routeItem[];
    currentPage: WhateverPageComponent | undefined;
    currentRoute: routeItem | undefined;
    /**
     * Add a route with a custom component. Those will be loaded on page load or a softnavigate with navigateTo.
     * params can be added with [name] e.g.: '/mypage/[myparam]/info'
     */
    registerRoute(route: string, comp: WhateverPageComponent): this;
    getParamValue(name: string): string | undefined;
    enable(): this;
    constructor(anchor: HTMLElement);
}
/**
 * Add a route with a custom component. Those will be loaded on page load or a softnavigate with navigateTo.
 * params can be added with [name] e.g.: '/mypage/[myparam]/info'
 */
declare function RouteRegister(el: HTMLElement): PageRegister;
declare function GetParamValue(name: string): string | undefined;

/**
 * Fetch JSON
 */
declare const fetcher: {
    post: typeof post;
};
interface FetchResult<T> {
    result: T | undefined;
    /**
     * Status will be 0 if err is caused by an exception
     *
     */
    err: {
        status: number;
        name: string;
        cause: string | object;
    } | undefined;
}
/**
 *
 * @param url
 * @param body
 * @param headers
 * @param requestInit modify all the request init params. {method} will always be post. If {body} or {headers} is specified it will override the {requestInit})
 * @returns {result} is successful otherwise {{error}}
 */
declare function post<T>(url: string, body: string | null | undefined, headers: {} | undefined | undefined, requestInit: Partial<RequestInit> | null | undefined): Promise<FetchResult<T>>;

declare global {
    interface HTMLElement {
        /** Add an event listener and return the Element */
        WithEventListener$HFX<K extends keyof HTMLElementEventMap>(eventtype: K, listener: (ev: HTMLElementEventMap[keyof HTMLElementEventMap]) => void): this;
    }
    interface Object {
        With$HFX<T extends Object>(this: T, run: (obj: T) => this): T;
    }
}

export { A, Abbr, Address, Article, Aside, B, Bdi, Bdo, Br, Button, Cite, Component, Div, Footer, GetParamValue, H1, H2, H3, H4, H5, H6, Hr, I, Img, Input, Label, Main, Nav, P, PageComponent, RenderToBody, RootComponent, RouteRegister, Span, Title, WithEventListener, fetcher, navigateTo, t };
