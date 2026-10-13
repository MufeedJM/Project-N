import React from 'react';
import { useCart } from '../../context/CartContext';
import { useStore } from '../../context/StoreContext';
import { BRAND_CONFIG } from '../../data/products';
import {
  X,
  Trash2,
  Plus,
  Minus,
  ShoppingBag,
  ArrowRight,
  Truck,
  ShieldCheck,
  Sparkles,
} from 'lucide-react';

const formatPackSize = (quantity: number, unit: string) => {
  const normalizedUnit = unit.trim();
  if (normalizedUnit === 'kg' || normalizedUnit === 'g') {
    return `${quantity}${normalizedUnit}`;
  }
  return `${quantity} ${normalizedUnit}`;
};

export const CartDrawer: React.FC = () => {
  const {
    items,
    removeFromCart,
    updateQuantity,
    subtotal,
    deliveryFee,
    totalWeightKg,
    total,
    isCartOpen,
    setIsCartOpen,
    itemCount,
  } = useCart();

  const { navigateToCheckout, navigateToCatalog } = useStore();

  if (!isCartOpen) return null;

  const handleCheckoutClick = () => {
    setIsCartOpen(false);
    navigateToCheckout();
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      {/* Backdrop */}
      <div
        onClick={() => setIsCartOpen(false)}
        className="absolute inset-0 bg-black/50 backdrop-blur-xs transition-opacity duration-300"
      />

      <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
        <div className="w-screen max-w-md bg-white shadow-2xl flex flex-col">
          {/* Cart Header */}
          <div className="p-5 sm:p-6 border-b border-earth-100 flex items-center justify-between bg-agro-50/50">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-xl bg-agro-700 text-white flex items-center justify-center shadow-xs">
                <ShoppingBag className="w-4 h-4" />
              </div>
              <div>
                <h3 className="text-base sm:text-lg font-bold text-charcoal-900 font-display">
                  Your Seed Cart
                </h3>
                <span className="text-xs text-gray-500 font-medium">
                  {itemCount} {itemCount === 1 ? 'packet' : 'packets'} selected
                </span>
              </div>
            </div>

            <button
              onClick={() => setIsCartOpen(false)}
              className="p-2 rounded-xl text-gray-400 hover:text-charcoal-800 hover:bg-earth-100 transition"
              aria-label="Close cart"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Courier Fee Summary */}
          <div className="px-6 py-3 bg-earth-50 border-b border-earth-200/60">
            <div className="flex items-center justify-between text-xs font-medium text-charcoal-800">
              <span className="flex items-center gap-1.5">
                <Truck className="w-3.5 h-3.5 text-agro-700" />
                <span>Courier Fee</span>
              </span>
              <span className="font-bold text-agro-900">LKR {deliveryFee.toLocaleString()}</span>
            </div>
            <div className="text-[11px] text-gray-500 mt-1">
              Estimated shipping for {totalWeightKg.toFixed(1)}kg total parcel weight.
            </div>
          </div>

          {/* Cart Items List */}
          <div className="flex-1 overflow-y-auto p-5 sm:p-6 divide-y divide-earth-100">
            {items.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-center py-12">
                <div className="w-16 h-16 rounded-full bg-agro-50 text-agro-600 flex items-center justify-center mb-4 border border-agro-200">
                  <ShoppingBag className="w-8 h-8 opacity-60" />
                </div>
                <h4 className="text-base font-bold text-charcoal-900 font-display">
                  Your seed cart is empty
                </h4>
                <p className="text-xs text-charcoal-800/70 mt-1 max-w-xs">
                  Browse our certified Sri Lankan agricultural varieties and add seeds to your garden plan.
                </p>
                <button
                  onClick={() => {
                    setIsCartOpen(false);
                    navigateToCatalog('All');
                  }}
                  className="mt-6 inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-agro-700 hover:bg-agro-800 text-white font-semibold text-xs shadow-soft transition"
                >
                  <span>Explore Seeds Catalog</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            ) : (
              items.map(({ product, quantity }) => (
                <div key={product.id} className="py-4 first:pt-0 last:pb-0 flex gap-4">
                  {/* Thumbnail */}
                  <div className="w-20 h-20 rounded-2xl overflow-hidden bg-earth-100 flex-shrink-0 border border-agro-100">
                    <img
                      src={product.image}
                      alt={product.name}
                      className="w-full h-full object-cover object-center"
                    />
                  </div>

                  {/* Info */}
                  <div className="flex-1 flex flex-col justify-between">
                    <div>
                      <div className="flex items-start justify-between gap-2">
                        <div>
                          <h4 className="text-sm font-bold text-charcoal-900 line-clamp-1">
                            {product.name}
                          </h4>
                          <span className="text-[11px] font-semibold text-agro-700 block">
                            Variety: {product.variety}
                          </span>
                        </div>
                        <button
                          onClick={() => removeFromCart(product.id)}
                          className="text-gray-400 hover:text-rose-600 transition p-1"
                          aria-label={`Remove ${product.name} from cart`}
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>

                      <div className="text-[11px] text-gray-500 mt-0.5">
                        {formatPackSize(product.quantity, product.unit)} / pack
                      </div>
                    </div>

                    <div className="flex items-center justify-between mt-2 pt-2">
                      {/* Quantity Controls */}
                      <div className="flex items-center border border-earth-200 rounded-xl bg-earth-50/50 p-0.5">
                        <button
                          onClick={() => updateQuantity(product.id, quantity - 1)}
                          className="w-6 h-6 rounded-lg flex items-center justify-center text-charcoal-800 hover:bg-white transition"
                          aria-label="Decrease quantity"
                        >
                          <Minus className="w-3 h-3" />
                        </button>
                        <span className="w-8 text-center text-xs font-bold text-charcoal-900">
                          {quantity}
                        </span>
                        <button
                          onClick={() => updateQuantity(product.id, quantity + 1)}
                          disabled={quantity >= product.stock}
                          className="w-6 h-6 rounded-lg flex items-center justify-center text-charcoal-800 hover:bg-white disabled:opacity-30 transition"
                          aria-label="Increase quantity"
                        >
                          <Plus className="w-3 h-3" />
                        </button>
                      </div>

                      {/* Line Price */}
                      <div className="text-right">
                        <span className="text-xs font-extrabold text-charcoal-900">
                          LKR {(product.price * quantity).toLocaleString()}
                        </span>
                        {quantity > 1 && (
                          <span className="block text-[10px] text-gray-500">
                            LKR {product.price.toLocaleString()} each
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Cart Footer & Checkout */}
          {items.length > 0 && (
            <div className="p-5 sm:p-6 border-t border-earth-100 bg-earth-50/50 space-y-4">
              <div className="space-y-2 text-xs">
                <div className="flex justify-between text-charcoal-800">
                  <span>Subtotal</span>
                  <span className="font-semibold">LKR {subtotal.toLocaleString()}</span>
                </div>

                <div className="flex justify-between text-charcoal-800">
                  <span className="flex items-center gap-1">
                    <span>Islandwide Courier Delivery</span>
                    {deliveryFee === 0 && (
                      <span className="text-[10px] font-bold text-emerald-700 bg-emerald-100 px-1.5 py-0.2 rounded">
                        FREE
                      </span>
                    )}
                  </span>
                  <span className="font-semibold">
                    {deliveryFee === 0 ? 'LKR 0' : `LKR ${deliveryFee.toLocaleString()}`}
                  </span>
                </div>

                <div className="pt-2 border-t border-earth-200/80 flex justify-between items-baseline">
                  <span className="text-sm font-bold text-charcoal-900">Total Amount</span>
                  <div className="text-right">
                    <span className="text-xs font-bold text-agro-800 mr-1">LKR</span>
                    <span className="text-xl font-extrabold text-charcoal-950 font-display">
                      {total.toLocaleString()}
                    </span>
                  </div>
                </div>
              </div>

              {/* Checkout Button */}
              <button
                onClick={handleCheckoutClick}
                className="w-full inline-flex items-center justify-center gap-2 py-4 px-6 rounded-2xl bg-agro-700 hover:bg-agro-800 active:scale-95 text-white font-bold text-sm shadow-soft hover:shadow-soft-lg transition-all"
              >
                <span>Proceed to Checkout</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <div className="flex items-center justify-center gap-2 text-[11px] text-gray-500">
                <ShieldCheck className="w-3.5 h-3.5 text-agro-700" />
                <span>Secure payment gateway ready • Islandwide courier</span>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
