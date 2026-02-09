import type MagicString from 'magic-string';
import type { TemplateManager } from '../types.js';
export interface RuntimeImportOptions {
    ssr: boolean;
}
export declare function addRuntimeImports(s: MagicString, templates: TemplateManager, options: RuntimeImportOptions): void;
