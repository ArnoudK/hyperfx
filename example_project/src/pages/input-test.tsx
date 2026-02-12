import { createSignal } from "hyperfx";
import { createRoute } from "hyperfx-extra";

export const InputRoute = createRoute('input-test', {
  view: InputTest
})

export function InputTest() {
  const [inputValue, setInputValue] = createSignal('');

  const addItem = () => {
    console.log('Adding:', inputValue());
    setInputValue(''); // This should clear the input
  };

  return (
    <div class="p-4">
      <h1 class="text-xl mb-4">Input Clearing Test</h1>
      <input
        type="text"
        value={inputValue()}
        oninput={(e) => setInputValue((e.target as HTMLInputElement).value)}
        placeholder="Type something..."
        class="border p-2 mr-2"
      />
      <button
        type="button"
        onclick={(_e)=>addItem()}
        class="bg-blue-500 text-white px-4 py-2 rounded"
      >
        Add
      </button>
      <p class="mt-2">Current value: {inputValue()}</p>
    </div>
  );
}