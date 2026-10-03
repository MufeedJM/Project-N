import React from 'react';
import { useStore } from '../../context/StoreContext';
import { ProductCategory } from '../../types';
import { ArrowRight, Sprout } from 'lucide-react';

interface CategoryItem {
  title: ProductCategory;
  subtitle: string;
  image: string;
  count: string;
}

const CATEGORY_ITEMS: CategoryItem[] = [
  {
    title: 'Vegetable Seeds',
    subtitle: 'Tomatoes, chilies, brinjals & gourds',
    image: 'https://images.unsplash.com/photo-1592924357228-91a4daadcfea?auto=format&fit=crop&w=600&q=80',
    count: '6 Varieties',
  },
  {
    title: 'Fruit Seeds',
    subtitle: 'Red Lady papaya & passion fruit',
    image: 'https://images.unsplash.com/photo-1517282009859-f000ec3b26fe?auto=format&fit=crop&w=600&q=80',
    count: '2 Varieties',
  },
  {
    title: 'Leafy Vegetables',
    subtitle: 'Wel gotukola, mukunuwenna greens',
    image: 'https://images.unsplash.com/photo-1540420773420-3366772f4999?auto=format&fit=crop&w=600&q=80',
    count: '2 Varieties',
  },
  {
    title: 'Flower Seeds',
    subtitle: 'Golden marigolds & pollinators',
    image: 'https://images.unsplash.com/photo-1588691500331-f1ceacb31fc6?auto=format&fit=crop&w=600&q=80',
    count: '1 Variety',
  },
  {
    title: 'Herbal Seeds',
    subtitle: 'Sacred Maduruthala & indigenous herbs',
    image: 'https://images.unsplash.com/photo-1618164436241-4473940d1f5c?auto=format&fit=crop&w=600&q=80',
    count: '1 Variety',
  },
  {
    title: 'Other Agricultural Seeds',
    subtitle: 'Sweet corn & commercial field crops',
    image: 'https://images.unsplash.com/photo-1551754655-cd27e38d2076?auto=format&fit=crop&w=600&q=80',
    count: '1 Variety',
  },
];

export const CategoryShowcase: React.FC = () => {
  const { navigateToCatalog } = useStore();

  return (
    <section className="py-16 sm:py-20 bg-earth-50/40 border-b border-earth-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-10">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-agro-100 text-agro-800 text-xs font-bold mb-3 border border-agro-200">
              <Sprout className="w-3.5 h-3.5 text-agro-700" />
              <span>Cultivation Categories</span>
            </div>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-charcoal-900 font-display">
              Browse by Agricultural Crop
            </h2>
            <p className="text-xs sm:text-sm text-charcoal-800/80 mt-1">
              Select a category to view seed varieties suited for Sri Lankan farming conditions.
            </p>
          </div>

          <button
            onClick={() => navigateToCatalog('All')}
            className="inline-flex items-center gap-1.5 text-xs sm:text-sm font-bold text-agro-800 hover:text-agro-950 group"
          >
            <span>Explore All Categories</span>
            <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
          </button>
        </div>

        {/* 6 Category Cards Grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 sm:gap-6">
          {CATEGORY_ITEMS.map((cat, idx) => (
            <div
              key={idx}
              onClick={() => navigateToCatalog(cat.title)}
              className="group relative bg-white rounded-3xl p-3 border border-agro-100 shadow-soft hover:shadow-soft-xl hover:-translate-y-1 transition-all duration-300 cursor-pointer flex flex-col overflow-hidden"
            >
              {/* Photo */}
              <div className="aspect-square w-full rounded-2xl overflow-hidden bg-earth-100 mb-3 relative">
                <img
                  src={cat.image}
                  alt={cat.title}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-black/10 group-hover:bg-black/0 transition-colors" />
                <span className="absolute bottom-2 left-2 text-[10px] font-bold px-2 py-0.5 rounded-full bg-white/90 text-agro-900 backdrop-blur-xs shadow-xs">
                  {cat.count}
                </span>
              </div>

              {/* Text */}
              <div className="px-1 pb-1">
                <h3 className="text-xs sm:text-sm font-bold text-charcoal-900 group-hover:text-agro-800 transition line-clamp-1">
                  {cat.title}
                </h3>
                <p className="text-[11px] text-gray-500 line-clamp-1 mt-0.5">
                  {cat.subtitle}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
