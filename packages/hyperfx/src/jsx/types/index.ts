// ========================================
// MAIN TYPE EXPORTS - JSX ELEMENT TYPES FOR HYPERFX
// ========================================

// Base reactive types and utilities
export type {
  ReactiveString,
  ReactiveNumber,
  ReactiveBoolean,
  ReactiveObject,
  MaybeReactive,
  UnwrapReactive,
  ReactiveProps,
  Reactive,
} from './base';

export {
  isReactive,
  isSignal,
} from './base';

// Global attributes (valid on all elements)
export type {
  GlobalHTMLAttributes,
  ARIARole,
  ARIAAutocomplete,
  ARIACurrent,
  ARIAPopupType,
  ARIALiveRegion,
  ARIARelevant,
  ARIASort,
  EventHandler,
  MouseEventHandler,
  KeyboardEventHandler,
  TouchEventHandler,
  FocusEventHandler,
  FormEventHandler,
  ChangeEventHandler,
  InputEventHandler,
  SubmitEventHandler,
} from './global-attributes';

// Form attributes and elements
export type {
  FormAssociatedAttributes,
  ButtonHTMLAttributes,
  FormHTMLAttributes,
  InputHTMLAttributes,
  LabelHTMLAttributes,
  SelectHTMLAttributes,
  TextareaHTMLAttributes,
  OptionHTMLAttributes,
  OptgroupHTMLAttributes,
  FieldsetHTMLAttributes,
  LegendHTMLAttributes,
  MeterHTMLAttributes,
  OutputHTMLAttributes,
  ProgressHTMLAttributes,
  DatalistHTMLAttributes,
  InputType,
  FormEncType,
  FormMethod,
  AutoComplete,
} from './form-attributes';

// Media elements
export type {
  AudioHTMLAttributes,
  VideoHTMLAttributes,
  ImgHTMLAttributes,
  EmbedHTMLAttributes,
  IframeHTMLAttributes,
  ObjectHTMLAttributes,
  SourceHTMLAttributes,
  TrackHTMLAttributes,
  MapHTMLAttributes,
  AreaHTMLAttributes,
  ReferrerPolicy,
  PreloadType,
  LoadingType,
  DecodingType,
  CrossOriginType,
  MediaType,
} from './media-attributes';

// Structural elements
export type {
  DivHTMLAttributes,
  SpanHTMLAttributes,
  PHTMLAttributes,
  // Heading and sectioning elements moved to semantic-attributes.ts
  UlHTMLAttributes,
  OlHTMLAttributes,
  LiHTMLAttributes,
  DlHTMLAttributes,
  DtHTMLAttributes,
  DdHTMLAttributes,
  BlockquoteHTMLAttributes,
  PreHTMLAttributes,
  HrHTMLAttributes,
  BrHTMLAttributes,
  TableHTMLAttributes,
  TheadHTMLAttributes,
  TbodyHTMLAttributes,
  TfootHTMLAttributes,
  TrHTMLAttributes,
  ThHTMLAttributes,
  TdHTMLAttributes,
  ColHTMLAttributes,
  ColgroupHTMLAttributes,
  CaptionHTMLAttributes,
  AHTMLAttributes,
  StrongHTMLAttributes,
  EmHTMLAttributes,
  BHTMLAttributes,
  IHTMLAttributes,
  UHTMLAttributes,
  SHTMLAttributes,
  SmallHTMLAttributes,
  MarkHTMLAttributes,
  DelHTMLAttributes,
  InsHTMLAttributes,
  SubHTMLAttributes,
  SupHTMLAttributes,
  QHTMLAttributes,
  CiteHTMLAttributes,
  AbbrHTMLAttributes,
  TimeHTMLAttributes,
  CodeHTMLAttributes,
  VarHTMLAttributes,
  SampHTMLAttributes,
  KbdHTMLAttributes,
  DfnHTMLAttributes,
  AddressHTMLAttributes,
  FigureHTMLAttributes,
  FigcaptionHTMLAttributes,
} from './structural-attributes';

// Semantic elements
export type {
  BodyHTMLAttributes,
  HtmlHTMLAttributes,
  HeadHTMLAttributes,
  TitleHTMLAttributes,
  BaseHTMLAttributes,
  LinkHTMLAttributes,
  MetaHTMLAttributes,
  StyleHTMLAttributes,
  ScriptHTMLAttributes,
  HeaderHTMLAttributes,
  FooterHTMLAttributes,
  MainHTMLAttributes,
  SectionHTMLAttributes,
  ArticleHTMLAttributes,
  AsideHTMLAttributes,
  NavHTMLAttributes,
  HgroupHTMLAttributes,
  H1HTMLAttributes,
  H2HTMLAttributes,
  H3HTMLAttributes,
  H4HTMLAttributes,
  H5HTMLAttributes,
  H6HTMLAttributes,
  DataHTMLAttributes,
  RubyHTMLAttributes,
  RtHTMLAttributes,
  RpHTMLAttributes,
  BdiHTMLAttributes,
  BdoHTMLAttributes,
  WbrHTMLAttributes,
  CanvasHTMLAttributes,
  NoscriptHTMLAttributes,
  TemplateHTMLAttributes,
  MenuHTMLAttributes,
  SlotHTMLAttributes,
  PortalHTMLAttributes,
} from './semantic-attributes';

// Custom elements support
export type {
  CustomElementAttributes,
  WebComponentAttributes,
  DataBoundElementAttributes,
  SlottedElementAttributes,
  CreateCustomElementAttributes,
  CreatePolymorphicElementAttributes,
  UnknownCustomElementAttributes,
} from './custom-elements';

// Enhanced event types
export type {
  ClipboardEventHandler,
  CompositionEventHandler,
  DragEventHandler,
  InvalidEventHandler,
  PointerEventHandler,
  SelectEventHandler,
  WheelEventHandler,
  AnimationEventHandler,
  TransitionEventHandler,
  LoadStartEventHandler,
  ProgressEventHandler,
  SuspendEventHandler,
  AbortEventHandler,
  MediaErrorEventHandler,
  EmptiedEventHandler,
  StalledEventHandler,
  LoadedMetadataEventHandler,
  LoadedDataEventHandler,
  CanPlayEventHandler,
  CanPlayThroughEventHandler,
  PlayingEventHandler,
  WaitingEventHandler,
  SeekingEventHandler,
  SeekedEventHandler,
  EndedEventHandler,
  DurationChangeEventHandler,
  TimeUpdateEventHandler,
  PlayEventHandler,
  PauseEventHandler,
  RateChangeEventHandler,
  ResizeEventHandler,
  VolumeChangeEventHandler,
  LoadEventHandler,
  ResetEventHandler,
  SubmitEventHandlerDetailed,
  WindowEventHandler,
  DocumentEventHandler,
  BeforeUnloadEventHandler,
  HashChangeEventHandler,
  PopStateEventHandler,
  PageTransitionEventHandler,
  StorageEventHandler,
  MessageEventHandler,
  PromiseRejectionEventHandler,
  EventFromHandler,
  EventHandlerMap,
  GenericEventHandler,
} from './events';

// ========================================
// INTRINSIC ELEMENTS MAPPING
// ========================================

import type { JSXChildren } from '../jsx-runtime';
import type { GlobalHTMLAttributes } from './global-attributes';

// Default attributes for elements not explicitly defined
export interface DefaultHTMLAttributes extends GlobalHTMLAttributes {
  // Any additional attributes can be added here if needed
}

// IntrinsicElements mapping - exhaustive for standard HTML elements
export type IntrinsicElements = {
  [K in keyof HTMLElementTagNameMap]: (
    K extends 'a' ? import('./structural-attributes').AHTMLAttributes :
    K extends 'abbr' ? import('./structural-attributes').AbbrHTMLAttributes :
    K extends 'address' ? import('./structural-attributes').AddressHTMLAttributes :
    K extends 'area' ? import('./media-attributes').AreaHTMLAttributes :
    K extends 'article' ? import('./semantic-attributes').ArticleHTMLAttributes :
    K extends 'aside' ? import('./semantic-attributes').AsideHTMLAttributes :
    K extends 'audio' ? import('./media-attributes').AudioHTMLAttributes :
    K extends 'b' ? import('./structural-attributes').BHTMLAttributes :
    K extends 'base' ? import('./semantic-attributes').BaseHTMLAttributes :
    K extends 'bdi' ? import('./semantic-attributes').BdiHTMLAttributes :
    K extends 'bdo' ? import('./semantic-attributes').BdoHTMLAttributes :
    K extends 'blockquote' ? import('./structural-attributes').BlockquoteHTMLAttributes :
    K extends 'body' ? import('./semantic-attributes').BodyHTMLAttributes :
    K extends 'br' ? import('./structural-attributes').BrHTMLAttributes :
    K extends 'button' ? import('./form-attributes').ButtonHTMLAttributes :
    K extends 'canvas' ? import('./semantic-attributes').CanvasHTMLAttributes :
    K extends 'caption' ? import('./structural-attributes').CaptionHTMLAttributes :
    K extends 'cite' ? import('./structural-attributes').CiteHTMLAttributes :
    K extends 'code' ? import('./structural-attributes').CodeHTMLAttributes :
    K extends 'col' ? import('./structural-attributes').ColHTMLAttributes :
    K extends 'colgroup' ? import('./structural-attributes').ColgroupHTMLAttributes :
    K extends 'data' ? import('./semantic-attributes').DataHTMLAttributes :
    K extends 'datalist' ? import('./form-attributes').DatalistHTMLAttributes :
    K extends 'dd' ? import('./structural-attributes').DdHTMLAttributes :
    K extends 'del' ? import('./structural-attributes').DelHTMLAttributes :
    K extends 'details' ? import('./structural-attributes').DetailsHTMLAttributes :
    K extends 'dfn' ? import('./structural-attributes').DfnHTMLAttributes :
    K extends 'dialog' ? import('./structural-attributes').DialogHTMLAttributes :
    K extends 'div' ? import('./structural-attributes').DivHTMLAttributes :
    K extends 'dl' ? import('./structural-attributes').DlHTMLAttributes :
    K extends 'dt' ? import('./structural-attributes').DtHTMLAttributes :
    K extends 'em' ? import('./structural-attributes').EmHTMLAttributes :
    K extends 'embed' ? import('./media-attributes').EmbedHTMLAttributes :
    K extends 'fieldset' ? import('./form-attributes').FieldsetHTMLAttributes :
    K extends 'figcaption' ? import('./structural-attributes').FigcaptionHTMLAttributes :
    K extends 'figure' ? import('./structural-attributes').FigureHTMLAttributes :
    K extends 'footer' ? import('./semantic-attributes').FooterHTMLAttributes :
    K extends 'form' ? import('./form-attributes').FormHTMLAttributes :
    K extends 'h1' ? import('./semantic-attributes').H1HTMLAttributes :
    K extends 'h2' ? import('./semantic-attributes').H2HTMLAttributes :
    K extends 'h3' ? import('./semantic-attributes').H3HTMLAttributes :
    K extends 'h4' ? import('./semantic-attributes').H4HTMLAttributes :
    K extends 'h5' ? import('./semantic-attributes').H5HTMLAttributes :
    K extends 'h6' ? import('./semantic-attributes').H6HTMLAttributes :
    K extends 'head' ? import('./semantic-attributes').HeadHTMLAttributes :
    K extends 'header' ? import('./semantic-attributes').HeaderHTMLAttributes :
    K extends 'hgroup' ? import('./semantic-attributes').HgroupHTMLAttributes :
    K extends 'hr' ? import('./structural-attributes').HrHTMLAttributes :
    K extends 'html' ? import('./semantic-attributes').HtmlHTMLAttributes :
    K extends 'i' ? import('./structural-attributes').IHTMLAttributes :
    K extends 'iframe' ? import('./media-attributes').IframeHTMLAttributes :
    K extends 'img' ? import('./media-attributes').ImgHTMLAttributes :
    K extends 'input' ? import('./form-attributes').InputHTMLAttributes :
    K extends 'ins' ? import('./structural-attributes').InsHTMLAttributes :
    K extends 'kbd' ? import('./structural-attributes').KbdHTMLAttributes :
    K extends 'label' ? import('./form-attributes').LabelHTMLAttributes :
    K extends 'legend' ? import('./form-attributes').LegendHTMLAttributes :
    K extends 'li' ? import('./structural-attributes').LiHTMLAttributes :
    K extends 'link' ? import('./semantic-attributes').LinkHTMLAttributes :
    K extends 'main' ? import('./semantic-attributes').MainHTMLAttributes :
    K extends 'map' ? import('./media-attributes').MapHTMLAttributes :
    K extends 'mark' ? import('./structural-attributes').MarkHTMLAttributes :
    K extends 'menu' ? import('./semantic-attributes').MenuHTMLAttributes :
    K extends 'meta' ? import('./semantic-attributes').MetaHTMLAttributes :
    K extends 'meter' ? import('./form-attributes').MeterHTMLAttributes :
    K extends 'nav' ? import('./semantic-attributes').NavHTMLAttributes :
    K extends 'noscript' ? import('./semantic-attributes').NoscriptHTMLAttributes :
    K extends 'object' ? import('./media-attributes').ObjectHTMLAttributes :
    K extends 'ol' ? import('./structural-attributes').OlHTMLAttributes :
    K extends 'optgroup' ? import('./form-attributes').OptgroupHTMLAttributes :
    K extends 'option' ? import('./form-attributes').OptionHTMLAttributes :
    K extends 'output' ? import('./form-attributes').OutputHTMLAttributes :
    K extends 'p' ? import('./structural-attributes').PHTMLAttributes :
    K extends 'picture' ? DefaultHTMLAttributes :
    K extends 'portal' ? import('./semantic-attributes').PortalHTMLAttributes :
    K extends 'pre' ? import('./structural-attributes').PreHTMLAttributes :
    K extends 'progress' ? import('./form-attributes').ProgressHTMLAttributes :
    K extends 'q' ? import('./structural-attributes').QHTMLAttributes :
    K extends 'rp' ? import('./semantic-attributes').RpHTMLAttributes :
    K extends 'rt' ? import('./semantic-attributes').RtHTMLAttributes :
    K extends 'ruby' ? import('./semantic-attributes').RubyHTMLAttributes :
    K extends 's' ? import('./structural-attributes').SHTMLAttributes :
    K extends 'samp' ? import('./structural-attributes').SampHTMLAttributes :
    K extends 'script' ? import('./semantic-attributes').ScriptHTMLAttributes :
    K extends 'section' ? import('./semantic-attributes').SectionHTMLAttributes :
    K extends 'select' ? import('./form-attributes').SelectHTMLAttributes :
    K extends 'slot' ? import('./semantic-attributes').SlotHTMLAttributes :
    K extends 'small' ? import('./structural-attributes').SmallHTMLAttributes :
    K extends 'source' ? import('./media-attributes').SourceHTMLAttributes :
    K extends 'span' ? import('./structural-attributes').SpanHTMLAttributes :
    K extends 'strong' ? import('./structural-attributes').StrongHTMLAttributes :
    K extends 'style' ? import('./semantic-attributes').StyleHTMLAttributes :
    K extends 'sub' ? import('./structural-attributes').SubHTMLAttributes :
    K extends 'summary' ? import('./structural-attributes').SummaryHTMLAttributes :
    K extends 'sup' ? import('./structural-attributes').SupHTMLAttributes :
    K extends 'table' ? import('./structural-attributes').TableHTMLAttributes :
    K extends 'tbody' ? import('./structural-attributes').TbodyHTMLAttributes :
    K extends 'td' ? import('./structural-attributes').TdHTMLAttributes :
    K extends 'template' ? import('./semantic-attributes').TemplateHTMLAttributes :
    K extends 'textarea' ? import('./form-attributes').TextareaHTMLAttributes :
    K extends 'tfoot' ? import('./structural-attributes').TfootHTMLAttributes :
    K extends 'th' ? import('./structural-attributes').ThHTMLAttributes :
    K extends 'thead' ? import('./structural-attributes').TheadHTMLAttributes :
    K extends 'time' ? import('./structural-attributes').TimeHTMLAttributes :
    K extends 'title' ? import('./semantic-attributes').TitleHTMLAttributes :
    K extends 'tr' ? import('./structural-attributes').TrHTMLAttributes :
    K extends 'track' ? import('./media-attributes').TrackHTMLAttributes :
    K extends 'u' ? import('./structural-attributes').UHTMLAttributes :
    K extends 'ul' ? import('./structural-attributes').UlHTMLAttributes :
    K extends 'var' ? import('./structural-attributes').VarHTMLAttributes :
    K extends 'video' ? import('./media-attributes').VideoHTMLAttributes :
    K extends 'wbr' ? import('./semantic-attributes').WbrHTMLAttributes :
    DefaultHTMLAttributes
  ) & { children?: JSXChildren }
};

// ========================================
// JSX NAMESPACE EXPORT
// ========================================

export namespace JSX {
  export type Element = import('../jsx-runtime').JSXElement;
  export interface ElementChildrenAttribute {
    children: JSXChildren;
  }
  export type IntrinsicElements = import('./index').IntrinsicElements;
}