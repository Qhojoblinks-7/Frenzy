import { useCartStore, selectItemCount, selectItemsSubtotal, selectDeliveryFee, selectGrandTotal } from '../state/useCartStore';
import { formatCurrency } from '../utils/formatCurrency';

export function CartDrawer({ isOpen, onClose, onCheckout }) {
  const items = useCartStore((state) => state.items);
  const notes = useCartStore((state) => state.notes);
  const itemsSubtotal = useCartStore(selectItemsSubtotal);
  const deliveryFee = useCartStore(selectDeliveryFee);
  const grandTotal = useCartStore(selectGrandTotal);
  const itemCount = useCartStore(selectItemCount);
  const removeItem = useCartStore((state) => state.removeItem);
  const updateQuantity = useCartStore((state) => state.updateQuantity);

  if (!isOpen) return null;

  return (
    <div
      className="cart-drawer-overlay fixed inset-0 bg-black/40 flex items-end sm:items-center justify-center z-50"
      onClick={onClose}
    >
      <div
        className="cart-drawer bg-surface-card w-full sm:max-w-md h-[90dvh] sm:h-full sm:max-h-[90vh] flex flex-col shadow-2xl rounded-t-2xl sm:rounded-xl animate-slide-up sm:animate-slide-in"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Grab handle for the mobile bottom sheet */}
        <div className="sm:hidden flex justify-center pt-3 pb-1">
          <div className="w-10 h-1.5 rounded-full bg-border-subtle" />
        </div>

        <div className="p-4 sm:p-5 border-b border-border-subtle flex justify-between items-center">
          <h2 className="text-lg font-bold text-festive-crimson">
            Your Cart{itemCount > 0 ? ` (${itemCount})` : ''}
          </h2>
          <button
            type="button"
            className="min-h-[44px] min-w-[44px] flex items-center justify-center text-ink-muted hover:text-ink-primary rounded-full hover:bg-surface-muted"
            onClick={onClose}
            aria-label="Close cart"
          >
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
              <line x1="18" y1="6" x2="6" y2="18" />
              <line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-4 sm:p-5 flex flex-col gap-4">
          {items.length === 0 ? (
            <p className="text-center text-ink-secondary py-10">Your cart is empty.</p>
          ) : (
            items.map((item) => {
              const addOnTotal = item.addOns.reduce((a, addOn) => a + addOn.price, 0);
              const unitPrice = item.price + addOnTotal;
              return (
                <div
                  key={item.cartItemId}
                  className="flex gap-3 items-start border-b border-surface-muted pb-3"
                >
                  <img
                    src={item.image}
                    alt={item.name}
                    className="w-16 h-16 object-cover rounded shrink-0"
                    loading="lazy"
                  />
                  <div className="flex-1 min-w-0">
                    <div className="text-sm font-semibold text-ink-primary">{item.name}</div>
                    <div className="text-xs font-bold text-festive-warning">
                      {formatCurrency(unitPrice)} × {item.qty}
                    </div>
                    {item.addOns.length > 0 && (
                      <div className="flex flex-wrap gap-1.5 mt-1">
                        {item.addOns.map((addOn) => (
                          <span
                            key={addOn.id}
                            className="bg-surface-muted text-festive-crimson text-[10px] font-bold px-2 py-0.5 rounded-full"
                          >
                            +{addOn.name}
                          </span>
                        ))}
                      </div>
                    )}
                    {notes[item.cartItemId] && (
                      <div className="text-[10px] text-ink-muted italic mt-1">
                        Note: {notes[item.cartItemId]}
                      </div>
                    )}
                  </div>
                  <div className="flex items-center gap-1 shrink-0">
                    <button
                      type="button"
                      className="bg-surface-muted min-h-[40px] min-w-[40px] flex items-center justify-center rounded-lg text-festive-crimson font-bold text-lg hover:bg-festive-gold-soft active:bg-festive-gold-soft transition-colors"
                      onClick={() => updateQuantity(item.cartItemId, item.qty - 1)}
                      aria-label={`Decrease ${item.name} quantity`}
                    >
                      −
                    </button>
                    <span className="w-6 text-center text-sm font-bold text-ink-primary">{item.qty}</span>
                    <button
                      type="button"
                      className="bg-surface-muted min-h-[40px] min-w-[40px] flex items-center justify-center rounded-lg text-festive-crimson font-bold text-lg hover:bg-festive-gold-soft active:bg-festive-gold-soft transition-colors"
                      onClick={() => updateQuantity(item.cartItemId, item.qty + 1)}
                      aria-label={`Increase ${item.name} quantity`}
                    >
                      +
                    </button>
                    <button
                      type="button"
                      className="min-h-[40px] min-w-[36px] flex items-center justify-center text-festive-warning hover:text-festive-crimson rounded-lg hover:bg-surface-muted"
                      onClick={() => removeItem(item.cartItemId)}
                      aria-label={`Remove ${item.name}`}
                    >
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
                        <line x1="18" y1="6" x2="6" y2="18" />
                        <line x1="6" y1="6" x2="18" y2="18" />
                      </svg>
                    </button>
                  </div>
                </div>
              );
            })
          )}
        </div>

        <div className="p-4 sm:p-5 border-t border-border-subtle bg-surface-page pb-[calc(16px+env(safe-area-inset-bottom))]">
          <div className="flex flex-col gap-2 mb-4">
            <div className="flex justify-between text-sm text-ink-secondary">
              <span>Subtotal</span>
              <span>{formatCurrency(itemsSubtotal)}</span>
            </div>
            <div className="flex justify-between text-sm text-ink-secondary">
              <span>Delivery</span>
              <span>{formatCurrency(deliveryFee)}</span>
            </div>
            <div className="flex justify-between text-lg font-bold text-ink-primary border-t border-border-subtle pt-2">
              <span>Total</span>
              <span>{formatCurrency(grandTotal)}</span>
            </div>
          </div>
          <button
            type="button"
            className="w-full bg-festive-gold text-white min-h-[52px] rounded-lg text-lg font-bold hover:bg-festive-warning active:bg-festive-warning transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            onClick={onCheckout}
            disabled={itemCount === 0}
          >
            Checkout ({itemCount})
          </button>
        </div>
      </div>
    </div>
  );
}