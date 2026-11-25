import { useState, useMemo, useEffect } from 'react';
import { useCartStore } from './state/useCartStore';
import { MENU_ITEMS } from './data/menuData';
import { captureChannel } from './utils/channelTracker';
import { buildOrderMessage } from './utils/whatsappFormatter';
import { HeaderBar } from './components/HeaderBar';
import { CategoryTabs } from './components/CategoryTabs';
import { MenuItemCard } from './components/MenuItemCard';
import { ItemCustomizeModal } from './components/ItemCustomizeModal';
import { CartDrawer } from './components/CartDrawer';
import { CheckoutModal } from './components/CheckoutModal';
import { BottomCartBar } from './components/BottomCartBar';
import './index.css';

function App() {
  const [openCategory, setOpenCategory] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [cartOpen, setCartOpen] = useState(false);
  const [checkoutOpen, setCheckoutOpen] = useState(false);
  const [customizingItem, setCustomizingItem] = useState(null);
  const [customizeQty, setCustomizeQty] = useState(1);
  const [lastOrder, setLastOrder] = useState(null);

  const clearCart = useCartStore((state) => state.clearCart);

  useEffect(() => {
    captureChannel();
  }, []);

  const filteredItems = useMemo(() => {
    const query = searchQuery.toLowerCase();
    return MENU_ITEMS.filter((item) => {
      const matchesCategory = openCategory === 'all' || item.category === openCategory;
      const matchesQuery =
        item.name.toLowerCase().includes(query) ||
        item.description.toLowerCase().includes(query);
      return matchesCategory && matchesQuery;
    });
  }, [openCategory, searchQuery]);

  const handleCheckout = (order) => {
    const { url } = buildOrderMessage(order);
    setLastOrder({ ...order, url });
    // Use anchor click to avoid popup blockers
    const a = document.createElement('a');
    a.href = url;
    a.target = '_blank';
    a.rel = 'noopener noreferrer';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  const handleNewOrder = () => {
    clearCart();
    setLastOrder(null);
    setCheckoutOpen(false);
    setCartOpen(false);
  };

  return (
    <div className="app">
      <HeaderBar onCartToggle={() => setCartOpen(!cartOpen)} onSearch={setSearchQuery} />
      <main className="menu-body">
        <CategoryTabs activeCategory={openCategory} onCategoryChange={setOpenCategory} />

        <div className="search-hint">
          {searchQuery && <span>Showing results for “{searchQuery}”</span>}
        </div>

        <div className="menu-grid">
          {filteredItems.length === 0 ? (
            <p className="no-results">No dishes found matching your search.</p>
          ) : (
            filteredItems.map((item) => (
              <MenuItemCard
                key={item.id}
                item={item}
                onCustomize={(qty) => {
                  setCustomizeQty(qty);
                  setCustomizingItem(item);
                }}
              />
            ))
          )}
        </div>
      </main>

      {customizingItem && (
        <ItemCustomizeModal
          item={customizingItem}
          initialQty={customizeQty}
          isOpen={true}
          onClose={() => setCustomizingItem(null)}
        />
      )}

      <CartDrawer
        isOpen={cartOpen}
        onClose={() => setCartOpen(false)}
        onCheckout={() => {
          setCartOpen(false);
          setCheckoutOpen(true);
        }}
      />

      <CheckoutModal
        isOpen={checkoutOpen}
        onClose={() => setCheckoutOpen(false)}
        onSubmit={handleCheckout}
      />

      <BottomCartBar onCartToggle={() => setCartOpen(true)} />

      {lastOrder && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-surface-card rounded-xl p-6 max-w-md w-full text-center">
            <div className="w-16 h-16 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <polyline points="20 6 9 17 4 12" />
              </svg>
            </div>
            <h2 className="text-xl font-bold text-ink-primary mb-2">Order Sent!</h2>
            <p className="text-sm text-ink-secondary mb-6">
              Please hit Send in WhatsApp to confirm your order with our team.
            </p>
            <div className="flex flex-col gap-3">
              <button
                type="button"
                className="bg-festive-crimson text-white py-3 rounded-lg font-bold hover:bg-festive-crimson-dark transition-colors"
                onClick={handleNewOrder}
              >
                Start New Order
              </button>
              <button
                type="button"
                className="bg-surface-muted text-ink-secondary py-3 rounded-lg font-bold hover:bg-surface-card transition-colors"
                onClick={() => {
                  setLastOrder(null);
                  setCheckoutOpen(true);
                }}
              >
                Edit Details
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default App;
