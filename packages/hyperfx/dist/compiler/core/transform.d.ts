import type { HyperFXPluginOptions, TransformResult } from './types.js';
export declare class HyperFXTransformer {
    private options;
    private currentContext;
    private componentGen;
    private templateGen;
    private codeGen;
    private ssrGen;
    constructor(options?: HyperFXPluginOptions);
    setSSR(ssr: boolean): void;
    isSSR(): boolean;
    /**
     * Get or create a template (with deduplication)
     * If a template with the same HTML already exists, return its ID
     */
    private getOrCreateTemplate;
    /**
     * Transform JSX code to optimized HyperFX runtime calls
     */
    transform(code: string, id: string, ssr?: boolean): TransformResult | null;
    private _transform;
    /**
     * Check if code contains JSX
     */
    private hasJSX;
    /**
     * Parse code to AST
     */
    private parseCode;
    /**
     * Transform a JSX element
     */
    private transformJSXElement;
    /**
     * Transform a JSX fragment
     */
    private transformJSXFragment;
    /**
     * Check if a JSX element is completely static (no dynamic content at all)
     */
    private isStaticElement;
    /**
     * Check if children are all static (recursive)
     */
    private hasOnlyStaticChildren;
    /**
     * Transform a static element into a template
     */
    private transformStaticElement;
    /**
     * Generate HTML string from JSX element
     */
    private generateTemplateHTML;
    /**
     * Transform a dynamic element with reactive content
     */
    private transformDynamicElement;
    /**
     * Analyze a dynamic element to extract template and dynamic parts
     */
    private analyzeDynamicElement;
    /**
     * Try to evaluate a constant expression at compile time
     * Returns the string value if constant, null otherwise
     */
    private tryEvaluateConstant;
    /**
     * Check if an expression is reactive (function that returns content)
     * Reactive expressions require the marker to remain for updates
     */
    private isReactiveExpression;
    /**
     * Generate code to access an element given its path
     * Path format: ['div[0]', 'span[1]'] means root.children[0].children[1]
     * Empty path means the root element itself
     */
    private generateElementAccess;
    /**
     * Generate code for a dynamic element
     */
    private generateDynamicCode;
    /**
     * Generate element creation code without IIFE wrapper (for use in map functions)
     */
    private generateElementCodeInline;
    /**
     * Try to optimize a .map() call for list rendering
     * Returns optimization info if successful, null otherwise
     */
    private tryOptimizeMapCall;
    /**
     * Extract the key prop from a JSX element
     * Returns the key expression as a string, or null if no key
     */
    private extractKeyProp;
    /**
     * Check if a JSX element is a component (vs HTML element)
     * Components start with uppercase letter
     */
    private isComponentElement;
    /**
     * Generate code for children array
     */
    private generateChildrenCode;
    /**
     * Generate code for a component call (not a template)
     */
    private generateComponentCall;
    /**
     * Generate code for a JSX element (recursive helper)
     */
    private generateElementCode;
    /**
     * Convert a Babel node to code string
     */
    private codeFromNode;
    /**
     * Add runtime imports to the code
     */
    private addRuntimeImports;
    /**
     * Top-level entry point for transforming a JSX element/fragment to runtime calls (SSR)
     */
    private transformJSXToRuntime;
    /**
     * Recursive generator for standard JSX calls
     */
    private generateSSRJSXCode;
}
