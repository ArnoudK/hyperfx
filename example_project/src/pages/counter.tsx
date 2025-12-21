import { createSignal, createComputed, For } from "hyperfx";

export function CounterPage() {
  const count = createSignal(0);
  const step = createSignal(1);

  // Computed values
  const isEven = createComputed(() => count() % 2 === 0);
  const doubleCount = createComputed(() => count() * 2);
  const status = createComputed(() => {
    const c = count();
    if (c === 0) return "Zero";
    if (c > 0) return "Positive";
    return "Negative";
  });
  const evenOddText = createComputed(() => isEven() ? 'Even' : 'Odd');

  // Reactive step buttons
  const stepButtons = createComputed(() =>
    [1, 2, 5, 10, 25, 100].map(value => ({
      value,
      isActive: step() === value
    }))
  );

  return (
    <div class="max-w-4xl mx-auto space-y-8">
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
            {count}
          </div>

          <div class="grid grid-cols-1 md:grid-cols-3 gap-4 text-lg">
            <div class="p-4 bg-gray-700 rounded-lg">
              <div class="text-sm text-gray-400">Status</div>
              <div class="font-semibold">
                {status}
              </div>
            </div>

            <div class="p-4 bg-gray-700 rounded-lg">
              <div class="text-sm text-gray-400">Even/Odd</div>
              <div class="font-semibold">
                {evenOddText}
              </div>
            </div>

            <div class="p-4 bg-gray-700 rounded-lg">
              <div class="text-sm text-gray-400">Double</div>
              <div class="font-semibold text-cyan-400">
                {doubleCount}
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
            <div class="flex justify-center space-x-2">
              <button
                type="button"
                onclick={() => count(count() + step())}
                class="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors"
              >
                +{step}
              </button>
              <button
                type="button"
                onclick={() => count(count() - step())}
                class="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors"
              >
                -{step}
              </button>
              <button
                type="button"
                onclick={() => count(0)}
                class="px-4 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700 transition-colors"
              >
                Reset
              </button>
            </div>

            <div class="flex justify-center space-x-2">
              <button
                type="button"
                onclick={() => count(count() * 2)}
                class="px-3 py-1 bg-purple-600 text-white text-sm rounded-md hover:bg-purple-700 transition-colors"
              >
                ×2
              </button>
              <button
                type="button"
                onclick={() => count(Math.floor(count() / 2))}
                class="px-3 py-1 bg-purple-600 text-white text-sm rounded-md hover:bg-purple-700 transition-colors"
              >
                ÷2
              </button>
              <button
                type="button"
                onclick={() => count(count() * -1)}
                class="px-3 py-1 bg-orange-600 text-white text-sm rounded-md hover:bg-orange-700 transition-colors"
              >
                ±
              </button>
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
              <For each={stepButtons}>
                {({ value, isActive }) => (
                  <button
                    type="button"
                    onclick={() => step(value)}
                    class={`px-3 py-2 rounded-md transition-colors ${isActive
                      ? 'bg-blue-600 text-white'
                      : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                      }`}
                  >
                    {value}
                  </button>
                )}
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
                value={step().toString()}
                oninput={(e) => {
                  const value = parseInt((e.target as HTMLInputElement).value) || 1;
                  step(Math.max(1, value));
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
          {[0, 1, 10, 50, 100, 500, 1000, -1, -10, -100].map(value => (
            <button
              type="button"
              onclick={() => count(value)}
              class="px-3 py-2 bg-gray-700 text-gray-300 rounded-md hover:bg-gray-600 transition-colors text-sm"
            >
              {String(value)}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
