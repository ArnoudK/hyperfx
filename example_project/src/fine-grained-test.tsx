import { createSignal } from "hyperfx";

// Test fine-grained reactivity with JSX
interface FineGrainedTestProps {
  title?: string;
  [key: string]: any;
}

function FineGrainedTest(props: FineGrainedTestProps): JSX.Element {
  const [count1, setCount1] = createSignal(0);
  const [count2, setCount2] = createSignal(0);
  const [status, setStatus] = createSignal('idle');

  console.log('FineGrainedTest mounted');


  return (
    <div class="space-y-6">
      <h2 class="text-2xl font-bold text-blue-400">
        {props.title || "Fine-Grained Reactivity Test"}
      </h2>
      {props.message && <p class="text-green-400">{props.message}</p>}

      <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Count 1 Section */}
        <div class="bg-gray-800 p-6 rounded-lg">
          <h3 class="text-lg font-semibold text-green-400 mb-4">Counter 1</h3>
          <p class="text-2xl mb-4">Count: {count1()}</p>
          <button
            type="button"
            onclick={() => setCount1(prev => prev + 1)}
            class="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
          >
            Increment Count 1
          </button>
        </div>

        {/* Count 2 Section */}
        <div class="bg-gray-800 p-6 rounded-lg">
          <h3 class="text-lg font-semibold text-purple-400 mb-4">Counter 2</h3>
          <p class="text-2xl mb-4">Count: {count2()}</p>
          <button
            type="button"
            onclick={() => setCount2(prev => prev + 1)}
            class="px-4 py-2 bg-purple-600 text-white rounded hover:bg-purple-700"
          >
            Increment Count 2
          </button>
        </div>
      </div>

      {/* Status Section */}
      <div class="bg-gray-800 p-6 rounded-lg">
        <h3 class="text-lg font-semibold text-yellow-400 mb-4">Status</h3>
        <p class="text-xl mb-4">Status: {status()}</p>
        <div class="flex gap-2">
          <button
            type="button"
            onclick={() => status('active')}
            class="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
          >
            Set Active
          </button>
          <button
            type="button"
            onclick={() => status('idle')}
            class="px-4 py-2 bg-gray-600 text-white rounded hover:bg-gray-700"
          >
            Set Idle
          </button>
        </div>
      </div>

      {/* Instructions */}
      <div class="bg-gray-700 p-4 rounded-lg">
        <p class="text-sm text-gray-300">
          <strong>Test:</strong> Click buttons and check the console. Only the specific reactive text nodes should update when their signals change.
        </p>
      </div>
    </div>
  );
}

export { FineGrainedTest };