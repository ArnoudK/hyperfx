import { HyperFXTransformer } from './packages/hyperfx/dist/compiler/core/transform.js';

const code = `
export default function Test() {
  return <div class="hello world">Test</div>;
}
`;

const transformer = new HyperFXTransformer({ ssr: false });
const result = transformer.transform(code, 'test.tsx', false);

console.log('=== TRANSFORMED CODE ===');
console.log(result?.code || 'null');
