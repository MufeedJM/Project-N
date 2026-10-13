import React, { createContext, useContext, useState, useEffect } from 'react';
import { CartItem, Product } from '../types';

interface CartContextType {
  items: CartItem[];
  addToCart: (product: Product, quantity?: number) => void;
  removeFromCart: (productId: string) => void;
  updateQuantity: (productId: string, quantity: number) => void;
  clearCart: () => void;
  itemCount: number;
  subtotal: number;
  deliveryFee: number;
  totalWeightKg: number;
  total: number;
  isCartOpen: boolean;
  setIsCartOpen: (open: boolean) => void;
  freeDeliveryRemaining: number;
  freeDeliveryProgress: number;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

const CART_STORAGE_KEY = 'ceylon_seeds_cart';

export const CartProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [items, setItems] = useState<CartItem[]>(() => {
    try {
      const saved = localStorage.getItem(CART_STORAGE_KEY);
      if (saved) return JSON.parse(saved);
    } catch (e) {
      console.error('Could not load cart', e);
    }
    return [];
  });

  const [isCartOpen, setIsCartOpen] = useState(false);

  useEffect(() => {
    try {
      localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(items));
    } catch (e) {
      console.error('Could not save cart', e);
    }
  }, [items]);

  const addToCart = (product: Product, quantity = 1) => {
    if (quantity <= 0) return;
    setItems((prev) => {
      const existing = prev.find((item) => item.product.id === product.id);
      if (existing) {
        const newQty = Math.min(existing.quantity + quantity, product.stock);
        return prev.map((item) =>
          item.product.id === product.id ? { ...item, quantity: newQty } : item
        );
      }
      return [...prev, { product, quantity: Math.min(quantity, product.stock) }];
    });
  };

  const removeFromCart = (productId: string) => {
    setItems((prev) => prev.filter((item) => item.product.id !== productId));
  };

  const updateQuantity = (productId: string, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(productId);
      return;
    }
    setItems((prev) =>
      prev.map((item) => {
        if (item.product.id === productId) {
          const validQty = Math.min(quantity, item.product.stock);
          return { ...item, quantity: validQty };
        }
        return item;
      })
    );
  };

  const clearCart = () => {
    setItems([]);
  };

  const itemCount = items.reduce((sum, item) => sum + item.quantity, 0);
  const subtotal = items.reduce((sum, item) => sum + item.product.price * item.quantity, 0);

  const getProductWeightKg = (product: Product) => {
    const explicitWeight = Number(product.weight);
    if (Number.isFinite(explicitWeight) && explicitWeight >= 0) {
      return explicitWeight;
    }

    const isSeedProduct =
      product.inventoryType === 'Seed' ||
      (!product.inventoryType && product.category !== 'Fertilizer' && product.category !== 'Tools');

    return isSeedProduct ? 0.5 : 1;
  };

  const totalWeightKg = items.reduce(
    (sum, item) => sum + getProductWeightKg(item.product) * item.quantity,
    0
  );

  const deliveryFee = (() => {
    if (subtotal === 0) return 0;

    const isSeedOnlyOrder = items.every(
      (item) =>
        item.product.inventoryType === 'Seed' ||
        (!item.product.inventoryType && item.product.category !== 'Fertilizer' && item.product.category !== 'Tools')
    );

    if (isSeedOnlyOrder) {
      if (subtotal > 3000) return 450;
      if (subtotal > 2500) return 400;
      if (subtotal > 1000) return 300;
      return 250;
    }

    if (totalWeightKg <= 1) {
      return 425;
    }

    return 425 + (Math.ceil(totalWeightKg) - 1) * 100;
  })();

  const total = subtotal + deliveryFee;

  const freeDeliveryRemaining = 0;
  const freeDeliveryProgress = 0;

  return (
    <CartContext.Provider
      value={{
        items,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        itemCount,
        subtotal,
        deliveryFee,
        totalWeightKg,
        total,
        isCartOpen,
        setIsCartOpen,
        freeDeliveryRemaining,
        freeDeliveryProgress,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};
