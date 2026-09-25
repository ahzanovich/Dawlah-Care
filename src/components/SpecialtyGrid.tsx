import React from 'react';
import { 
  Activity, 
  Stethoscope, 
  Heart, 
  Baby, 
  Sparkles, 
  ShieldAlert, 
  Zap, 
  Mic2,
  LayoutGrid
} from 'lucide-react';
import { SpecialtyCategory } from '../types';

interface SpecialtyGridProps {
  categories: SpecialtyCategory[];
  selectedCategorySlug: string | null;
  onSelectCategory: (slug: string | null) => void;
}

// Icon helper mapping
const renderCategoryIcon = (iconName: string, className: string) => {
  switch (iconName) {
    case 'Activity': return <Activity className={className} />;
    case 'Stethoscope': return <Stethoscope className={className} />;
    case 'Heart': return <Heart className={className} />;
    case 'Baby': return <Baby className={className} />;
    case 'Sparkles': return <Sparkles className={className} />;
    case 'ShieldAlert': return <ShieldAlert className={className} />;
    case 'Zap': return <Zap className={className} />;
    case 'Mic2': return <Mic2 className={className} />;
    default: return <Activity className={className} />;
  }
};

export const SpecialtyGrid: React.FC<SpecialtyGridProps> = ({
  categories,
  selectedCategorySlug,
  onSelectCategory,
}) => {
  return (
    <div className="mb-5 sm:mb-8">
      <div className="flex items-center justify-between mb-2 sm:mb-3">
        <div>
          <h2 className="text-sm sm:text-base font-semibold text-zinc-950 dark:text-white tracking-tight">
            Browse Specialties
          </h2>
          <p className="text-[11px] sm:text-xs text-zinc-500 dark:text-zinc-400">
            Swipe or select a specialty to filter clinics
          </p>
        </div>

        {selectedCategorySlug && (
          <button
            onClick={() => onSelectCategory(null)}
            className="text-xs text-red-600 dark:text-amber-400 hover:underline font-medium"
          >
            Show All
          </button>
        )}
      </div>

      <div className="flex sm:grid sm:grid-cols-4 lg:grid-cols-8 gap-2 sm:gap-2.5 overflow-x-auto no-scrollbar pb-1.5 snap-x">
        {/* "All" button */}
        <button
          onClick={() => onSelectCategory(null)}
          className={`p-2 sm:p-3 rounded-xl border text-center transition-all flex flex-col items-center justify-center gap-1.5 sm:gap-2 shrink-0 w-20 sm:w-auto snap-start cursor-pointer ${
            selectedCategorySlug === null
              ? 'bg-red-600 dark:bg-amber-500 text-white dark:text-black border-red-600 dark:border-amber-400 font-semibold shadow-xs'
              : 'bg-white dark:bg-zinc-900 text-zinc-700 dark:text-zinc-300 border-zinc-200 dark:border-zinc-800 hover:border-red-300 dark:hover:border-amber-500/50 hover:bg-red-50/30 dark:hover:bg-zinc-800'
          }`}
        >
          <div className={`w-7 h-7 sm:w-8 sm:h-8 rounded-lg flex items-center justify-center transition-colors ${
            selectedCategorySlug === null 
              ? 'bg-red-700 dark:bg-amber-400 text-white dark:text-black' 
              : 'bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-300 group-hover:bg-red-50 dark:group-hover:bg-zinc-700 group-hover:text-red-600'
          }`}>
            <LayoutGrid className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
          </div>
          <span className="text-[11px] sm:text-xs font-medium leading-tight truncate w-full text-center">All</span>
        </button>

        {/* Categories */}
        {categories.map((cat) => {
          const isSelected = selectedCategorySlug === cat.slug;
          return (
            <button
              key={cat.id}
              onClick={() => onSelectCategory(isSelected ? null : cat.slug)}
              className={`p-2 sm:p-3 rounded-xl border text-center transition-all flex flex-col items-center justify-center gap-1.5 sm:gap-2 shrink-0 w-24 sm:w-auto snap-start cursor-pointer ${
                isSelected
                  ? 'bg-red-600 dark:bg-amber-500 text-white dark:text-black border-red-600 dark:border-amber-400 font-semibold shadow-xs'
                  : 'bg-white dark:bg-zinc-900 text-zinc-700 dark:text-zinc-300 border-zinc-200 dark:border-zinc-800 hover:border-red-300 dark:hover:border-amber-500/50 hover:bg-red-50/30 dark:hover:bg-zinc-800'
              }`}
            >
              <div className={`w-7 h-7 sm:w-8 sm:h-8 rounded-lg flex items-center justify-center transition-transform group-hover:scale-110 ${
                isSelected 
                  ? 'bg-red-700 dark:bg-amber-400 text-white dark:text-black' 
                  : cat.bgLight
              }`}>
                {renderCategoryIcon(cat.iconName, 'w-3.5 h-3.5 sm:w-4 sm:h-4')}
              </div>
              <span className="text-[11px] sm:text-xs font-medium leading-tight truncate w-full text-center">{cat.name}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
};
