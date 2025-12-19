import { createSignal, createComputed, For } from 'hyperfx';
import { TopNav } from '../components/topnav';

// State using HyperFX signals
const featureList = createSignal(['SSR', 'Hydration', 'Routing', 'Reactivity']);
const newFeature = createSignal('');
const featureCount = createComputed(() => featureList().length);

// Actions
function addFeature() {
    const feature = newFeature().trim();
    if (feature) {
        featureList([...featureList(), feature]);
        newFeature('');
    }
}

function removeFeature(index: number) {
    const features = featureList();
    featureList([...features.slice(0, index), ...features.slice(index + 1)]);
}

function updateNewFeature(event: Event) {
    const value = (event.target as HTMLInputElement).value;
    newFeature(value);
}

function resetFeatures() {
    featureList(['SSR', 'Hydration', 'Routing', 'Reactivity']);
    newFeature('');
}

export default function AboutPage() {
    return (
        <div class="min-h-screen bg-linear-to-br from-gray-900 via-gray-800 to-gray-900 text-white">
            <TopNav />

            <main class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                <section class="text-center mb-16">
                    <h1 class="text-5xl p-2 md:text-7xl font-bold mb-8 bg-linear-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
                        📖 About HyperFX JSX
                    </h1>
                    <p class="text-xl md:text-2xl text-gray-300 max-w-4xl mx-auto leading-relaxed">
                        Learn about our modern SSR framework with JSX support
                    </p>
                </section>

                {/* Framework Features */}
                <section class="mb-16" aria-labelledby="features-section">
                    <div class="bg-linear-to-br from-purple-900/50 via-indigo-900/50 to-blue-900/50 backdrop-blur-sm p-10 rounded-2xl border border-purple-500/30 shadow-2xl shadow-purple-500/10">
                        <h2 id="features-section" class="text-3xl font-semibold mb-8 text-center text-purple-300">
                            🚀 Framework Features
                        </h2>

                        <div class="mb-8">
                            <h3 class="text-2xl font-medium mb-6 text-center">
                                Feature List (
                                <span
                                    aria-live="polite"
                                    class="text-transparent bg-linear-to-r from-yellow-400 to-orange-400 bg-clip-text font-bold"
                                >
                                    {featureCount}
                                </span>
                                items)
                            </h3>

                            <ul class="space-y-3 mb-8" role="list" aria-label="Framework features">
                                <For
                                    each={featureList}
                                    children={(feature, index) => (
                                        <li
                                            class="flex items-center justify-between bg-linear-to-r from-gray-800/80 to-gray-700/80 backdrop-blur-sm p-4 rounded-xl border border-gray-600/50 hover:border-purple-500/50 transition-all duration-300"
                                            role="listitem"
                                        >
                                            <span class="text-white font-medium text-lg">{feature}</span>
                                            <button
                                                class="group px-4 py-2 bg-linear-to-r from-red-600 to-rose-600 hover:from-red-500 hover:to-rose-500 rounded-lg text-sm font-semibold transition-all duration-300 focus:outline-none focus:ring-4 focus:ring-red-500/50 focus:ring-offset-2 focus:ring-offset-gray-900 transform hover:scale-105 hover:shadow-lg hover:shadow-red-500/25"
                                                onClick={() => removeFeature(index())}
                                                type="button"
                                                aria-label={`Remove ${feature} from feature list`}
                                            >
                                                <span class="flex items-center gap-2">
                                                    <span class="text-lg group-hover:animate-pulse">🗑️</span>
                                                    Remove
                                                </span>
                                            </button>
                                        </li>
                                    )}
                                />
                            </ul>

                            <form
                                class="flex flex-col lg:flex-row gap-4"
                                onsubmit={(e: Event) => {
                                    e.preventDefault();
                                    addFeature();
                                }}
                            >
                                <label htmlFor="new-feature" class="sr-only">
                                    Add new feature
                                </label>
                                <input
                                    id="new-feature"
                                    type="text"
                                    placeholder="Add new feature..."
                                    class="flex-1 px-6 py-4 bg-gray-800/80 backdrop-blur-sm text-white border border-gray-600/50 rounded-xl focus:border-blue-500 focus:outline-none focus:ring-4 focus:ring-blue-500/30 transition-all duration-300 text-lg"
                                    value={newFeature}
                                    oninput={updateNewFeature}
                                    required
                                />
                                <div class="flex gap-4">
                                    <button
                                        type="submit"
                                        class="group px-8 py-4 bg-linear-to-r from-green-600 to-emerald-600 hover:from-green-500 hover:to-emerald-500 rounded-xl text-lg font-semibold transition-all duration-300 focus:outline-none focus:ring-4 focus:ring-green-500/50 focus:ring-offset-2 focus:ring-offset-gray-900 transform hover:scale-105 hover:shadow-lg hover:shadow-green-500/25"
                                    >
                                        <span class="flex items-center gap-2">
                                            <span class="text-xl group-hover:animate-bounce">➕</span>
                                            Add
                                        </span>
                                    </button>
                                    <button
                                        type="button"
                                        class="group px-8 py-4 bg-linear-to-r from-gray-600 to-slate-600 hover:from-gray-500 hover:to-slate-500 rounded-xl text-lg font-semibold transition-all duration-300 focus:outline-none focus:ring-4 focus:ring-gray-500/50 focus:ring-offset-2 focus:ring-offset-gray-900 transform hover:scale-105 hover:shadow-lg hover:shadow-gray-500/25"
                                        onClick={resetFeatures}
                                    >
                                        <span class="flex items-center gap-2">
                                            <span class="text-xl group-hover:animate-spin">🔄</span>
                                            Reset
                                        </span>
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                </section>

                {/* Technical Details */}
                <section class="mb-16" aria-labelledby="technical-details">
                    <h2 id="technical-details" class="text-3xl font-bold mb-8 text-center bg-linear-to-r from-cyan-400 to-blue-400 bg-clip-text text-transparent">
                        Technical Excellence
                    </h2>
                    <div class="grid grid-cols-1 lg:grid-cols-2 gap-8">
                        <article class="bg-linear-to-br from-gray-800/80 to-gray-700/80 backdrop-blur-sm p-8 rounded-2xl border border-gray-600/50 hover:border-green-500/50 transition-all duration-300 group">
                            <h3 class="text-2xl font-semibold mb-6 text-green-400 group-hover:text-green-300 transition-colors duration-300">
                                🔧 Technical Stack
                            </h3>
                            <ul class="space-y-3 text-gray-300" role="list">
                                <li class="flex items-center gap-3">
                                    <span class="w-2 h-2 bg-green-400 rounded-full"></span>
                                    <strong>HyperFX:</strong> Reactive UI framework
                                </li>
                                <li class="flex items-center gap-3">
                                    <span class="w-2 h-2 bg-blue-400 rounded-full"></span>
                                    <strong>Vinxi:</strong> Full-stack meta-framework
                                </li>
                                <li class="flex items-center gap-3">
                                    <span class="w-2 h-2 bg-purple-400 rounded-full"></span>
                                    <strong>JSX:</strong> Familiar React-like syntax
                                </li>
                                <li class="flex items-center gap-3">
                                    <span class="w-2 h-2 bg-cyan-400 rounded-full"></span>
                                    <strong>Tailwind CSS v4:</strong> Modern styling
                                </li>
                                <li class="flex items-center gap-3">
                                    <span class="w-2 h-2 bg-indigo-400 rounded-full"></span>
                                    <strong>TypeScript:</strong> Type safety
                                </li>
                                <li class="flex items-center gap-3">
                                    <span class="w-2 h-2 bg-orange-400 rounded-full"></span>
                                    <strong>Vite:</strong> Fast development
                                </li>
                            </ul>
                        </article>

                        <article class="bg-linear-to-br from-gray-800/80 to-gray-700/80 backdrop-blur-sm p-8 rounded-2xl border border-gray-600/50 hover:border-blue-500/50 transition-all duration-300 group">
                            <h3 class="text-2xl font-semibold mb-6 text-blue-400 group-hover:text-blue-300 transition-colors duration-300">
                                ⚡ Performance
                            </h3>
                            <ul class="space-y-3 text-gray-300" role="list">
                                <li class="flex items-center gap-3">
                                    <span class="w-2 h-2 bg-yellow-400 rounded-full"></span>
                                    Fast server-side rendering
                                </li>
                                <li class="flex items-center gap-3">
                                    <span class="w-2 h-2 bg-green-400 rounded-full"></span>
                                    Progressive hydration
                                </li>
                                <li class="flex items-center gap-3">
                                    <span class="w-2 h-2 bg-blue-400 rounded-full"></span>
                                    Minimal JavaScript bundle
                                </li>
                                <li class="flex items-center gap-3">
                                    <span class="w-2 h-2 bg-purple-400 rounded-full"></span>
                                    Efficient client-side updates
                                </li>
                                <li class="flex items-center gap-3">
                                    <span class="w-2 h-2 bg-pink-400 rounded-full"></span>
                                    Smart caching strategies
                                </li>
                                <li class="flex items-center gap-3">
                                    <span class="w-2 h-2 bg-cyan-400 rounded-full"></span>
                                    SEO-friendly architecture
                                </li>
                            </ul>
                        </article>
                    </div>
                </section>

                {/* Philosophy */}
                <section aria-labelledby="philosophy-heading">
                    <article class="bg-linear-to-br from-orange-900/50 via-amber-900/50 to-yellow-900/50 backdrop-blur-sm p-10 rounded-2xl border border-orange-500/30 shadow-2xl shadow-orange-500/10">
                        <h3 id="philosophy-heading" class="text-3xl font-semibold mb-8 text-center text-orange-400">
                            💭 Philosophy
                        </h3>
                        <div class="space-y-6 text-lg leading-relaxed">
                            <p class="text-gray-300">
                                HyperFX combines the best of both worlds: the familiar JSX syntax that developers love
                                with the performance and simplicity of a lightweight framework.
                            </p>
                            <p class="text-gray-300">
                                We believe in progressive enhancement, where your app works great even without JavaScript,
                                but becomes more interactive as it loads. This ensures the best user experience
                                across all devices and network conditions.
                            </p>
                        </div>
                    </article>
                </section>
            </main>
        </div>
    );
}
