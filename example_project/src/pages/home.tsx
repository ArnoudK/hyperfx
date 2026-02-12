import { createSignal, createComputed } from "hyperfx";
import { createRoute } from "hyperfx-extra";


export const HomeRoute = createRoute('/',
  {
    view: HomePage
  }
)

export function HomePage() {

  const [thing, setThing] = createSignal('Thing');

  const [name, setName] = createSignal('');
  const [count, setCount] = createSignal(0);

  // Computed greeting that updates when name changes
  const greeting = createComputed(() =>
    `Hello, ${name() || 'Anonymous'}! Welcome to HyperFX.`
  );

  const increment = () => setCount(prev => prev + 1);
  const decrement = () => setCount(prev => prev - 1);
  const reset = () => setCount(0);

  const counterText = createComputed(() => {
    const c = count();
    if (c === 0) return "Counter is at zero.";
    return c > 0 ? "Counter is positive." : "Counter is negative.";
  });

  return (
    <div class="space-y-8">
      <div class="text-center">
        <h1 class="text-4xl font-bold text-blue-400 mb-4">
          Welcome to HyperFX Demo
        </h1>
        <p class="text-xl text-gray-300 mb-8">
          A modern reactive framework with JSX support
        </p>
      </div>
      <div>
        <input value={thing()} class="p-2 border border-gray-300 rounded" type="text" oninput={(e) => setThing((e.target as HTMLInputElement).value)} />
        <p>{thing()}</p>
      </div>

      <div class="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Interactive Greeting */}
        <div class="bg-gray-800 p-6 rounded-lg shadow-lg">
          <h2 class="text-2xl font-semibold text-green-400 mb-4">
            Interactive Greeting
          </h2>
          <div class="space-y-4">
            <div>
              <label for="name-input" class="block text-sm font-medium text-gray-300 mb-2">
                Enter your name:
              </label>
              <input
                id="name-input"
                type="text"
                class="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="Your name..."
                value={name}
                oninput={(e) => setName((e.target as HTMLInputElement).value)}
              />
            </div>
            <div class="p-4 bg-gray-700 rounded-md">
              <p class="text-lg text-blue-300">{greeting}</p>
            </div>
          </div>
        </div>

        {/* Counter Demo */}
        <div class="bg-gray-800 p-6 rounded-lg shadow-lg">
          <h2 class="text-2xl font-semibold text-purple-400 mb-4">
            Reactive Counter
          </h2>
          <div class="space-y-4">
            <div class="text-center">
              <div class="text-4xl font-bold text-yellow-400 mb-4">
                {count}
              </div>
              <div class="space-x-2">
                <button
                  type="button"
                  onclick={increment}
                  class="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 focus:ring-2 focus:ring-green-500 transition-colors cursor-pointer"
                >
                  +1
                </button>
                <button
                  type="button"
                  onclick={decrement}
                  class="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 focus:ring-2 focus:ring-red-500 transition-colors cursor-pointer"
                >
                  -1
                </button>
                <button
                  type="button"
                  onclick={reset}
                  class="px-4 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700 focus:ring-2 focus:ring-gray-500 transition-colors cursor-pointer"
                >
                  Reset
                </button>
              </div>
            </div>
            <div class="text-center text-sm text-gray-400">
              <p>{count}</p>
              <p>
                {counterText}
              </p>

            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
