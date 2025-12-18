import { createSignal } from "hyperfx";

export function InputTest() {
  const inputValue = createSignal('');

  const addItem = () => {
    console.log('Adding:', inputValue.get());
    inputValue.set(''); // This should clear the input
  };

  return (
    <div class="p-4">
      <h1 class="text-xl mb-4">Input Clearing Test</h1>
      <input
        type="text"
        value={inputValue}
        onInput={(e) => inputValue.set((e.target as HTMLInputElement).value)}
        placeholder="Type something..."
        class="border p-2 mr-2"
      />
      <button
        type="button"
        onClick={addItem}
        class="bg-blue-500 text-white px-4 py-2 rounded"
      >
        Add
      </button>
      <p class="mt-2">Current value: {inputValue}</p>
    </div>
  );
}