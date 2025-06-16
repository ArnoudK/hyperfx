import { createSignal, RouterLink, VNode } from 'hyperfx';
import { TopNav } from '../components/topnav';

// Type definitions for better type safety
type CounterValue = number;
type CounterSignal = ReturnType<typeof createSignal<CounterValue>>;

interface CounterActions {
    increment: () => void;
    decrement: () => void;
    reset: () => void;
}

// Create a reactive counter signal with proper typing
const count: CounterSignal = createSignal<CounterValue>(0);

// Counter actions with proper typing
const counterActions: CounterActions = {
    increment(): void {
        count(count() + 1);
    },

    decrement(): void {
        count(count() - 1);
    },

    reset(): void {
        count(0);
    }
};

// Export individual actions for convenience
export const { increment, decrement, reset } = counterActions;

export default function HomePage(): VNode<any> {
    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-white">
          <TopNav />

            <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                <section className="text-center mb-16">
                    <h1 className="text-5xl md:text-7xl font-bold p-2 mb-8 bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
                        🚀 Welcome to HyperFX JSX
                    </h1>
                    
                    <p className="text-xl md:text-2xl text-gray-300 max-w-4xl mx-auto leading-relaxed">
                        A modern SSR framework with reactive JSX components
                    </p>
                </section>

                {/* Interactive Counter Demo */}
                <section className="mb-16" aria-labelledby="counter-heading">
                    <div className="bg-gradient-to-br from-blue-900/50 via-purple-900/50 to-indigo-900/50 backdrop-blur-sm p-10 rounded-2xl border border-blue-500/30 shadow-2xl shadow-blue-500/10">
                        <h2 id="counter-heading" className="text-3xl font-semibold mb-8 text-center text-blue-300">
                            🧮 Interactive Counter
                        </h2>
                        
                        <div className="text-center">
                            <div 
                                className="text-7xl md:text-8xl font-bold mb-10 text-transparent bg-gradient-to-r from-yellow-400 via-orange-400 to-red-400 bg-clip-text animate-pulse"
                                role="status"
                                aria-live="polite"
                                aria-label={`Current count: ${count()}`}
                            >
                                {count}
                            </div>
                            
                            <div className="flex flex-wrap justify-center gap-6">
                                <button
                                    className="group px-8 py-4 bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-500 hover:to-emerald-500 rounded-xl text-lg font-semibold transition-all duration-300 focus:outline-none focus:ring-4 focus:ring-green-500/50 focus:ring-offset-2 focus:ring-offset-gray-900 transform hover:scale-105 hover:shadow-lg hover:shadow-green-500/25"
                                    onclick={increment}
                                    type="button"
                                    aria-label="Increment counter"
                                >
                                    <span className="flex items-center gap-2">
                                        <span className="text-2xl group-hover:animate-bounce">➕</span>
                                        Increment
                                    </span>
                                </button>
                                <button
                                    className="group px-8 py-4 bg-gradient-to-r from-red-600 to-rose-600 hover:from-red-500 hover:to-rose-500 rounded-xl text-lg font-semibold transition-all duration-300 focus:outline-none focus:ring-4 focus:ring-red-500/50 focus:ring-offset-2 focus:ring-offset-gray-900 transform hover:scale-105 hover:shadow-lg hover:shadow-red-500/25"
                                    onclick={decrement}
                                    type="button"
                                    aria-label="Decrement counter"
                                >
                                    <span className="flex items-center gap-2">
                                        <span className="text-2xl group-hover:animate-bounce">➖</span>
                                        Decrement
                                    </span>
                                </button>
                                <button
                                    className="group px-8 py-4 bg-gradient-to-r from-gray-600 to-slate-600 hover:from-gray-500 hover:to-slate-500 rounded-xl text-lg font-semibold transition-all duration-300 focus:outline-none focus:ring-4 focus:ring-gray-500/50 focus:ring-offset-2 focus:ring-offset-gray-900 transform hover:scale-105 hover:shadow-lg hover:shadow-gray-500/25"
                                    onclick={reset}
                                    type="button"
                                    aria-label="Reset counter to zero"
                                >
                                    <span className="flex items-center gap-2">
                                        <span className="text-2xl group-hover:animate-spin">🔄</span>
                                        Reset
                                    </span>
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
