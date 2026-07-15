import { useMemo, useState, type ChangeEvent, type FormEvent } from 'react'
import './App.css'

type View = 'login' | 'shop' | 'checkout' | 'success'

type Product = {
  id: string
  name: string
  price: number
  rating: number
  category: string
  description: string
  badge: string
}

type CartItem = Product & {
  quantity: number
}

type FormState = {
  name: string
  email: string
  address: string
  city: string
  zip: string
  card: string
  notes: string
}

const products: Product[] = [
  {
    id: 'aurora-headphones',
    name: 'Aurora Noise-Canceling Headphones',
    price: 249,
    rating: 4.9,
    category: 'Audio',
    description: 'Immersive sound with 40-hour battery life and adaptive noise control.',
    badge: 'Bestseller',
  },
  {
    id: 'lumen-watch',
    name: 'Lumen Smart Watch',
    price: 189,
    rating: 4.8,
    category: 'Wearables',
    description: 'A sapphire display, heart-rate tracking, and all-day fitness insights.',
    badge: 'New arrival',
  },
  {
    id: 'nova-laptop',
    name: 'Nova 14" Pro Laptop',
    price: 1299,
    rating: 5,
    category: 'Computing',
    description: 'Ultra-light workstation with a 120Hz display and AI-ready performance.',
    badge: 'Pro pick',
  },
  {
    id: 'atlas-speaker',
    name: 'Atlas Wireless Speaker',
    price: 149,
    rating: 4.7,
    category: 'Audio',
    description: 'Deep bass and room-filling sound with a premium fabric finish.',
    badge: 'Limited stock',
  },
  {
    id: 'terra-bag',
    name: 'Terra Travel Backpack',
    price: 119,
    rating: 4.6,
    category: 'Lifestyle',
    description: 'Weather-resistant carry-on with modular organization for daily travel.',
    badge: 'Editor’s choice',
  },
]

const initialForm: FormState = {
  name: '',
  email: '',
  address: '',
  city: '',
  zip: '',
  card: '',
  notes: '',
}

function formatCurrency(value: number) {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    maximumFractionDigits: 0,
  }).format(value)
}

function App() {
  const [view, setView] = useState<View>('login')
  const [loginData, setLoginData] = useState({ email: '', password: '' })
  const [error, setError] = useState('')
  const [cart, setCart] = useState<CartItem[]>([])
  const [formData, setFormData] = useState<FormState>(initialForm)
  const [orderId, setOrderId] = useState('')

  const cartCount = useMemo(() => cart.reduce((sum, item) => sum + item.quantity, 0), [cart])
  const subtotal = useMemo(() => cart.reduce((sum, item) => sum + item.price * item.quantity, 0), [cart])
  const shipping = cart.length > 0 ? 12.5 : 0
  const total = subtotal + shipping

  const addToCart = (product: Product) => {
    setCart((current) => {
      const existing = current.find((item) => item.id === product.id)
      if (existing) {
        return current.map((item) =>
          item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item,
        )
      }

      return [...current, { ...product, quantity: 1 }]
    })
  }

  const updateQuantity = (id: string, change: number) => {
    setCart((current) =>
      current
        .map((item) => (item.id === id ? { ...item, quantity: item.quantity + change } : item))
        .filter((item) => item.quantity > 0),
    )
  }

  const handleInputChange = (event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = event.target
    const fieldName = name as keyof FormState
    setFormData((current) => ({ ...current, [fieldName]: value }))
  }

  const handleLogin = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()

    if (loginData.email === 'ankit@gmail.com' && loginData.password === 'ankit123') {
      setError('')
      setFormData((current) => ({ ...current, email: loginData.email }))
      setView('shop')
      return
    }

    setError('Please use the demo credentials shown below.')
  }

  const handleCheckout = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    if (cart.length === 0) {
      return
    }

    const generatedOrderId = `AK-${Math.floor(100000 + Math.random() * 900000)}`
    setOrderId(generatedOrderId)
    setCart([])
    setFormData(initialForm)
    setView('success')
  }

  const handleGoToCheckout = () => {
    if (cart.length > 0) {
      setView('checkout')
    }
  }

  const handleBackToShop = () => {
    setView('shop')
  }

  const handleLogout = () => {
    setView('login')
    setLoginData({ email: '', password: '' })
    setError('')
    setCart([])
    setFormData(initialForm)
    setOrderId('')
  }

  return (
    <div className="app-shell">
      {view === 'login' && (
        <div className="auth-shell">
          <div className="auth-card">
            <p className="eyebrow">Secure sign in</p>
            <h1>Welcome back to Ankit_Pandey_Demo_Ecommerce.com</h1>
            <p className="hero-text">
              Use the demo credentials below to access the shopping experience and complete a realistic purchase flow.
            </p>
            <div className="credential-box">
              <span>Email: ankit@gmail.com</span>
              <span>Password: ankit123</span>
            </div>
            <form onSubmit={handleLogin} className="login-form">
              <label>
                Email
                <input
                  type="email"
                  value={loginData.email}
                  onChange={(event) => setLoginData((current) => ({ ...current, email: event.target.value }))}
                  required
                />
              </label>
              <label>
                Password
                <input
                  type="password"
                  value={loginData.password}
                  onChange={(event) => setLoginData((current) => ({ ...current, password: event.target.value }))}
                  required
                />
              </label>
              {error && <p className="error-text">{error}</p>}
              <button type="submit" className="primary-btn full-width">
                Sign in
              </button>
            </form>
          </div>
        </div>
      )}

      {view !== 'login' && (
        <>
          <header className="topbar">
            <div className="brand-block">
              <span className="brand-mark">AP</span>
              <div>
                <strong>Ankit_Pandey_Demo_Ecommerce.com</strong>
                <p>Premium essentials for work and life</p>
              </div>
            </div>
            <div className="topbar-actions">
              <button type="button" className="ghost-btn" onClick={() => setView('shop')}>
                Shop
              </button>
              <button type="button" className="ghost-btn" onClick={handleGoToCheckout} disabled={cart.length === 0}>
                Checkout
              </button>
              <button type="button" className="ghost-btn" onClick={handleLogout}>
                Logout
              </button>
            </div>
          </header>

          <section className="hero-panel">
            <div className="hero-copy">
              <p className="eyebrow">Curated for modern buyers</p>
              <h1 data-testid="page-title">A polished commerce experience built for realistic Playwright testing.</h1>
              <p className="hero-text">
                Sign in, browse five premium products, add them to your basket, and finish a full checkout journey.
              </p>
              <div className="hero-actions">
                <button type="button" className="primary-btn" onClick={() => setView('shop')}>
                  Browse products
                </button>
                <span className="secondary-pill">Free shipping over $150</span>
              </div>
            </div>

            <div className="hero-stats">
              <div>
                <strong>5</strong>
                <span>Curated products</span>
              </div>
              <div>
                <strong>24/7</strong>
                <span>Support coverage</span>
              </div>
              <div>
                <strong>4.9/5</strong>
                <span>Average rating</span>
              </div>
            </div>
          </section>

          {view === 'shop' && (
            <main className="content-grid">
              <section className="catalog-panel" id="products">
                <div className="section-heading">
                  <div>
                    <p className="eyebrow">Featured products</p>
                    <h2>Modern essentials for work and play</h2>
                  </div>
                  <p className="muted">Each item includes a realistic product card, pricing, and a clear action for automation practice.</p>
                </div>

                <div className="products-grid">
                  {products.map((product) => (
                    <article className="product-card" key={product.id} data-testid={`product-${product.id}`}>
                      <div className="product-top">
                        <span className="product-badge">{product.badge}</span>
                        <span className="product-category">{product.category}</span>
                      </div>
                      <h3>{product.name}</h3>
                      <p>{product.description}</p>
                      <div className="product-meta">
                        <span>{product.rating.toFixed(1)} ★</span>
                        <strong>{formatCurrency(product.price)}</strong>
                      </div>
                      <button type="button" className="secondary-btn" onClick={() => addToCart(product)} data-testid={`add-${product.id}`}>
                        Add to cart
                      </button>
                    </article>
                  ))}
                </div>
              </section>

              <aside className="sidebar">
                <section className="info-card cart-card">
                  <div className="card-title-row">
                    <h3>Shopping cart</h3>
                    <span className="cart-pill" data-testid="cart-count">
                      {cartCount}
                    </span>
                  </div>

                  {cart.length === 0 ? (
                    <p className="empty-cart">Your basket is ready for a few premium picks.</p>
                  ) : (
                    <div className="cart-items">
                      {cart.map((item) => (
                        <div className="cart-item" key={item.id}>
                          <div>
                            <strong>{item.name}</strong>
                            <p>{formatCurrency(item.price)} each</p>
                          </div>
                          <div className="quantity-controls">
                            <button type="button" onClick={() => updateQuantity(item.id, -1)}>
                              −
                            </button>
                            <span>{item.quantity}</span>
                            <button type="button" onClick={() => updateQuantity(item.id, 1)}>
                              +
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}

                  <div className="totals">
                    <div>
                      <span>Subtotal</span>
                      <strong>{formatCurrency(subtotal)}</strong>
                    </div>
                    <div>
                      <span>Shipping</span>
                      <strong>{formatCurrency(shipping)}</strong>
                    </div>
                    <div className="grand-total">
                      <span>Total</span>
                      <strong>{formatCurrency(total)}</strong>
                    </div>
                  </div>
                  <button type="button" className="primary-btn full-width" onClick={handleGoToCheckout} disabled={cart.length === 0}>
                    Proceed to checkout
                  </button>
                </section>

                <section className="info-card support-card">
                  <h3>Why this flow works well for Playwright</h3>
                  <ul>
                    <li>Clear buttons, labels, and states</li>
                    <li>Realistic cart and checkout behavior</li>
                    <li>Success state after a completed order</li>
                  </ul>
                </section>
              </aside>
            </main>
          )}

          {view === 'checkout' && (
            <main className="checkout-view">
              <section className="checkout-panel">
                <div className="section-heading compact">
                  <div>
                    <p className="eyebrow">Checkout</p>
                    <h2>Securely place your order</h2>
                  </div>
                  <button type="button" className="secondary-btn" onClick={handleBackToShop}>
                    Back to shop
                  </button>
                </div>
                <form onSubmit={handleCheckout} data-testid="checkout-form">
                  <label>
                    Full name
                    <input name="name" value={formData.name} onChange={handleInputChange} required />
                  </label>
                  <label>
                    Email
                    <input type="email" name="email" value={formData.email} onChange={handleInputChange} required />
                  </label>
                  <label>
                    Address
                    <input name="address" value={formData.address} onChange={handleInputChange} required />
                  </label>
                  <div className="inline-fields">
                    <label>
                      City
                      <input name="city" value={formData.city} onChange={handleInputChange} required />
                    </label>
                    <label>
                      ZIP
                      <input name="zip" value={formData.zip} onChange={handleInputChange} required />
                    </label>
                  </div>
                  <label>
                    Card number
                    <input name="card" value={formData.card} onChange={handleInputChange} placeholder="4242 4242 4242 4242" required />
                  </label>
                  <label>
                    Delivery notes
                    <textarea name="notes" value={formData.notes} onChange={handleInputChange} rows={3} />
                  </label>
                  <button type="submit" className="primary-btn full-width">
                    Place order
                  </button>
                </form>
              </section>

              <aside className="checkout-summary">
                <h3>Order summary</h3>
                <div className="totals">
                  <div>
                    <span>Subtotal</span>
                    <strong>{formatCurrency(subtotal)}</strong>
                  </div>
                  <div>
                    <span>Shipping</span>
                    <strong>{formatCurrency(shipping)}</strong>
                  </div>
                  <div className="grand-total">
                    <span>Total</span>
                    <strong>{formatCurrency(total)}</strong>
                  </div>
                </div>
                <div className="cart-items">
                  {cart.map((item) => (
                    <div className="cart-item" key={item.id}>
                      <div>
                        <strong>{item.name}</strong>
                        <p>{item.quantity} × {formatCurrency(item.price)}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </aside>
            </main>
          )}

          {view === 'success' && (
            <main className="success-view">
              <section className="info-card success-card" data-testid="order-success">
                <p className="eyebrow">Order confirmed</p>
                <h3>Thanks, {formData.name || 'friend'}!</h3>
                <p>
                  Your order <strong>#{orderId}</strong> is being prepared for dispatch and will arrive in 2 business days.
                </p>
                <ul>
                  <li>Tracking updates will be sent to {formData.email || 'your inbox'}.</li>
                  <li>Delivery notes: {formData.notes || 'No special instructions provided.'}</li>
                  <li>Payment method: Visa ending in 4242.</li>
                </ul>
                <button type="button" className="primary-btn" onClick={() => setView('shop')}>
                  Continue shopping
                </button>
              </section>
            </main>
          )}
        </>
      )}
    </div>
  )
}

export default App
