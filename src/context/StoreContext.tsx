import React, { createContext, useContext, useState } from 'react';
import { Order, Product, ProductCategory, ToastMessage } from '../types';

export type AppView = 'home' | 'catalog' | 'details' | 'checkout' | 'order-success' | 'admin';

interface StoreContextType {
  activeView: AppView;
  setActiveView: (view: AppView) => void;
  selectedCategory: ProductCategory | 'All';
  setSelectedCategory: (cat: ProductCategory | 'All') => void;
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  sortBy: 'popular' | 'price-asc' | 'price-desc' | 'newest';
  setSortBy: (sort: 'popular' | 'price-asc' | 'price-desc' | 'newest') => void;
  maxPrice: number;
  setMaxPrice: (price: number) => void;
  selectedProduct: Product | null;
  setSelectedProduct: (product: Product | null) => void;
  lastCompletedOrder: Order | null;
  setLastCompletedOrder: (order: Order | null) => void;
  toasts: ToastMessage[];
  addToast: (title: string, message: string, type?: ToastMessage['type']) => void;
  removeToast: (id: string) => void;
  navigateToCatalog: (category?: ProductCategory | 'All') => void;
  navigateToProduct: (product: Product) => void;
  navigateToCheckout: () => void;
  navigateToHome: () => void;
}

const StoreContext = createContext<StoreContextType | undefined>(undefined);

export const StoreProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [activeView, setActiveView] = useState<AppView>('home');
  const [selectedCategory, setSelectedCategory] = useState<ProductCategory | 'All'>('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState<'popular' | 'price-asc' | 'price-desc' | 'newest'>('popular');
  const [maxPrice, setMaxPrice] = useState<number>(1000);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [lastCompletedOrder, setLastCompletedOrder] = useState<Order | null>(null);
  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  const addToast = (title: string, message: string, type: ToastMessage['type'] = 'success') => {
    const id = `toast-${Date.now()}-${Math.random()}`;
    const newToast: ToastMessage = { id, title, message, type };
    setToasts((prev) => [...prev, newToast]);

    setTimeout(() => {
      removeToast(id);
    }, 4000);
  };

  const removeToast = (id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  const navigateToCatalog = (category: ProductCategory | 'All' = 'All') => {
    setSelectedCategory(category);
    setActiveView('catalog');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const navigateToProduct = (product: Product) => {
    setSelectedProduct(product);
    setActiveView('details');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const navigateToCheckout = () => {
    setActiveView('checkout');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const navigateToHome = () => {
    setActiveView('home');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <StoreContext.Provider
      value={{
        activeView,
        setActiveView,
        selectedCategory,
        setSelectedCategory,
        searchQuery,
        setSearchQuery,
        sortBy,
        setSortBy,
        maxPrice,
        setMaxPrice,
        selectedProduct,
        setSelectedProduct,
        lastCompletedOrder,
        setLastCompletedOrder,
        toasts,
        addToast,
        removeToast,
        navigateToCatalog,
        navigateToProduct,
        navigateToCheckout,
        navigateToHome,
      }}
    >
      {children}
    </StoreContext.Provider>
  );
};

export const useStore = () => {
  const context = useContext(StoreContext);
  if (!context) {
    throw new Error('useStore must be used within a StoreProvider');
  }
  return context;
};
