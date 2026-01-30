import type { ReactiveString, ReactiveBoolean, ReactiveNumber } from './base';
import type { GlobalHTMLAttributes } from './global-attributes';

// ========================================
// STRUCTURAL ELEMENTS
// ========================================

export interface DivHTMLAttributes extends GlobalHTMLAttributes {}

export interface SpanHTMLAttributes extends GlobalHTMLAttributes {}

export interface PHTMLAttributes extends GlobalHTMLAttributes {}

// ========================================
// SECTIONING ELEMENTS (MOVED TO SEMANTIC)
// ========================================
// Note: Sectioning and heading elements are now in semantic-attributes.ts

export interface UlHTMLAttributes extends GlobalHTMLAttributes {
  type?: ReactiveString;
}

export interface OlHTMLAttributes extends GlobalHTMLAttributes {
  reversed?: ReactiveBoolean;
  start?: ReactiveNumber | ReactiveString;
  type?: '1' | 'a' | 'A' | 'i' | 'I' | ReactiveString;
}

export interface LiHTMLAttributes extends GlobalHTMLAttributes {
  value?: ReactiveNumber | ReactiveString;
}

export interface DlHTMLAttributes extends GlobalHTMLAttributes {}
export interface DtHTMLAttributes extends GlobalHTMLAttributes {}
export interface DdHTMLAttributes extends GlobalHTMLAttributes {}

export interface BlockquoteHTMLAttributes extends GlobalHTMLAttributes {
  cite?: ReactiveString;
}

export interface PreHTMLAttributes extends GlobalHTMLAttributes {}

export interface HrHTMLAttributes extends GlobalHTMLAttributes {}

export interface BrHTMLAttributes extends GlobalHTMLAttributes {}

// ========================================
// TABLE ELEMENTS
// ========================================

export interface TableHTMLAttributes extends GlobalHTMLAttributes {
  cellpadding?: ReactiveNumber | ReactiveString;
  cellspacing?: ReactiveNumber | ReactiveString;
  summary?: ReactiveString;
  width?: ReactiveNumber | ReactiveString;
}

export interface TheadHTMLAttributes extends GlobalHTMLAttributes {}
export interface TbodyHTMLAttributes extends GlobalHTMLAttributes {}
export interface TfootHTMLAttributes extends GlobalHTMLAttributes {}

export interface TrHTMLAttributes extends GlobalHTMLAttributes {}

export interface ThHTMLAttributes extends GlobalHTMLAttributes {
  abbr?: ReactiveString;
  align?: 'left' | 'center' | 'right' | 'justify' | 'char' | ReactiveString;
  colspan?: ReactiveNumber | ReactiveString;
  headers?: ReactiveString;
  rowspan?: ReactiveNumber | ReactiveString;
  scope?: 'row' | 'col' | 'rowgroup' | 'colgroup' | ReactiveString;
  valign?: 'top' | 'middle' | 'bottom' | 'baseline' | ReactiveString;
  width?: ReactiveNumber | ReactiveString;
}

export interface TdHTMLAttributes extends GlobalHTMLAttributes {
  abbr?: ReactiveString;
  align?: 'left' | 'center' | 'right' | 'justify' | 'char' | ReactiveString;
  colspan?: ReactiveNumber | ReactiveString;
  headers?: ReactiveString;
  rowspan?: ReactiveNumber | ReactiveString;
  valign?: 'top' | 'middle' | 'bottom' | 'baseline' | ReactiveString;
  width?: ReactiveNumber | ReactiveString;
}

export interface ColHTMLAttributes extends GlobalHTMLAttributes {
  span?: ReactiveNumber | ReactiveString;
  width?: ReactiveNumber | ReactiveString;
}

export interface ColgroupHTMLAttributes extends GlobalHTMLAttributes {
  span?: ReactiveNumber | ReactiveString;
}

export interface CaptionHTMLAttributes extends GlobalHTMLAttributes {}

// ========================================
// LISTS AND DEFINITIONS
// ========================================

export interface DetailsHTMLAttributes extends GlobalHTMLAttributes {
  open?: ReactiveBoolean;
}

export interface SummaryHTMLAttributes extends GlobalHTMLAttributes {}

export interface DialogHTMLAttributes extends GlobalHTMLAttributes {
  open?: ReactiveBoolean;
}

// ========================================
// INLINE ELEMENTS
// ========================================

export interface AHTMLAttributes extends GlobalHTMLAttributes {
  href?: ReactiveString;
  target?: '_self' | '_blank' | '_parent' | '_top' | ReactiveString;
  rel?: ReactiveString;
  download?: ReactiveString;
  hreflang?: ReactiveString;
  type?: ReactiveString;
}

export interface StrongHTMLAttributes extends GlobalHTMLAttributes {}
export interface EmHTMLAttributes extends GlobalHTMLAttributes {}
export interface BHTMLAttributes extends GlobalHTMLAttributes {}
export interface IHTMLAttributes extends GlobalHTMLAttributes {}
export interface UHTMLAttributes extends GlobalHTMLAttributes {}
export interface SHTMLAttributes extends GlobalHTMLAttributes {}
export interface SmallHTMLAttributes extends GlobalHTMLAttributes {}
export interface MarkHTMLAttributes extends GlobalHTMLAttributes {}
export interface DelHTMLAttributes extends GlobalHTMLAttributes {
  cite?: ReactiveString;
  datetime?: ReactiveString;
}
export interface InsHTMLAttributes extends GlobalHTMLAttributes {
  cite?: ReactiveString;
  datetime?: ReactiveString;
}
export interface SubHTMLAttributes extends GlobalHTMLAttributes {}
export interface SupHTMLAttributes extends GlobalHTMLAttributes {}
export interface QHTMLAttributes extends GlobalHTMLAttributes {
  cite?: ReactiveString;
}
export interface CiteHTMLAttributes extends GlobalHTMLAttributes {}
export interface AbbrHTMLAttributes extends GlobalHTMLAttributes {
  title?: ReactiveString;
}
export interface TimeHTMLAttributes extends GlobalHTMLAttributes {
  datetime?: ReactiveString;
}
export interface CodeHTMLAttributes extends GlobalHTMLAttributes {}
export interface VarHTMLAttributes extends GlobalHTMLAttributes {}
export interface SampHTMLAttributes extends GlobalHTMLAttributes {}
export interface KbdHTMLAttributes extends GlobalHTMLAttributes {}
export interface DfnHTMLAttributes extends GlobalHTMLAttributes {}

// ========================================
// MISCELLANEOUS STRUCTURAL
// ========================================

export interface AddressHTMLAttributes extends GlobalHTMLAttributes {}
export interface FigureHTMLAttributes extends GlobalHTMLAttributes {}
export interface FigcaptionHTMLAttributes extends GlobalHTMLAttributes {}