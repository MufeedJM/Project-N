import React, { useState } from 'react';
import { Product } from '../../types';
import { useCart } from '../../context/CartContext';
import { useStore } from '../../context/StoreContext';
import {
  ArrowLeft,
  ShoppingBag,
  Zap,
  Sprout,
  Sun,
  Droplets,
  Thermometer,
  Calendar,
  Layers,
  ShieldCheck,
  Truck,
  CheckCircle2,
  Sparkles,
} from 'lucide-react';

interface ProductDetailsProps {
  product: Product;
}

export const ProductDetails: React.FC<ProductDetailsProps> = ({ product }) => {
  const { addToCart } = useCart();
  const { navigateToCatalog, navigateToCheckout, addToast } = useStore();

  const formatPackSize = (quantity: number, unit: string) => {
    const normalizedUnit = unit.trim();
    if (normalizedUnit === 'kg' || normalizedUnit === 'g') {
      return `${quantity}${normalizedUnit}`;
    }
    if (normalizedUnit === 'unit' || normalizedUnit === 'Unit') {
      return `${quantity}`;
    }
    return `${quantity} ${normalizedUnit}`;
  };

  const isToolProduct = product.category === 'Tools' || product.inventoryType === 'Tool';
  const showSeedSpecificDetails = !isToolProduct;

  const [selectedImage, setSelectedImage] = useState<string>(product.image);
  const [quantity, setQuantity] = useState<number>(1);
  const [activeTab, setActiveTab] = useState<'agronomy' | 'instructions' | 'storage'>('agronomy');

  const galleryImages = [product.image, ...(product.gallery || [])].filter(
    (val, idx, arr) => arr.indexOf(val) === idx
  );

  const handleAddToCart = () => {
    if (product.stock <= 0) return;
    addToCart(product, quantity);
    addToast(
      'Added to Cart',
      `${quantity}x ${product.name} (${product.variety}) added to your basket.`,
      'success'
    );
  };

  const handleBuyNow = () => {
    if (product.stock <= 0) return;
    addToCart(product, quantity);
    navigateToCheckout();
  };

  const isOutOfStock = product.stock <= 0;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
      {/* Breadcrumb / Back Link */}
      <button
        onClick={() => navigateToCatalog('All')}
        className="inline-flex items-center gap-2 text-xs sm:text-sm font-semibold text-agro-800 hover:text-agro-950 mb-6 group transition"
      >
        <ArrowLeft className="w-4 h-4 transition-transform group-hover:-translate-x-1" />
        <span>Back to Seed Catalog</span>
      </button>

      {/* Main Grid: Gallery & Primary Buy Box */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 bg-white rounded-3xl sm:rounded-4xl p-6 sm:p-8 lg:p-10 border border-agro-100 shadow-soft-lg">
        {/* Left: Image Gallery (5 cols on lg) */}
        <div className="lg:col-span-6 flex flex-col gap-4">
          {/* Main Selected Image */}
          <div className="relative aspect-[4/3] sm:aspect-square w-full rounded-2xl sm:rounded-3xl overflow-hidden bg-earth-100 border border-agro-100/60 shadow-inner group">
            <img
              src={selectedImage}
              alt={`${product.name} ${product.variety}`}
              className="w-full h-full object-cover object-center transition-transform duration-500 group-hover:scale-105"
            />

            {product.departmentApproved && (
              <div className="absolute top-4 left-4 z-10">
                <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-agro-900/90 text-agro-100 text-xs font-bold backdrop-blur-md border border-agro-600/60 shadow-md">
                  <ShieldCheck className="w-4 h-4 text-emerald-400" />
                  Certified Variety
                </span>
              </div>
            )}

            {!isToolProduct && product.germinationRate > 0 && (
              <div className="absolute top-4 right-4 z-10">
                <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white/95 text-agro-900 text-xs font-bold shadow-soft">
                  <Sprout className="w-4 h-4 text-emerald-600" />
                  {product.germinationRate}% Germination Tested
                </span>
              </div>
            )}
          </div>

          {/* Thumbnails */}
          {galleryImages.length > 1 && (
            <div className="flex items-center gap-3 overflow-x-auto pb-2">
              {galleryImages.map((img, index) => (
                <button
                  key={index}
                  onClick={() => setSelectedImage(img)}
                  className={`relative w-20 h-20 flex-shrink-0 rounded-xl overflow-hidden border-2 transition-all ${
                    selectedImage === img
                      ? 'border-agro-600 ring-2 ring-agro-200 scale-95'
                      : 'border-transparent opacity-75 hover:opacity-100'
                  }`}
                >
                  <img
                    src={img}
                    alt={`Thumbnail ${index + 1}`}
                    className="w-full h-full object-cover"
                  />
                </button>
              ))}
            </div>
          )}

          {product.imageCredit && (
            <p className="text-[11px] text-charcoal-800/70">
              Photo:{' '}
              <a
                href={product.imageCredit.sourceUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="underline hover:text-agro-800"
              >
                {product.imageCredit.name}
              </a>
              {' · '}
              <a
                href={product.imageCredit.licenseUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="underline hover:text-agro-800"
              >
                {product.imageCredit.license}
              </a>
            </p>
          )}

          {/* Trust Guarantees */}
          <div className="grid grid-cols-2 gap-3 pt-4 border-t border-earth-100 text-xs text-charcoal-800">
            <div className="flex items-center gap-2 p-3 rounded-xl bg-earth-50 border border-earth-200/60">
              <ShieldCheck className="w-4 h-4 text-agro-700 flex-shrink-0" />
              <span>Hermetically Sealed Foil Pack</span>
            </div>
            <div className="flex items-center gap-2 p-3 rounded-xl bg-earth-50 border border-earth-200/60">
              <Truck className="w-4 h-4 text-agro-700 flex-shrink-0" />
              <span>Islandwide 2-3 Day Delivery</span>
            </div>
          </div>
        </div>

        {/* Right: Product Details & Purchase Controls (6 cols on lg) */}
        <div className="lg:col-span-6 flex flex-col justify-between">
          <div>
            {/* Category & Crop Type */}
            <div className="flex items-center gap-2 mb-2">
              <span className="text-xs font-bold uppercase tracking-wider px-2.5 py-1 rounded-md bg-agro-100 text-agro-800">
                {product.category}
              </span>
              <span className="text-xs text-gray-500 font-medium">
                • {product.cropType}
              </span>
            </div>

            {/* Product Title */}
            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-charcoal-900 font-display">
              {product.name}
            </h1>

            {/* Variety Callout */}
            <div className="flex items-center gap-3 mt-2">
              <span className="text-sm font-semibold text-agro-800 bg-agro-50 px-3 py-1 rounded-lg border border-agro-200/60">
                Cultivar / Variety: <span className="font-bold">{product.variety}</span>
              </span>
            </div>

            {/* Pricing Section */}
            <div className="mt-5 p-4 rounded-2xl bg-earth-50/70 border border-earth-200/60 flex items-baseline justify-between">
              <div>
                <span className="text-xs font-medium text-gray-500 block mb-0.5">Retail Price</span>
                <div className="flex items-baseline gap-1.5">
                  <span className="text-base font-bold text-agro-800">LKR</span>
                  <span className="text-3xl sm:text-4xl font-extrabold text-charcoal-950 font-display">
                    {product.price.toLocaleString()}
                  </span>
                </div>
              </div>

              <div className="text-right">
                <span className="text-xs text-gray-500 block">Package Size</span>
                <span className="text-sm font-bold text-agro-900">
                  {formatPackSize(product.quantity, product.unit)} / Packet
                </span>
                <div className="mt-1">
                  {isOutOfStock ? (
                    <span className="text-xs font-bold text-rose-600 bg-rose-50 px-2.5 py-0.5 rounded-full">
                      Out of Stock
                    </span>
                  ) : (
                    <span className="text-xs font-bold text-emerald-700 bg-emerald-50 px-2.5 py-0.5 rounded-full">
                      In Stock ({product.stock} packets available)
                    </span>
                  )}
                </div>
              </div>
            </div>

            {/* Short Narrative Description */}
            <p className="mt-5 text-sm sm:text-base text-charcoal-800/80 leading-relaxed">
              {product.description}
            </p>

            {/* Agro Quick Stats Grid */}
            {showSeedSpecificDetails && (
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 mt-6">
                {product.plantingSeason && (
                  <div className="p-3 rounded-xl bg-agro-50/60 border border-agro-100 text-center">
                    <Calendar className="w-4 h-4 text-agro-700 mx-auto mb-1" />
                    <span className="text-[10px] text-gray-500 block">Season</span>
                    <span className="text-xs font-bold text-agro-900">{product.plantingSeason}</span>
                  </div>
                )}

                {product.germinationRate > 0 && (
                  <div className="p-3 rounded-xl bg-agro-50/60 border border-agro-100 text-center">
                    <Sprout className="w-4 h-4 text-emerald-600 mx-auto mb-1" />
                    <span className="text-[10px] text-gray-500 block">Germination</span>
                    <span className="text-xs font-bold text-agro-900">{product.germinationRate}% Viable</span>
                  </div>
                )}

                {product.sowingDepth && (
                  <div className="p-3 rounded-xl bg-agro-50/60 border border-agro-100 text-center">
                    <Layers className="w-4 h-4 text-earth-700 mx-auto mb-1" />
                    <span className="text-[10px] text-gray-500 block">Depth</span>
                    <span className="text-xs font-bold text-agro-900">{product.sowingDepth}</span>
                  </div>
                )}

                {product.harvestInformation && (
                  <div className="p-3 rounded-xl bg-agro-50/60 border border-agro-100 text-center">
                    <Sparkles className="w-4 h-4 text-gold-600 mx-auto mb-1" />
                    <span className="text-[10px] text-gray-500 block">First Harvest</span>
                    <span className="text-xs font-bold text-agro-900 truncate">
                      {product.harvestInformation.split(' ')[0]} Days
                    </span>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Action Box: Quantity, Add to Cart & Buy Now */}
          <div className="mt-8 pt-6 border-t border-earth-100">
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4">
              {/* Quantity Selector */}
              <div className="flex items-center justify-between sm:justify-start border border-agro-200 rounded-2xl p-1 bg-white shadow-xs">
                <span className="text-xs text-gray-500 font-semibold px-3 hidden sm:inline">
                  Qty:
                </span>
                <div className="flex items-center">
                  <button
                    onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                    disabled={quantity <= 1 || isOutOfStock}
                    className="w-10 h-10 rounded-xl flex items-center justify-center text-charcoal-800 hover:bg-agro-50 disabled:opacity-30 disabled:hover:bg-transparent font-bold text-lg"
                    aria-label="Decrease quantity"
                  >
                    -
                  </button>
                  <span className="w-12 text-center font-bold text-charcoal-900 text-sm">
                    {quantity}
                  </span>
                  <button
                    onClick={() => setQuantity((q) => Math.min(product.stock, q + 1))}
                    disabled={quantity >= product.stock || isOutOfStock}
                    className="w-10 h-10 rounded-xl flex items-center justify-center text-charcoal-800 hover:bg-agro-50 disabled:opacity-30 disabled:hover:bg-transparent font-bold text-lg"
                    aria-label="Increase quantity"
                  >
                    +
                  </button>
                </div>
              </div>

              {/* Add to Cart Button */}
              <button
                onClick={handleAddToCart}
                disabled={isOutOfStock}
                className="flex-1 inline-flex items-center justify-center gap-2 py-4 px-6 rounded-2xl bg-agro-700 hover:bg-agro-800 active:scale-95 text-white font-bold text-sm shadow-soft transition disabled:bg-gray-300 disabled:cursor-not-allowed"
              >
                <ShoppingBag className="w-4 h-4" />
                <span>Add to Cart</span>
              </button>

              {/* Buy Now Button */}
              <button
                onClick={handleBuyNow}
                disabled={isOutOfStock}
                className="inline-flex items-center justify-center gap-2 py-4 px-6 rounded-2xl bg-gold-500 hover:bg-gold-600 active:scale-95 text-charcoal-950 font-bold text-sm shadow-soft transition disabled:bg-gray-200 disabled:text-gray-400 disabled:cursor-not-allowed"
              >
                <Zap className="w-4 h-4 fill-charcoal-950" />
                <span>Buy Now</span>
              </button>
            </div>

            {/* Small Trust Indicators Near Purchase Buttons */}
            <div className="flex items-center justify-center sm:justify-start gap-4 sm:gap-6 mt-4 text-[11px] text-gray-500 font-medium">
              <span className="flex items-center gap-1">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                Quality Checked
              </span>
              <span className="flex items-center gap-1">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                Secure Checkout
              </span>
              <span className="flex items-center gap-1">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                Islandwide Delivery
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Tabs Section: Agronomy, Planting Instructions & Storage */}
      {showSeedSpecificDetails && (
        <div className="mt-12 bg-white rounded-3xl p-6 sm:p-10 border border-agro-100 shadow-soft">
          <div className="flex border-b border-earth-100 gap-4 sm:gap-8 pb-4">
            <button
              onClick={() => setActiveTab('agronomy')}
              className={`text-sm sm:text-base font-bold pb-2 border-b-2 transition ${
                activeTab === 'agronomy'
                  ? 'border-agro-600 text-agro-900'
                  : 'border-transparent text-gray-400 hover:text-charcoal-800'
              }`}
            >
              Growing Conditions & Agronomy
            </button>
            <button
              onClick={() => setActiveTab('instructions')}
              className={`text-sm sm:text-base font-bold pb-2 border-b-2 transition ${
                activeTab === 'instructions'
                  ? 'border-agro-600 text-agro-900'
                  : 'border-transparent text-gray-400 hover:text-charcoal-800'
              }`}
            >
              Planting & Spacing Guide
            </button>
            <button
              onClick={() => setActiveTab('storage')}
              className={`text-sm sm:text-base font-bold pb-2 border-b-2 transition ${
                activeTab === 'storage'
                  ? 'border-agro-600 text-agro-900'
                  : 'border-transparent text-gray-400 hover:text-charcoal-800'
              }`}
            >
              Storage & Viability
            </button>
          </div>

          <div className="pt-6">
            {activeTab === 'agronomy' && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="flex items-start gap-4 p-4 rounded-2xl bg-earth-50/60 border border-earth-200/50">
                  <div className="w-10 h-10 rounded-xl bg-agro-100 flex items-center justify-center text-agro-700 flex-shrink-0">
                    <Sun className="w-5 h-5 text-amber-500" />
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-charcoal-900">Sunlight Requirement</h4>
                    <p className="text-xs sm:text-sm text-charcoal-800/80 mt-1">
                      {product.growingConditions.sunlight}
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-4 p-4 rounded-2xl bg-earth-50/60 border border-earth-200/50">
                  <div className="w-10 h-10 rounded-xl bg-agro-100 flex items-center justify-center text-agro-700 flex-shrink-0">
                    <Layers className="w-5 h-5 text-emerald-600" />
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-charcoal-900">Recommended Soil</h4>
                    <p className="text-xs sm:text-sm text-charcoal-800/80 mt-1">
                      {product.growingConditions.soil}
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-4 p-4 rounded-2xl bg-earth-50/60 border border-earth-200/50">
                  <div className="w-10 h-10 rounded-xl bg-agro-100 flex items-center justify-center text-agro-700 flex-shrink-0">
                    <Thermometer className="w-5 h-5 text-rose-500" />
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-charcoal-900">Ideal Climate & Temp</h4>
                    <p className="text-xs sm:text-sm text-charcoal-800/80 mt-1">
                      {product.growingConditions.temperature}
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-4 p-4 rounded-2xl bg-earth-50/60 border border-earth-200/50">
                  <div className="w-10 h-10 rounded-xl bg-agro-100 flex items-center justify-center text-agro-700 flex-shrink-0">
                    <Droplets className="w-5 h-5 text-sky-500" />
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-charcoal-900">Watering Schedule</h4>
                    <p className="text-xs sm:text-sm text-charcoal-800/80 mt-1">
                      {product.growingConditions.watering}
                    </p>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'instructions' && (
              <div className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div className="p-4 rounded-2xl bg-agro-50/50 border border-agro-100">
                    <span className="text-xs text-gray-500 block">Plant Spacing</span>
                    <span className="text-sm font-bold text-agro-900 mt-1 block">
                      {product.plantSpacing}
                    </span>
                  </div>
                  <div className="p-4 rounded-2xl bg-agro-50/50 border border-agro-100">
                    <span className="text-xs text-gray-500 block">Sowing Depth</span>
                    <span className="text-sm font-bold text-agro-900 mt-1 block">
                      {product.sowingDepth}
                    </span>
                  </div>
                  <div className="p-4 rounded-2xl bg-agro-50/50 border border-agro-100">
                    <span className="text-xs text-gray-500 block">Harvest Expectation</span>
                    <span className="text-sm font-bold text-agro-900 mt-1 block">
                      {product.harvestInformation}
                    </span>
                  </div>
                </div>

                <div className="p-5 rounded-2xl bg-earth-50 border border-earth-200 text-xs sm:text-sm text-charcoal-800 space-y-2">
                  <h4 className="font-bold text-charcoal-900">Step-by-Step Planting Tips:</h4>
                  <ol className="list-decimal pl-5 space-y-1.5 leading-relaxed">
                    <li>
                      Prepare seedling nursery trays or nursery raised beds with fine compost and coir dust mix (1:1).
                    </li>
                    <li>
                      Sow seeds at {product.sowingDepth} depth and cover lightly with sifted topsoil.
                    </li>
                    <li>
                      Moisten with a fine mist sprayer twice daily. Germination typically begins within 5-8 days.
                    </li>
                    <li>
                      Transplant healthy seedlings with 3-4 true leaves into well-tilled field beds spacing {product.plantSpacing} apart.
                    </li>
                  </ol>
                </div>
              </div>
            )}

            {activeTab === 'storage' && (
              <div className="p-5 rounded-2xl bg-earth-50 border border-earth-200 text-xs sm:text-sm text-charcoal-800 space-y-3">
                <h4 className="font-bold text-charcoal-900">Seed Storage & Shelf Life</h4>
                <p>
                  Our seeds are packaged in multi-layered, hermetically sealed aluminum foil pouches
                  with desiccant packets to prevent ambient tropical moisture absorption.
                </p>
                <ul className="list-disc pl-5 space-y-1">
                  <li>Store unopened seed packs in a cool, dry location below 20°C or refrigerator vegetable crisper.</li>
                  <li>Once opened, reseal tightly and sow within the current planting season for optimal germination.</li>
                  <li>Guaranteed minimum {product.germinationRate}% germination viability for 12 months from packing date.</li>
                </ul>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Why Choose Our Seeds Banner */}
      <div className="mt-12 bg-gradient-to-r from-agro-900 via-agro-800 to-agro-950 text-white rounded-3xl p-8 sm:p-10 shadow-soft-xl">
        <h3 className="text-xl sm:text-2xl font-bold font-display text-white mb-2">
          Why Choose FLORA SEEDS?
        </h3>
        <p className="text-xs sm:text-sm text-agro-200 max-w-2xl mb-6">
          Every seed lot undergoes rigorous purity and germination trials at our agricultural test
          facility to ensure high yields under Sri Lankan soil conditions.
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 pt-4 border-t border-white/10">
          <div className="flex items-start gap-3">
            <CheckCircle2 className="w-5 h-5 text-emerald-400 flex-shrink-0 mt-0.5" />
            <div>
              <h4 className="text-sm font-semibold text-white">Vigor Tested</h4>
              <p className="text-xs text-agro-200/80 mt-0.5">High seed energy ensuring rapid, uniform emergence.</p>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <CheckCircle2 className="w-5 h-5 text-emerald-400 flex-shrink-0 mt-0.5" />
            <div>
              <h4 className="text-sm font-semibold text-white">Bacterial Wilt Resistant</h4>
              <p className="text-xs text-agro-200/80 mt-0.5">Selected specifically for Sri Lanka's tropical pathogens.</p>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <CheckCircle2 className="w-5 h-5 text-emerald-400 flex-shrink-0 mt-0.5" />
            <div>
              <h4 className="text-sm font-semibold text-white">Agronomist Support</h4>
              <p className="text-xs text-agro-200/80 mt-0.5">Free WhatsApp agricultural advice for registered growers.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
