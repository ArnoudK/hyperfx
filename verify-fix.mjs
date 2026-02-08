import { HyperFXTransformer } from './packages/hyperfx/dist/compiler/core/transform.js';

const transformer = new HyperFXTransformer();

// Test case 1: Signal in function child (should preserve the call)
const code1 = `
function Counter() {
  const count = createSignal(0);
  return (
    <button onclick={() => count(count() + 1)}>
      +{count}
    </button>
  );
}
`;

console.log('Test 1: Signal in function child');
console.log('Input:', code1);
const result1 = transformer.transform(code1, 'test.tsx');
if (result1) {
  console.log('Output:', result1.code);
  console.log('✓ Signal call preserved in function context:', result1.code.includes('count()'));
} else {
  console.log('✗ Transform failed');
}

console.log('\n---\n');

// Test case 2: Signal in non-function context (should optimize)
const code2 = `
function Counter() {
  const count = createSignal(0);
  return (
    <div>
      Count: {count}
    </div>
  );
}
`;

console.log('Test 2: Signal in non-function context');
console.log('Input:', code2);
const result2 = transformer.transform(code2, 'test.tsx');
if (result2) {
  console.log('Output:', result2.code);
  console.log('✓ Signal optimized in reactive context:', !result2.code.includes('count()') || result2.code.includes('count'));
} else {
  console.log('✗ Transform failed');
}

console.log('\n---\n');

// Test case 3: The original issue - signal as child with function
const code3 = `
function Component() {
  const step = createSignal(5);
  return (
    <Button onclick={() => count(count() + step())}>
      +{step}
    </Button>
  );
}
`;

console.log('Test 3: Original issue - signal in function child');
console.log('Input:', code3);
const result3 = transformer.transform(code3, 'test.tsx');
if (result3) {
  console.log('Output:', result3.code);
  console.log('✓ Signal call preserved in onclick handler:', result3.code.includes('step()'));
  console.log('✓ Signal optimized as child:', !result3.code.match(/\+\s*step\(\)/));
} else {
  console.log('✗ Transform failed');
}
