// List Performance Test Component
import { createSignal, For } from "hyperfx";

export function ListPerformanceTest() {
  const items = createSignal(['Item 1', 'Item 2', 'Item 3', 'Item 4', 'Item 5']);
  let renderCount = 0; // Use regular variable instead of reactive signal
  const displayRenderCount = createSignal(0); // Separate signal for display

  // Track render calls to demonstrate optimization
  const renderItem = (item: string, index: number) => {
    renderCount += 1;
    console.log(`Rendering item: ${item} (total renders: ${renderCount})`);
    
    return (
      <div className="p-3 bg-gray-700 rounded border border-gray-600 flex justify-between items-center mb-2">
        <p className="text-gray-200">{item}</p>
        <p className="text-gray-400 text-sm">#{index + 1}</p>
      </div>
    );
  };

  const addItem = () => {
    const currentItems = items();
    const newItem = `Item ${currentItems.length + 1}`;
    items([...currentItems, newItem]);
    displayRenderCount(renderCount); // Update display
    console.log(`Added item: ${newItem}`);
  };

  const removeItem = () => {
    const currentItems = items();
    if (currentItems.length > 0) {
      const removedItem = currentItems[currentItems.length - 1];
      items(currentItems.slice(0, -1));
      displayRenderCount(renderCount); // Update display
      console.log(`Removed item: ${removedItem}`);
    }
  };

  const shuffleItems = () => {
    const currentItems = [...items()];
    for (let i = currentItems.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [currentItems[i], currentItems[j]] = [currentItems[j], currentItems[i]];
    }
    items(currentItems);
    displayRenderCount(renderCount); // Update display
    console.log('Shuffled items');
  };

  const resetRenderCount = () => {
    renderCount = 0;
    displayRenderCount(0);
    console.log('Reset render count');
  };

  return (
    <div className="space-y-6 max-w-2xl mx-auto p-6">
      <h3 className="text-2xl font-bold text-blue-400 mb-4">📋 Smart List Performance Test</h3>
      
      <p className="text-gray-300 mb-4">
        This test demonstrates VNode reuse optimization. Check the browser console to see render counts. 
        With optimization, only new/changed items should re-render when you add/remove items.
      </p>

      {/* Controls */}
      <div className="flex flex-wrap gap-2 mb-4">
        <button
          className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 transition-colors"
          onClick={addItem}
        >
          Add Item
        </button>
        
        <button
          className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 transition-colors"
          onClick={removeItem}
        >
          Remove Item
        </button>
        
        <button
          className="px-4 py-2 bg-purple-600 text-white rounded hover:bg-purple-700 transition-colors"
          onClick={shuffleItems}
        >
          Shuffle Items
        </button>
        
        <button
          className="px-4 py-2 bg-gray-600 text-white rounded hover:bg-gray-700 transition-colors"
          onClick={resetRenderCount}
        >
          Reset Counter
        </button>
      </div>

      {/* Stats */}
      <p className="text-yellow-300 font-medium">
        Total Renders: {displayRenderCount()}
      </p>

      {/* List with For component */}
      <div className="space-y-2">
        {For(items, renderItem, (item) => item)}
      </div>
    </div>
  );
}
