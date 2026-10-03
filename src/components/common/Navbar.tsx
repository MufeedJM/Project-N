import React, { useState, useEffect } from 'react';
import { BrandLogo } from './BrandLogo';
import { useCart } from '../../context/CartContext';
import { useStore } from '../../context/StoreContext';
import { CATEGORIES } from '../../data/products';
import { ProductCategory } from '../../types';
import {
  ShoppingBag,
  Search,
  Menu,
  X,
  ChevronDown,
  Sparkles,
  PhoneCall,
  LayoutDashboard,
  Sprout,
} from 'lucide-react';

export const Navbar: React.FC = () => {
  const { itemCount, setIsCartOpen } = useCart();
  const {
    activeView,
    setActiveView,
    navigateToCatalog,
    navigateToHome,
    searchQuery,
    setSearchQuery,
    selectedCategory,
  } = useStore();

  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [categoryDropdownOpen, setCategoryDropdownOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigateToCatalog('All');
      setSearchOpen(false);
      setMobileMenuOpen(false);
    }
  };

  const handleCategorySelect = (cat: ProductCategory | 'All') => {
    navigateToCatalog(cat);
    setCategoryDropdownOpen(false);
    setMobileMenuOpen(false);
  };

  return (
    <>
      {/* Top Agricultural Notice Strip */}
      <div className="bg-agro-950 text-agro-100 text-xs py-2 px-4 border-b border-agro-800/60 hidden md:block">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="inline-flex items-center justify-center w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
            <span className="font-medium text-agro-200">
              Maha & Yala Certified Seeds In Stock
            </span>
            <span className="text-agro-400">•</span>
            <span className="text-agro-300">Free Islandwide Delivery on orders over LKR 3,000</span>
          </div>
          <div className="flex items-center gap-6 text-agro-200">
            <a
              href="https://wa.me/94771234567"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1.5 hover:text-white transition"
            >
              <PhoneCall className="w-3.5 h-3.5 text-agro-400" />
              <span>Agri Advisory Hotline: +94 77 123 4567</span>
            </a>
            <button
              onClick={() => setActiveView('admin')}
              className="flex items-center gap-1 text-[11px] bg-agro-800/80 hover:bg-agro-700 text-agro-200 px-2 py-0.5 rounded-full border border-agro-600 transition"
              title="Open Admin Dashboard Preview"
            >
              <LayoutDashboard className="w-3 h-3 text-gold-400" />
              <span>Admin Preview</span>
            </button>
          </div>
        </div>
      </div>

      {/* Main Sticky Navbar */}
      <header
        className={`sticky top-0 z-40 w-full transition-all duration-300 ${
          isScrolled
            ? 'glass-nav py-3 shadow-soft'
            : 'bg-white/95 backdrop-blur-md py-4 border-b border-agro-100'
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between">
            {/* Logo */}
            <div onClick={navigateToHome} className="cursor-pointer">
              <BrandLogo size={isScrolled ? 'sm' : 'md'} />
            </div>

            {/* Desktop Navigation Links */}
            <nav className="hidden lg:flex items-center gap-1 xl:gap-2">
              <button
                onClick={navigateToHome}
                className={`px-3.5 py-2 rounded-xl text-sm font-semibold transition ${
                  activeView === 'home'
                    ? 'text-agro-800 bg-agro-50 font-bold'
                    : 'text-charcoal-800 hover:text-agro-700 hover:bg-agro-50/50'
                }`}
              >
                Home
              </button>

              <button
                onClick={() => navigateToCatalog('All')}
                className={`px-3.5 py-2 rounded-xl text-sm font-semibold transition ${
                  activeView === 'catalog' && selectedCategory === 'All'
                    ? 'text-agro-800 bg-agro-50 font-bold'
                    : 'text-charcoal-800 hover:text-agro-700 hover:bg-agro-50/50'
                }`}
              >
                Shop Seeds
              </button>

              {/* Categories Dropdown */}
              <div className="relative">
                <button
                  onClick={() => setCategoryDropdownOpen(!categoryDropdownOpen)}
                  onMouseEnter={() => setCategoryDropdownOpen(true)}
                  className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-sm font-semibold text-charcoal-800 hover:text-agro-700 hover:bg-agro-50/50 transition"
                >
                  <span>Categories</span>
                  <ChevronDown
                    className={`w-4 h-4 text-gray-400 transition-transform duration-200 ${
                      categoryDropdownOpen ? 'rotate-180 text-agro-600' : ''
                    }`}
                  />
                </button>

                {categoryDropdownOpen && (
                  <div
                    onMouseLeave={() => setCategoryDropdownOpen(false)}
                    className="absolute top-full left-0 mt-1 w-64 bg-white rounded-2xl shadow-soft-xl border border-agro-100 p-2 z-50 animate-in fade-in slide-in-from-top-2 duration-150"
                  >
                    <button
                      onClick={() => handleCategorySelect('All')}
                      className="w-full text-left px-3.5 py-2 rounded-xl text-xs font-bold text-agro-900 hover:bg-agro-50 transition flex items-center justify-between"
                    >
                      <span>All Seed Categories</span>
                      <Sprout className="w-3.5 h-3.5 text-agro-600" />
                    </button>
                    <div className="h-px bg-agro-50 my-1"></div>
                    {CATEGORIES.map((cat) => (
                      <button
                        key={cat}
                        onClick={() => handleCategorySelect(cat)}
                        className="w-full text-left px-3.5 py-2 rounded-xl text-xs font-medium text-charcoal-800 hover:text-agro-800 hover:bg-agro-50 transition"
                      >
                        {cat}
                      </button>
                    ))}
                  </div>
                )}
              </div>

              <a
                href="#about-section"
                onClick={(e) => {
                  e.preventDefault();
                  if (activeView !== 'home') {
                    navigateToHome();
                    setTimeout(() => {
                      document.getElementById('about-section')?.scrollIntoView({ behavior: 'smooth' });
                    }, 100);
                  } else {
                    document.getElementById('about-section')?.scrollIntoView({ behavior: 'smooth' });
                  }
                }}
                className="px-3.5 py-2 rounded-xl text-sm font-semibold text-charcoal-800 hover:text-agro-700 hover:bg-agro-50/50 transition"
              >
                About
              </a>

              <a
                href="#question-section"
                onClick={(e) => {
                  e.preventDefault();
                  if (activeView !== 'home') {
                    navigateToHome();
                    setTimeout(() => {
                      document.getElementById('question-section')?.scrollIntoView({ behavior: 'smooth' });
                    }, 100);
                  } else {
                    document.getElementById('question-section')?.scrollIntoView({ behavior: 'smooth' });
                  }
                }}
                className="px-3.5 py-2 rounded-xl text-sm font-semibold text-charcoal-800 hover:text-agro-700 hover:bg-agro-50/50 transition"
              >
                Contact
              </a>
            </nav>

            {/* Right Action Icons & Buttons */}
            <div className="flex items-center gap-2 sm:gap-3">
              {/* Search Toggle */}
              <div className="relative">
                {searchOpen ? (
                  <form
                    onSubmit={handleSearchSubmit}
                    className="flex items-center bg-agro-50/80 rounded-2xl border border-agro-200 px-3 py-1.5 shadow-inner"
                  >
                    <input
                      type="text"
                      placeholder="Search variety, crop..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      autoFocus
                      className="bg-transparent text-xs sm:text-sm text-charcoal-900 placeholder:text-gray-400 focus:outline-none w-36 sm:w-52"
                    />
                    <button
                      type="submit"
                      className="text-agro-700 hover:text-agro-900 p-1"
                      aria-label="Search"
                    >
                      <Search className="w-4 h-4" />
                    </button>
                    <button
                      type="button"
                      onClick={() => setSearchOpen(false)}
                      className="text-gray-400 hover:text-gray-600 p-1"
                      aria-label="Close search"
                    >
                      <X className="w-3.5 h-3.5" />
                    </button>
                  </form>
                ) : (
                  <button
                    onClick={() => setSearchOpen(true)}
                    className="p-2.5 rounded-xl text-charcoal-800 hover:text-agro-700 hover:bg-agro-50 transition"
                    aria-label="Search seeds"
                  >
                    <Search className="w-5 h-5" />
                  </button>
                )}
              </div>

              {/* Cart Trigger */}
              <button
                onClick={() => setIsCartOpen(true)}
                className="relative p-2.5 rounded-xl text-charcoal-800 hover:text-agro-700 hover:bg-agro-50 transition group"
                aria-label={`View cart with ${itemCount} items`}
              >
                <ShoppingBag className="w-5 h-5 transition-transform group-hover:scale-105" />
                {itemCount > 0 && (
                  <span className="absolute -top-1 -right-1 bg-agro-600 text-white font-extrabold text-[11px] w-5 h-5 rounded-full flex items-center justify-center shadow-md animate-subtle-pulse">
                    {itemCount}
                  </span>
                )}
              </button>

              {/* Primary "Shop Now" Button */}
              <button
                onClick={() => navigateToCatalog('All')}
                className="hidden sm:inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-agro-700 hover:bg-agro-800 active:bg-agro-900 text-white font-semibold text-xs tracking-wide shadow-soft hover:shadow-soft-lg transition-all duration-200"
              >
                <Sparkles className="w-3.5 h-3.5 text-gold-300" />
                <span>Shop Seeds</span>
              </button>

              {/* Mobile Hamburger Toggle */}
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="lg:hidden p-2 rounded-xl text-charcoal-800 hover:bg-agro-50 transition"
                aria-label="Toggle navigation menu"
              >
                {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Menu Drawer */}
        {mobileMenuOpen && (
          <div className="lg:hidden bg-white border-b border-agro-100 shadow-xl px-4 pt-3 pb-6 animate-in slide-in-from-top-3">
            {/* Mobile Search */}
            <form onSubmit={handleSearchSubmit} className="mb-4">
              <div className="flex items-center bg-agro-50 rounded-xl px-3 py-2 border border-agro-200">
                <Search className="w-4 h-4 text-agro-600 mr-2" />
                <input
                  type="text"
                  placeholder="Search seeds, varieties (e.g. T-245, MI-2)..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="bg-transparent text-sm w-full focus:outline-none"
                />
              </div>
            </form>

            <div className="flex flex-col gap-1">
              <button
                onClick={() => {
                  navigateToHome();
                  setMobileMenuOpen(false);
                }}
                className="text-left px-3 py-2.5 rounded-xl font-semibold text-sm text-charcoal-900 hover:bg-agro-50"
              >
                Home
              </button>
              <button
                onClick={() => {
                  navigateToCatalog('All');
                  setMobileMenuOpen(false);
                }}
                className="text-left px-3 py-2.5 rounded-xl font-semibold text-sm text-charcoal-900 hover:bg-agro-50 flex items-center justify-between"
              >
                <span>Shop All Seeds</span>
                <span className="text-xs bg-agro-100 text-agro-800 font-bold px-2 py-0.5 rounded-full">
                  In Stock
                </span>
              </button>

              {/* Mobile Category Expand */}
              <div className="py-2 pl-3 border-l-2 border-agro-200 my-1 flex flex-col gap-1">
                <span className="text-[11px] font-bold uppercase tracking-wider text-earth-700 px-2 mb-1">
                  Browse by Crop
                </span>
                {CATEGORIES.map((cat) => (
                  <button
                    key={cat}
                    onClick={() => handleCategorySelect(cat)}
                    className="text-left px-2 py-1.5 text-xs text-charcoal-800 hover:text-agro-700 font-medium"
                  >
                    {cat}
                  </button>
                ))}
              </div>

              <button
                onClick={() => {
                  navigateToHome();
                  setMobileMenuOpen(false);
                  setTimeout(() => {
                    document.getElementById('about-section')?.scrollIntoView({ behavior: 'smooth' });
                  }, 100);
                }}
                className="text-left px-3 py-2.5 rounded-xl font-semibold text-sm text-charcoal-900 hover:bg-agro-50"
              >
                About Our Agriculture
              </button>

              <button
                onClick={() => {
                  navigateToHome();
                  setMobileMenuOpen(false);
                  setTimeout(() => {
                    document.getElementById('question-section')?.scrollIntoView({ behavior: 'smooth' });
                  }, 100);
                }}
                className="text-left px-3 py-2.5 rounded-xl font-semibold text-sm text-charcoal-900 hover:bg-agro-50"
              >
                Ask a Question / Advisory
              </button>

              <button
                onClick={() => {
                  setActiveView('admin');
                  setMobileMenuOpen(false);
                }}
                className="text-left px-3 py-2.5 rounded-xl font-semibold text-sm text-agro-800 bg-agro-50/80 flex items-center gap-2 mt-2"
              >
                <LayoutDashboard className="w-4 h-4 text-gold-600" />
                <span>Admin Inventory & Orders</span>
              </button>

              <div className="pt-4 mt-2 border-t border-gray-100 flex items-center justify-between text-xs text-charcoal-800">
                <span>Agri Hotline: +94 77 123 4567</span>
                <span className="font-bold text-agro-700">LKR Currency</span>
              </div>
            </div>
          </div>
        )}
      </header>
    </>
  );
};
