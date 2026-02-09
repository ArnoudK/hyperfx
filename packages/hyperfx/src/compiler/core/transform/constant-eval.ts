import * as t from '@babel/types';

export interface ConstantEvalOptions {
  optimizeConstants: boolean;
}

export function tryEvaluateConstant(node: t.Node, options: ConstantEvalOptions): string | null {
  try {
    return evaluateNode(node, options);
  } catch {
    return null;
  }
}

function evaluateNode(node: t.Node, options: ConstantEvalOptions): string | null {
  if (t.isStringLiteral(node)) {
    return node.value;
  }

  if (t.isNumericLiteral(node)) {
    return String(node.value);
  }

  if (t.isBooleanLiteral(node)) {
    return node.value ? 'true' : 'false';
  }

  if (t.isNullLiteral(node)) {
    return 'null';
  }

  if (t.isIdentifier(node) && node.name === 'undefined') {
    return 'undefined';
  }

  if (t.isUnaryExpression(node)) {
    const arg = evaluateNode(node.argument, options);
    if (arg === null) {
      return null;
    }

    switch (node.operator) {
      case '!': {
        const truthValue = arg !== 'false' && arg !== '0' && arg !== '' && arg !== 'null' && arg !== 'undefined';
        return truthValue ? 'false' : 'true';
      }
      case '-': {
        const num = Number(arg);
        if (!Number.isNaN(num)) {
          return String(-num);
        }
        return null;
      }
      case '+': {
        const num = Number(arg);
        if (!Number.isNaN(num)) {
          return String(num);
        }
        return null;
      }
      case 'typeof': {
        if (arg === 'null') return 'object';
        if (arg === 'undefined') return 'undefined';
        if (arg === 'true' || arg === 'false') return 'boolean';
        if (!Number.isNaN(Number(arg))) return 'number';
        return 'string';
      }
    }
  }

  if (t.isBinaryExpression(node)) {
    const left = evaluateNode(node.left, options);
    const right = evaluateNode(node.right, options);

    if (left === null || right === null) {
      return null;
    }

    const leftNum = Number(left);
    const rightNum = Number(right);

    switch (node.operator) {
      case '+':
        if (!Number.isNaN(leftNum) && !Number.isNaN(rightNum)) {
          return String(leftNum + rightNum);
        }
        return left + right;
      case '-':
        if (!Number.isNaN(leftNum) && !Number.isNaN(rightNum)) {
          return String(leftNum - rightNum);
        }
        return null;
      case '*':
        if (!Number.isNaN(leftNum) && !Number.isNaN(rightNum)) {
          return String(leftNum * rightNum);
        }
        return null;
      case '/':
        if (!Number.isNaN(leftNum) && !Number.isNaN(rightNum) && rightNum !== 0) {
          return String(leftNum / rightNum);
        }
        return null;
      case '%':
        if (!Number.isNaN(leftNum) && !Number.isNaN(rightNum) && rightNum !== 0) {
          return String(leftNum % rightNum);
        }
        return null;
      case '**':
        if (!Number.isNaN(leftNum) && !Number.isNaN(rightNum)) {
          return String(Math.pow(leftNum, rightNum));
        }
        return null;
      case '>':
        if (!Number.isNaN(leftNum) && !Number.isNaN(rightNum)) {
          return leftNum > rightNum ? 'true' : 'false';
        }
        return null;
      case '<':
        if (!Number.isNaN(leftNum) && !Number.isNaN(rightNum)) {
          return leftNum < rightNum ? 'true' : 'false';
        }
        return null;
      case '>=':
        if (!Number.isNaN(leftNum) && !Number.isNaN(rightNum)) {
          return leftNum >= rightNum ? 'true' : 'false';
        }
        return null;
      case '<=':
        if (!Number.isNaN(leftNum) && !Number.isNaN(rightNum)) {
          return leftNum <= rightNum ? 'true' : 'false';
        }
        return null;
      case '===':
        return left === right ? 'true' : 'false';
      case '!==':
        return left !== right ? 'true' : 'false';
      case '==':
        return left == right ? 'true' : 'false';
      case '!=':
        return left != right ? 'true' : 'false';
    }
  }

  if (t.isLogicalExpression(node)) {
    const left = evaluateNode(node.left, options);

    if (left === null) {
      return null;
    }

    const leftTruthy = left !== 'false' && left !== '0' && left !== '' && left !== 'null' && left !== 'undefined';

    switch (node.operator) {
      case '&&': {
        if (!leftTruthy) {
          return left;
        }
        const right = evaluateNode(node.right, options);
        return right !== null ? right : null;
      }
      case '||': {
        if (leftTruthy) {
          return left;
        }
        const right = evaluateNode(node.right, options);
        return right !== null ? right : null;
      }
      case '??': {
        if (left === 'null' || left === 'undefined') {
          const right = evaluateNode(node.right, options);
          return right !== null ? right : null;
        }
        return left;
      }
    }
  }

  if (t.isArrayExpression(node)) {
    const elements: string[] = [];
    for (const elem of node.elements) {
      if (elem === null) {
        elements.push('');
        continue;
      }
      if (t.isSpreadElement(elem)) {
        return null;
      }
      const value = evaluateNode(elem, options);
      if (value === null) {
        return null;
      }
      const wrappedValue = !Number.isNaN(Number(value)) || value === 'true' || value === 'false' || value === 'null'
        ? value
        : `"${value}"`;
      elements.push(wrappedValue);
    }
    return `[${elements.join(',')}]`;
  }

  if (t.isObjectExpression(node)) {
    const props: string[] = [];
    for (const prop of node.properties) {
      if (t.isSpreadElement(prop)) {
        return null;
      }
      if (!t.isObjectProperty(prop)) {
        return null;
      }

      let key: string;
      if (t.isIdentifier(prop.key) && !prop.computed) {
        key = prop.key.name;
      } else if (t.isStringLiteral(prop.key)) {
        key = prop.key.value;
      } else {
        const keyVal = evaluateNode(prop.key as t.Node, options);
        if (keyVal === null) {
          return null;
        }
        key = keyVal;
      }

      const value = evaluateNode(prop.value as t.Node, options);
      if (value === null) {
        return null;
      }

      const wrappedValue = !Number.isNaN(Number(value)) || value === 'true' || value === 'false' || value === 'null'
        ? value
        : `"${value}"`;
      props.push(`"${key}":${wrappedValue}`);
    }
    return `{${props.join(',')}}`;
  }

  if (t.isTemplateLiteral(node)) {
    if (node.expressions.length === 0) {
      return node.quasis[0]?.value.cooked || '';
    }

    if (options.optimizeConstants) {
      for (const expr of node.expressions) {
        if (evaluateNode(expr, options) === null) {
          return null;
        }
      }

      let result = '';
      for (let i = 0; i < node.quasis.length; i++) {
        result += node.quasis[i]?.value.cooked || '';
        if (i < node.expressions.length) {
          result += evaluateNode(node.expressions[i]!, options) || '';
        }
      }
      return result;
    }
  }

  if (t.isConditionalExpression(node)) {
    const test = evaluateNode(node.test, options);
    if (test !== null) {
      const testValue = test === 'true' || (test !== 'false' && test !== '0' && test !== '' && test !== 'null' && test !== 'undefined');
      return evaluateNode(testValue ? node.consequent : node.alternate, options);
    }
  }

  return null;
}
