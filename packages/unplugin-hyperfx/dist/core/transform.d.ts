import type { HyperFXPluginOptions, TransformResult } from './types.js';
export declare class HyperFXTransformer {
    private options;
    private templateCounter;
    private templates;
    private templatesByHTML;
    private currentContext;
    constructor(options?: HyperFXPluginOptions);
    /**
     * Get or create a template (with deduplication)
     * If a template with the same HTML already exists, return its ID
     */
    private getOrCreateTemplate;
    /**
     * Check if an identifier is a known global that shouldn't be optimized
     */
    private isKnownGlobal;
    /**
     * Check if a member expression is a known non-signal pattern
     */
    private isKnownNonSignal;
    /**
     * Transform JSX code to optimized HyperFX runtime calls
     */
    transform(code: string, id: string): TransformResult | null;
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
     * Get tag name from JSX opening element
     */
    private getTagName;
    /**
     * Get HTML attributes string
     */
    private getAttributesHTML;
    /**
     * Get HTML children string
     */
    private getChildrenHTML;
    /**
     * Transform a dynamic element with reactive content
     */
    private transformDynamicElement;
    /**
     * Analyze a dynamic element to extract template and dynamic parts
     */
    private analyzeDynamicElement;
    /**
     * Build template HTML with comment markers for dynamic insertions
     */
    private buildTemplateWithMarkers;
    /**
     * Separate static and dynamic attributes
     */
    private separateAttributes;
    /**
     * Try to evaluate a constant expression at compile time
     * Returns the string value if constant, null otherwise
     */
    private tryEvaluateConstant;
    /**
     * Build children HTML with markers for dynamic content
     */
    private buildChildrenWithMarkers;
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
}
//# sourceMappingURL=transform.d.ts.map