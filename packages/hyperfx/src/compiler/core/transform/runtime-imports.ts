import type MagicString from 'magic-string';
import type { TemplateManager } from '../types.js';

export interface RuntimeImportOptions {
  ssr: boolean;
}

export function addRuntimeImports(
  s: MagicString,
  templates: TemplateManager,
  options: RuntimeImportOptions
): void {
  if (options.ssr) {
    s.prepend(`import { jsx as _$jsx, jsxs as _$jsxs, Fragment as _$Fragment, marker as _$marker } from 'hyperfx/jsx-server-runtime';\n`);
    return;
  }

  const imports: string[] = [];
  const helpers: string[] = [];
  const usedHelpers = new Set<string>();

  const templateEntries = templates.getTemplates();
  if (templateEntries.size > 0) {
    usedHelpers.add('template');
  }

  const code = s.toString();
  if (code.includes('_$insert')) usedHelpers.add('insert');
  if (code.includes('_$markerSlot')) usedHelpers.add('markerSlot');
  if (code.includes('_$spread')) usedHelpers.add('spread');
  if (code.includes('_$delegate')) usedHelpers.add('delegate');
  if (code.includes('_$effect')) usedHelpers.add('effect');
  if (code.includes('_$bindProp')) usedHelpers.add('bindProp');
  if (code.includes('_$setProp')) usedHelpers.add('setProp');
  if (code.includes('_$mapArray')) usedHelpers.add('mapArray');
  if (code.includes('_$mapArrayKeyed')) usedHelpers.add('mapArrayKeyed');
  if (code.includes('_$findMarker')) usedHelpers.add('findMarker');
  if (code.includes('_$unwrapProps')) usedHelpers.add('unwrapProps');
  if (code.includes('_$unwrapComponent')) usedHelpers.add('unwrapComponent');
  if (code.includes('_$createComponent')) usedHelpers.add('createComponent');

  if (usedHelpers.size > 0) {
    const helperNames: string[] = [];
    for (const helper of Array.from(usedHelpers)) {
      helperNames.push(`${helper} as _$${helper}`);
    }
    imports.push(`import { ${helperNames.join(', ')} } from 'hyperfx/runtime-dom';`);
  }

  for (const [id, html] of templateEntries) {
    helpers.push(`const ${id} = _$template(\`${html}\`);`);
  }

  if (imports.length > 0 || helpers.length > 0) {
    const importBlock = [...imports, ...helpers].join('\n') + '\n\n';
    s.prepend(importBlock);
  }
}
