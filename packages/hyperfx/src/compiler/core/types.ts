import type * as t from '@babel/types';

export interface HyperFXPluginOptions {
  /**
   * Enable/disable specific optimizations
   */
  optimize?: {
    /** Extract static templates (default: true) */
    templates?: boolean;
    /** Event delegation (default: true) */
    events?: boolean;
    /** Fold constants (default: true) */
    constants?: boolean;
  /** SSR optimizations (default: true) */
  ssr?: boolean;
  /** Insert hydration markers for dynamic expressions (default: true) */
  hydrationMarkers?: boolean;
  };

  /**
   * Advanced optimizations (experimental)
   */
  advanced?: {
    /** Optimize control flow components (default: false) */
    controlFlow?: boolean;
    /** Hoist static nodes (default: false) */
    hoisting?: boolean;
  };

  /**
   * Development options
   */
  dev?: {
    /** Show warnings for non-optimizable patterns (default: true) */
    warnings?: boolean;
    /** Generate source maps (default: true) */
    sourceMap?: boolean;
  };

  /**
   * SSR mode (default: false)
   */
  ssr?: boolean;

  /**
   * Custom JSX pragma (default: 'jsx')
   */
  pragma?: string;

  /**
   * Custom fragment pragma (default: 'Fragment')
   */
  pragmaFrag?: string;
}

export interface TransformResult {
  code: string;
  map?: import('magic-string').SourceMap; // SourceMap from magic-string
}

export interface TemplateInfo {
  id: string;
  html: string;
  dynamic: boolean;
}

export interface DynamicPart {
  type: 'child' | 'attribute' | 'element';
  markerId: number;
  expression: t.Node;
  path: string[];
  attributeName?: string;
}

export interface DynamicElementAnalysis {
  templateHTML: string;
  dynamics: DynamicPart[];
}

export interface AttributeInfo {
  name: string;
  value: t.Node;
}

export interface SeparatedAttributes {
  staticAttrs: string;
  dynamicAttrs: AttributeInfo[];
}

export type CodeContext = 'reactive' | 'static' | 'effect' | 'event' | 'function';

export interface TemplateManager {
  getOrCreateTemplate(html: string): string;
  getTemplates(): Map<string, string>;
  resetCounter(): void;
}
