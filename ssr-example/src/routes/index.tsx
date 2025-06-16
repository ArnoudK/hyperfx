import { createSignal, RouterLink, VNode } from 'hyperfx';
import { TopNav } from '../components/topnav';

// Create a reactive counter signal
const count = createSignal(0);

// Counter actions
function increment() {
    count(count() + 1);
}

function decrement() {
    count(count() - 1);
}

function reset() {
    count(0);
}

export default function HomePage(): VNode {
    return (
        <div className="min-h-screen bg-gray-900 text-white">
          <TopNav />

            <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <section className="text-center mb-12">
                    <h1 className="text-4xl md:text-5xl font-bold mb-6">
                        🚀 Welcome to HyperFX JSX
                    </h1>
                    
                    <p className="text-xl text-gray-300 max-w-3xl mx-auto">
                        A modern SSR framework with reactive JSX components
                    </p>
                </section>

                {/* Interactive Counter Demo */}
                <section className="mb-12" aria-labelledby="counter-heading">
                    <div className="bg-gradient-to-r from-blue-900 to-purple-900 p-8 rounded-lg border border-blue-700">
                        <h2 id="counter-heading" className="text-2xl font-semibold mb-6 text-blue-300">
                            🧮 Interactive Counter
                        </h2>
                        
                        <div className="text-center">
                            <div 
                                className="text-6xl font-bold mb-6 text-yellow-400"
                                role="status"
                                aria-live="polite"
                                aria-label={`Current count: ${count()}`}
                            >
                                {count}
                            </div>
                            
                            <div className="flex flex-wrap justify-center gap-4">
                                <button
                                    className="px-6 py-3 bg-green-600 hover:bg-green-700 rounded-lg text-lg font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 focus:ring-offset-gray-900"
                                    onclick={increment}
                                    type="button"
                                    aria-label="Increment counter"
                                >
                                    ➕ Increment
                                </button>
                                <button
                                    className="px-6 py-3 bg-red-600 hover:bg-red-700 rounded-lg text-lg font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 focus:ring-offset-gray-900"
                                    onclick={decrement}
                                    type="button"
                                    aria-label="Decrement counter"
                                >
                                    ➖ Decrement
                                </button>
                                <button
                                    className="px-6 py-3 bg-gray-600 hover:bg-gray-700 rounded-lg text-lg font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 focus:ring-offset-gray-900"
                                    onclick={reset}
                                    type="button"
                                    aria-label="Reset counter to zero"
                                >
                                    🔄 Reset
                                </button>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Features Grid */}
                <section className="mb-12" aria-labelledby="features-heading">
                    <h2 id="features-heading" className="sr-only">Features</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        <article className="bg-gray-800 p-6 rounded-lg border border-gray-700">
                            <h3 className="text-xl font-semibold mb-3 text-green-400">⚡ Fast SSR</h3>
                            <p className="text-gray-300">
                                Server-side rendering with automatic hydration for optimal performance
                                and SEO benefits.
                            </p>
                        </article>

                        <article className="bg-gray-800 p-6 rounded-lg border border-gray-700">
                            <h3 className="text-xl font-semibold mb-3 text-blue-400">🔄 Reactive</h3>
                            <p className="text-gray-300">
                                Fine-grained reactivity with signals that update only what's needed
                                for maximum efficiency.
                            </p>
                        </article>

                        <article className="bg-gray-800 p-6 rounded-lg border border-gray-700">
                            <h3 className="text-xl font-semibold mb-3 text-purple-400">📱 JSX</h3>
                            <p className="text-gray-300">
                                Familiar React-like JSX syntax with TypeScript support for
                                a great developer experience.
                            </p>
                        </article>
                    </div>
                </section>

                {/* Getting Started */}
                <section aria-labelledby="getting-started-heading">
                    <article className="bg-gray-800 p-6 rounded-lg border border-gray-700">
                        <h3 id="getting-started-heading" className="text-xl font-semibold mb-4 text-orange-400">
                            🚀 Getting Started
                        </h3>
                        <p className="text-gray-300 mb-4">
                            This counter demonstrates HyperFX's reactive capabilities. The count value
                            is stored in a reactive signal that automatically updates the UI when changed.
                        </p>
                        <p className="text-gray-300">
                            Try clicking the buttons above - the count updates instantly with no manual
                            DOM manipulation required!
                        </p>
                    </article>
                </section>
            </main>
        </div>
    );
}
