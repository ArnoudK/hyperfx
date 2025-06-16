import { createSignal, createComputed, VNode, If, For } from 'hyperfx';
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
        console.log('🛒 Adding to cart:', product.name, 'current cart length:', currentCart.length);
        cart([...currentCart, product]);
        console.log('🛒 After adding, cart length:', cart().length, 'total:', cartTotal(), 'count:', cartItemCount());
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
        <div className="min-h-screen bg-gray-900 text-white">
           <TopNav />

            <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <section className="text-center mb-12">
                    <h1 className="text-4xl md:text-5xl font-bold mb-6">🛍️ HyperFX Products</h1>
                    <p className="text-xl text-gray-300 max-w-3xl mx-auto">
                        Discover our premium tools and components for reactive web development
                    </p>
                </section>

                {/* Shopping Cart Summary */}
                <section className="mb-12" aria-labelledby="cart-heading">
                    <div className="bg-gradient-to-r from-green-900 to-blue-900 p-6 rounded-lg border border-green-700">
                        <h2 id="cart-heading" className="text-2xl font-semibold mb-4 text-green-300">
                            🛒 Shopping Cart
                        </h2>
                        
                        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
                            <div className="flex flex-col sm:flex-row gap-4 text-lg">
                                <span aria-live="polite">
                                    Items: <strong>{cartItemCount()}</strong>
                                </span>
                                <span aria-live="polite">
                                    Total: <strong>${cartTotal()}</strong>
                                </span>
                            </div>
                            
                            <button
                                className="px-4 py-2 bg-red-600 hover:bg-red-700 rounded transition-colors disabled:opacity-50 disabled:cursor-not-allowed focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 focus:ring-offset-gray-900"
                                onclick={clearCart}
                                disabled={isCartEmpty}
                                type="button"
                                aria-label={`Clear all ${cartItemCount()} items from cart`}
                            >
                                Clear Cart
                            </button>
                        </div>

                        {If(
                            showCartItems,
                            () => (
                                <div className="mt-6">
                                    <h3 className="text-lg font-medium mb-3">Cart Items:</h3>
                                    <ul className="space-y-2" role="list" aria-label="Items in shopping cart">
                                        <For 
                                            each={cart}
                                            children={(item, index) => (
                                                <li className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-2 bg-gray-800 p-3 rounded">
                                                    <div className="flex-1">
                                                        <span className="font-medium">{item.name}</span>
                                                        <span className="text-green-400 ml-2">${item.price}</span>
                                                    </div>
                                                    <button
                                                        className="px-3 py-1 bg-red-600 hover:bg-red-700 rounded text-sm transition-colors focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 focus:ring-offset-gray-800 self-start sm:self-center"
                                                        onclick={() => removeFromCart(item.id)}
                                                        type="button"
                                                        aria-label={`Remove ${item.name} from cart`}
                                                    >
                                                        Remove
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
                    <h2 id="products-heading" className="text-2xl font-semibold mb-6 text-center">
                        Available Products
                    </h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
                        {products.map(product => {
                            // Create computed signals for this product
                            const isInCart = createComputed(() => !!cart().find(item => item.id === product.id));
                            const buttonText = createComputed(() => isInCart() ? 'In Cart' : 'Add to Cart');
                            const buttonLabel = createComputed(() => isInCart() 
                                ? `${product.name} is already in cart` 
                                : `Add ${product.name} to cart for $${product.price}`
                            );
                            
                            return (
                                <article key={product.id} className="bg-gray-800 p-6 rounded-lg border border-gray-700">
                                    <header className="mb-4">
                                        <div className="flex justify-between items-start mb-2">
                                            <h3 className="text-xl font-semibold text-blue-400">{product.name}</h3>
                                            <span className="text-sm bg-gray-700 px-2 py-1 rounded text-gray-300">
                                                {product.category}
                                            </span>
                                        </div>
                                        <p className="text-gray-300">{product.description}</p>
                                    </header>
                                    
                                    <footer className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
                                        <span className="text-2xl font-bold text-green-400" aria-label={`Price: ${product.price} dollars`}>
                                            ${product.price}
                                        </span>
                                        <button
                                            className="px-4 py-2 rounded transition-colors bg-blue-600 hover:bg-blue-700 text-white disabled:bg-gray-600 disabled:text-gray-400 disabled:cursor-not-allowed focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-gray-800"
                                            onclick={() => addToCart(product)}
                                            disabled={isInCart}
                                            type="button"
                                            aria-label={buttonLabel}
                                        >
                                            {buttonText}
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

