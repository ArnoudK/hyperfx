import { createSignal, createComputed, VNode, If, For } from 'hyperfx';
import { template } from 'hyperfx/jsx';
import { TopNav } from '../components/topnav';

// Product data
interface Product {
  id: number;
  name: string;
  price: number;
  description: string;
  category: string;
}

const products: Product[] = [
  {
    id: 1,
    name: 'HyperFX Pro',
    price: 99,
    description: 'Advanced reactive framework with premium features',
    category: 'Framework'
  },
  {
    id: 2,
    name: 'JSX Components',
    price: 49,
    description: 'Pre-built accessible component library',
    category: 'Components'
  },
  {
    id: 3,
    name: 'SSR Toolkit',
    price: 79,
    description: 'Server-side rendering tools and optimization utilities',
    category: 'Tools'
  },
  {
    id: 4,
    name: 'Dev Tools',
    price: 29,
    description: 'Development and debugging tools for enhanced productivity',
    category: 'Tools'
  }
];

// Shopping cart state
const cart = createSignal<Product[]>([]);
const cartTotal = createComputed(() =>
  cart().reduce((total, product) => total + product.price, 0)
);
const cartItemCount = createComputed(() => cart().length);
// Derived signal for showing cart items
const showCartItems = createComputed(() => cartItemCount() > 0);
// Computed signal for cart empty state
const isCartEmpty = createComputed(() => cartItemCount() === 0);

// Cart actions
function addToCart(product: Product) {
  const currentCart = cart();
  if (!currentCart.find(item => item.id === product.id)) {
    cart([...currentCart, product]);
  }
}

function removeFromCart(productId: number) {
  const currentCart = cart();
  cart(currentCart.filter(item => item.id !== productId));
}

function clearCart() {
  cart([]);
}

export default function ProductsPage(): VNode {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-white">
      <TopNav />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <section className="text-center mb-16">
          <h1 className="text-5xl md:text-7xl p-2 font-bold mb-8 bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
            🛍️ HyperFX Products
          </h1>
          <p className="text-xl md:text-2xl text-gray-300 max-w-4xl mx-auto leading-relaxed">
            Discover our premium tools and components for reactive web development
          </p>
        </section>

        {/* Shopping Cart Summary */}
        <section className="mb-16" aria-labelledby="cart-heading">
          <div className="bg-gradient-to-br from-green-900/50 via-emerald-900/50 to-teal-900/50 backdrop-blur-sm p-10 rounded-2xl border border-green-500/30 shadow-2xl shadow-green-500/10">
            <h2 id="cart-heading" className="text-3xl font-semibold mb-8 text-center text-green-300">
              🛒 Shopping Cart
            </h2>

            <div className="flex flex-col lg:flex-row lg:justify-between lg:items-center gap-6 mb-8">
              <div className="flex flex-col sm:flex-row gap-6 text-xl">
                <div
                  aria-live="polite"
                  className="text-center lg:text-left"
                >
                  Items: <span className="text-transparent bg-gradient-to-r from-yellow-400 to-orange-400 bg-clip-text font-bold text-2xl">{cartItemCount()}</span>
                </div>
                <div
                  aria-live="polite"
                  className="text-center lg:text-left"
                >
                  Total: <span className="text-transparent bg-gradient-to-r from-green-400 to-emerald-400 bg-clip-text font-bold text-2xl">${cartTotal()}</span>
                </div>
              </div>

              <button
                className="group px-8 py-4 bg-gradient-to-r from-red-600 to-rose-600 hover:from-red-500 hover:to-rose-500 rounded-xl text-lg font-semibold transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none focus:outline-none focus:ring-4 focus:ring-red-500/50 focus:ring-offset-2 focus:ring-offset-gray-900 transform hover:scale-105 hover:shadow-lg hover:shadow-red-500/25"
                onclick={clearCart}
                disabled={isCartEmpty}
                type="button"
                aria-label={template`Clear all ${cartItemCount} items from cart`}
              >
                <span className="flex items-center gap-2">
                  <span className="text-xl group-hover:animate-bounce">🗑️</span>
                  Clear Cart
                </span>
              </button>
            </div>

            {If(
              showCartItems,
              () => (
                <div>
                  <h3 className="text-2xl font-medium mb-6 text-center">Cart Items:</h3>
                  <ul className="space-y-4" role="list" aria-label="Items in shopping cart">
                    <For
                      each={cart}
                      children={(item, index) => (
                        <li className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4 bg-gradient-to-r from-gray-800/80 to-gray-700/80 backdrop-blur-sm p-4 rounded-xl border border-gray-600/50 hover:border-green-500/50 transition-all duration-300">
                          <div className="flex-1">
                            <span className="font-medium text-lg text-white">{item.name}</span>
                            <span className="text-green-400 ml-3 font-bold text-xl">${item.price}</span>
                          </div>
                          <button
                            className="group px-4 py-2 bg-gradient-to-r from-red-300 to-rose-400 hover:from-red-800 hover:to-rose-900 rounded-lg text-sm font-semibold transition-all duration-300 focus:outline-none focus:ring-4 focus:ring-red-500/50 focus:ring-offset-2 focus:ring-offset-gray-900 transform hover:scale-105 hover:shadow-lg hover:shadow-red-500/25 self-start sm:self-center"
                            onclick={() => removeFromCart(item.id)}
                            type="button"
                            aria-label={`Remove ${item.name} from cart`}
                          >
                            <span className="flex items-center gap-2">
                              <span className="text-lg group-hover:animate-pulse">❌</span>
                              Remove
                            </span>
                          </button>
                        </li>
                      )}
                    />
                  </ul>
                </div>
              )
            )}
          </div>
        </section>

        {/* Products Grid */}
        <section aria-labelledby="products-heading">
          <h2 id="products-heading" className="text-3xl font-bold mb-8 text-center bg-gradient-to-r from-cyan-400 to-blue-400 bg-clip-text text-transparent">
            Available Products
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-16">
            {products.map(product => {
              // Create computed signals for this product
              const isInCart = createComputed(() => !!cart().find(item => item.id === product.id));
              const buttonText = createComputed(() => isInCart() ? 'In Cart' : 'Add to Cart');
              const buttonLabel = createComputed(() => isInCart()
                ? `${product.name} is already in cart`
                : `Add ${product.name} to cart for $${product.price}`
              );

              return (
                <article key={product.id} className="bg-gradient-to-br from-gray-800/80 to-gray-700/80 backdrop-blur-sm p-8 rounded-2xl border border-gray-600/50 hover:border-blue-500/50 transition-all duration-300 group hover:transform hover:scale-[1.02] hover:shadow-2xl hover:shadow-blue-500/10">
                  <header className="mb-6">
                    <div className="flex justify-between items-start mb-4">
                      <h3 className="text-2xl font-semibold text-blue-400 group-hover:text-blue-300 transition-colors duration-300">
                        {product.name}
                      </h3>
                      <span className="text-sm bg-gradient-to-r from-purple-600 to-indigo-600 px-3 py-1 rounded-full text-white font-medium">
                        {product.category}
                      </span>
                    </div>
                    <p className="text-gray-300 text-lg leading-relaxed">{product.description}</p>
                  </header>

                  <footer className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-6">
                    <span
                      className="text-3xl font-bold text-transparent bg-gradient-to-r from-green-400 to-emerald-400 bg-clip-text"
                      aria-label={`Price: ${product.price} dollars`}
                    >
                      ${product.price}
                    </span>
                    <button
                      className="group px-6 py-3 rounded-xl text-lg font-semibold transition-all duration-300 focus:outline-none focus:ring-4 focus:ring-offset-2 focus:ring-offset-gray-900 transform hover:scale-105 hover:shadow-lg bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-500 hover:to-cyan-500 text-white disabled:from-gray-600 disabled:to-slate-600 disabled:text-gray-400 disabled:cursor-not-allowed disabled:transform-none disabled:shadow-none focus:ring-blue-500/50 hover:shadow-blue-500/25"
                      onclick={() => addToCart(product)}
                      disabled={isInCart}
                      type="button"
                      aria-label={buttonLabel}
                    >
                      <span className="flex items-center gap-2">
                        <span className="text-xl group-hover:animate-bounce">
                          {isInCart() ? '✓' : '🛒'}
                        </span>
                        {buttonText}
                      </span>
                    </button>
                  </footer>
                </article>
              );
            })}
          </div>
        </section>


      </main>
    </div>
  );
}

