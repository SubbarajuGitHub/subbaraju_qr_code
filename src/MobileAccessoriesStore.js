
import React, { useState, useEffect } from 'react';
import { ShoppingCart, Search, Filter, Minus, Plus, X, Tag, Package, Smartphone, Battery, Headphones, Cable, Shield } from 'lucide-react';

// Mock data for products
const products = [
  { id: 1, name: 'iPhone Lightning Cable', category: 'cables', price: 25, image: '📱', description: 'Original lightning cable for iPhone' },
  { id: 2, name: 'Samsung Fast Charger', category: 'chargers', price: 35, image: '🔌', description: '25W fast charging adapter' },
  { id: 3, name: 'Wireless Earbuds', category: 'accessories', price: 120, image: '🎧', description: 'Bluetooth 5.0 wireless earbuds' },
  { id: 4, name: 'Phone Case - Clear', category: 'accessories', price: 15, image: '📱', description: 'Transparent protective case' },
  { id: 5, name: 'USB-C Cable 2m', category: 'cables', price: 20, image: '🔌', description: 'High-speed USB-C charging cable' },
  { id: 6, name: 'Wireless Charger Pad', category: 'chargers', price: 45, image: '⚡', description: '15W wireless charging pad' },
  { id: 7, name: 'Screen Protector', category: 'accessories', price: 12, image: '🛡️', description: 'Tempered glass screen protector' },
  { id: 8, name: 'Car Charger Dual USB', category: 'chargers', price: 28, image: '🚗', description: 'Dual port car charger' },
  { id: 9, name: 'Micro USB Cable', category: 'cables', price: 18, image: '🔌', description: 'Durable micro USB cable' },
  { id: 10, name: 'Phone Stand', category: 'accessories', price: 22, image: '📱', description: 'Adjustable phone stand' },
  { id: 11, name: 'Power Bank 10000mAh', category: 'accessories', price: 55, image: '🔋', description: 'Portable power bank' },
  { id: 12, name: 'Lightning to USB-C Cable', category: 'cables', price: 30, image: '🔌', description: 'Lightning to USB-C adapter cable' }
];

const categories = [
  { id: 'all', name: 'All Items', icon: Package, count: products.length },
  { id: 'accessories', name: 'Mobile Accessories', icon: Smartphone, count: products.filter(p => p.category === 'accessories').length },
  { id: 'cables', name: 'Cables', icon: Cable, count: products.filter(p => p.category === 'cables').length },
  { id: 'chargers', name: 'Chargers', icon: Battery, count: products.filter(p => p.category === 'chargers').length }
];

const coupons = {
  'SAVE10': { discount: 10, type: 'percentage' },
  'FLAT20': { discount: 20, type: 'fixed' },
  'WELCOME15': { discount: 15, type: 'percentage' }
};

export default function MobileAccessoriesStore() {
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [cart, setCart] = useState([]);
  const [showCart, setShowCart] = useState(false);
  const [couponCode, setCouponCode] = useState('');
  const [appliedCoupon, setAppliedCoupon] = useState(null);
  const [showCheckout, setShowCheckout] = useState(false);
  const [sortBy, setSortBy] = useState('name');
  const [priceRange, setPriceRange] = useState([0, 200]);

  // Filter products based on category, search term, and price range
  const filteredProducts = products.filter(product => {
    const matchesCategory = selectedCategory === 'all' || product.category === selectedCategory;
    const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesPrice = product.price >= priceRange[0] && product.price <= priceRange[1];
    return matchesCategory && matchesSearch && matchesPrice;
  });

  // Sort products
  const sortedProducts = [...filteredProducts].sort((a, b) => {
    switch (sortBy) {
      case 'price-low':
        return a.price - b.price;
      case 'price-high':
        return b.price - a.price;
      case 'name':
      default:
        return a.name.localeCompare(b.name);
    }
  });

  const addToCart = (product) => {
    setCart(prevCart => {
      const existingItem = prevCart.find(item => item.id === product.id);
      if (existingItem) {
        return prevCart.map(item =>
          item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item
        );
      }
      return [...prevCart, { ...product, quantity: 1 }];
    });
  };

  const updateQuantity = (id, change) => {
    setCart(prevCart => {
      return prevCart.map(item => {
        if (item.id === id) {
          const newQuantity = item.quantity + change;
          return newQuantity > 0 ? { ...item, quantity: newQuantity } : null;
        }
        return item;
      }).filter(Boolean);
    });
  };

  const removeFromCart = (id) => {
    setCart(prevCart => prevCart.filter(item => item.id !== id));
  };

  const applyCoupon = () => {
    const coupon = coupons[couponCode.toUpperCase()];
    if (coupon) {
      setAppliedCoupon({ code: couponCode.toUpperCase(), ...coupon });
      alert(`Coupon applied! You saved ${coupon.type === 'percentage' ? coupon.discount + '%' : '$' + coupon.discount}`);
    } else {
      alert('Invalid coupon code');
    }
  };

  const calculateTotal = () => {
    const subtotal = cart.reduce((total, item) => total + (item.price * item.quantity), 0);
    let discount = 0;
    
    if (appliedCoupon) {
      discount = appliedCoupon.type === 'percentage' 
        ? (subtotal * appliedCoupon.discount) / 100
        : appliedCoupon.discount;
    }
    
    return {
      subtotal: subtotal.toFixed(2),
      discount: discount.toFixed(2),
      total: (subtotal - discount).toFixed(2)
    };
  };

  const placeOrder = () => {
    const orderData = {
      items: cart,
      total: calculateTotal().total,
      coupon: appliedCoupon,
      paymentMethod: 'Cash on Delivery',
      timestamp: new Date().toISOString()
    };
    
    // In a real app, you would send this to your backend API
    console.log('Order placed:', orderData);
    alert('Order placed successfully! You will receive your items with Cash on Delivery.');
    
    // Reset cart and states
    setCart([]);
    setAppliedCoupon(null);
    setCouponCode('');
    setShowCart(false);
    setShowCheckout(false);
  };

  const cartItemsCount = cart.reduce((total, item) => total + item.quantity, 0);
  const totals = calculateTotal();

  return (
    <>
      <style>{`
        /* Global Styles */
        * {
          margin: 0;
          padding: 0;
          box-sizing: border-box;
        }

        .app-container {
          min-height: 100vh;
          background-color: #f9fafb;
        }

        /* Header Styles */
        .header {
          background-color: white;
          box-shadow: 0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06);
          border-bottom: 1px solid #e5e7eb;
        }

        .header-content {
          max-width: 80rem;
          margin: 0 auto;
          padding: 0 1rem;
        }

        @media (min-width: 640px) {
          .header-content {
            padding: 0 1.5rem;
          }
        }

        @media (min-width: 1024px) {
          .header-content {
            padding: 0 2rem;
          }
        }

        .header-main {
          display: flex;
          align-items: center;
          justify-content: space-between;
          height: 4rem;
        }

        .logo-section {
          display: flex;
          align-items: center;
        }

        .logo-icon {
          height: 2rem;
          width: 2rem;
          color: #2563eb;
        }

        .logo-text {
          margin-left: 0.5rem;
          font-size: 1.25rem;
          font-weight: 700;
          color: #111827;
        }

        .search-container {
          flex: 1;
          max-width: 28rem;
          margin: 0 2rem;
        }

        .search-wrapper {
          position: relative;
        }

        .search-icon {
          position: absolute;
          left: 0.75rem;
          top: 50%;
          transform: translateY(-50%);
          color: #9ca3af;
          height: 1rem;
          width: 1rem;
        }

        .search-input {
          width: 100%;
          padding: 0.5rem 1rem 0.5rem 2.5rem;
          border: 1px solid #d1d5db;
          border-radius: 0.5rem;
          outline: none;
          transition: all 0.15s ease-in-out;
        }

        .search-input:focus {
          border-color: transparent;
          box-shadow: 0 0 0 2px #2563eb;
        }

        .cart-button {
          position: relative;
          padding: 0.5rem;
          color: #4b5563;
          background: none;
          border: none;
          cursor: pointer;
          border-radius: 0.25rem;
          transition: color 0.15s ease-in-out;
        }

        .cart-button:hover {
          color: #111827;
        }

        .cart-icon {
          height: 1.5rem;
          width: 1.5rem;
        }

        .cart-badge {
          position: absolute;
          top: -0.25rem;
          right: -0.25rem;
          background-color: #ef4444;
          color: white;
          font-size: 0.75rem;
          border-radius: 9999px;
          height: 1.25rem;
          width: 1.25rem;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        /* Main Container */
        .main-container {
          max-width: 80rem;
          margin: 0 auto;
          padding: 2rem 1rem;
        }

        @media (min-width: 640px) {
          .main-container {
            padding: 2rem 1.5rem;
          }
        }

        @media (min-width: 1024px) {
          .main-container {
            padding: 2rem;
          }
        }

        .content-wrapper {
          display: flex;
          gap: 2rem;
        }

        /* Sidebar Styles */
        .sidebar {
          width: 16rem;
          flex-shrink: 0;
        }

        .sidebar-content {
          background-color: white;
          border-radius: 0.5rem;
          box-shadow: 0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06);
          padding: 1.5rem;
        }

        .sidebar-title {
          font-size: 1.125rem;
          font-weight: 600;
          color: #111827;
          margin-bottom: 1rem;
        }

        .categories-list {
          display: flex;
          flex-direction: column;
          gap: 0.5rem;
        }

        .category-button {
          width: 100%;
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 0.75rem;
          border-radius: 0.5rem;
          text-align: left;
          background: none;
          border: 1px solid transparent;
          cursor: pointer;
          transition: all 0.15s ease-in-out;
          color: #374151;
        }

        .category-button:hover {
          background-color: #f9fafb;
        }

        .category-button-active {
          background-color: #eff6ff;
          color: #1d4ed8;
          border-color: #bfdbfe;
        }

        .category-content {
          display: flex;
          align-items: center;
        }

        .category-icon {
          height: 1rem;
          width: 1rem;
          margin-right: 0.75rem;
        }

        .category-name {
          font-size: 0.875rem;
          font-weight: 500;
        }

        .category-count {
          font-size: 0.75rem;
          background-color: #e5e7eb;
          color: #4b5563;
          padding: 0.25rem 0.5rem;
          border-radius: 9999px;
        }

        /* Filters */
        .filters-section {
          margin-top: 2rem;
        }

        .filters-title {
          font-size: 1rem;
          font-weight: 600;
          color: #111827;
          margin-bottom: 1rem;
          display: flex;
          align-items: center;
        }

        .filters-icon {
          height: 1rem;
          width: 1rem;
          margin-right: 0.5rem;
        }

        .filter-group {
          margin-bottom: 1.5rem;
        }

        .filter-label {
          display: block;
          font-size: 0.875rem;
          font-weight: 500;
          color: #374151;
          margin-bottom: 0.5rem;
        }

        .sort-select {
          width: 100%;
          padding: 0.5rem;
          border: 1px solid #d1d5db;
          border-radius: 0.375rem;
          outline: none;
          transition: all 0.15s ease-in-out;
        }

        .sort-select:focus {
          box-shadow: 0 0 0 2px #2563eb;
          border-color: transparent;
        }

        .price-range-container {
          display: flex;
          flex-direction: column;
          gap: 0.5rem;
        }

        .price-range {
          width: 100%;
        }

        /* Main Content */
        .main-content {
          flex: 1;
        }

        .content-header {
          margin-bottom: 1.5rem;
        }

        .content-title {
          font-size: 1.5rem;
          font-weight: 700;
          color: #111827;
        }

        .products-count {
          color: #4b5563;
          margin-top: 0.25rem;
        }

        /* Product Grid */
        .products-grid {
          display: grid;
          grid-template-columns: 1fr;
          gap: 1.5rem;
        }

        @media (min-width: 768px) {
          .products-grid {
            grid-template-columns: repeat(2, 1fr);
          }
        }

        @media (min-width: 1024px) {
          .products-grid {
            grid-template-columns: repeat(3, 1fr);
          }
        }

        .product-card {
          background-color: white;
          border-radius: 0.5rem;
          box-shadow: 0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06);
          border: 1px solid #e5e7eb;
          transition: box-shadow 0.15s ease-in-out;
        }

        .product-card:hover {
          box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
        }

        .product-content {
          padding: 1.5rem;
        }

        .product-image {
          font-size: 2.25rem;
          margin-bottom: 1rem;
          text-align: center;
        }

        .product-name {
          font-size: 1.125rem;
          font-weight: 600;
          color: #111827;
          margin-bottom: 0.5rem;
        }

        .product-description {
          color: #4b5563;
          font-size: 0.875rem;
          margin-bottom: 1rem;
        }

        .product-footer {
          display: flex;
          align-items: center;
          justify-content: space-between;
        }

        .product-price {
          font-size: 1.25rem;
          font-weight: 700;
          color: #2563eb;
        }

        .add-to-cart-btn {
          background-color: #2563eb;
          color: white;
          padding: 0.5rem 1rem;
          border-radius: 0.5rem;
          border: none;
          cursor: pointer;
          transition: background-color 0.15s ease-in-out;
          display: flex;
          align-items: center;
          gap: 0.5rem;
        }

        .add-to-cart-btn:hover {
          background-color: #1d4ed8;
        }

        .btn-icon {
          height: 1rem;
          width: 1rem;
        }

        /* No Products */
        .no-products {
          text-align: center;
          padding: 3rem 0;
        }

        .no-products-icon {
          height: 3rem;
          width: 3rem;
          color: #9ca3af;
          margin: 0 auto 1rem;
        }

        .no-products-title {
          font-size: 1.125rem;
          font-weight: 500;
          color: #111827;
          margin-bottom: 0.5rem;
        }

        .no-products-text {
          color: #4b5563;
        }

        /* Cart Overlay */
        .cart-overlay {
          position: fixed;
          inset: 0;
          z-index: 50;
          overflow: hidden;
        }

        .cart-backdrop {
          position: absolute;
          inset: 0;
          background-color: rgba(0, 0, 0, 0.5);
        }

        .cart-sidebar {
          position: absolute;
          right: 0;
          top: 0;
          height: 100%;
          width: 24rem;
          background-color: white;
          box-shadow: -10px 0 25px -5px rgba(0, 0, 0, 0.1), -8px 0 10px -6px rgba(0, 0, 0, 0.1);
          display: flex;
          flex-direction: column;
        }

        .cart-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 1rem;
          border-bottom: 1px solid #e5e7eb;
        }

        .cart-title {
          font-size: 1.125rem;
          font-weight: 600;
        }

        .cart-close {
          padding: 0.25rem;
          background: none;
          border: none;
          cursor: pointer;
          border-radius: 0.25rem;
          transition: background-color 0.15s ease-in-out;
        }

        .cart-close:hover {
          background-color: #f3f4f6;
        }

        .close-icon {
          height: 1.25rem;
          width: 1.25rem;
        }

        .cart-content {
          flex: 1;
          overflow-y: auto;
          padding: 1rem;
        }

        .empty-cart {
          text-align: center;
          padding: 2rem 0;
        }

        .empty-cart-icon {
          height: 3rem;
          width: 3rem;
          color: #9ca3af;
          margin: 0 auto 1rem;
        }

        .empty-cart-text {
          color: #4b5563;
        }

        .cart-items-container {
          display: flex;
          flex-direction: column;
          gap: 1rem;
        }

        .cart-item {
          display: flex;
          align-items: center;
          gap: 0.75rem;
          padding: 0.75rem;
          border: 1px solid #e5e7eb;
          border-radius: 0.5rem;
        }

        .cart-item-image {
          font-size: 1.5rem;
        }

        .cart-item-details {
          flex: 1;
        }

        .cart-item-name {
          font-weight: 500;
          font-size: 0.875rem;
        }

        .cart-item-price {
          color: #2563eb;
          font-weight: 600;
        }

        .cart-item-controls {
          display: flex;
          align-items: center;
          gap: 0.5rem;
        }

        .quantity-btn {
          padding: 0.25rem;
          background: none;
          border: none;
          cursor: pointer;
          border-radius: 0.25rem;
          transition: background-color 0.15s ease-in-out;
        }

        .quantity-btn:hover {
          background-color: #f3f4f6;
        }

        .quantity-icon {
          height: 0.75rem;
          width: 0.75rem;
        }

        .quantity-display {
          width: 2rem;
          text-align: center;
          font-size: 0.875rem;
        }

        .remove-btn {
          padding: 0.25rem;
          background: none;
          border: none;
          cursor: pointer;
          border-radius: 0.25rem;
          margin-left: 0.5rem;
          color: #dc2626;
          transition: background-color 0.15s ease-in-out;
        }

        .remove-btn:hover {
          background-color: #fef2f2;
        }

        .remove-icon {
          height: 0.75rem;
          width: 0.75rem;
        }

        /* Coupon Section */
        .coupon-section {
          border-top: 1px solid #e5e7eb;
          padding-top: 1rem;
        }

        .coupon-input-container {
          display: flex;
          gap: 0.5rem;
          margin-bottom: 0.75rem;
        }

        .coupon-input {
          flex: 1;
          padding: 0.5rem;
          border: 1px solid #d1d5db;
          border-radius: 0.25rem;
          font-size: 0.875rem;
          outline: none;
        }

        .coupon-apply-btn {
          background-color: #16a34a;
          color: white;
          padding: 0.5rem 0.75rem;
          border: none;
          border-radius: 0.25rem;
          font-size: 0.875rem;
          cursor: pointer;
          transition: background-color 0.15s ease-in-out;
          display: flex;
          align-items: center;
          gap: 0.25rem;
        }

        .coupon-apply-btn:hover {
          background-color: #15803d;
        }

        .coupon-icon {
          height: 0.75rem;
          width: 0.75rem;
        }

        .coupon-success {
          background-color: #f0fdf4;
          border: 1px solid #bbf7d0;
          border-radius: 0.25rem;
          padding: 0.5rem;
          font-size: 0.875rem;
        }

        .coupon-success-text {
          color: #15803d;
          font-weight: 500;
        }

        /* Order Summary */
        .order-summary {
          border-top: 1px solid #e5e7eb;
          padding-top: 1rem;
          display: flex;
          flex-direction: column;
          gap: 0.5rem;
        }

        .summary-row {
          display: flex;
          justify-content: space-between;
          font-size: 0.875rem;
        }

        .discount-row {
          color: #16a34a;
        }

        .summary-total {
          display: flex;
          justify-content: space-between;
          font-weight: 600;
          font-size: 1.125rem;
          border-top: 1px solid #e5e7eb;
          padding-top: 0.5rem;
        }

        .checkout-btn {
          width: 100%;
          background-color: #2563eb;
          color: white;
          padding: 0.75rem;
          border: none;
          border-radius: 0.5rem;
          font-weight: 500;
          cursor: pointer;
          transition: background-color 0.15s ease-in-out;
        }

        .checkout-btn:hover {
          background-color: #1d4ed8;
        }

        /* Checkout Modal */
        .checkout-overlay {
          position: fixed;
          inset: 0;
          z-index: 50;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 1rem;
          background-color: rgba(0, 0, 0, 0.5);
        }

        .checkout-modal {
          background-color: white;
          border-radius: 0.5rem;
          max-width: 28rem;
          width: 100%;
          padding: 1.5rem;
        }

        .checkout-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          margin-bottom: 1rem;
        }

        .checkout-title {
          font-size: 1.125rem;
          font-weight: 600;
        }

        .checkout-close {
          padding: 0.25rem;
          background: none;
          border: none;
          cursor: pointer;
          border-radius: 0.25rem;
          transition: background-color 0.15s ease-in-out;
        }

        .checkout-close:hover {
          background-color: #f3f4f6;
        }

        .checkout-content {
          display: flex;
          flex-direction: column;
          gap: 1rem;
        }

        .checkout-summary {
          background-color: #f9fafb;
          padding: 1rem;
          border-radius: 0.5rem;
        }

        .checkout-summary-title {
          font-weight: 500;
          margin-bottom: 0.5rem;
        }

        .checkout-summary-details {
          display: flex;
          flex-direction: column;
          gap: 0.25rem;
          font-size: 0.875rem;
        }

        .checkout-summary-row {
          display: flex;
          justify-content: space-between;
        }

        .checkout-discount {
          color: #16a34a;
        }

        .checkout-summary-total {
          display: flex;
          justify-content: space-between;
          font-weight: 600;
          border-top: 1px solid #e5e7eb;
          padding-top: 0.25rem;
        }

        .payment-method {
          background-color: #eff6ff;
          padding: 1rem;
          border-radius: 0.5rem;
        }

        .payment-title {
          font-weight: 500;
          color: #1e3a8a;
          margin-bottom: 0.5rem;
        }

        .payment-option {
          display: flex;
          align-items: center;
          color: #1e40af;
        }

        .payment-icon {
          height: 1rem;
          width: 1rem;
          margin-right: 0.5rem;
        }

        .payment-text {
          font-size: 0.875rem;
        }

        .payment-description {
          font-size: 0.75rem;
          color: #1d4ed8;
          margin-top: 0.25rem;
        }

        .place-order-btn {
          width: 100%;
          background-color: #16a34a;
          color: white;
          padding: 0.75rem;
          border: none;
          border-radius: 0.5rem;
          font-weight: 500;
          cursor: pointer;
          transition: background-color 0.15s ease-in-out;
        }

        .place-order-btn:hover {
          background-color: #15803d;
        }

        .checkout-terms {
          font-size: 0.75rem;
          color: #4b5563;
          text-align: center;
        }
      `}</style>
      <div className="app-container">
      {/* Header */}
      <header className="header">
        <div className="header-content">
          <div className="header-main">
            <div className="logo-section">
              <Smartphone className="logo-icon" />
              <h1 className="logo-text">MobileHub</h1>
            </div>
            
            <div className="search-container">
              <div className="search-wrapper">
                <Search className="search-icon" />
                <input
                  type="text"
                  placeholder="Search products..."
                  className="search-input"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
            </div>

            <button
              onClick={() => setShowCart(true)}
              className="cart-button"
            >
              <ShoppingCart className="cart-icon" />
              {cartItemsCount > 0 && (
                <span className="cart-badge">
                  {cartItemsCount}
                </span>
              )}
            </button>
          </div>
        </div>
      </header>

      <div className="main-container">
        <div className="content-wrapper">
          {/* Sidebar */}
          <div className="sidebar">
            <div className="sidebar-content">
              <h3 className="sidebar-title">Categories</h3>
              <div className="categories-list">
                {categories.map(category => {
                  const Icon = category.icon;
                  return (
                    <button
                      key={category.id}
                      onClick={() => setSelectedCategory(category.id)}
                      className={`category-button ${selectedCategory === category.id ? 'category-button-active' : ''}`}
                    >
                      <div className="category-content">
                        <Icon className="category-icon" />
                        <span className="category-name">{category.name}</span>
                      </div>
                      <span className="category-count">
                        {category.count}
                      </span>
                    </button>
                  );
                })}
              </div>

              {/* Filters */}
              <div className="filters-section">
                <h4 className="filters-title">
                  <Filter className="filters-icon" />
                  Filters
                </h4>
                
                {/* Sort By */}
                <div className="filter-group">
                  <label className="filter-label">Sort By</label>
                  <select
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value)}
                    className="sort-select"
                  >
                    <option value="name">Name (A-Z)</option>
                    <option value="price-low">Price (Low to High)</option>
                    <option value="price-high">Price (High to Low)</option>
                  </select>
                </div>

                {/* Price Range */}
                <div className="filter-group">
                  <label className="filter-label">
                    Price Range: ${priceRange[0]} - ${priceRange[1]}
                  </label>
                  <div className="price-range-container">
                    <input
                      type="range"
                      min="0"
                      max="200"
                      value={priceRange[0]}
                      onChange={(e) => setPriceRange([Number(e.target.value), priceRange[1]])}
                      className="price-range"
                    />
                    <input
                      type="range"
                      min="0"
                      max="200"
                      value={priceRange[1]}
                      onChange={(e) => setPriceRange([priceRange[0], Number(e.target.value)])}
                      className="price-range"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Main Content */}
          <div className="main-content">
            <div className="content-header">
              <h2 className="content-title">
                {selectedCategory === 'all' ? 'All Products' : categories.find(c => c.id === selectedCategory)?.name}
              </h2>
              <p className="products-count">{sortedProducts.length} products found</p>
            </div>

            {/* Product Grid */}
            <div className="products-grid">
              {sortedProducts.map(product => (
                <div key={product.id} className="product-card">
                  <div className="product-content">
                    <div className="product-image">{product.image}</div>
                    <h3 className="product-name">{product.name}</h3>
                    <p className="product-description">{product.description}</p>
                    <div className="product-footer">
                      <span className="product-price">${product.price}</span>
                      <button
                        onClick={() => addToCart(product)}
                        className="add-to-cart-btn"
                      >
                        <ShoppingCart className="btn-icon" />
                        Add to Cart
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {sortedProducts.length === 0 && (
              <div className="no-products">
                <Package className="no-products-icon" />
                <h3 className="no-products-title">No products found</h3>
                <p className="no-products-text">Try adjusting your search or filter criteria</p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Cart Sidebar */}
      {showCart && (
        <div className="cart-overlay">
          <div className="cart-backdrop" onClick={() => setShowCart(false)} />
          <div className="cart-sidebar">
            <div className="cart-header">
              <h3 className="cart-title">Shopping Cart ({cartItemsCount})</h3>
              <button onClick={() => setShowCart(false)} className="cart-close">
                <X className="close-icon" />
              </button>
            </div>

            <div className="cart-content">
              {cart.length === 0 ? (
                <div className="empty-cart">
                  <ShoppingCart className="empty-cart-icon" />
                  <p className="empty-cart-text">Your cart is empty</p>
                </div>
              ) : (
                <div className="cart-items-container">
                  {cart.map(item => (
                    <div key={item.id} className="cart-item">
                      <div className="cart-item-image">{item.image}</div>
                      <div className="cart-item-details">
                        <h4 className="cart-item-name">{item.name}</h4>
                        <p className="cart-item-price">${item.price}</p>
                      </div>
                      <div className="cart-item-controls">
                        <button
                          onClick={() => updateQuantity(item.id, -1)}
                          className="quantity-btn"
                        >
                          <Minus className="quantity-icon" />
                        </button>
                        <span className="quantity-display">{item.quantity}</span>
                        <button
                          onClick={() => updateQuantity(item.id, 1)}
                          className="quantity-btn"
                        >
                          <Plus className="quantity-icon" />
                        </button>
                        <button
                          onClick={() => removeFromCart(item.id)}
                          className="remove-btn"
                        >
                          <X className="remove-icon" />
                        </button>
                      </div>
                    </div>
                  ))}

                  {/* Coupon Section */}
                  <div className="coupon-section">
                    <div className="coupon-input-container">
                      <input
                        type="text"
                        placeholder="Coupon code"
                        value={couponCode}
                        onChange={(e) => setCouponCode(e.target.value)}
                        className="coupon-input"
                      />
                      <button
                        onClick={applyCoupon}
                        className="coupon-apply-btn"
                      >
                        <Tag className="coupon-icon" />
                        Apply
                      </button>
                    </div>
                    {appliedCoupon && (
                      <div className="coupon-success">
                        <span className="coupon-success-text">
                          Coupon "{appliedCoupon.code}" applied! 
                          Saved: ${totals.discount}
                        </span>
                      </div>
                    )}
                  </div>

                  {/* Order Summary */}
                  <div className="order-summary">
                    <div className="summary-row">
                      <span>Subtotal:</span>
                      <span>${totals.subtotal}</span>
                    </div>
                    {appliedCoupon && (
                      <div className="summary-row discount-row">
                        <span>Discount:</span>
                        <span>-${totals.discount}</span>
                      </div>
                    )}
                    <div className="summary-total">
                      <span>Total:</span>
                      <span>${totals.total}</span>
                    </div>
                  </div>

                  <button
                    onClick={() => setShowCheckout(true)}
                    className="checkout-btn"
                  >
                    Proceed to Checkout
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Checkout Modal */}
      {showCheckout && (
        <div className="checkout-overlay">
          <div className="checkout-modal">
            <div className="checkout-header">
              <h3 className="checkout-title">Checkout</h3>
              <button onClick={() => setShowCheckout(false)} className="checkout-close">
                <X className="close-icon" />
              </button>
            </div>

            <div className="checkout-content">
              <div className="checkout-summary">
                <h4 className="checkout-summary-title">Order Summary</h4>
                <div className="checkout-summary-details">
                  <div className="checkout-summary-row">
                    <span>Items ({cartItemsCount}):</span>
                    <span>${totals.subtotal}</span>
                  </div>
                  {appliedCoupon && (
                    <div className="checkout-summary-row checkout-discount">
                      <span>Discount:</span>
                      <span>-${totals.discount}</span>
                    </div>
                  )}
                  <div className="checkout-summary-total">
                    <span>Total:</span>
                    <span>${totals.total}</span>
                  </div>
                </div>
              </div>

              <div className="payment-method">
                <h4 className="payment-title">Payment Method</h4>
                <div className="payment-option">
                  <Package className="payment-icon" />
                  <span className="payment-text">Cash on Delivery (COD)</span>
                </div>
                <p className="payment-description">
                  Pay when your order is delivered to your doorstep
                </p>
              </div>

              <button
                onClick={placeOrder}
                className="place-order-btn"
              >
                Place Order (COD)
              </button>

              <p className="checkout-terms">
                By placing this order, you agree to our terms and conditions
              </p>
            </div>
          </div>
        </div>
      )}
      </div>
    </>
  );
}
