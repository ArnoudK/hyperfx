import { createSignal, createComputed, For, Show } from "hyperfx";
import { createRoute } from "hyperfx-extra";
import { Button } from "./components/ui/buttons";



export const CounterRoute = createRoute('counter', {
  view: CounterPage
}
)



export function CounterPage() {
  const [count, setCount] = createSignal(0);
  const [step, setStep] = createSignal(1);

  // Computed values
  const isEven = createComputed(() => count() % 2 === 0);
  const doubleCount = createComputed(() => count() * 2);
  const status = createComputed(() => {
    const c = count();
    if (c === 0) return "Zero";
    if (c > 0) return "Positive";
    return "Negative";
  });
  const evenOddText = createComputed(() => {
    const c = count();
    console.log("Recomputing even/odd text for count:", c);
    if (c === 0) return "N/A";
    return isEven() ? "Even" : "Odd";
  });



  return <div class="max-w-4xl mx-auto space-y-8">
    <div class="text-center">
      <h1 class="text-4xl font-bold text-blue-400 mb-4">
        Advanced Counter Demo
      </h1>
      <p class="text-xl text-gray-300">
        Demonstrates reactive computations and multiple signal interactions
      </p>
    </div>

    {/* Main Counter Display */}
    <div class="bg-gray-800 p-8 rounded-lg shadow-lg text-center">
      <div class="space-y-6">
        <div class="text-6xl font-bold text-yellow-400">
          <Show when={count() == 0} fallback={<p>{count()}</p>}>
            <p class="italic">Zero</p>
          </Show>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-3 gap-4 text-lg">
          <div class="p-4 bg-gray-700 rounded-lg">
            <div class="text-sm text-gray-400">Status</div>
            <div class="font-semibold">
              {status()}
            </div>
          </div>

          <div class="p-4 bg-gray-700 rounded-lg">
            <div class="text-sm text-gray-400">Even/Odd</div>
            <div class="font-semibold">
              {evenOddText()}
            </div>
          </div>

          <div class="p-4 bg-gray-700 rounded-lg">
            <div class="text-sm text-gray-400">Double</div>
            <div class="font-semibold text-cyan-400">
              {doubleCount()}
            </div>
          </div>
        </div>
      </div>
    </div>

    {/* Controls */}
    <div class="grid grid-cols-1 md:grid-cols-2 gap-8">
      {/* Counter Controls */}
      <div class="bg-gray-800 p-6 rounded-lg shadow-lg">
        <h2 class="text-2xl font-semibold text-green-400 mb-4">
          Counter Controls
        </h2>

        <div class="space-y-4">
          <div class="flex justify-center gap-2">
            <Button
              type="button"
              onclick={() => setCount(count() + step())}
              variant="success"
              size="medium"
            >
              +{step()}
            </Button>
            <Button
              type="button"
              onclick={() => setCount(count() - step())}
              variant="danger"
              size="medium"
            >
              -{step}
            </Button>
            <Button
              type="button"
              onclick={() => setCount(0)}
              variant="secondary"
              size="medium"
            >
              Reset
            </Button>
          </div>

          <div class="flex justify-center space-x-2">
            <Button
              type="button"
              onclick={() => setCount(count() * 2)}
              variant="primary"
              size="medium"
            >
              ×2
            </Button>
            <Button
              type="button"
              onclick={() => setCount(Math.floor(count() / 2))}
              variant="primary"
              size="medium"
            >
              ÷2
            </Button>
            <Button
              type="button"
              onclick={() => setCount(count() * -1)}
              variant="primary"
              size="medium"
            >
              ±
            </Button>
          </div>
        </div>
      </div>

      {/* Step Controls */}
      <div class="bg-gray-800 p-6 rounded-lg shadow-lg">
        <h2 class="text-2xl font-semibold text-blue-400 mb-4">
          Step Size: {step}
        </h2>

        <div class="space-y-4">
          <div class="grid grid-cols-3 gap-2">
            <For each={[1, 2, 5, 10, 25, 100]}>
              {(val ) => {
               const activeClass = createComputed(() => step() === val ? 'bg-blue-600 text-white'
               : 'bg-gray-700 text-gray-300 hover:bg-gray-600')
               return <button
                  type="button"
                  onclick={() => setStep(val)}
                  class={`px-3 py-2 rounded-md transition-colors ${activeClass()}`}
                >
                  {val}
                </button>
              }}
            </For>
          </div>

          <div>
            <label for="step-input" class="block text-sm font-medium text-gray-300 mb-2">
              Custom Step:
            </label>
            <input
              id="step-input"
              type="number"
              class="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              value={()=>String(step())}
              oninput={(e) => {
                const value = parseInt((e.target as HTMLInputElement).value) || 1;
                setStep(Math.max(1, value));
              }}
            />
          </div>
        </div>
      </div>
    </div>


    {/* History */}
    <div class="bg-gray-800 p-6 rounded-lg shadow-lg">
      <h2 class="text-2xl font-semibold text-purple-400 mb-4">
        Quick Actions
      </h2>
      <div class="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-2">
        <For each={[0, 1, 10, 50, 100, 500, 1000, -1, -10, -100]}>
          {(value) => (
            <button
              type="button"
              onclick={() => setCount(value)}
              class="px-3 py-2 bg-gray-700 text-gray-300 rounded-md hover:bg-gray-600 transition-colors text-sm"
            >
              {String(value)}
            </button>
          )}
        </For>
      </div>
    </div>
  </div>
    ;
}
