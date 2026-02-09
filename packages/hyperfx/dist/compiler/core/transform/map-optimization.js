import * as t from '@babel/types';
export function tryOptimizeMapCall(node, options) {
    if (!t.isCallExpression(node)) {
        return null;
    }
    if (!t.isMemberExpression(node.callee) ||
        !t.isIdentifier(node.callee.property) ||
        node.callee.property.name !== 'map') {
        return null;
    }
    const arrayExpr = options.codeFromNode(node.callee.object);
    if (node.arguments.length === 0) {
        return null;
    }
    const mapFn = node.arguments[0];
    let mapFnCode;
    let keyFn;
    if (t.isArrowFunctionExpression(mapFn) || t.isFunctionExpression(mapFn)) {
        const params = [];
        for (const param of mapFn.params) {
            params.push(options.codeFromNode(param));
        }
        const paramsStr = params.join(', ');
        if (t.isBlockStatement(mapFn.body)) {
            const body = '{ /* complex body */ }';
            mapFnCode = `(${paramsStr}) => ${body}`;
        }
        else if (t.isJSXElement(mapFn.body)) {
            const keyProp = extractKeyProp(mapFn.body, options.codeFromNode);
            if (keyProp) {
                const paramName = mapFn.params[0] ? options.codeFromNode(mapFn.params[0]) : 'item';
                const indexParam = mapFn.params[1] ? options.codeFromNode(mapFn.params[1]) : 'i';
                keyFn = `(${paramName}, ${indexParam}) => ${keyProp}`;
            }
            if (options.isStaticElement(mapFn.body)) {
                const html = options.generateTemplateHTML(mapFn.body);
                const templateId = options.getOrCreateTemplate(html);
                const body = `${templateId}.cloneNode(true)`;
                mapFnCode = `(${paramsStr}) => ${body}`;
            }
            else {
                const analysis = options.analyzeDynamicElement(mapFn.body);
                if (analysis) {
                    const templateId = options.getOrCreateTemplate(analysis.templateHTML);
                    const inlineCode = options.generateElementCodeInline(templateId, analysis.dynamics, mapFn.body);
                    mapFnCode = `(${paramsStr}) => {\n  ${inlineCode.split('\n').join('\n  ')}\n}`;
                }
                else {
                    mapFnCode = `(${paramsStr}) => null`;
                }
            }
        }
        else {
            const body = options.codeFromNode(mapFn.body);
            mapFnCode = `(${paramsStr}) => ${body}`;
        }
    }
    else {
        return null;
    }
    return {
        arrayExpr,
        mapFn: mapFnCode,
        keyFn,
    };
}
function extractKeyProp(node, codeFromNode) {
    for (const attr of node.openingElement.attributes) {
        if (t.isJSXAttribute(attr) &&
            t.isJSXIdentifier(attr.name) &&
            attr.name.name === 'key') {
            if (t.isJSXExpressionContainer(attr.value)) {
                return codeFromNode(attr.value.expression);
            }
            if (t.isStringLiteral(attr.value)) {
                return `"${attr.value.value}"`;
            }
        }
    }
    return null;
}
//# sourceMappingURL=map-optimization.js.map