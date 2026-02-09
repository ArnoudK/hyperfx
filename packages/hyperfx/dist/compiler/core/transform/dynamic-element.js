import { tryOptimizeMapCall } from './map-optimization.js';
export function generateDynamicCode(templateId, dynamics, options) {
    const lines = [];
    lines.push(`(() => {`);
    lines.push(`  const _el$ = ${templateId}.cloneNode(true);`);
    const attributeDynamics = [];
    const childDynamics = [];
    for (const dynamic of dynamics) {
        if (dynamic.type === 'attribute') {
            attributeDynamics.push(dynamic);
        }
        else if (dynamic.type === 'child' || dynamic.type === 'element') {
            childDynamics.push(dynamic);
        }
    }
    const elementsByPath = new Map();
    for (const dynamic of attributeDynamics) {
        const pathKey = JSON.stringify(dynamic.path);
        let elementVar = elementsByPath.get(pathKey);
        if (!elementVar) {
            if (dynamic.path.length === 0) {
                elementVar = '_el$';
            }
            else {
                elementVar = `_el${elementsByPath.size}$`;
                const elementAccess = options.generateElementAccess('_el$', dynamic.path);
                lines.push(`  const ${elementVar} = ${elementAccess};`);
            }
            elementsByPath.set(pathKey, elementVar);
        }
        if (dynamic.attributeName === '...spread') {
            const code = options.codeFromNode(dynamic.expression, 'reactive');
            lines.push(`  _$spread(${elementVar}, () => (${code}));`);
            continue;
        }
        const attrName = dynamic.attributeName;
        if (attrName.startsWith('on')) {
            const eventName = attrName.slice(2).toLowerCase();
            const code = options.codeFromNode(dynamic.expression, 'event');
            lines.push(`  _$delegate(${elementVar}, "${eventName}", ${code});`);
            continue;
        }
        const code = options.codeFromNode(dynamic.expression, 'reactive');
        lines.push(`  _$effect(() => _$setProp(${elementVar}, "${attrName}", ${code}));`);
    }
    if (childDynamics.length > 0) {
        for (let i = 0; i < childDynamics.length; i++) {
            const dynamic = childDynamics[i];
            if (dynamic.type === 'child') {
                const mapOptimization = tryOptimizeMapCall(dynamic.expression, options.mapOptimization);
                if (mapOptimization) {
                    lines.push(`  const _marker${i}$ = _$findMarker(_el$, 'hfx:dyn:${dynamic.markerId}');`);
                    lines.push(`  if (_marker${i}$) {`);
                    if (mapOptimization.keyFn) {
                        lines.push(`    _$mapArrayKeyed(_marker${i}$.parentNode, () => ${mapOptimization.arrayExpr}, ${mapOptimization.mapFn}, ${mapOptimization.keyFn}, _marker${i}$);`);
                    }
                    else {
                        lines.push(`    _$mapArray(_marker${i}$.parentNode, () => ${mapOptimization.arrayExpr}, ${mapOptimization.mapFn}, _marker${i}$);`);
                    }
                    lines.push(`    _marker${i}$.remove();`);
                    lines.push(`  }`);
                    continue;
                }
                const code = options.codeFromNode(dynamic.expression, 'reactive');
                const isReactive = options.isReactiveExpression(dynamic.expression);
                lines.push(`  const _marker${i}$ = _$findMarker(_el$, 'hfx:dyn:${dynamic.markerId}');`);
                lines.push(`  if (_marker${i}$) {`);
                lines.push(`    _$insert(_marker${i}$.parentNode, ${code}, _marker${i}$);`);
                if (!isReactive) {
                    lines.push(`    _marker${i}$.remove();`);
                }
                lines.push(`  }`);
            }
            else if (dynamic.type === 'element') {
                const elementNode = dynamic.expression;
                const code = options.generateElementCode(elementNode);
                lines.push(`  const _marker${i}$ = _$findMarker(_el$, 'hfx:dyn:${dynamic.markerId}');`);
                lines.push(`  if (_marker${i}$) {`);
                lines.push(`    _$insert(_marker${i}$.parentNode, ${code}, _marker${i}$);`);
                lines.push(`    _marker${i}$.remove();`);
                lines.push(`  }`);
            }
        }
    }
    lines.push(`  return _el$;`);
    lines.push(`})()`);
    return lines.join('\n');
}
export function generateElementCodeInline(templateId, dynamics, options) {
    const lines = [];
    lines.push(`const _el$ = ${templateId}.cloneNode(true);`);
    const attributeDynamics = [];
    const childDynamics = [];
    for (const dynamic of dynamics) {
        if (dynamic.type === 'attribute') {
            attributeDynamics.push(dynamic);
        }
        else if (dynamic.type === 'child' || dynamic.type === 'element') {
            childDynamics.push(dynamic);
        }
    }
    const elementsByPath = new Map();
    for (const dynamic of attributeDynamics) {
        const pathKey = JSON.stringify(dynamic.path);
        let elementVar = elementsByPath.get(pathKey);
        if (!elementVar) {
            if (dynamic.path.length === 0) {
                elementVar = '_el$';
            }
            else {
                elementVar = `_el${elementsByPath.size}$`;
                const elementAccess = options.generateElementAccess('_el$', dynamic.path);
                lines.push(`const ${elementVar} = ${elementAccess};`);
            }
            elementsByPath.set(pathKey, elementVar);
        }
        if (dynamic.attributeName === '...spread') {
            const code = options.codeFromNode(dynamic.expression, 'reactive');
            lines.push(`_$spread(${elementVar}, () => (${code}));`);
            continue;
        }
        const attrName = dynamic.attributeName;
        if (attrName.startsWith('on')) {
            const eventName = attrName.slice(2).toLowerCase();
            const code = options.codeFromNode(dynamic.expression, 'event');
            lines.push(`_$delegate(${elementVar}, "${eventName}", ${code});`);
            continue;
        }
        if (attrName === 'class' || attrName === 'className') {
            const constantValue = options.tryEvaluateConstant(dynamic.expression);
            if (constantValue !== null) {
                continue;
            }
        }
        const code = options.codeFromNode(dynamic.expression, 'reactive');
        lines.push(`_$effect(() => _$setProp(${elementVar}, "${attrName}", ${code}));`);
    }
    if (childDynamics.length > 0) {
        for (let i = 0; i < childDynamics.length; i++) {
            const dynamic = childDynamics[i];
            if (dynamic.type === 'child') {
                const mapOptimization = tryOptimizeMapCall(dynamic.expression, options.mapOptimization);
                if (mapOptimization) {
                    lines.push(`const _marker${i}$ = Array.from(_el$.childNodes).find(n => n.nodeType === 8 && n.textContent === 'hfx:dyn:${dynamic.markerId}');`);
                    lines.push(`if (_marker${i}$) {`);
                    if (mapOptimization.keyFn) {
                        lines.push(`  _$mapArrayKeyed(_marker${i}$.parentNode, () => ${mapOptimization.arrayExpr}, ${mapOptimization.mapFn}, ${mapOptimization.keyFn}, _marker${i}$);`);
                    }
                    else {
                        lines.push(`  _$mapArray(_marker${i}$.parentNode, () => ${mapOptimization.arrayExpr}, ${mapOptimization.mapFn}, _marker${i}$);`);
                    }
                    lines.push(`  _marker${i}$.remove();`);
                    lines.push(`}`);
                    continue;
                }
                const code = options.codeFromNode(dynamic.expression, 'reactive');
                const isReactive = options.isReactiveExpression(dynamic.expression);
                lines.push(`const _marker${i}$ = _$findMarker(_el$, 'hfx:dyn:${dynamic.markerId}');`);
                lines.push(`if (_marker${i}$) {`);
                lines.push(`  _$insert(_marker${i}$.parentNode, ${code}, _marker${i}$);`);
                if (!isReactive) {
                    lines.push(`  _marker${i}$.remove();`);
                }
                lines.push(`}`);
            }
            else if (dynamic.type === 'element') {
                const elementNode = dynamic.expression;
                const code = options.generateElementCode(elementNode);
                lines.push(`const _marker${i}$ = _$findMarker(_el$, 'hfx:dyn:${dynamic.markerId}');`);
                lines.push(`if (_marker${i}$) {`);
                lines.push(`  _$insert(_marker${i}$.parentNode, ${code}, _marker${i}$);`);
                lines.push(`  _marker${i}$.remove();`);
                lines.push(`}`);
            }
        }
    }
    lines.push(`return _el$;`);
    return lines.join('\n');
}
export function createDynamicElementAnalysis(templateHTML, dynamics) {
    return { templateHTML, dynamics };
}
//# sourceMappingURL=dynamic-element.js.map