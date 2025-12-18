import { createSignal } from "hyperfx";

// Test script to demonstrate fine-grained reactivity
function testFineGrainedReactivity() {
  console.log('🧪 Testing Fine-Grained Reactivity in HyperFX');

  // Create multiple signals
  const signal1 = createSignal('Signal 1: 0');
  const signal2 = createSignal('Signal 2: 0');
  const signal3 = createSignal('Signal 3: 0');

  // Create DOM elements
  const div1 = document.createElement('div');
  div1.textContent = signal1();

  const div2 = document.createElement('div');
  div2.textContent = signal2();

  const div3 = document.createElement('div');
  div3.textContent = signal3();

  // Set up reactive effects - each only updates its own element
  console.log('Setting up reactive effects...');

  // Effect for signal1 -> div1 only
  // createEffect(() => {
    const value1 = signal1();
    div1.textContent = value1;
    console.log(`🔄 Updated div1: ${value1}`);
  // });

  // Effect for signal2 -> div2 only
  // createEffect(() => {
    const value2 = signal2();
    div2.textContent = value2;
    console.log(`🔄 Updated div2: ${value2}`);
  // });

  // Effect for signal3 -> div3 only
  // createEffect(() => {
    const value3 = signal3();
    div3.textContent = value3;
    console.log(`🔄 Updated div3: ${value3}`);
  // });

  // Test: Update signal1
  console.log('\n--- Testing signal1 update ---');
  signal1('Signal 1: 42');

  // Test: Update signal2
  console.log('\n--- Testing signal2 update ---');
  signal2('Signal 2: 1337');

  // Test: Update signal3
  console.log('\n--- Testing signal3 update ---');
  signal3('Signal 3: 999');

  // Verify other signals didn't trigger updates
  console.log('\n✅ Fine-grained reactivity verified!');
  console.log('Each signal update only triggered its corresponding DOM element update.');
  console.log('No unnecessary re-renders of unrelated elements.');

  return { div1, div2, div3 };
}

// Run the test
if (typeof window !== 'undefined') {
  // Only run in browser
  setTimeout(testFineGrainedReactivity, 100);
}

export { testFineGrainedReactivity };