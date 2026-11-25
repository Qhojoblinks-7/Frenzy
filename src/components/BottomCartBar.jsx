import { useCartStore, selectItemCount, selectGrandTotal } from '../state/useCartStore';
import { formatCurrency } from '../utils/formatCurrency';

export function BottomCartBar({ onCartToggle }) {
  const itemCount = useCartStore(selectItemCount);
  const grandTotal = useCartStore(selectGrandTotal);

  if (itemCount === 0) return null;

  return (
    <div className="fixed left-0 right-0 bottom-0 z-40 px-3 pb-[calc(12px+env(safe-area-inset-bottom))] pointer-events-none">
      <div className="max-w-[480px] mx-auto pointer-events-auto">
        <button
          type="button"
          onClick={onCartToggle}
          className="w-full flex items-center justify-between gap-3 bg-festive-crimson text-white rounded-full pl-5 pr-2 py-2 shadow-lg active:scale-[0.99] transition-transform min-h-[56px]"
          aria-label={`View cart, ${itemCount} items, ${formatCurrency(grandTotal)}`}
        >
          <span className="flex items-center gap-2 min-w-0">
            <span className="bg-festive-gold text-white text-xs font-bold rounded-full min-w-[24px] h-[24px] px-1.5 flex items-center justify-center shrink-0">
              {itemCount}
            </span>
            <span className="text-sm font-medium truncate">View Cart</span>
          </span>
          <span className="flex items-center gap-2 shrink-0">
            <span className="text-base font-bold">{formatCurrency(grandTotal)}</span>
            <span className="bg-white/15 rounded-full p-1">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
                <path d="M5 12h14" />
                <path d="M13 6l6 6-6 6" />
              </svg>
            </span>
          </span>
        </button>
      </div>
    </div>
  );
}