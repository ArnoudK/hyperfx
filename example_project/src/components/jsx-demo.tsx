import { createSignal, mount, VNode } from "hyperfx";

// Simple functional JSX component
export function JSXDemo(): VNode {
  const count = createSignal(0);
  const name = createSignal("World");

  return (
    <div className="p-6 max-w-2xl mx-auto bg-gray-800 text-white rounded-lg">
      <h1 className="text-3xl font-bold mb-6 text-blue-300">
        JSX Demo Component
      </h1>
      
      {/* Counter section */}
      <div className="bg-blue-900 p-4 rounded-lg mb-6 border border-blue-700">
        <h2 className="text-xl font-semibold mb-4 text-blue-100">
          Reactive Counter
        </h2>
        <p className="mb-4 text-blue-200">
          Count: <span className="font-bold">{count}</span>
        </p>
        <div className="space-x-2">
          <button 
            className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition-colors"
            onClick={() => count(count() + 1)}
          >
            Increment
          </button>
          <button 
            className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600 transition-colors"
            onClick={() => count(count() - 1)}
          >
            Decrement
          </button>
          <button 
            className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600 transition-colors"
            onClick={() => count(0)}
          >
            Reset
          </button>
        </div>
      </div>
      
      {/* Input section */}
      <div className="bg-green-900 p-4 rounded-lg mb-6 border border-green-700">
        <h2 className="text-xl font-semibold mb-4 text-green-100">
          Reactive Input
        </h2>
        <div className="mb-4">
          <label 
            className="block text-sm font-medium mb-2 text-green-200"
            htmlFor="name-input"
          >
            Enter your name:
          </label>
          <input
            type="text"
            id="name-input"
            name="name"
            className="border border-gray-600 bg-gray-800 rounded px-3 py-2 w-full text-white"
            onInput={(e: Event) => name((e.target as HTMLInputElement).value)}
            placeholder="Type your name..."
            value={name()}
          />
        </div>
        <p className="text-lg text-green-200">
          Hello, <span className="font-bold">{name}</span>!
        </p>
      </div>
    </div>
  );
}

// Mount function for standalone usage
export function mountJSXDemo(container: HTMLElement) {
  const vnode = JSXDemo();
  mount(vnode, container);
}
