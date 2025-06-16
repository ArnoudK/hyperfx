import { createSignal, createComputed, VNode, For } from 'hyperfx';
import { TopNav } from '../components/topnav';

// State using HyperFX signals
const featureList = createSignal(['SSR', 'Hydration', 'Routing', 'Reactivity']);
const newFeature = createSignal('');
const featureCount = createComputed(() => featureList().length);

// Actions
function addFeature() {
    const feature = newFeature().trim();
    if (feature) {
        console.log('Before addFeature - current features:', featureList());
        featureList([...featureList(), feature]);
        console.log('After addFeature - new features:', featureList());
        newFeature('');
    }
}

function removeFeature(index: number) {
    console.log('Before removeFeature - current features:', featureList(), 'removing index:', index);
    const features = featureList();
    featureList([...features.slice(0, index), ...features.slice(index + 1)]);
    console.log('After removeFeature - new features:', featureList());
}

function updateNewFeature(event: Event) {
    const value = (event.target as HTMLInputElement).value;
    newFeature(value);
}

function resetFeatures() {
    featureList(['SSR', 'Hydration', 'Routing', 'Reactivity']);
    newFeature('');
}

export default function AboutPage(): VNode {
    return (
        <div className="min-h-screen bg-gray-900 text-white">
            <TopNav />

            <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <section className="text-center mb-12">
                    <h1 className="text-4xl md:text-5xl font-bold mb-6">📖 About HyperFX JSX</h1>
                    <p className="text-xl text-gray-300 max-w-3xl mx-auto">
                        Learn about our modern SSR framework with JSX support
                    </p>
                </section>

                {/* Framework Features */}
                <section className="mb-12" aria-labelledby="features-section">
                    <div className="bg-gradient-to-r from-purple-900 to-indigo-900 p-6 rounded-lg border border-purple-700">
                        <h2 id="features-section" className="text-2xl font-semibold mb-4 text-purple-300">
                            🚀 Framework Features
                        </h2>

                        <div className="mb-6">
                            <h3 className="text-lg font-medium mb-3 text-yellow-400">
                                Feature List (<span aria-live="polite">{featureCount}</span> items)
                            </h3>
                          
                            <ul className="space-y-2 mb-4" role="list" aria-label="Framework features">
                                <For 
                                    each={featureList}
                                    children={(feature, index) => (
                                        <li 
                                            className="flex items-center justify-between bg-gray-800 p-3 rounded-lg"
                                            role="listitem"
                                        >
                                            <span className="text-white">{feature}</span>
                                            <button
                                                className="px-3 py-1 bg-red-600 hover:bg-red-700 rounded text-sm transition-colors focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 focus:ring-offset-gray-800"
                                                onclick={() => removeFeature(index)}
                                                type="button"
                                                aria-label={`Remove ${feature} from feature list`}
                                            >
                                                Remove
                                            </button>
                                        </li>
                                    )}
                                />
                            </ul>

                            <form 
                                className="flex flex-col sm:flex-row gap-2"
                                onsubmit={(e: Event) => {
                                    e.preventDefault();
                                    addFeature();
                                }}
                            >
                                <label htmlFor="new-feature" className="sr-only">
                                    Add new feature
                                </label>
                                <input
                                    id="new-feature"
                                    type="text"
                                    placeholder="Add new feature..."
                                    className="flex-1 px-4 py-2 bg-gray-800 text-white border border-gray-600 rounded focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors"
                                    value={newFeature()}
                                    oninput={updateNewFeature}
                                    required
                                />
                                <div className="flex gap-2">
                                    <button
                                        type="submit"
                                        className="px-6 py-2 bg-green-600 hover:bg-green-700 rounded transition-colors focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 focus:ring-offset-gray-900"
                                    >
                                        Add
                                    </button>
                                    <button
                                        type="button"
                                        className="px-6 py-2 bg-gray-600 hover:bg-gray-700 rounded transition-colors focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 focus:ring-offset-gray-900"
                                        onclick={resetFeatures}
                                    >
                                        Reset
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                </section>

                {/* Technical Details */}
                <section className="mb-12" aria-labelledby="technical-details">
                    <h2 id="technical-details" className="sr-only">Technical Details</h2>
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                        <article className="bg-gray-800 p-6 rounded-lg border border-gray-700">
                            <h3 className="text-xl font-semibold mb-4 text-green-400">🔧 Technical Stack</h3>
                            <ul className="space-y-2 text-gray-300" role="list">
                                <li><strong>HyperFX:</strong> Reactive UI framework</li>
                                <li><strong>Vinxi:</strong> Full-stack meta-framework</li>
                                <li><strong>JSX:</strong> Familiar React-like syntax</li>
                                <li><strong>Tailwind CSS v4:</strong> Modern styling</li>
                                <li><strong>TypeScript:</strong> Type safety</li>
                                <li><strong>Vite:</strong> Fast development</li>
                            </ul>
                        </article>

                        <article className="bg-gray-800 p-6 rounded-lg border border-gray-700">
                            <h3 className="text-xl font-semibold mb-4 text-blue-400">⚡ Performance</h3>
                            <ul className="space-y-2 text-gray-300" role="list">
                                <li>Fast server-side rendering</li>
                                <li>Progressive hydration</li>
                                <li>Minimal JavaScript bundle</li>
                                <li>Efficient client-side updates</li>
                                <li>Smart caching strategies</li>
                                <li>SEO-friendly architecture</li>
                            </ul>
                        </article>
                    </div>
                </section>

                {/* Philosophy */}
                <section aria-labelledby="philosophy-heading">
                    <article className="bg-gray-800 p-6 rounded-lg border border-gray-700">
                        <h3 id="philosophy-heading" className="text-xl font-semibold mb-4 text-orange-400">
                            💭 Philosophy
                        </h3>
                        <p className="text-gray-300 mb-4">
                            HyperFX combines the best of both worlds: the familiar JSX syntax that developers love
                            with the performance and simplicity of a lightweight framework.
                        </p>
                        <p className="text-gray-300">
                            We believe in progressive enhancement, where your app works great even without JavaScript,
                            but becomes more interactive as it loads. This ensures the best user experience
                            across all devices and network conditions.
                        </p>
                    </article>
                </section>
            </main>
        </div>
    );
}
