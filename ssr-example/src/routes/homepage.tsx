import { createSignal } from 'hyperfx';
import { TopNav } from '../components/topnav';







export default function HomePage() {
    const count = createSignal<number>(0);

    const increment = () => {
        count(count() + 1);
    };

    const decrement = () => {
        count(count() - 1);
    };

    const reset = () => {
        count(0);
    };

    return (

        <div class="min-h-screen bg-linear-to-br from-gray-900 via-gray-800 to-gray-900 text-white">
            <nav><TopNav /></nav>
            <main class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                <section class="text-center mb-16">
                    <h1 class="text-5xl md:text-7xl font-bold p-2 mb-8 bg-linear-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
                        🚀 Welcome to HyperFX JSX
                    </h1>
                    <p class="text-xl md:text-2xl text-gray-300 max-w-4xl mx-auto leading-relaxed">
                        A modern SSR framework with reactive JSX components
                    </p>
                </section>

                {/* Interactive Counter Demo */}
                <section class="mb-16" aria-labelledby="counter-heading">
                    <div class="bg-linear-to-br from-blue-900/50 via-purple-900/50 to-indigo-900/50 backdrop-blur-sm p-10 rounded-2xl border border-blue-500/30 shadow-2xl shadow-blue-500/10">
                        <h2 id="counter-heading" class="text-3xl font-semibold mb-8 text-center text-blue-300">🧮 Interactive Counter</h2>

                        <div class="text-center">
                            <div
                                class="text-7xl md:text-8xl font-bold mb-10 text-transparent bg-linear-to-r from-yellow-400 via-orange-400 to-red-400 bg-clip-text animate-pulse"
                                role="status"
                                aria-live="polite"
                            >
                                {count}
                            </div>

                            <div class="flex flex-wrap justify-center gap-6">
                                <button
                                    class="group px-8 py-4 bg-linear-to-r from-green-600 to-emerald-600 hover:from-green-500 hover:to-emerald-500 rounded-xl text-lg font-semibold transition-all duration-300 focus:outline-none focus:ring-4 focus:ring-green-500/50 focus:ring-offset-2 focus:ring-offset-gray-900 transform hover:scale-105 hover:shadow-lg hover:shadow-green-500/25"
                                    onClick={increment}
                                    type="button"
                                    aria-label="Increment counter"
                                >
                                    <span class="flex items-center gap-2">
                                        <span class="text-2xl group-hover:animate-bounce">➕</span>
                                        Increment
                                    </span>
                                </button>

                                <button
                                    class="group px-8 py-4 bg-linear-to-r from-red-600 to-rose-600 hover:from-red-500 hover:to-rose-500 rounded-xl text-lg font-semibold transition-all duration-300 focus:outline-none focus:ring-4 focus:ring-red-500/50 focus:ring-offset-2 focus:ring-offset-gray-900 transform hover:scale-105 hover:shadow-lg hover:shadow-red-500/25"
                                    onClick={decrement}
                                    type="button"
                                    aria-label="Decrement counter"
                                >
                                    <span class="flex items-center gap-2">
                                        <span class="text-2xl group-hover:animate-bounce">➖</span>
                                        Decrement
                                    </span>
                                </button>

                                <button
                                    class="group px-8 py-4 bg-linear-to-r from-gray-600 to-slate-600 hover:from-gray-500 hover:to-slate-500 rounded-xl text-lg font-semibold transition-all duration-300 focus:outline-none focus:ring-4 focus:ring-gray-500/50 focus:ring-offset-2 focus:ring-offset-gray-900 transform hover:scale-105 hover:shadow-lg hover:shadow-gray-500/25"
                                    onClick={reset}
                                    type="button"
                                    aria-label="Reset counter to zero"
                                >
                                    <span class="flex items-center gap-2">
                                        <span class="text-2xl group-hover:animate-spin">🔄</span>
                                        Reset
                                    </span>
                                </button>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Features Grid */}
                <section class="mb-12" aria-labelledby="features-heading">
                    <h2 class="sr-only">Features</h2>

                    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        <article class="bg-gray-800 p-6 rounded-lg border border-gray-700">
                            <h3 class="text-xl font-semibold mb-3 text-green-400">⚡ Fast SSR</h3>
                            <p class="text-gray-300">Server-side rendering with automatic hydration for optimal performance and SEO benefits.</p>
                        </article>

                        <article class="bg-gray-800 p-6 rounded-lg border border-gray-700">
                            <h3 class="text-xl font-semibold mb-3 text-blue-400">🔄 Reactive</h3>
                            <p class="text-gray-300">Fine-grained reactivity with signals that update only what's needed for maximum efficiency.</p>
                        </article>

                        <article class="bg-gray-800 p-6 rounded-lg border border-gray-700">
                            <h3 class="text-xl font-semibold mb-3 text-purple-400">📱 JSX</h3>
                            <p class="text-gray-300">Familiar React-like JSX syntax with TypeScript support for a great developer experience.</p>
                        </article>
                    </div>
                </section>

                {/* Getting Started */}
                <section aria-labelledby="getting-started-heading">
                    <article class="bg-gray-800 p-6 rounded-lg border border-gray-700">
                        <h3 id="getting-started-heading" class="text-xl font-semibold mb-4 text-orange-400">🚀 Getting Started</h3>
                        <p class="text-gray-300 mb-4">This counter demonstrates HyperFX's reactive capabilities. The count value is stored in a reactive signal that automatically updates the UI when changed.</p>
                        <p class="text-gray-300">Try clicking the buttons above - the count updates instantly with no manual DOM manipulation required!</p>
                    </article>
                </section>
            </main>
        </div>
    );
}
