import { createSignal } from "hyperfx";

export function JSXCounter() {
  const count = createSignal(0);
  
  return (
    <div className="p-6 bg-gradient-to-br from-purple-900 to-blue-900 rounded-lg shadow-xl">
      <h2 className="text-2xl font-bold text-white mb-4">
        JSX Counter Demo
      </h2>
      
      <div className="bg-black bg-opacity-30 p-4 rounded-lg mb-4">
        <p className="text-xl text-blue-200 mb-4">
          Current count: <span className="font-bold text-blue-300">{count}</span>
        </p>
        
        <div className="space-x-2">
          <button 
            className="bg-green-600 hover:bg-green-700 text-white font-medium px-4 py-2 rounded transition-colors"
            onClick={() => count(count() + 1)}
          >
            + Increment
          </button>
          
          <button 
            className="bg-red-600 hover:bg-red-700 text-white font-medium px-4 py-2 rounded transition-colors"
            onClick={() => count(count() - 1)}
          >
            - Decrement
          </button>
          
          <button 
            className="bg-gray-600 hover:bg-gray-700 text-white font-medium px-4 py-2 rounded transition-colors"
            onClick={() => count(0)}
          >
            🔄 Reset
          </button>
        </div>
      </div>
      
      <div className="text-sm text-gray-300">
        {count() === 0 ? (
          <p>Count is at zero</p>
        ) : count() > 0 ? (
          <p className="text-green-400">Positive count! 🎉</p>
        ) : (
          <p className="text-red-400">Negative count! 😔</p>
        )}
      </div>
    </div>
  );
}
