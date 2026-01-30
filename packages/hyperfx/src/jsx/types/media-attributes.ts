import type { ReactiveString, ReactiveBoolean, ReactiveNumber } from './base';
import type { GlobalHTMLAttributes } from './global-attributes';

// ========================================
// MEDIA ELEMENTS
// ========================================

export interface AudioHTMLAttributes extends GlobalHTMLAttributes {
  autoplay?: ReactiveBoolean;
  controls?: ReactiveBoolean;
  crossorigin?: ReactiveString;
  loop?: ReactiveBoolean;
  muted?: ReactiveBoolean;
  preload?: 'none' | 'metadata' | 'auto' | ReactiveString;
  src?: ReactiveString;
}

export interface VideoHTMLAttributes extends GlobalHTMLAttributes {
  autoplay?: ReactiveBoolean;
  controls?: ReactiveBoolean;
  crossorigin?: ReactiveString;
  height?: ReactiveNumber | ReactiveString;
  loop?: ReactiveBoolean;
  muted?: ReactiveBoolean;
  playsinline?: ReactiveBoolean;
  poster?: ReactiveString;
  preload?: 'none' | 'metadata' | 'auto' | ReactiveString;
  src?: ReactiveString;
  width?: ReactiveNumber | ReactiveString;
}

export interface ImgHTMLAttributes extends GlobalHTMLAttributes {
  alt?: ReactiveString;
  crossorigin?: 'anonymous' | 'use-credentials' | ReactiveString;
  decoding?: 'async' | 'sync' | 'auto' | ReactiveString;
  height?: ReactiveNumber | ReactiveString;
  loading?: 'eager' | 'lazy' | ReactiveString;
  referrerpolicy?: ReferrerPolicy;
  sizes?: ReactiveString;
  src?: ReactiveString;
  srcset?: ReactiveString;
  usemap?: ReactiveString;
  width?: ReactiveNumber | ReactiveString;
}

export interface EmbedHTMLAttributes extends GlobalHTMLAttributes {
  height?: ReactiveNumber | ReactiveString;
  src?: ReactiveString;
  type?: ReactiveString;
  width?: ReactiveNumber | ReactiveString;
}

export interface IframeHTMLAttributes extends GlobalHTMLAttributes {
  allow?: ReactiveString;
  allowfullscreen?: ReactiveBoolean;
  height?: ReactiveNumber | ReactiveString;
  loading?: 'eager' | 'lazy' | ReactiveString;
  name?: ReactiveString;
  referrerpolicy?: ReferrerPolicy;
  sandbox?: ReactiveString;
  src?: ReactiveString;
  srcdoc?: ReactiveString;
  width?: ReactiveNumber | ReactiveString;
}

export interface ObjectHTMLAttributes extends GlobalHTMLAttributes {
  data?: ReactiveString;
  form?: ReactiveString;
  height?: ReactiveNumber | ReactiveString;
  name?: ReactiveString;
  type?: ReactiveString;
  usemap?: ReactiveString;
  width?: ReactiveNumber | ReactiveString;
}

// ========================================
// MEDIA-RELATED ELEMENTS
// ========================================

export interface SourceHTMLAttributes extends GlobalHTMLAttributes {
  media?: ReactiveString;
  sizes?: ReactiveString;
  src?: ReactiveString;
  srcset?: ReactiveString;
  type?: ReactiveString;
}

export interface TrackHTMLAttributes extends GlobalHTMLAttributes {
  default?: ReactiveBoolean;
  kind?: 'subtitles' | 'captions' | 'descriptions' | 'chapters' | 'metadata' | ReactiveString;
  label?: ReactiveString;
  src?: ReactiveString;
  srclang?: ReactiveString;
}

export interface MapHTMLAttributes extends GlobalHTMLAttributes {
  name?: ReactiveString;
}

export interface AreaHTMLAttributes extends GlobalHTMLAttributes {
  alt?: ReactiveString;
  coords?: ReactiveString;
  download?: ReactiveString;
  href?: ReactiveString;
  hreflang?: ReactiveString;
  media?: ReactiveString;
  referrerpolicy?: ReferrerPolicy;
  rel?: ReactiveString;
  shape?: 'rect' | 'circle' | 'poly' | 'default' | ReactiveString;
  target?: ReactiveString;
}

// ========================================
// MEDIA TYPE DEFINITIONS
// ========================================

export type ReferrerPolicy =
  | 'no-referrer'
  | 'no-referrer-when-downgrade'
  | 'origin'
  | 'origin-when-cross-origin'
  | 'same-origin'
  | 'strict-origin'
  | 'strict-origin-when-cross-origin'
  | 'unsafe-url';

export type PreloadType = 'none' | 'metadata' | 'auto';

export type LoadingType = 'eager' | 'lazy';

export type DecodingType = 'async' | 'sync' | 'auto';

export type CrossOriginType = 'anonymous' | 'use-credentials';

export type MediaType =
  | 'application/vnd.apple.mpegurl'
  | 'application/dash+xml'
  | 'application/x-mpegurl'
  | 'video/mp4'
  | 'video/webm'
  | 'video/ogg'
  | 'audio/mp4'
  | 'audio/webm'
  | 'audio/ogg'
  | 'audio/mpeg'
  | 'audio/wav'
  | string;