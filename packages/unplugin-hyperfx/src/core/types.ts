export interface HyperFXPluginOptions  {
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
  map?: any;
}

export interface TemplateInfo {
  id: string;
  html: string;
  dynamic: boolean;
}

export interface DynamicPart {
  type: 'child' | 'attribute' | 'element';
  markerId: number;
  expression: any;
  path: string[];
  attributeName?: string;
}
