import { useState } from 'react';
import { useCartStore } from '../state/useCartStore';

export function MenuItemCard({ item, onCustomize }) {
  const [qty, setQty] = useState(0);
  const addItem = useCartStore((state) => state.addItem);

  const soldOut = item.available === false;
  const effectiveQty = qty === 0 ? 1 : qty;

  const handleAdd = () => {
    if (soldOut) return;
    addItem(item, [], effectiveQty);
    setQty(0);
  };

  const handleCustomize = () => {
    if (soldOut) return;
    onCustomize(effectiveQty);
  };

  return (
    <article className="bg-surface-card border border-border-subtle rounded-xl overflow-hidden transition-all duration-200 hover:-translate-y-1 hover:shadow-lg hover:shadow-festive-crimson/10 border-transparent hover:border-festive-crimson">
      <div className="relative h-48 overflow-hidden bg-surface-muted">
        <img src={item.image} alt={item.name} className="w-full h-full object-cover" loading="lazy" />
        {item.badge && (
          <span className="absolute top-2 left-2 bg-festive-crimson text-white text-[10px] font-bold px-2 py-0.5 rounded uppercase tracking-tighter">
            {item.badge}
          </span>
        )}
        {item.popular && (
          <span className="absolute top-2 left-2 bg-festive-gold text-white text-[10px] font-bold px-2 py-0.5 rounded uppercase tracking-tighter">
            Popular
          </span>
        )}
        {soldOut && (
          <span className="absolute top-2 right-2 bg-ink-primary text-white text-[10px] font-bold px-2 py-0.5 rounded uppercase tracking-tighter">
            Sold Out
          </span>
        )}
      </div>

      <div className="p-4 flex flex-col gap-3">
        <div className="flex justify-between items-baseline gap-2">
          <h3 className="text-lg font-bold text-ink-primary">{item.name}</h3>
          <span className="text-lg font-bold text-festive-warning">{item.price.toFixed(2)}</span>
        </div>
        <p className="text-sm text-ink-secondary line-clamp-2">{item.description}</p>

        {item.addOns && item.addOns.length > 0 && (
          <div className="flex flex-wrap gap-2">
            {item.addOns.map((addOn) => (
              <span key={addOn.id} className="bg-festive-gold-soft text-festive-warning text-[11px] font-bold px-2 py-0.5 rounded-full">
                +{addOn.name} {addOn.price.toFixed(2)}
              </span>
            ))}
          </div>
        )}

        <div className="mt-auto flex gap-3">
          <div className={`flex items-center border border-border-subtle rounded-lg overflow-hidden shrink-0 transition-opacity ${soldOut ? 'opacity-50' : ''}`}>
            <button type="button" className="bg-surface-muted min-h-[44px] min-w-[44px] flex items-center justify-center text-festive-crimson font-bold text-lg hover:bg-festive-gold-soft active:bg-festive-gold-soft transition-colors disabled:opacity-40" onClick={() => setQty((q) => Math.max(0, q - 1))} disabled={soldOut || qty === 0} aria-label="Decrease quantity">
              −
            </button>
            <span className={`min-w-[32px] py-1 text-center text-sm font-bold ${qty === 0 ? 'text-ink-muted' : 'text-ink-primary'}`}>{effectiveQty}</span>
            <button type="button" className="bg-surface-muted min-h-[44px] min-w-[44px] flex items-center justify-center text-festive-crimson font-bold text-lg hover:bg-festive-gold-soft active:bg-festive-gold-soft transition-colors" onClick={() => setQty((q) => q + 1)} disabled={soldOut} aria-label="Increase quantity">
              +
            </button>
          </div>
          <div className="flex-1 flex flex-col gap-2">
            <button type="button" className="bg-transparent border border-festive-gold text-festive-warning min-h-[44px] px-3 rounded-lg text-sm font-medium hover:bg-festive-gold-soft active:bg-festive-gold-soft transition-colors disabled:opacity-50 disabled:cursor-not-allowed" onClick={handleCustomize} disabled={soldOut}>
              Make It Yours
            </button>
            <button type="button" className="bg-festive-crimson text-white min-h-[44px] px-4 rounded-lg text-sm font-bold hover:bg-festive-crimson-dark active:bg-festive-crimson-dark transition-colors disabled:opacity-50 disabled:cursor-not-allowed" onClick={handleAdd} disabled={soldOut}>
              {soldOut ? 'Sold Out' : 'Grab It'}
            </button>
          </div>
        </div>
      </div>
    </article>
  );
}
