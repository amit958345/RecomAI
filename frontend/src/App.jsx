
import { useState, useEffect } from "react";
import "./App.css";

function App() {
  const [search, setSearch] = useState("");
  const [products, setProducts] = useState([]);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [loadingRecommendations, setLoadingRecommendations] = useState(false);

  const [cart, setCart] = useState(() => {
    try {
      const savedCart = localStorage.getItem("recomai-cart");
      return savedCart ? JSON.parse(savedCart) : [];
    } catch {
      return [];
    }
  });

  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);

  // Fetch products from the FastAPI backend.
  useEffect(() => {
    fetch("http://127.0.0.1:8000/products")
      .then((response) => {
        if (!response.ok) {
          throw new Error("Failed to load products");
        }
        return response.json();
      })
      .then((data) => setProducts(data))
      .catch((error) => {
        console.error("Error fetching products:", error);
      });
  }, []);

  // Save the cart whenever it changes.
  useEffect(() => {
    localStorage.setItem("recomai-cart", JSON.stringify(cart));
  }, [cart]);

  // Scroll to the checkout section after it becomes visible.
  useEffect(() => {
    if (isCheckoutOpen) {
      requestAnimationFrame(() => {
        document.querySelector(".checkout-section")?.scrollIntoView({
          behavior: "smooth",
          block: "start",
        });
      });
    }
  }, [isCheckoutOpen]);

  // Get AI-powered product recommendations.
  const handleRecommendations = async (productId) => {
    setLoadingRecommendations(true);

    try {
      const response = await fetch(
        `http://127.0.0.1:8000/recommendations/${productId}`
      );

      if (!response.ok) {
        throw new Error("Failed to fetch recommendations");
      }

      const data = await response.json();
      setSelectedProduct(data);
    } catch (error) {
      console.error("Error fetching recommendations:", error);
    } finally {
      setLoadingRecommendations(false);
    }
  };

  // Add a product or increase its quantity.
  const handleAddToCart = (product) => {
    setCart((previousCart) => {
      const existingProduct = previousCart.find(
        (item) => item.id === product.id
      );

      if (existingProduct) {
        return previousCart.map((item) =>
          item.id === product.id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      }

      return [...previousCart, { ...product, quantity: 1 }];
    });
  };

  // Increase product quantity.
  const handleIncreaseQuantity = (productId) => {
    setCart((previousCart) =>
      previousCart.map((item) =>
        item.id === productId
          ? { ...item, quantity: item.quantity + 1 }
          : item
      )
    );
  };

  // Decrease quantity and remove the product when quantity reaches zero.
  const handleDecreaseQuantity = (productId) => {
    setCart((previousCart) =>
      previousCart
        .map((item) =>
          item.id === productId
            ? { ...item, quantity: item.quantity - 1 }
            : item
        )
        .filter((item) => item.quantity > 0)
    );
  };

  // Remove a product completely.
  const handleRemoveFromCart = (productId) => {
    setCart((previousCart) =>
      previousCart.filter((item) => item.id !== productId)
    );
  };

  // Total number of units in the cart.
  const cartCount = cart.reduce(
    (total, item) => total + item.quantity,
    0
  );

  // Total order value.
  const cartTotal = cart.reduce(
    (total, item) =>
      total + Number(item.price) * item.quantity,
    0
  );

  // Return the correct product image.
  const getProductImage = (name) => {
    if (name.includes("Nike")) return "/images/nike-shoes.jpg";
    if (name.includes("Adidas")) return "/images/adidas-shoes.jpg";
    if (name.includes("Puma")) return "/images/puma-shoes.jpg";
    if (name.includes("Samsung")) return "/images/samsung-headphones.jpg";
    return "/images/sony-headphones.jpg";
  };

  // Close checkout and return to the product store.
  const handleContinueShopping = () => {
    setIsCheckoutOpen(false);
    setIsCartOpen(false);

    requestAnimationFrame(() => {
      document.querySelector(".products-section")?.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
    });
  };

  return (
    <div className="app">
      {/* Navigation */}
      <header className="navbar">
        <h1 className="logo">
          Recom<span>AI</span>
        </h1>

        <input
          type="text"
          placeholder="Search products..."
          value={search}
          onChange={(event) => setSearch(event.target.value)}
        />

        <button
          className="cart-button"
          onClick={() => {
            setIsCheckoutOpen(false);
            setIsCartOpen((previous) => !previous);
          }}
        >
          🛒 Cart ({cartCount})
        </button>
      </header>

      {/* Shopping Cart */}
      {isCartOpen && (
        <section className="cart-panel">
          <div className="cart-panel-header">
            <h2>Your Shopping Cart</h2>

            <div className="cart-header-actions">
              {cart.length > 0 && (
                <button
                  className="clear-cart-button"
                  onClick={() => setCart([])}
                >
                  Clear Cart
                </button>
              )}

              <button
                className="cart-close-button"
                onClick={() => setIsCartOpen(false)}
                aria-label="Close shopping cart"
              >
                ✕
              </button>
            </div>
          </div>

          {cart.length === 0 ? (
            <p className="empty-cart">Your cart is empty.</p>
          ) : (
            <>
              <div className="cart-items">
                {cart.map((item) => (
                  <div className="cart-item" key={item.id}>
                    <img
                      className="cart-item-image"
                      src={getProductImage(item.name)}
                      alt={item.name}
                    />

                    <div className="cart-item-info">
                      <h3>{item.name}</h3>

                      <p>
                        ₹{Number(item.price).toLocaleString("en-IN")} each
                      </p>

                      <div className="quantity-controls">
                        <button
                          onClick={() =>
                            handleDecreaseQuantity(item.id)
                          }
                          aria-label={`Decrease ${item.name} quantity`}
                        >
                          −
                        </button>

                        <span>{item.quantity}</span>

                        <button
                          onClick={() =>
                            handleIncreaseQuantity(item.id)
                          }
                          aria-label={`Increase ${item.name} quantity`}
                        >
                          +
                        </button>

                        <button
                          className="remove-item-button"
                          onClick={() =>
                            handleRemoveFromCart(item.id)
                          }
                        >
                          Remove
                        </button>
                      </div>
                    </div>

                    <strong>
                      ₹
                      {(
                        Number(item.price) * item.quantity
                      ).toLocaleString("en-IN")}
                    </strong>
                  </div>
                ))}
              </div>

              <div className="cart-total">
                <span>Total</span>
                <strong>
                  ₹{cartTotal.toLocaleString("en-IN")}
                </strong>
              </div>

              <button
                className="checkout-button"
                onClick={() => {
                  setIsCartOpen(false);
                  setIsCheckoutOpen(true);
                }}
              >
                Proceed to Checkout →
              </button>

              <button
                className="continue-shopping-button"
                onClick={handleContinueShopping}
              >
                ← Continue Shopping
              </button>
            </>
          )}
        </section>
      )}

      {/* Main Store */}
      <main>
        <section className="hero">
          <p className="tagline">SMART SHOPPING STARTS HERE</p>

          <h2>
            Discover Products
            <br />
            <span>Made for You.</span>
          </h2>

          <p className="hero-description">
            Explore products and discover recommendations
            tailored to your interests.
          </p>

          <button
            className="explore-button"
            onClick={() => {
              document.querySelector(".products-section")?.scrollIntoView({
                behavior: "smooth",
                block: "start",
              });
            }}
          >
            Explore Products ↓
          </button>
        </section>

        <section className="products-section">
          <div className="section-heading">
            <div>
              <p className="tagline">YOUR NEXT FAVORITE</p>
              <h2>Explore Products</h2>
            </div>

            <span className="product-count">Product Store</span>
          </div>

          {products.length > 0 ? (
            <div className="products-grid">
              {products
                .filter((product) =>
                  product.name
                    .toLowerCase()
                    .includes(search.toLowerCase())
                )
                .map((product) => (
                  <div className="product-card" key={product.id}>
                    <div className="product-image">
                      <img
                        src={getProductImage(product.name)}
                        alt={product.name}
                      />
                    </div>

                    <p className="product-category">
                      {product.category}
                    </p>

                    <h3>{product.name}</h3>
                    <p>{product.description}</p>

                    <div className="product-bottom">
                      <span className="product-price">
                        ₹
                        {Number(product.price).toLocaleString("en-IN")}
                      </span>

                      <button
                        className="cart-button"
                        onClick={() => handleAddToCart(product)}
                      >
                        Add to Cart
                      </button>
                    </div>

                    <button
                      className="recommend-button"
                      onClick={() =>
                        handleRecommendations(product.id)
                      }
                      disabled={loadingRecommendations}
                    >
                      {loadingRecommendations
                        ? "⏳ Finding Recommendations..."
                        : "✨ AI Recommendations"}
                    </button>
                  </div>
                ))}
            </div>
          ) : (
            <div className="loading-card">
              <div className="loading-icon">✦</div>
              <h3>Loading your products...</h3>
              <p>Connecting to your product catalogue.</p>
            </div>
          )}

          {products.length > 0 &&
            products.filter((product) =>
              product.name.toLowerCase().includes(search.toLowerCase())
            ).length === 0 && (
              <div className="loading-card">
                <h3>No products found</h3>
                <p>Try searching with a different product name.</p>
              </div>
            )}
        </section>

        {/* AI Recommendations */}
        {selectedProduct && (
          <section className="recommendations-section">
            <p className="tagline">POWERED BY AI</p>

            <h2>
              Similar Products for {selectedProduct.product}
            </h2>

            <div className="products-grid">
              {selectedProduct.recommendations.map((item) => (
                <div className="product-card" key={item.id}>
                  <div className="product-image">
                    <img
                      src={getProductImage(item.name)}
                      alt={item.name}
                    />
                  </div>

                  <p className="product-category">
                    {item.category}
                  </p>

                  <h3>{item.name}</h3>

                  <p>
                    AI similarity score: {item.similarity}
                  </p>

                  <span className="product-price">
                    ₹{Number(item.price).toLocaleString("en-IN")}
                  </span>

                  <button
                    className="cart-button"
                    onClick={() => handleAddToCart(item)}
                  >
                    Add to Cart
                  </button>
                </div>
              ))}
            </div>
          </section>
        )}
      </main>

      {/* Checkout Summary */}
      {isCheckoutOpen && (
        <section className="checkout-section">
          <div className="checkout-header">
            <h2>Checkout</h2>
            <p>Review your order before confirming.</p>
          </div>

          {cart.length === 0 ? (
            <div className="checkout-empty">
              <h3>Your cart is empty</h3>

              <button
                className="continue-shopping-button"
                onClick={handleContinueShopping}
              >
                Back to Store
              </button>
            </div>
          ) : (
            <>
              <div className="checkout-items">
                {cart.map((item) => (
                  <div className="checkout-item" key={item.id}>
                    <div>
                      <h3>{item.name}</h3>
                      <p>Quantity: {item.quantity}</p>
                      <p>
                        ₹{Number(item.price).toLocaleString("en-IN")} each
                      </p>
                    </div>

                    <strong>
                      ₹
                      {(
                        Number(item.price) * item.quantity
                      ).toLocaleString("en-IN")}
                    </strong>
                  </div>
                ))}
              </div>

              <div className="checkout-total">
                <span>Order Total</span>
                <strong>
                  ₹{cartTotal.toLocaleString("en-IN")}
                </strong>
              </div>

              <p className="checkout-demo-note">
                Demo checkout only. No payment will be collected.
              </p>

              <div className="checkout-actions">
                <button
                  className="continue-shopping-button"
                  onClick={() => {
                    setIsCheckoutOpen(false);
                    setIsCartOpen(true);
                  }}
                >
                  ← Back to Cart
                </button>

                <button
                  className="continue-shopping-button"
                  onClick={handleContinueShopping}
                >
                  Continue Shopping
                </button>
              </div>
            </>
          )}
        </section>
      )}

      {/* Footer */}
      <footer>
        <p>RecomAI — Smarter Shopping, Better Discoveries.</p>
      </footer>
    </div>
  );
}

export default App;
