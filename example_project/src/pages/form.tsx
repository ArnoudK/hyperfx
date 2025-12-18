import { createSignal, createComputed } from "hyperfx";

interface FormData {
  name: string;
  email: string;
  age: number;
  country: string;
  interests: string[];
  newsletter: boolean;
  comments: string;
}

export function FormPage() {
  // Form state
  const name = createSignal('');
  const email = createSignal('');
  const age = createSignal(18);
  const country = createSignal('');
  const interests = createSignal<string[]>([]);
  const newsletter = createSignal(false);
  const comments = createSignal('');

  // Validation
  const isValidEmail = createComputed(() => {
    const emailValue = email();
    return emailValue.includes('@') && emailValue.includes('.');
  });

  const isValidAge = createComputed(() => {
    const ageValue = age();
    return ageValue >= 13 && ageValue <= 120;
  });

  const formData = createComputed((): FormData => ({
    name: name(),
    email: email(),
    age: age(),
    country: country(),
    interests: interests(),
    newsletter: newsletter(),
    comments: comments()
  }));

  const isFormValid = createComputed(() => {
    return name().trim().length > 0 &&
           isValidEmail() &&
           isValidAge() &&
           country().length > 0;
  });

  // Reactive visibility classes for validation messages
  const emailErrorVisible = createComputed(() => email() && !isValidEmail());
  const ageErrorVisible = createComputed(() => !isValidAge());

  // Reactive classes
  const formStatusClass = createComputed(() => isFormValid() ? 'bg-green-900' : 'bg-red-900');
  const formStatusText = createComputed(() => isFormValid() ? 'Valid ✓' : 'Invalid ✗');

  // Reactive preview data
  const previewName = createComputed(() => name() || 'Not set');
  const previewEmail = createComputed(() => email() || 'Not set');
  const previewAge = createComputed(() => age() ? age().toString() : 'Not set');
  const previewCountry = createComputed(() => country() || 'Not set');
  const previewInterests = createComputed(() => interests().length > 0 ? interests().join(', ') : 'None');
  const previewNewsletter = createComputed(() => newsletter() ? 'Yes' : 'No');

  // Reactive validation colors
  const emailValidationColor = createComputed(() => isValidEmail() ? 'text-green-400' : 'text-red-400');
  const ageValidationColor = createComputed(() => isValidAge() ? 'text-green-400' : 'text-red-400');
  const countryValidationColor = createComputed(() => country() ? 'text-green-400' : 'text-red-400');

  // Reactive JSON display
  const formDataJson = createComputed(() => JSON.stringify(formData(), null, 2));

  // Actions
  const toggleInterest = (interest: string) => {
    const current = interests();
    if (current.includes(interest)) {
      interests(current.filter(i => i !== interest));
    } else {
      interests([...current, interest]);
    }
  };

  const handleSubmit = (e: Event) => {
    e.preventDefault();
    if (isFormValid()) {
      alert(`Form submitted!\n\n${JSON.stringify(formData(), null, 2)}`);
    }
  };

  const resetForm = () => {
    name('');
    email('');
    age(18);
    country('');
    interests([]);
    newsletter(false);
    comments('');
  };

  const availableInterests = ['Technology', 'Sports', 'Music', 'Travel', 'Cooking', 'Reading', 'Gaming', 'Art'];
  const countries = ['United States', 'Canada', 'United Kingdom', 'Germany', 'France', 'Japan', 'Australia', 'Other'];

  return (
    <div class="max-w-4xl mx-auto space-y-8">
      <div class="text-center">
        <h1 class="text-4xl font-bold text-blue-400 mb-4">
          Interactive Form Demo
        </h1>
        <p class="text-xl text-gray-300">
          Demonstrates form handling, validation, and complex state management
        </p>
      </div>

      <div class="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Form */}
        <div class="bg-gray-800 p-6 rounded-lg shadow-lg">
          <h2 class="text-2xl font-semibold text-green-400 mb-6">
            User Registration
          </h2>
          
          <form onSubmit={handleSubmit} class="space-y-6">
            {/* Name */}
            <div>
              <label htmlFor="name" class="block text-sm font-medium text-gray-300 mb-2">
                Name *
              </label>
              <input
                id="name"
                type="text"
                required
                class="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white placeholder-gray-400 focus:ring-2 focus:ring-green-500 focus:border-green-500"
                placeholder="Enter your name"
                 value={name}
                onInput={(e) => name((e.target as HTMLInputElement).value)}
              />
            </div>

            {/* Email */}
            <div>
              <label htmlFor="email" class="block text-sm font-medium text-gray-300 mb-2">
                Email *
              </label>
              <input
                id="email"
                type="email"
                required
                class={`w-full px-3 py-2 bg-gray-700 border rounded-md text-white placeholder-gray-400 focus:ring-2 focus:ring-green-500 ${
                  email() && !isValidEmail() 
                    ? 'border-red-500 focus:border-red-500' 
                    : 'border-gray-600 focus:border-green-500'
                }`}
                placeholder="Enter your email"
                 value={email}
                onInput={(e) => email((e.target as HTMLInputElement).value)}
              />
               <p class={`mt-1 text-sm text-red-400 ${emailErrorVisible() ? '' : 'hidden'}`}>
                 Please enter a valid email
               </p>
            </div>

            {/* Age */}
            <div>
              <label htmlFor="age" class="block text-sm font-medium text-gray-300 mb-2">
                Age *
              </label>
              <input
                id="age"
                type="number"
                min="13"
                max="120"
                required
                class={`w-full px-3 py-2 bg-gray-700 border rounded-md text-white placeholder-gray-400 focus:ring-2 focus:ring-green-500 ${
                  !isValidAge() 
                    ? 'border-red-500 focus:border-red-500' 
                    : 'border-gray-600 focus:border-green-500'
                }`}
                value={age().toString()}
                onInput={(e) => age(parseInt((e.target as HTMLInputElement).value) || 18)}
              />
               <p class={`mt-1 text-sm text-red-400 ${ageErrorVisible() ? '' : 'hidden'}`}>
                 Age must be between 13 and 120
               </p>
            </div>

            {/* Country */}
            <div>
              <label htmlFor="country" class="block text-sm font-medium text-gray-300 mb-2">
                Country *
              </label>
              <select
                id="country"
                required
                class="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white focus:ring-2 focus:ring-green-500 focus:border-green-500"
                value={country}
                onChange={(e) => country((e.target as HTMLSelectElement).value)}
              >
                <option value="">Select a country</option>
                <>
                  {countries.map((c) => <option key={c} value={c}>{c}</option>)}
                </>
              </select>
            </div>

            {/* Interests */}
            <div>
              <label class="block text-sm font-medium text-gray-300 mb-2">
                Interests
              </label>
              <div class="grid grid-cols-2 gap-2">
                {availableInterests.map((interest) => (
                  <label key={interest} class="flex items-center">
                    <input
                      type="checkbox"
                      checked={interests().includes(interest)}
                      onChange={() => toggleInterest(interest)}
                      class="w-4 h-4 text-green-600 bg-gray-700 border-gray-600 rounded focus:ring-green-500 focus:ring-2"
                    />
                    <span class="ml-2 text-sm text-gray-300">{interest}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* Newsletter */}
            <div>
              <label class="flex items-center">
                <input
                  type="checkbox"
                   checked={newsletter}
                  onChange={(e) => newsletter((e.target as HTMLInputElement).checked)}
                  class="w-4 h-4 text-green-600 bg-gray-700 border-gray-600 rounded focus:ring-green-500 focus:ring-2"
                />
                <span class="ml-2 text-sm text-gray-300">Subscribe to newsletter</span>
              </label>
            </div>

            {/* Comments */}
            <div>
              <label htmlFor="comments" class="block text-sm font-medium text-gray-300 mb-2">
                Comments
              </label>
              <textarea
                id="comments"
                rows={4}
                class="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white placeholder-gray-400 focus:ring-2 focus:ring-green-500 focus:border-green-500"
                placeholder="Any additional comments..."
                 value={comments}
                onInput={(e) => comments((e.target as HTMLTextAreaElement).value)}
              />
            </div>

            {/* Submit */}
            <div class="flex space-x-2">
              <button
                type="submit"
                 disabled={!isFormValid()}
                class={`flex-1 px-4 py-2 rounded-md transition-colors ${
                  isFormValid()
                    ? 'bg-green-600 text-white hover:bg-green-700'
                    : 'bg-gray-600 text-gray-400 cursor-not-allowed'
                }`}
              >
                Submit
              </button>
              <button
                type="button"
                onClick={resetForm}
                class="px-4 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700 transition-colors"
              >
                Reset
              </button>
            </div>
          </form>
        </div>

        {/* Live Preview */}
        <div class="bg-gray-800 p-6 rounded-lg shadow-lg">
          <h2 class="text-2xl font-semibold text-purple-400 mb-6">
            Form Data Preview
          </h2>
          
          <div class="space-y-4">
            <div class={`p-4 rounded-md ${formStatusClass as any}`}>
               <div class="text-sm font-medium">
                 Form Status: {formStatusText as any}
              </div>
            </div>

            <div class="bg-gray-700 p-4 rounded-md">
              <h3 class="font-semibold text-gray-200 mb-2">Current Data:</h3>
               <pre class="text-sm text-gray-300 overflow-x-auto whitespace-pre-wrap">
                 {formDataJson}
               </pre>
            </div>

            <div class="space-y-2 text-sm">
               <div class="flex justify-between">
                 <span class="text-gray-400">Name:</span>
                 <span class="text-white">{previewName}</span>
               </div>
               <div class="flex justify-between">
                 <span class="text-gray-400">Email:</span>
                 <span class={emailValidationColor()}>
                   {previewEmail}
                </span>
              </div>
               <div class="flex justify-between">
                 <span class="text-gray-400">Age:</span>
                 <span class={ageValidationColor()}>
                   {previewAge}
                 </span>
               </div>
               <div class="flex justify-between">
                 <span class="text-gray-400">Country:</span>
                 <span class={countryValidationColor()}>
                   {previewCountry}
                 </span>
               </div>
               <div class="flex justify-between">
                 <span class="text-gray-400">Interests:</span>
                 <span class="text-white">{previewInterests}</span>
               </div>
               <div class="flex justify-between">
                 <span class="text-gray-400">Newsletter:</span>
                 <span class="text-white">{previewNewsletter}</span>
               </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
