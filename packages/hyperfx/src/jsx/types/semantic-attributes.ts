import type { ReactiveString, ReactiveBoolean } from './base';
import type { GlobalHTMLAttributes } from './global-attributes';

// ========================================
// SEMANTIC HTML5 ELEMENTS
// ========================================

export interface BodyHTMLAttributes extends GlobalHTMLAttributes {
  onafterprint?: (event: Event) => void;
  onbeforeprint?: (event: Event) => void;
  onbeforeunload?: (event: BeforeUnloadEvent) => void;
  onhashchange?: (event: HashChangeEvent) => void;
  onlanguagechange?: (event: Event) => void;
  onmessage?: (event: MessageEvent) => void;
  onmessageerror?: (event: MessageEvent) => void;
  onoffline?: (event: Event) => void;
  ononline?: (event: Event) => void;
  onpagehide?: (event: PageTransitionEvent) => void;
  onpageshow?: (event: PageTransitionEvent) => void;
  onpopstate?: (event: PopStateEvent) => void;
  onrejectionhandled?: (event: PromiseRejectionEvent) => void;
  onstorage?: (event: StorageEvent) => void;
  onunhandledrejection?: (event: PromiseRejectionEvent) => void;
  onunload?: (event: Event) => void;
}

export interface HtmlHTMLAttributes extends GlobalHTMLAttributes {
  manifest?: ReactiveString;
}

export interface HeadHTMLAttributes extends GlobalHTMLAttributes {}

export interface TitleHTMLAttributes extends GlobalHTMLAttributes {}

// ========================================
// METADATA ELEMENTS
// ========================================

export interface BaseHTMLAttributes extends GlobalHTMLAttributes {
  href?: ReactiveString;
  target?: ReactiveString;
}

export interface LinkHTMLAttributes extends GlobalHTMLAttributes {
  as?: ReactiveString;
  crossorigin?: 'anonymous' | 'use-credentials' | ReactiveString;
  href?: ReactiveString;
  hreflang?: ReactiveString;
  integrity?: ReactiveString;
  media?: ReactiveString;
  referrerpolicy?: 'no-referrer' | 'no-referrer-when-downgrade' | 'origin' | 'origin-when-cross-origin' | 'same-origin' | 'strict-origin' | 'strict-origin-when-cross-origin' | 'unsafe-url' | ReactiveString;
  rel?: ReactiveString;
  sizes?: ReactiveString;
  type?: ReactiveString;
}

export interface MetaHTMLAttributes extends GlobalHTMLAttributes {
  charset?: ReactiveString;
  content?: ReactiveString;
  httpEquiv?: 'content-language' | 'content-type' | 'default-style' | 'refresh' | 'set-cookie' | 'x-ua-compatible' | 'content-security-policy' | ReactiveString;
  name?: ReactiveString;
}

export interface StyleHTMLAttributes extends GlobalHTMLAttributes {
  media?: ReactiveString;
  type?: ReactiveString;
}

export interface ScriptHTMLAttributes extends GlobalHTMLAttributes {
  async?: ReactiveBoolean;
  crossorigin?: 'anonymous' | 'use-credentials' | ReactiveString;
  defer?: ReactiveBoolean;
  integrity?: ReactiveString;
  nomodule?: ReactiveBoolean;
  referrerpolicy?: 'no-referrer' | 'no-referrer-when-downgrade' | 'origin' | 'origin-when-cross-origin' | 'same-origin' | 'strict-origin' | 'strict-origin-when-cross-origin' | 'unsafe-url' | ReactiveString;
  src?: ReactiveString;
  type?: ReactiveString;
}

// ========================================
// SECTIONING ELEMENTS
// ========================================

export interface HeaderHTMLAttributes extends GlobalHTMLAttributes {}
export interface FooterHTMLAttributes extends GlobalHTMLAttributes {}
export interface MainHTMLAttributes extends GlobalHTMLAttributes {}
export interface SectionHTMLAttributes extends GlobalHTMLAttributes {}
export interface ArticleHTMLAttributes extends GlobalHTMLAttributes {}
export interface AsideHTMLAttributes extends GlobalHTMLAttributes {}
export interface NavHTMLAttributes extends GlobalHTMLAttributes {}

export interface HgroupHTMLAttributes extends GlobalHTMLAttributes {}

// ========================================
// HEADING ELEMENTS
// ========================================

export interface H1HTMLAttributes extends GlobalHTMLAttributes {}
export interface H2HTMLAttributes extends GlobalHTMLAttributes {}
export interface H3HTMLAttributes extends GlobalHTMLAttributes {}
export interface H4HTMLAttributes extends GlobalHTMLAttributes {}
export interface H5HTMLAttributes extends GlobalHTMLAttributes {}
export interface H6HTMLAttributes extends GlobalHTMLAttributes {}

// ========================================
// PHRASE ELEMENTS
// ========================================

export interface DataHTMLAttributes extends GlobalHTMLAttributes {
  value?: ReactiveString;
}

export interface RubyHTMLAttributes extends GlobalHTMLAttributes {}
export interface RtHTMLAttributes extends GlobalHTMLAttributes {}
export interface RpHTMLAttributes extends GlobalHTMLAttributes {}
export interface BdiHTMLAttributes extends GlobalHTMLAttributes {}
export interface BdoHTMLAttributes extends GlobalHTMLAttributes {
  dir?: 'ltr' | 'rtl' | ReactiveString;
}
export interface WbrHTMLAttributes extends GlobalHTMLAttributes {}

// ========================================
// EMBEDDED CONTENT
// ========================================

export interface CanvasHTMLAttributes extends GlobalHTMLAttributes {
  height?: ReactiveString | number;
  width?: ReactiveString | number;
}

export interface NoscriptHTMLAttributes extends GlobalHTMLAttributes {}

export interface TemplateHTMLAttributes extends GlobalHTMLAttributes {}

// ========================================
// INTERACTIVE ELEMENTS
// ========================================

export interface MenuHTMLAttributes extends GlobalHTMLAttributes {}

// ========================================
// WEB COMPONENTS
// ========================================

export interface SlotHTMLAttributes extends GlobalHTMLAttributes {
  name?: ReactiveString;
}

export interface PortalHTMLAttributes extends GlobalHTMLAttributes {}