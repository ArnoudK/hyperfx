// ========================================
// MAIN TYPE EXPORTS - JSX ELEMENT TYPES FOR HYPERFX
// ========================================


export * from './base';

// Global attributes (valid on all elements)
export * from './global-attributes';

// Form attributes and elements
export * from './form-attributes';

// Media elements
export * from './media-attributes';

// Structural elements
export * from './structural-attributes';

// Semantic elements
export * from './semantic-attributes';

// Custom elements support
export * from './custom-elements';

// Enhanced event types
export * from './events';

// ========================================
// INTRINSIC ELEMENTS MAPPING
// ========================================

import type { JSXChildren, JSXElement } from '../jsx-runtime';
import type { GlobalHTMLAttributes } from './global-attributes';
import type * as StructuralAttributes from './structural-attributes';
import type * as MediaAttributes from './media-attributes';
import type * as SemanticAttributes from './semantic-attributes';
import type * as FormAttributes from './form-attributes';

// Default attributes for elements not explicitly defined
export interface DefaultHTMLAttributes extends GlobalHTMLAttributes {
  // Any additional attributes can be added here if needed
}

// IntrinsicElements mapping - exhaustive for standard HTML elements
export type IntrinsicElements = {
  [K in keyof HTMLElementTagNameMap]: (
    K extends 'a' ? StructuralAttributes.AHTMLAttributes :
    K extends 'abbr' ? StructuralAttributes.AbbrHTMLAttributes :
    K extends 'address' ? StructuralAttributes.AddressHTMLAttributes :
    K extends 'area' ? MediaAttributes.AreaHTMLAttributes :
    K extends 'article' ? SemanticAttributes.ArticleHTMLAttributes :
    K extends 'aside' ? SemanticAttributes.AsideHTMLAttributes :
    K extends 'audio' ? MediaAttributes.AudioHTMLAttributes :
    K extends 'b' ? StructuralAttributes.BHTMLAttributes :
    K extends 'base' ? SemanticAttributes.BaseHTMLAttributes :
    K extends 'bdi' ? SemanticAttributes.BdiHTMLAttributes :
    K extends 'bdo' ? SemanticAttributes.BdoHTMLAttributes :
    K extends 'blockquote' ? StructuralAttributes.BlockquoteHTMLAttributes :
    K extends 'body' ? SemanticAttributes.BodyHTMLAttributes :
    K extends 'br' ? StructuralAttributes.BrHTMLAttributes :
    K extends 'button' ? FormAttributes.ButtonHTMLAttributes :
    K extends 'canvas' ? SemanticAttributes.CanvasHTMLAttributes :
    K extends 'caption' ? StructuralAttributes.CaptionHTMLAttributes :
    K extends 'cite' ? StructuralAttributes.CiteHTMLAttributes :
    K extends 'code' ? StructuralAttributes.CodeHTMLAttributes :
    K extends 'col' ? StructuralAttributes.ColHTMLAttributes :
    K extends 'colgroup' ? StructuralAttributes.ColgroupHTMLAttributes :
    K extends 'data' ? SemanticAttributes.DataHTMLAttributes :
    K extends 'datalist' ? FormAttributes.DatalistHTMLAttributes :
    K extends 'dd' ? StructuralAttributes.DdHTMLAttributes :
    K extends 'del' ? StructuralAttributes.DelHTMLAttributes :
    K extends 'details' ? StructuralAttributes.DetailsHTMLAttributes :
    K extends 'dfn' ? StructuralAttributes.DfnHTMLAttributes :
    K extends 'dialog' ? StructuralAttributes.DialogHTMLAttributes :
    K extends 'div' ? StructuralAttributes.DivHTMLAttributes :
    K extends 'dl' ? StructuralAttributes.DlHTMLAttributes :
    K extends 'dt' ? StructuralAttributes.DtHTMLAttributes :
    K extends 'em' ? StructuralAttributes.EmHTMLAttributes :
    K extends 'embed' ? MediaAttributes.EmbedHTMLAttributes :
    K extends 'fieldset' ? FormAttributes.FieldsetHTMLAttributes :
    K extends 'figcaption' ? StructuralAttributes.FigcaptionHTMLAttributes :
    K extends 'figure' ? StructuralAttributes.FigureHTMLAttributes :
    K extends 'footer' ? SemanticAttributes.FooterHTMLAttributes :
    K extends 'form' ? FormAttributes.FormHTMLAttributes :
    K extends 'h1' ? SemanticAttributes.H1HTMLAttributes :
    K extends 'h2' ? SemanticAttributes.H2HTMLAttributes :
    K extends 'h3' ? SemanticAttributes.H3HTMLAttributes :
    K extends 'h4' ? SemanticAttributes.H4HTMLAttributes :
    K extends 'h5' ? SemanticAttributes.H5HTMLAttributes :
    K extends 'h6' ? SemanticAttributes.H6HTMLAttributes :
    K extends 'head' ? SemanticAttributes.HeadHTMLAttributes :
    K extends 'header' ? SemanticAttributes.HeaderHTMLAttributes :
    K extends 'hgroup' ? SemanticAttributes.HgroupHTMLAttributes :
    K extends 'hr' ? StructuralAttributes.HrHTMLAttributes :
    K extends 'html' ? SemanticAttributes.HtmlHTMLAttributes :
    K extends 'i' ? StructuralAttributes.IHTMLAttributes :
    K extends 'iframe' ? MediaAttributes.IframeHTMLAttributes :
    K extends 'img' ? MediaAttributes.ImgHTMLAttributes :
    K extends 'input' ? FormAttributes.InputHTMLAttributes :
    K extends 'ins' ? StructuralAttributes.InsHTMLAttributes :
    K extends 'kbd' ? StructuralAttributes.KbdHTMLAttributes :
    K extends 'label' ? FormAttributes.LabelHTMLAttributes :
    K extends 'legend' ? FormAttributes.LegendHTMLAttributes :
    K extends 'li' ? StructuralAttributes.LiHTMLAttributes :
    K extends 'link' ? SemanticAttributes.LinkHTMLAttributes :
    K extends 'main' ? SemanticAttributes.MainHTMLAttributes :
    K extends 'map' ? MediaAttributes.MapHTMLAttributes :
    K extends 'mark' ? StructuralAttributes.MarkHTMLAttributes :
    K extends 'menu' ? SemanticAttributes.MenuHTMLAttributes :
    K extends 'meta' ? SemanticAttributes.MetaHTMLAttributes :
    K extends 'meter' ? FormAttributes.MeterHTMLAttributes :
    K extends 'nav' ? SemanticAttributes.NavHTMLAttributes :
    K extends 'noscript' ? SemanticAttributes.NoscriptHTMLAttributes :
    K extends 'object' ? MediaAttributes.ObjectHTMLAttributes :
    K extends 'ol' ? StructuralAttributes.OlHTMLAttributes :
    K extends 'optgroup' ? FormAttributes.OptgroupHTMLAttributes :
    K extends 'option' ? FormAttributes.OptionHTMLAttributes :
    K extends 'output' ? FormAttributes.OutputHTMLAttributes :
    K extends 'p' ? StructuralAttributes.PHTMLAttributes :
    K extends 'picture' ? DefaultHTMLAttributes :
    K extends 'portal' ? SemanticAttributes.PortalHTMLAttributes :
    K extends 'pre' ? StructuralAttributes.PreHTMLAttributes :
    K extends 'progress' ? FormAttributes.ProgressHTMLAttributes :
    K extends 'q' ? StructuralAttributes.QHTMLAttributes :
    K extends 'rp' ? SemanticAttributes.RpHTMLAttributes :
    K extends 'rt' ? SemanticAttributes.RtHTMLAttributes :
    K extends 'ruby' ? SemanticAttributes.RubyHTMLAttributes :
    K extends 's' ? StructuralAttributes.SHTMLAttributes :
    K extends 'samp' ? StructuralAttributes.SampHTMLAttributes :
    K extends 'script' ? SemanticAttributes.ScriptHTMLAttributes :
    K extends 'section' ? SemanticAttributes.SectionHTMLAttributes :
    K extends 'select' ? FormAttributes.SelectHTMLAttributes :
    K extends 'slot' ? SemanticAttributes.SlotHTMLAttributes :
    K extends 'small' ? StructuralAttributes.SmallHTMLAttributes :
    K extends 'source' ? MediaAttributes.SourceHTMLAttributes :
    K extends 'span' ? StructuralAttributes.SpanHTMLAttributes :
    K extends 'strong' ? StructuralAttributes.StrongHTMLAttributes :
    K extends 'style' ? SemanticAttributes.StyleHTMLAttributes :
    K extends 'sub' ? StructuralAttributes.SubHTMLAttributes :
    K extends 'summary' ? StructuralAttributes.SummaryHTMLAttributes :
    K extends 'sup' ? StructuralAttributes.SupHTMLAttributes :
    K extends 'table' ? StructuralAttributes.TableHTMLAttributes :
    K extends 'tbody' ? StructuralAttributes.TbodyHTMLAttributes :
    K extends 'td' ? StructuralAttributes.TdHTMLAttributes :
    K extends 'template' ? SemanticAttributes.TemplateHTMLAttributes :
    K extends 'textarea' ? FormAttributes.TextareaHTMLAttributes :
    K extends 'tfoot' ? StructuralAttributes.TfootHTMLAttributes :
    K extends 'th' ? StructuralAttributes.ThHTMLAttributes :
    K extends 'thead' ? StructuralAttributes.TheadHTMLAttributes :
    K extends 'time' ? StructuralAttributes.TimeHTMLAttributes :
    K extends 'title' ? SemanticAttributes.TitleHTMLAttributes :
    K extends 'tr' ? StructuralAttributes.TrHTMLAttributes :
    K extends 'track' ? MediaAttributes.TrackHTMLAttributes :
    K extends 'u' ? StructuralAttributes.UHTMLAttributes :
    K extends 'ul' ? StructuralAttributes.UlHTMLAttributes :
    K extends 'var' ? StructuralAttributes.VarHTMLAttributes :
    K extends 'video' ? MediaAttributes.VideoHTMLAttributes :
    K extends 'wbr' ? SemanticAttributes.WbrHTMLAttributes :
    DefaultHTMLAttributes
  ) & { children?: JSXChildren }
};

// ========================================
// JSX NAMESPACE EXPORT
// ========================================

type _IntrinsicElements = IntrinsicElements;

export namespace JSX {
  export type Element = JSXElement;
  export interface ElementChildrenAttribute {
    children: JSXChildren;
  }
  export type IntrinsicElements = _IntrinsicElements;
}