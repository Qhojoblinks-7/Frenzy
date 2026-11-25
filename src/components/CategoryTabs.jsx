import { useEffect, useRef } from 'react';
import { CATEGORIES, getCategoryLabel } from '../data/menuData';

export function CategoryTabs({ activeCategory, onCategoryChange }) {
  const scrollRef = useRef(null);

  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;
    const active = el.querySelector('[data-active="true"]');
    if (active) {
      active.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'center' });
    }
  }, [activeCategory]);

  return (
    <div className="category-tabs">
      <div className="tabs-scroll" ref={scrollRef}>
        {CATEGORIES.map((cat) => {
          const isActive = activeCategory === cat.id;
          return (
            <button
              key={cat.id}
              type="button"
              className={`tab min-h-[44px] px-4 rounded-full text-sm font-medium whitespace-nowrap transition-all duration-200 ${
                isActive
                  ? 'bg-festive-gold border-festive-gold text-white shadow-sm'
                  : 'bg-surface-card border-border-subtle text-ink-secondary hover:border-festive-gold hover:text-festive-warning'
              }`}
              onClick={() => onCategoryChange(cat.id)}
              data-active={isActive}
              aria-pressed={isActive}
            >
              {getCategoryLabel(cat.id)}
            </button>
          );
        })}
      </div>
    </div>
  );
}