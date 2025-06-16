import { RouterLink } from "hyperfx";


export function TopNav(){
return (<header className="bg-gray-800 border-b border-gray-700">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <nav className="flex space-x-8 py-4" role="navigation" aria-label="Main navigation">
                        <RouterLink href="/" className="text-blue-400 hover:text-blue-300 transition-colors">
                            Home
                        </RouterLink>
                        <RouterLink 
                            href="/about" 
                            className="text-blue-400 hover:text-blue-300 transition-colors"
                        >
                            About
                        </RouterLink>
                        <RouterLink href="/products" className="text-blue-400 hover:text-blue-300 transition-colors">
                            Products
                        </RouterLink>
                    </nav>
                </div>
            </header>
)
}