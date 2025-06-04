import React, { useState, useEffect, useRef } from "react";
import { Star, ShoppingCart, Filter, Search } from "lucide-react";

// Mock data - this would typically come from an API
const mockProducts = [
  {
    id: 1,
    name: "Wireless Bluetooth Headphones",
    price: 79.99,
    originalPrice: 99.99,
    rating: 4.5,
    reviews: 128,
    category: "electronics",
    image: "🎧",
    inStock: true,
    description: "High-quality wireless headphones with noise cancellation",
  },
  {
    id: 2,
    name: "Cotton T-Shirt",
    price: 24.99,
    originalPrice: null,
    rating: 4.2,
    reviews: 89,
    category: "clothing",
    image: "👕",
    inStock: true,
    description: "Comfortable 100% cotton t-shirt",
  },
  {
    id: 3,
    name: "Smartphone Case",
    price: 15.99,
    originalPrice: 19.99,
    rating: 4.0,
    reviews: 45,
    category: "electronics",
    image: "📱",
    inStock: false,
    description: "Protective case for your smartphone",
  },
  {
    id: 4,
    name: "Running Shoes",
    price: 89.99,
    originalPrice: null,
    rating: 4.7,
    reviews: 203,
    category: "sports",
    image: "👟",
    inStock: true,
    description: "Lightweight running shoes for athletes",
  },
  {
    id: 5,
    name: "Coffee Mug",
    price: 12.99,
    originalPrice: 16.99,
    rating: 4.3,
    reviews: 67,
    category: "home",
    image: "☕",
    inStock: true,
    description: "Ceramic coffee mug with ergonomic handle",
  },
  {
    id: 6,
    name: "Yoga Mat",
    price: 34.99,
    originalPrice: null,
    rating: 4.6,
    reviews: 156,
    category: "sports",
    image: "🧘",
    inStock: true,
    description: "Non-slip yoga mat for all skill levels",
  },
];

const ProductCard = ({ product, onAddToCart }) => {
  const hasDiscount =
    product.originalPrice && product.originalPrice > product.price;
  const discountPercent = hasDiscount
    ? Math.round(
        ((product.originalPrice - product.price) / product.originalPrice) * 100
      )
    : 0;

  return (
    <div className="bg-white rounded-lg shadow-md p-4 hover:shadow-lg transition-shadow">
      <div className="text-4xl mb-3 text-center">{product.image}</div>

      <h3 className="font-semibold text-gray-800 mb-2 line-clamp-2">
        {product.name}
      </h3>

      <div className="flex items-center mb-2">
        <div className="flex items-center">
          <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
          <span className="text-sm text-gray-600 ml-1">{product.rating}</span>
          <span className="text-xs text-gray-500 ml-1">
            ({product.reviews})
          </span>
        </div>
      </div>

      <div className="mb-3">
        <div className="flex items-center gap-2">
          <span className="text-lg font-bold text-gray-900">
            ${product.price}
          </span>
          {hasDiscount && (
            <>
              <span className="text-sm text-gray-500 line-through">
                ${product.originalPrice}
              </span>
              <span className="text-xs bg-red-100 text-red-600 px-2 py-1 rounded">
                -{discountPercent}%
              </span>
            </>
          )}
        </div>
      </div>

      <p className="text-sm text-gray-600 mb-4 line-clamp-2">
        {product.description}
      </p>

      <button
        onClick={() => onAddToCart(product)}
        disabled={!product.inStock}
        className={`w-full flex items-center justify-center gap-2 py-2 px-4 rounded-md text-sm font-medium transition-colors ${
          product.inStock
            ? "bg-blue-600 text-white hover:bg-blue-700"
            : "bg-gray-200 text-gray-500 cursor-not-allowed"
        }`}
      >
        <ShoppingCart className="w-4 h-4" />
        {product.inStock ? "Add to Cart" : "Out of Stock"}
      </button>
    </div>
  );
};

const CartModal = ({ cart, onClose, onUpdateQuantity }) => {
  const overlayRef = useRef(null);

  // Close if click outside modal content
  const handleClickOutside = (e) => {
    if (overlayRef.current && e.target === overlayRef.current) {
      onClose();
    }
  };

  // Close on Esc key press
  useEffect(() => {
    const handleEsc = (e) => {
      if (e.key === "Escape") {
        onClose();
      }
    };
    document.addEventListener("keydown", handleEsc);
    return () => document.removeEventListener("keydown", handleEsc);
  }, [onClose]);

  const totalPrice = cart.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );

  return (
    <div
      ref={overlayRef}
      onClick={handleClickOutside}
      className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
      aria-modal="true"
      role="dialog"
      aria-labelledby="cart-modal-title"
      tabIndex={-1}
    >
      <div className="bg-white rounded-lg shadow-lg max-w-lg w-full p-6 relative mx-4">
        <h2 id="cart-modal-title" className="text-xl font-bold mb-4">
          Your Cart
        </h2>

        {cart.length === 0 && (
          <p className="text-gray-600">Your cart is empty.</p>
        )}

        {cart.length > 0 && (
          <>
            <ul className="divide-y divide-gray-200 max-h-80 overflow-y-auto mb-4">
              {cart.map((item) => (
                <li
                  key={item.id}
                  className="py-3 flex items-center justify-between"
                >
                  <div>
                    <div className="font-medium">{item.name}</div>
                    <div className="text-sm text-gray-500">
                      ${item.price.toFixed(2)}
                    </div>
                  </div>

                  <div className="flex items-center space-x-2">
                    <button
                      onClick={() =>
                        onUpdateQuantity(
                          item.id,
                          Math.max(item.quantity - 1, 1)
                        )
                      }
                      className="px-2 py-1 border rounded-md hover:bg-gray-100 focus:outline-none focus:ring focus:ring-blue-300"
                      aria-label={`Decrease quantity of ${item.name}`}
                    >
                      -
                    </button>
                    <span>{item.quantity}</span>
                    <button
                      onClick={() =>
                        onUpdateQuantity(item.id, item.quantity + 1)
                      }
                      className="px-2 py-1 border rounded-md hover:bg-gray-100 focus:outline-none focus:ring focus:ring-blue-300"
                      aria-label={`Increase quantity of ${item.name}`}
                    >
                      +
                    </button>
                  </div>
                </li>
              ))}
            </ul>

            <div className="flex justify-between font-semibold text-lg mb-4">
              <span>Total:</span>
              <span>${totalPrice.toFixed(2)}</span>
            </div>
          </>
        )}

        <button
          onClick={onClose}
          className="absolute top-3 right-3 text-gray-500 hover:text-gray-700 focus:outline-none"
          aria-label="Close cart modal"
        >
          ✕
        </button>
      </div>
    </div>
  );
};

const EcommerceApp = () => {
  const [products, setProducts] = useState([]);
  const [cart, setCart] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [loading, setLoading] = useState(true);
  const [isCartOpen, setIsCartOpen] = useState(false);

  // Simulate API call
  useEffect(() => {
    setTimeout(() => {
      setProducts(mockProducts);
      setLoading(false);
    }, 1000);
  }, []);

  const handleAddToCart = (product) => {
    setCart((prev) => {
      const existing = prev.find((item) => item.id === product.id);
      if (existing) {
        return prev.map((item) =>
          item.id === product.id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      }
      return [...prev, { ...product, quantity: 1 }];
    });
  };

  const handleUpdateQuantity = (productId, newQuantity) => {
    setCart((prev) =>
      prev.map((item) =>
        item.id === productId ? { ...item, quantity: newQuantity } : item
      )
    );
  };

  const filteredProducts = products.filter((product) => {
    const matchesSearch = product.name
      .toLowerCase()
      .includes(searchTerm.toLowerCase());
    const matchesCategory =
      selectedCategory === "all" || product.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const categories = ["all", ...new Set(products.map((p) => p.category))];
  const totalCartItems = cart.reduce((sum, item) => sum + item.quantity, 0);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-lg text-gray-600">Loading products...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-6xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <h1 className="text-2xl font-bold text-gray-900">ShopMart</h1>
            <div className="relative">
              <button
                onClick={() => setIsCartOpen(true)}
                className="relative focus:outline-none"
                aria-label="Open cart"
              >
                <ShoppingCart className="w-6 h-6 text-gray-600" />
                {totalCartItems > 0 && (
                  <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                    {totalCartItems}
                  </span>
                )}
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Cart Modal */}
      {isCartOpen && (
        <CartModal
          cart={cart}
          onClose={() => setIsCartOpen(false)}
          onUpdateQuantity={handleUpdateQuantity}
        />
      )}

      <div className="max-w-6xl mx-auto px-4 py-6">
        {/* Search and Filter Bar */}
        <div className="mb-6 flex flex-col sm:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <input
              type="text"
              placeholder="Search products..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>

          <div className="flex items-center gap-2">
            <Filter className="w-4 h-4 text-gray-600" />
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              {categories.map((category) => (
                <option key={category} value={category}>
                  {category === "all"
                    ? "All Categories"
                    : category.charAt(0).toUpperCase() + category.slice(1)}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Products Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredProducts.map((product) => (
            <ProductCard
              key={product.id}
              product={product}
              onAddToCart={handleAddToCart}
            />
          ))}
        </div>

        {filteredProducts.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-500 text-lg">
              No products found matching your criteria.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default EcommerceApp;
