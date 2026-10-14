import React from 'react';
import { Product } from '../../types';
import { useCart } from '../../context/CartContext';
import { useStore } from '../../context/StoreContext';
import {
  ShoppingBag,
  Eye,
  CheckCircle,
  Sprout,
  ShieldCheck,
  Sparkles,
} from 'lucide-react';

interface ProductCardProps {
  product: Product;
}

export const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  const { addToCart } = useCart();
  const { navigateToProduct, addToast } = useStore();

  const formatPackSize = (quantity: number, unit: string) => {
    const normalizedUnit = unit.trim();
    if (normalizedUnit === 'kg' || normalizedUnit === 'g') {
      return `${quantity}${normalizedUnit}`;
    }
    return `${quantity} ${normalizedUnit}`;
  };

  const handleAddToCart = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (product.stock <= 0) return;
    addToCart(product, 1);
    addToast(
      'Added to Cart',
      `${product.name} (${product.variety}) added to your basket.`,
      'success'
    );
  };

  const isLowStock = product.stock > 0 && product.stock <= 25;
  const isOutOfStock = product.stock <= 0;

  return (
    <div
      onClick={() => navigateToProduct(product)}
      className="group relative bg-white rounded-3xl border border-agro-100 shadow-soft hover:shadow-soft-xl hover:-translate-y-1 transition-all duration-300 flex flex-col overflow-hidden cursor-pointer"
    >
      {/* Product Image & Badges Container */}
      <div className="relative aspect-[4/3] w-full overflow-hidden bg-earth-100">
        <img
          src={product.image}
          alt={`${product.name} - ${product.variety}`}
          loading="lazy"
          className="w-full h-full object-cover object-center group-hover:scale-108 transition-transform duration-500 ease-out"
        />

        {/* Subtle Dark Bottom Gradient for Image Contrast */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent opacity-60 group-hover:opacity-40 transition-opacity" />

        {/* Top Badges */}
        <div className="absolute top-3 left-3 flex flex-wrap gap-1.5 z-10">
          {product.featured && (
            <span className="inline-flex items-center gap-1 text-[11px] font-bold px-2.5 py-1 rounded-full bg-agro-700/90 text-white backdrop-blur-md shadow-sm">
              <Sparkles className="w-3 h-3 text-gold-300" />
              Featured
            </span>
          )}
          {product.bestSeller && (
            <span className="inline-flex items-center gap-1 text-[11px] font-bold px-2.5 py-1 rounded-full bg-gold-600/95 text-white backdrop-blur-md shadow-sm">
              Best Seller
            </span>
          )}
          {product.departmentApproved && (
            <span className="inline-flex items-center gap-1 text-[11px] font-semibold px-2 py-0.5 rounded-full bg-white/95 text-agro-900 backdrop-blur-md border border-agro-200 shadow-xs">
              <ShieldCheck className="w-3 h-3 text-agro-600" />
              Govt Certified
            </span>
          )}
        </div>

        {/* Germination Viability Badge */}
        {product.germinationRate > 0 && (
          <div className="absolute top-3 right-3 z-10">
            <span className="inline-flex items-center gap-1 text-[11px] font-bold px-2.5 py-1 rounded-full bg-white/95 text-agro-900 shadow-sm border border-agro-100">
              <Sprout className="w-3 h-3 text-emerald-600" />
              {product.germinationRate}% Germination
            </span>
          </div>
        )}

        {/* Category Pill Over Image Bottom */}
        <div className="absolute bottom-2.5 left-3 z-10">
          <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-md bg-black/60 text-white backdrop-blur-sm">
            {product.category}
          </span>
        </div>
        {product.imageCredit && (
          <div className="absolute bottom-2 right-2 z-10 rounded-md bg-black/65 px-2 py-1 text-[9px] text-white backdrop-blur-sm">
            Photo{' '}
            <a
              href={product.imageCredit.sourceUrl}
              target="_blank"
              rel="noopener noreferrer"
              onClick={(event) => event.stopPropagation()}
              className="underline"
            >
              {product.imageCredit.name}
            </a>
            {' · '}
            <a
              href={product.imageCredit.licenseUrl}
              target="_blank"
              rel="noopener noreferrer"
              onClick={(event) => event.stopPropagation()}
              className="underline"
            >
              {product.imageCredit.license}
            </a>
          </div>
        )}
      </div>

      {/* Card Content Details */}
      <div className="p-5 flex-1 flex flex-col justify-between">
        <div>
          {/* Variety & Crop Type */}
          <div className="flex items-center justify-between gap-2 mb-1.5">
            {product.variety !== product.name && (
              <span className="text-xs font-semibold text-agro-700 bg-agro-50 px-2 py-0.5 rounded-md border border-agro-200/60 truncate">
                Variety: {product.variety}
              </span>
            )}
            <span className="text-[11px] text-gray-500 font-medium">
              {product.cropType}
            </span>
          </div>

          {/* Product Name */}
          <h3 className="text-lg font-bold text-charcoal-900 group-hover:text-agro-800 transition line-clamp-1">
            {product.name}
          </h3>

          {/* Short Description */}
          <p className="text-xs text-charcoal-800/75 mt-1.5 line-clamp-2 leading-relaxed">
            {product.description}
          </p>

          {/* Quantity & Stock Availability Strip */}
          <div className="mt-3 pt-3 border-t border-earth-100 flex items-center justify-between text-xs">
            <div className="flex items-center gap-1 text-charcoal-800 font-medium">
              <span className="text-gray-500">Pack:</span>
              <span className="font-bold text-agro-900">{formatPackSize(product.quantity, product.unit)}</span>
            </div>

            {/* Stock status */}
            <div>
              {isOutOfStock ? (
                <span className="text-rose-600 font-semibold text-[11px] bg-rose-50 px-2 py-0.5 rounded-full">
                  Out of Stock
                </span>
              ) : isLowStock ? (
                <span className="text-amber-700 font-semibold text-[11px] bg-amber-50 px-2 py-0.5 rounded-full">
                  Only {product.stock} left
                </span>
              ) : (
                <span className="inline-flex items-center gap-1 text-emerald-700 font-semibold text-[11px] bg-emerald-50 px-2 py-0.5 rounded-full">
                  <CheckCircle className="w-3 h-3 text-emerald-600" />
                  In Stock ({product.stock})
                </span>
              )}
            </div>
          </div>
        </div>

        {/* Pricing and Action Buttons */}
        <div className="mt-4 pt-3 border-t border-earth-100">
          <div className="flex items-baseline justify-between mb-3">
            <div>
              <span className="text-[11px] uppercase tracking-wider font-semibold text-gray-500 block">
                Price
              </span>
              <div className="flex items-baseline gap-1">
                <span className="text-xs font-bold text-agro-800">LKR</span>
                <span className="text-2xl font-extrabold text-charcoal-950 font-display">
                  {product.price.toLocaleString()}
                </span>
              </div>
            </div>
            <span className="text-[11px] text-gray-500">per packet</span>
          </div>

          <div className="grid grid-cols-2 gap-2">
            <button
              onClick={() => navigateToProduct(product)}
              className="inline-flex items-center justify-center gap-1.5 px-3 py-2.5 rounded-xl bg-earth-100/80 hover:bg-earth-200 text-charcoal-900 font-semibold text-xs transition duration-150 active:scale-95"
            >
              <Eye className="w-3.5 h-3.5 text-agro-700" />
              <span>View Details</span>
            </button>

            <button
              onClick={handleAddToCart}
              disabled={isOutOfStock}
              className={`inline-flex items-center justify-center gap-1.5 px-3 py-2.5 rounded-xl font-semibold text-xs transition-all duration-150 active:scale-95 ${
                isOutOfStock
                  ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
                  : 'bg-agro-700 hover:bg-agro-800 text-white shadow-sm hover:shadow-md'
              }`}
            >
              <ShoppingBag className="w-3.5 h-3.5" />
              <span>Add to Cart</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
