import React from 'react';
import { useStore } from '../../context/StoreContext';
import { seedService } from '../../services/seedService';
import { CATEGORIES } from '../../data/products';
import { ProductCategory } from '../../types';
import type { Product } from '../../types';
import { ProductCard } from './ProductCard';
import {
  Search,
  SlidersHorizontal,
  RotateCcw,
  Sparkles,
  CheckCircle,
  Tag,
  ArrowUpDown,
} from 'lucide-react';

export const ProductCatalog: React.FC = () => {
  const {
    selectedCategory,
    setSelectedCategory,
    searchQuery,
    setSearchQuery,
    sortBy,
    setSortBy,
  } = useStore();

  const [govtCertifiedOnly, setGovtCertifiedOnly] = React.useState(false);
  const [inStockOnly, setInStockOnly] = React.useState(false);
  const [filteredProducts, setFilteredProducts] = React.useState<Product[]>([]);
  const [isLoadingProducts, setIsLoadingProducts] = React.useState(true);
  const [productLoadError, setProductLoadError] = React.useState('');

  React.useEffect(() => {
    let isCurrentRequest = true;

    const loadProducts = async () => {
      setIsLoadingProducts(true);
      setProductLoadError('');
      try {
        let list = await seedService.search(searchQuery, selectedCategory, sortBy);
        if (govtCertifiedOnly) {
          list = list.filter((product) => product.departmentApproved);
        }
        if (inStockOnly) {
          list = list.filter((product) => product.stock > 0);
        }
        if (isCurrentRequest) setFilteredProducts(list);
      } catch (error) {
        if (isCurrentRequest) {
          setProductLoadError(
            error instanceof Error ? error.message : 'Products could not be loaded from the server.'
          );
        }
      } finally {
        if (isCurrentRequest) setIsLoadingProducts(false);
      }
    };

    void loadProducts();
    return () => {
      isCurrentRequest = false;
    };
  }, [searchQuery, selectedCategory, sortBy, govtCertifiedOnly, inStockOnly]);

  const handleResetFilters = () => {
    setSelectedCategory('All');
    setSearchQuery('');
    setSortBy('popular');
    setGovtCertifiedOnly(false);
    setInStockOnly(false);
  };

  return (
    <section id="catalog-section" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-16">
      {/* Section Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-agro-100 text-agro-800 text-xs font-bold mb-3 border border-agro-200">
            <Sparkles className="w-3.5 h-3.5 text-gold-600" />
            <span>High-Yield Varieties</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-charcoal-900 font-display">
            Explore Our Seeds
          </h2>
          <p className="text-xs sm:text-sm text-charcoal-800/80 mt-1 max-w-xl">
            Certified seed packets suited for Sri Lanka's low country wet, intermediate, and dry
            agricultural zones.
          </p>
        </div>

        {/* Results Counter */}
        <div className="text-xs sm:text-sm text-charcoal-800/70 font-medium">
          {isLoadingProducts ? (
            'Loading products…'
          ) : (
            <>
              Showing <span className="font-bold text-agro-900">{filteredProducts.length}</span> seed varieties
            </>
          )}
        </div>
      </div>

      {/* Category Pills Navigation */}
      <div className="flex items-center gap-2 overflow-x-auto pb-3 mb-6 no-scrollbar">
        <button
          onClick={() => setSelectedCategory('All')}
          className={`flex-shrink-0 px-4 py-2 rounded-2xl text-xs sm:text-sm font-bold transition-all duration-200 ${
            selectedCategory === 'All'
              ? 'bg-agro-800 text-white shadow-soft'
              : 'bg-white text-charcoal-800 hover:bg-agro-50 border border-agro-100'
          }`}
        >
          All Varieties
        </button>

        {CATEGORIES.map((category) => {
          const isActive = selectedCategory === category;
          return (
            <button
              key={category}
              onClick={() => setSelectedCategory(category)}
              className={`flex-shrink-0 px-4 py-2 rounded-2xl text-xs sm:text-sm font-semibold transition-all duration-200 ${
                isActive
                  ? 'bg-agro-800 text-white shadow-soft font-bold'
                  : 'bg-white text-charcoal-800 hover:bg-agro-50 border border-agro-100'
              }`}
            >
              {category}
            </button>
          );
        })}
      </div>

      {/* Controls Bar: Search, Sort, Quick Toggles */}
      <div className="bg-white rounded-3xl p-4 sm:p-5 border border-agro-100 shadow-soft mb-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-9 gap-4 items-center">
          {/* Search Input */}
          <div className="lg:col-span-4 relative">
            <Search className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
            <input
              type="text"
              placeholder="Search by variety (T-245, MI-2) or crop..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-earth-50/70 border border-earth-200/80 text-xs sm:text-sm text-charcoal-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-agro-500/20 focus:border-agro-600 transition"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-gray-400 hover:text-gray-600"
              >
                Clear
              </button>
            )}
          </div>

          {/* Sort By Dropdown */}
          <div className="lg:col-span-3 flex items-center gap-2">
            <ArrowUpDown className="w-4 h-4 text-agro-700 flex-shrink-0" />
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
              className="w-full py-2.5 px-3 rounded-xl bg-earth-50/70 border border-earth-200/80 text-xs sm:text-sm text-charcoal-900 focus:outline-none focus:ring-2 focus:ring-agro-500/20 focus:border-agro-600 cursor-pointer"
            >
              <option value="popular">Most Popular Varieties</option>
              <option value="price-asc">Price: Low to High</option>
              <option value="price-desc">Price: High to Low</option>
              <option value="newest">New Arrivals</option>
            </select>
          </div>

          {/* Reset Filters Button */}
          <div className="lg:col-span-2 flex justify-end">
            <button
              onClick={handleResetFilters}
              className="inline-flex items-center gap-1.5 px-3 py-2 text-xs font-semibold text-charcoal-800 hover:text-agro-800 hover:bg-earth-100 rounded-xl transition"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Reset</span>
            </button>
          </div>
        </div>

        {/* Secondary Toggles Strip */}
        <div className="flex flex-wrap items-center gap-4 pt-3 mt-3 border-t border-earth-100 text-xs text-charcoal-800">
          <label className="flex items-center gap-2 cursor-pointer select-none">
            <input
              type="checkbox"
              checked={govtCertifiedOnly}
              onChange={(e) => setGovtCertifiedOnly(e.target.checked)}
              className="rounded text-agro-700 focus:ring-agro-500 w-4 h-4 accent-agro-700 cursor-pointer"
            />
            <span className="font-medium">Approved Only</span>
          </label>

          <label className="flex items-center gap-2 cursor-pointer select-none">
            <input
              type="checkbox"
              checked={inStockOnly}
              onChange={(e) => setInStockOnly(e.target.checked)}
              className="rounded text-agro-700 focus:ring-agro-500 w-4 h-4 accent-agro-700 cursor-pointer"
            />
            <span className="font-medium">In Stock Only</span>
          </label>
        </div>
      </div>

      {/* Products Grid */}
      {productLoadError ? (
        <div
          role="alert"
          className="mx-auto max-w-lg rounded-3xl border border-rose-200 bg-rose-50 px-6 py-12 text-center text-sm text-rose-800"
        >
          Could not load products: {productLoadError}
        </div>
      ) : isLoadingProducts ? (
        <div role="status" className="py-16 text-center text-sm font-medium text-charcoal-800/70">
          Loading products…
        </div>
      ) : filteredProducts.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 sm:gap-8">
          {filteredProducts.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      ) : (
        /* Empty State */
        <div className="text-center py-16 px-4 bg-white rounded-3xl border border-agro-100 max-w-lg mx-auto">
          <div className="w-16 h-16 rounded-full bg-agro-50 text-agro-600 flex items-center justify-center mx-auto mb-4 border border-agro-200">
            <Search className="w-8 h-8" />
          </div>
          <h3 className="text-lg font-bold text-charcoal-900 font-display">
            No matching seed varieties found
          </h3>
          <p className="text-xs sm:text-sm text-charcoal-800/70 mt-1 max-w-xs mx-auto">
            Try adjusting your search keywords, increasing the price range, or clearing the category filter.
          </p>
          <button
            onClick={handleResetFilters}
            className="mt-5 inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-agro-700 hover:bg-agro-800 text-white font-semibold text-xs shadow-soft transition"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Reset All Filters</span>
          </button>
        </div>
      )}
    </section>
  );
};
