import { createSignal } from "hyperfx";
import { For } from "hyperfx";
import { createRoute } from "hyperfx-extra";



export const ArrayTestRoute = createRoute('array-test', {
  view: ArrayTest
}
)


export function ArrayTest() {
  const reactiveArray = createSignal(['Reactive A', 'Reactive B', 'Reactive C']);
  const staticArray = createSignal(['Static X', 'Static Y', 'Static Z']); // Now also a Signal

  return (
    <div class="p-6 max-w-2xl mx-auto">
      <h1 class="text-2xl font-bold mb-6">For Component Signal Support Test</h1>

      <div class="mb-8">
        <h2 class="text-xl font-semibold mb-4 text-green-600">Reactive Array (Signal)</h2>
        <button
          type="button"
          onclick={() => reactiveArray.set([...reactiveArray.get(), `Item ${reactiveArray.get().length + 1}`])}
          class="bg-green-500 text-white px-4 py-2 rounded mb-4"
        >
          Add Reactive Item
        </button>
        <div class="space-y-2">
          <For each={reactiveArray}>
            {(item, index) => (
              <div class="bg-green-100 p-3 rounded border-l-4 border-green-500">
                Reactive [{index()}] {item}
              </div>
            )}
          </For>
        </div>
      </div>

      <div class="mb-8">
        <h2 class="text-xl font-semibold mb-4 text-blue-600">Second Reactive Signal</h2>
        <button
          type="button"
          onclick={() => staticArray.set([...staticArray.get(), `Item ${staticArray.get().length + 1}`])}
          class="bg-blue-500 text-white px-4 py-2 rounded mb-4"
        >
          Add to Second Array
        </button>
        <div class="space-y-2">
          <For each={staticArray}>
            {(item, index) => (
              <div class="bg-blue-100 p-3 rounded border-l-4 border-blue-500">
                Second [{index()}] {item}
              </div>
            )}
          </For>
        </div>
      </div>

      <div class="text-sm text-gray-600">
        <p>✅ For component supports reactive Signals!</p>
        <p>Both Signals update reactively when modified.</p>
      </div>
    </div>
  );
}