import React, { useState } from 'react';
import { useStore } from '../../context/StoreContext';
import { seedService } from '../../services/seedService';
import { ProductCard } from '../catalog/ProductCard';
import type { Product } from '../../types';
import { ArrowRight, Sparkles, TrendingUp, Award, Clock } from 'lucide-react';

export const FeaturedProducts: React.FC = () => {
  const { navigateToCatalog } = useStore();
  const [activeTab, setActiveTab] = useState<'featured' | 'bestsellers' | 'new'>('featured');
  const [allProducts, setAllProducts] = useState<Product[]>([]);
  const [loadError, setLoadError] = useState('');

  React.useEffect(() => {
    let isCurrentRequest = true;
    void seedService
      .getAll()
      .then((products) => {
        if (isCurrentRequest) setAllProducts(products);
      })
      .catch((error: unknown) => {
        if (isCurrentRequest) {
          setLoadError(error instanceof Error ? error.message : 'Products could not be loaded from the server.');
        }
      });
    return () => {
      isCurrentRequest = false;
    };
  }, []);

  const displayedProducts = React.useMemo(() => {
    if (activeTab === 'bestsellers') {
      return allProducts.filter((p) => p.bestSeller).slice(0, 4);
    }
    if (activeTab === 'new') {
      return allProducts.filter((p) => p.isNew || p.category === 'Fruit Seeds').slice(0, 4);
    }
    return allProducts.filter((p) => p.featured).slice(0, 4);
  }, [activeTab, allProducts]);

  return (
    <section id="featured-varieties-section" className="py-16 sm:py-24 bg-white relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header & Tabs */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-10">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-agro-100 text-agro-800 text-xs font-bold mb-3 border border-agro-200">
              <Sparkles className="w-3.5 h-3.5 text-gold-600" />
              <span>Tested Sri Lankan Cultivars</span>
            </div>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-charcoal-900 font-display">
              Featured Varieties &amp; Best Sellers
            </h2>
            <p className="text-xs sm:text-sm text-charcoal-800/80 mt-1 max-w-xl">
              Our highest germination rate seeds chosen by commercial growers and home kitchen garden enthusiasts.
            </p>
          </div>

          {/* Filter Pills */}
          <div className="flex items-center gap-2 p-1.5 rounded-2xl bg-earth-50 border border-earth-200/80">
            <button
              onClick={() => setActiveTab('featured')}
              className={`inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold transition ${
                activeTab === 'featured'
                  ? 'bg-agro-700 text-white shadow-xs'
                  : 'text-charcoal-800 hover:text-agro-800'
              }`}
            >
              <Award className="w-3.5 h-3.5" />
              <span>Featured</span>
            </button>

            <button
              onClick={() => setActiveTab('bestsellers')}
              className={`inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold transition ${
                activeTab === 'bestsellers'
                  ? 'bg-agro-700 text-white shadow-xs'
                  : 'text-charcoal-800 hover:text-agro-800'
              }`}
            >
              <TrendingUp className="w-3.5 h-3.5" />
              <span>Best Sellers</span>
            </button>

            <button
              onClick={() => setActiveTab('new')}
              className={`inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold transition ${
                activeTab === 'new'
                  ? 'bg-agro-700 text-white shadow-xs'
                  : 'text-charcoal-800 hover:text-agro-800'
              }`}
            >
              <Clock className="w-3.5 h-3.5" />
              <span>New Arrivals</span>
            </button>
          </div>
        </div>

        {/* 4 Cards Grid */}
        {loadError ? (
          <p role="alert" className="py-8 text-center text-sm text-rose-700">
            Could not load featured products: {loadError}
          </p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8">
            {displayedProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        )}

        {/* Bottom CTA to view all */}
        <div className="mt-12 text-center">
          <button
            onClick={() => navigateToCatalog('All')}
            className="inline-flex items-center gap-2 px-8 py-3.5 rounded-2xl bg-earth-100 hover:bg-agro-50 hover:text-agro-900 border border-earth-200/80 text-charcoal-900 font-bold text-xs sm:text-sm shadow-soft transition active:scale-95"
          >
            <span>View All Seed Varieties ({allProducts.length} items)</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </section>
  );
};
