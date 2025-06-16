import { VNode, FRAGMENT_TAG } from "../elem/elem";
import { type AttributesForElement } from "../elem/attr";
import { ReactiveSignal } from "../reactive/state";
/**
 * JSX Runtime for HyperFX
 *
 * Features supported:
 * - Full TypeScript JSX support with type safety
 * - Reactive signals as props and children
 * - htmlFor attribute (maps to 'for')
 * - className attribute (maps to 'class')
 * - Key props for reconciliation
 * - Event handlers with proper typing
 * - Fragment support
 * - Function components
 *
 * Example usage:
 * ```tsx
 * // Reactive children
 * <div>{count()}</div>
 * <span>{() => `Count: ${count()}`}</span>
 *
 * // Reactive template literals (recommended approach)
 * <button aria-label={template`Clear all ${cartItemCount} items from cart`}>
 *   Clear Cart
 * </button>
 *
 * // Alternative: Use r() helper for complex reactive expressions
 * <div title={r(() => `User ${userName()}: ${status()}`)}>Content</div>
 *
 * // htmlFor attribute
 * <label htmlFor="input-id">Label</label>
 *
 * // Reactive props
 * <div className={isActive() ? 'active' : 'inactive'}>Content</div>
 *
 * // Key props
 * <div key="unique-id">Item</div>
 * ```
 */
export type ReactiveValue<T> = T | ReactiveSignal<T> | (() => T);
export type ReactiveString = ReactiveValue<string>;
export type ReactiveNumber = ReactiveValue<number>;
export type ReactiveBoolean = ReactiveValue<boolean>;
export type ReactiveStringExpression = string | ReactiveSignal<string> | (() => string);
export type EventHandler<E extends Event = Event> = (event: E) => void;
type MakeReactive<T> = {
    [K in keyof T]: K extends `on${string}` ? T[K] : K extends 'key' ? T[K] : K extends 'ref' ? T[K] : T[K] extends string | undefined ? ReactiveStringExpression | T[K] : T[K] extends number | undefined ? ReactiveNumber | T[K] : T[K] extends boolean | undefined ? ReactiveBoolean | T[K] : T[K] extends string | number | undefined ? ReactiveValue<string | number> | T[K] : ReactiveValue<T[K]> | T[K];
};
export type ReactiveElementAttributes<K extends keyof HTMLElementTagNameMap> = MakeReactive<AttributesForElement<K>> & {
    htmlFor?: ReactiveStringExpression;
    className?: ReactiveStringExpression;
    key?: string | number;
};
export type ComponentProps<P = {}> = P & {
    children?: JSXChildren;
    key?: string | number;
};
export type FunctionComponent<P = {}> = (props: ComponentProps<P>) => VNode;
export type JSXChild = VNode | string | number | boolean | null | undefined | ReactiveSignal<string> | ReactiveSignal<number> | ReactiveSignal<boolean> | ReactiveSignal<VNode> | ReactiveSignal<VNode[]>;
export type JSXChildren = JSXChild | JSXChild[];
export interface EventHandlers {
    onClick?: EventHandler<MouseEvent>;
    onInput?: EventHandler<InputEvent>;
    onChange?: EventHandler<Event>;
    onSubmit?: EventHandler<SubmitEvent>;
    onFocus?: EventHandler<FocusEvent>;
    onBlur?: EventHandler<FocusEvent>;
    onKeyDown?: EventHandler<KeyboardEvent>;
    onKeyUp?: EventHandler<KeyboardEvent>;
    onKeyPress?: EventHandler<KeyboardEvent>;
    onMouseEnter?: EventHandler<MouseEvent>;
    onMouseLeave?: EventHandler<MouseEvent>;
    onMouseMove?: EventHandler<MouseEvent>;
    onMouseDown?: EventHandler<MouseEvent>;
    onMouseUp?: EventHandler<MouseEvent>;
    onTouchStart?: EventHandler<TouchEvent>;
    onTouchEnd?: EventHandler<TouchEvent>;
    onTouchMove?: EventHandler<TouchEvent>;
    onScroll?: EventHandler<Event>;
    onResize?: EventHandler<Event>;
    onLoad?: EventHandler<Event>;
    onError?: EventHandler<Event>;
}
export declare namespace JSX {
    interface Element extends VNode {
    }
    interface IntrinsicElements {
        a: ReactiveElementAttributes<'a'> & EventHandlers & {
            children?: JSXChildren;
        };
        abbr: ReactiveElementAttributes<'abbr'> & EventHandlers & {
            children?: JSXChildren;
        };
        address: ReactiveElementAttributes<'address'> & EventHandlers & {
            children?: JSXChildren;
        };
        area: ReactiveElementAttributes<'area'> & EventHandlers;
        article: ReactiveElementAttributes<'article'> & EventHandlers & {
            children?: JSXChildren;
        };
        aside: ReactiveElementAttributes<'aside'> & EventHandlers & {
            children?: JSXChildren;
        };
        audio: ReactiveElementAttributes<'audio'> & EventHandlers & {
            children?: JSXChildren;
        };
        b: ReactiveElementAttributes<'b'> & EventHandlers & {
            children?: JSXChildren;
        };
        base: ReactiveElementAttributes<'base'> & EventHandlers;
        bdi: ReactiveElementAttributes<'bdi'> & EventHandlers & {
            children?: JSXChildren;
        };
        bdo: ReactiveElementAttributes<'bdo'> & EventHandlers & {
            children?: JSXChildren;
        };
        blockquote: ReactiveElementAttributes<'blockquote'> & EventHandlers & {
            children?: JSXChildren;
        };
        body: ReactiveElementAttributes<'body'> & EventHandlers & {
            children?: JSXChildren;
        };
        br: ReactiveElementAttributes<'br'> & EventHandlers;
        button: ReactiveElementAttributes<'button'> & EventHandlers & {
            children?: JSXChildren;
        };
        canvas: ReactiveElementAttributes<'canvas'> & EventHandlers & {
            children?: JSXChildren;
        };
        caption: ReactiveElementAttributes<'caption'> & EventHandlers & {
            children?: JSXChildren;
        };
        cite: ReactiveElementAttributes<'cite'> & EventHandlers & {
            children?: JSXChildren;
        };
        code: ReactiveElementAttributes<'code'> & EventHandlers & {
            children?: JSXChildren;
        };
        col: ReactiveElementAttributes<'col'> & EventHandlers;
        colgroup: ReactiveElementAttributes<'colgroup'> & EventHandlers & {
            children?: JSXChildren;
        };
        data: ReactiveElementAttributes<'data'> & EventHandlers & {
            children?: JSXChildren;
        };
        datalist: ReactiveElementAttributes<'datalist'> & EventHandlers & {
            children?: JSXChildren;
        };
        dd: ReactiveElementAttributes<'dd'> & EventHandlers & {
            children?: JSXChildren;
        };
        del: ReactiveElementAttributes<'del'> & EventHandlers & {
            children?: JSXChildren;
        };
        details: ReactiveElementAttributes<'details'> & EventHandlers & {
            children?: JSXChildren;
        };
        dfn: ReactiveElementAttributes<'dfn'> & EventHandlers & {
            children?: JSXChildren;
        };
        dialog: ReactiveElementAttributes<'dialog'> & EventHandlers & {
            children?: JSXChildren;
        };
        div: ReactiveElementAttributes<'div'> & EventHandlers & {
            children?: JSXChildren;
        };
        dl: ReactiveElementAttributes<'dl'> & EventHandlers & {
            children?: JSXChildren;
        };
        dt: ReactiveElementAttributes<'dt'> & EventHandlers & {
            children?: JSXChildren;
        };
        em: ReactiveElementAttributes<'em'> & EventHandlers & {
            children?: JSXChildren;
        };
        embed: ReactiveElementAttributes<'embed'> & EventHandlers;
        fieldset: ReactiveElementAttributes<'fieldset'> & EventHandlers & {
            children?: JSXChildren;
        };
        figcaption: ReactiveElementAttributes<'figcaption'> & EventHandlers & {
            children?: JSXChildren;
        };
        figure: ReactiveElementAttributes<'figure'> & EventHandlers & {
            children?: JSXChildren;
        };
        footer: ReactiveElementAttributes<'footer'> & EventHandlers & {
            children?: JSXChildren;
        };
        form: ReactiveElementAttributes<'form'> & EventHandlers & {
            children?: JSXChildren;
        };
        h1: ReactiveElementAttributes<'h1'> & EventHandlers & {
            children?: JSXChildren;
        };
        h2: ReactiveElementAttributes<'h2'> & EventHandlers & {
            children?: JSXChildren;
        };
        h3: ReactiveElementAttributes<'h3'> & EventHandlers & {
            children?: JSXChildren;
        };
        h4: ReactiveElementAttributes<'h4'> & EventHandlers & {
            children?: JSXChildren;
        };
        h5: ReactiveElementAttributes<'h5'> & EventHandlers & {
            children?: JSXChildren;
        };
        h6: ReactiveElementAttributes<'h6'> & EventHandlers & {
            children?: JSXChildren;
        };
        head: ReactiveElementAttributes<'head'> & EventHandlers & {
            children?: JSXChildren;
        };
        header: ReactiveElementAttributes<'header'> & EventHandlers & {
            children?: JSXChildren;
        };
        hgroup: ReactiveElementAttributes<'hgroup'> & EventHandlers & {
            children?: JSXChildren;
        };
        hr: ReactiveElementAttributes<'hr'> & EventHandlers;
        html: ReactiveElementAttributes<'html'> & EventHandlers & {
            children?: JSXChildren;
        };
        i: ReactiveElementAttributes<'i'> & EventHandlers & {
            children?: JSXChildren;
        };
        iframe: ReactiveElementAttributes<'iframe'> & EventHandlers & {
            children?: JSXChildren;
        };
        img: ReactiveElementAttributes<'img'> & EventHandlers;
        input: ReactiveElementAttributes<'input'> & EventHandlers;
        ins: ReactiveElementAttributes<'ins'> & EventHandlers & {
            children?: JSXChildren;
        };
        kbd: ReactiveElementAttributes<'kbd'> & EventHandlers & {
            children?: JSXChildren;
        };
        label: ReactiveElementAttributes<'label'> & EventHandlers & {
            children?: JSXChildren;
        };
        legend: ReactiveElementAttributes<'legend'> & EventHandlers & {
            children?: JSXChildren;
        };
        li: ReactiveElementAttributes<'li'> & EventHandlers & {
            children?: JSXChildren;
        };
        link: ReactiveElementAttributes<'link'> & EventHandlers;
        main: ReactiveElementAttributes<'main'> & EventHandlers & {
            children?: JSXChildren;
        };
        map: ReactiveElementAttributes<'map'> & EventHandlers & {
            children?: JSXChildren;
        };
        mark: ReactiveElementAttributes<'mark'> & EventHandlers & {
            children?: JSXChildren;
        };
        meta: ReactiveElementAttributes<'meta'> & EventHandlers;
        meter: ReactiveElementAttributes<'meter'> & EventHandlers & {
            children?: JSXChildren;
        };
        nav: ReactiveElementAttributes<'nav'> & EventHandlers & {
            children?: JSXChildren;
        };
        noscript: ReactiveElementAttributes<'noscript'> & EventHandlers & {
            children?: JSXChildren;
        };
        object: ReactiveElementAttributes<'object'> & EventHandlers & {
            children?: JSXChildren;
        };
        ol: ReactiveElementAttributes<'ol'> & EventHandlers & {
            children?: JSXChildren;
        };
        optgroup: ReactiveElementAttributes<'optgroup'> & EventHandlers & {
            children?: JSXChildren;
        };
        option: ReactiveElementAttributes<'option'> & EventHandlers & {
            children?: JSXChildren;
        };
        output: ReactiveElementAttributes<'output'> & EventHandlers & {
            children?: JSXChildren;
        };
        p: ReactiveElementAttributes<'p'> & EventHandlers & {
            children?: JSXChildren;
        };
        picture: ReactiveElementAttributes<'picture'> & EventHandlers & {
            children?: JSXChildren;
        };
        pre: ReactiveElementAttributes<'pre'> & EventHandlers & {
            children?: JSXChildren;
        };
        progress: ReactiveElementAttributes<'progress'> & EventHandlers & {
            children?: JSXChildren;
        };
        q: ReactiveElementAttributes<'q'> & EventHandlers & {
            children?: JSXChildren;
        };
        rp: ReactiveElementAttributes<'rp'> & EventHandlers & {
            children?: JSXChildren;
        };
        rt: ReactiveElementAttributes<'rt'> & EventHandlers & {
            children?: JSXChildren;
        };
        ruby: ReactiveElementAttributes<'ruby'> & EventHandlers & {
            children?: JSXChildren;
        };
        s: ReactiveElementAttributes<'s'> & EventHandlers & {
            children?: JSXChildren;
        };
        samp: ReactiveElementAttributes<'samp'> & EventHandlers & {
            children?: JSXChildren;
        };
        script: ReactiveElementAttributes<'script'> & EventHandlers & {
            children?: JSXChildren;
        };
        section: ReactiveElementAttributes<'section'> & EventHandlers & {
            children?: JSXChildren;
        };
        select: ReactiveElementAttributes<'select'> & EventHandlers & {
            children?: JSXChildren;
        };
        small: ReactiveElementAttributes<'small'> & EventHandlers & {
            children?: JSXChildren;
        };
        source: ReactiveElementAttributes<'source'> & EventHandlers;
        span: ReactiveElementAttributes<'span'> & EventHandlers & {
            children?: JSXChildren;
        };
        strong: ReactiveElementAttributes<'strong'> & EventHandlers & {
            children?: JSXChildren;
        };
        style: ReactiveElementAttributes<'style'> & EventHandlers & {
            children?: JSXChildren;
        };
        sub: ReactiveElementAttributes<'sub'> & EventHandlers & {
            children?: JSXChildren;
        };
        summary: ReactiveElementAttributes<'summary'> & EventHandlers & {
            children?: JSXChildren;
        };
        sup: ReactiveElementAttributes<'sup'> & EventHandlers & {
            children?: JSXChildren;
        };
        table: ReactiveElementAttributes<'table'> & EventHandlers & {
            children?: JSXChildren;
        };
        tbody: ReactiveElementAttributes<'tbody'> & EventHandlers & {
            children?: JSXChildren;
        };
        td: ReactiveElementAttributes<'td'> & EventHandlers & {
            children?: JSXChildren;
        };
        template: ReactiveElementAttributes<'template'> & EventHandlers & {
            children?: JSXChildren;
        };
        textarea: ReactiveElementAttributes<'textarea'> & EventHandlers & {
            children?: JSXChildren;
        };
        tfoot: ReactiveElementAttributes<'tfoot'> & EventHandlers & {
            children?: JSXChildren;
        };
        th: ReactiveElementAttributes<'th'> & EventHandlers & {
            children?: JSXChildren;
        };
        thead: ReactiveElementAttributes<'thead'> & EventHandlers & {
            children?: JSXChildren;
        };
        time: ReactiveElementAttributes<'time'> & EventHandlers & {
            children?: JSXChildren;
        };
        title: ReactiveElementAttributes<'title'> & EventHandlers & {
            children?: JSXChildren;
        };
        tr: ReactiveElementAttributes<'tr'> & EventHandlers & {
            children?: JSXChildren;
        };
        track: ReactiveElementAttributes<'track'> & EventHandlers;
        u: ReactiveElementAttributes<'u'> & EventHandlers & {
            children?: JSXChildren;
        };
        ul: ReactiveElementAttributes<'ul'> & EventHandlers & {
            children?: JSXChildren;
        };
        var: ReactiveElementAttributes<'var'> & EventHandlers & {
            children?: JSXChildren;
        };
        video: ReactiveElementAttributes<'video'> & EventHandlers & {
            children?: JSXChildren;
        };
        wbr: ReactiveElementAttributes<'wbr'> & EventHandlers;
    }
    interface ElementChildrenAttribute {
        children: JSXChildren;
    }
}
/**
 * Creates a reactive template literal that automatically updates when any signals change
 * Usage:
 * @example template`Clear all ${cartItemCount()} items from cart`
 */
export declare function template(strings: TemplateStringsArray, ...values: any[]): ReactiveSignal<string>;
/**
 * Alternative syntax for reactive template literals using a function wrapper
 * Usage: r(() => `Clear all ${cartItemCount()} items from cart`)
 */
export declare function r<T>(fn: () => T): ReactiveSignal<T>;
export declare function jsx<K extends keyof JSX.IntrinsicElements>(type: K, props: JSX.IntrinsicElements[K], key?: string | number): VNode;
export declare function jsx<P extends ComponentProps>(type: FunctionComponent<P>, props: P, key?: string | number): VNode;
export declare function jsx(type: typeof FRAGMENT_TAG, props: {
    children?: JSXChildren;
}, key?: string | number): VNode;
export declare function Fragment(props: {
    children?: JSXChildren;
}): VNode;
export declare function createElement(type: string | typeof FRAGMENT_TAG | FunctionComponent<any>, props: any, ...children: any[]): VNode;
export declare const jsxs: typeof jsx;
export declare const jsxDEV: typeof jsx;
export {};
