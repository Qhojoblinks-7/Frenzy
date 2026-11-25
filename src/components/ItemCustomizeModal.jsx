import { useState } from 'react';
import { useCartStore } from '../state/useCartStore';
import { formatCurrency } from '../utils/formatCurrency';

export function ItemCustomizeModal({ item, isOpen, onClose, initialQty = 1 }) {
  const [selectedAddOns, setSelectedAddOns] = useState(() => new Set());
  const [note, setNote] = useState('');
  const [qty, setQty] = useState(initialQty);

  const addItem = useCartStore((state) => state.addItem);
  const addNoteStore = useCartStore((state) => state.addNote);

  const toggleAddOn = (id) => {
    const next = new Set(selectedAddOns);
    if (next.has(id)) next.delete(id);
    else next.add(id);
    setSelectedAddOns(next);
  };

  const handleConfirm = () => {
    const addOnIds = [...selectedAddOns].sort();
    addItem(item, addOnIds, qty);
    if (note.trim()) {
      const cartItemId = `${item.id}|${addOnIds.join(',')}`;
      addNoteStore(cartItemId, note.trim());
    }
    onClose();
  };

  if (!isOpen) return null;

  const addOnTotal = item.addOns.reduce(
    (sum, addOn) => sum + (selectedAddOns.has(addOn.id) ? addOn.price : 0),
    0,
  );
  const unitPrice = item.price + addOnTotal;

  return (
    <div
      className="customize-overlay fixed inset-0 bg-black/50 flex items-end sm:items-center justify-center z-50"
      onClick={onClose}
    >
      <div
        className="customize-modal bg-surface-card w-full sm:max-w-md h-[92dvh] sm:h-auto sm:max-h-[90vh] flex flex-col rounded-t-2xl sm:rounded-xl shadow-2xl animate-slide-up sm:animate-slide-in"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="sm:hidden flex justify-center pt-3 pb-1 shrink-0">
          <div className="w-10 h-1.5 rounded-full bg-border-subtle" />
        </div>

        <div className="px-4 sm:px-6 py-4 border-b border-border-subtle flex justify-between items-center gap-3 shrink-0">
          <h2 className="text-lg sm:text-xl font-bold text-festive-crimson truncate">
            Make it yours
          </h2>
          <button
            type="button"
            className="min-h-[44px] min-w-[44px] shrink-0 flex items-center justify-center text-ink-muted hover:text-ink-primary rounded-full hover:bg-surface-muted"
            onClick={onClose}
            aria-label="Close customize"
          >
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
              <line x1="18" y1="6" x2="6" y2="18" />
              <line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-4 sm:p-6 flex flex-col gap-6">
          <div className="flex gap-3 items-center border border-border-subtle rounded-lg p-3 bg-surface-page">
            <img src={item.image} alt={item.name} className="w-16 h-16 object-cover rounded shrink-0" loading="lazy" />
            <div className="flex-1 min-w-0">
              <div className="text-base font-bold text-ink-primary">{item.name}</div>
              <div className="text-sm font-bold text-festive-warning">{formatCurrency(unitPrice)} each</div>
            </div>
            <div className="flex items-center border border-border-subtle rounded-lg overflow-hidden shrink-0 bg-surface-card">
              <button
                type="button"
                className="bg-surface-muted min-h-[44px] min-w-[44px] flex items-center justify-center text-festive-crimson font-bold text-lg hover:bg-festive-gold-soft active:bg-festive-gold-soft transition-colors disabled:opacity-40"
                onClick={() => setQty((q) => Math.max(1, q - 1))}
                disabled={qty <= 1}
                aria-label="Decrease quantity"
              >
                −
              </button>
              <span className="min-w-[32px] py-1 text-center text-sm font-bold text-ink-primary">{qty}</span>
              <button
                type="button"
                className="bg-surface-muted min-h-[44px] min-w-[44px] flex items-center justify-center text-festive-crimson font-bold text-lg hover:bg-festive-gold-soft active:bg-festive-gold-soft transition-colors"
                onClick={() => setQty((q) => q + 1)}
                aria-label="Increase quantity"
              >
                +
              </button>
            </div>
          </div>

          {item.addOns && item.addOns.length > 0 && (
            <fieldset className="border border-border-subtle rounded-lg p-3">
              <legend className="px-2 text-sm font-bold text-festive-crimson">Add-ons</legend>
              <div className="flex flex-col gap-1">
                {item.addOns.map((addOn) => {
                  const checked = selectedAddOns.has(addOn.id);
                  return (
                    <label
                      key={addOn.id}
                      className={`flex items-center gap-3 min-h-[48px] rounded-lg px-2 cursor-pointer ${checked ? 'bg-festive-gold-soft' : ''}`}
                    >
                      <input
                        type="checkbox"
                        className="w-5 h-5 rounded text-festive-crimson focus:ring-festive-gold"
                        checked={checked}
                        onChange={() => toggleAddOn(addOn.id)}
                      />
                      <span className="text-sm text-ink-secondary flex-1">{addOn.name}</span>
                      <span className="text-sm font-bold text-festive-warning">+{formatCurrency(addOn.price)}</span>
                    </label>
                  );
                })}
              </div>
            </fieldset>
          )}

          <div>
            <label htmlFor="item-note" className="block text-sm font-bold text-ink-secondary mb-1">
              Special note (optional)
            </label>
            <textarea
              id="item-note"
              rows={2}
              className="w-full border border-border-subtle rounded-lg px-3 py-3 text-base focus:outline-none focus:ring-2 focus:ring-festive-gold"
              value={note}
              onChange={(e) => setNote(e.target.value)}
              placeholder="e.g. Extra spicy, less oil..."
            />
          </div>
        </div>

        <div className="p-4 sm:p-6 border-t border-border-subtle bg-surface-page pb-[calc(16px+env(safe-area-inset-bottom))] flex justify-between items-center gap-3 shrink-0">
          <div>
            <span className="text-xs text-ink-muted block">{qty > 1 ? `${qty} × ` : ''}Total</span>
            <span className="text-lg font-bold text-ink-primary">{formatCurrency(unitPrice * qty)}</span>
          </div>
          <div className="flex gap-2 flex-1 sm:flex-none">
            <button
              type="button"
              className="flex-1 sm:flex-none min-h-[48px] bg-transparent border border-border-subtle text-ink-secondary px-4 rounded-lg text-sm font-medium hover:bg-surface-muted transition-colors"
              onClick={onClose}
            >
              Cancel
            </button>
            <button
              type="button"
              className="flex-1 sm:flex-none min-h-[48px] bg-festive-crimson text-white px-5 rounded-lg text-sm font-bold hover:bg-festive-crimson-dark transition-colors"
              onClick={handleConfirm}
            >
              Grab It
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}