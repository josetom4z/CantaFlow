import React from 'react';
import { INITIAL_CATEGORIES } from '../../services/mockData';

export const CategoryPills = ({ selectedCategory, onSelectCategory }) => {
  return (
    <div className="flex items-center gap-1.5 sm:gap-2 overflow-x-auto pb-1 -mx-4 px-4 sm:mx-0 sm:px-0 scrollbar-none no-scrollbar touch-pan-x">
      {INITIAL_CATEGORIES.map((cat) => {
        const isSelected = selectedCategory === cat;
        return (
          <button
            key={cat}
            onClick={() => onSelectCategory(cat)}
            className={`whitespace-nowrap px-3 sm:px-3.5 py-1.5 rounded-full text-[11px] sm:text-xs font-semibold transition-all duration-150 border flex-shrink-0 ${
              isSelected
                ? 'bg-purple-600 text-white border-purple-500 shadow-md shadow-purple-600/30'
                : 'bg-dark-800/80 text-slate-300 border-white/10 hover:border-purple-500/40 hover:bg-dark-700 active:scale-95'
            }`}
          >
            {cat}
          </button>
        );
      })}
    </div>
  );
};
