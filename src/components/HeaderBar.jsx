import { useState } from 'react';
import { useCartStore, selectItemCount, selectGrandTotal } from '../state/useCartStore';
import { formatCurrency } from '../utils/formatCurrency';

export function HeaderBar({ onCartToggle, onSearch }) {
  const [query, setQuery] = useState('');

  const itemCount = useCartStore(selectItemCount);
  const grandTotal = useCartStore(selectGrandTotal);

  const handleSearch = (e) => {
    e.preventDefault();
    onSearch(query);
  };

  const handleClear = () => {
    setQuery('');
    onSearch('');
  };

  return (
    <header className="bg-festive-crimson text-white shadow-md">
      <div className="w-full">
        {/* Row 1: brand + cart. Wraps cleanly down to 320px. */}
        <div className="flex items-center justify-between gap-3 px-4 py-3 sm:px-6">
          <div className="flex items-center gap-2 min-w-0 font-bold">FRENZY</div>

          <div className="flex items-center gap-2 shrink-0">
            {itemCount > 0 && (
              <span className="hidden sm:inline-block text-xs font-medium opacity-90 whitespace-nowrap">
                {formatCurrency(grandTotal)}
              </span>
            )}
            <button
              type="button"
              className="relative flex items-center gap-2 bg-white/10 border border-white/20 text-white min-h-[44px] px-3 rounded-lg hover:bg-white/20 active:bg-white/30 transition-colors"
              onClick={onCartToggle}
              aria-label={`Cart, ${itemCount} item${itemCount === 1 ? '' : 's'}`}
            >
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
                <circle cx="8" cy="21" r="1" />
                <circle cx="19" cy="21" r="1" />
                <path d="M2.05 2.05h2l2.66 12.42a2 2 0 0 0 2 1.58h9.78a2 2 0 0 0 2-1.58l2.66-12.42h2" />
              </svg>
              <span className="hidden sm:inline text-sm font-medium">Cart</span>
              {itemCount > 0 && (
                <span className="absolute -top-2 -right-2 bg-festive-gold text-[10px] font-bold flex items-center justify-center min-w-[20px] h-[20px] rounded-full px-1.5">
                  {itemCount}
                </span>
              )}
            </button>
          </div>
        </div>

        {/* Row 2: search. Always visible, full width on mobile. */}
        <div className="px-4 pb-3 sm:px-6">
          <form onSubmit={handleSearch} className="w-full">
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-white/70 pointer-events-none">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
                  <circle cx="11" cy="11" r="8" />
                  <path d="M21 21l-4.35-4.35" />
                </svg>
              </span>
              <input
                type="search"
                inputMode="search"
                placeholder="Search dishes..."
                className="w-full bg-white/15 border border-white/30 rounded-lg pl-10 pr-10 py-2.5 text-white placeholder-white/70 text-base focus:outline-none focus:ring-2 focus:ring-festive-gold transition-colors"
                value={query}
                onChange={(e) => {
                  setQuery(e.target.value);
                  onSearch(e.target.value);
                }}
              />
              {query && (
                <button
                  type="button"
                  onClick={handleClear}
                  className="absolute right-2 top-1/2 -translate-y-1/2 min-h-[36px] min-w-[36px] flex items-center justify-center text-white/80 hover:text-white"
                  aria-label="Clear search"
                >
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
                    <line x1="18" y1="6" x2="6" y2="18" />
                    <line x1="6" y1="6" x2="18" y2="18" />
                  </svg>
                </button>
              )}
            </div>
          </form>
        </div>
      </div>
    </header>
  );
}