import React from 'react';
import { useStore } from '../../context/StoreContext';
import { ArrowRight, CheckCircle2, Sprout, ShieldCheck, Truck, CreditCard, Sparkles } from 'lucide-react';

export const Hero: React.FC = () => {
  const { navigateToCatalog } = useStore();

  return (
    <section className="relative overflow-hidden bg-agro-950 text-white">
      {/* Background Image Container with Soft Gradient Overlays */}
      <div className="absolute inset-0 z-0">
        <img
          src="https://images.unsplash.com/photo-1500937386664-56d1dfef3854?auto=format&fit=crop&w=2000&q=85"
          alt="Lush green agricultural farm in Sri Lanka"
          className="w-full h-full object-cover object-center scale-105 transition-transform duration-1000 ease-out transform"
        />
        {/* Multi-layered soft dark and agricultural emerald gradients for high text contrast */}
        <div className="absolute inset-0 bg-gradient-to-r from-agro-950/95 via-agro-950/80 to-agro-950/40" />
        <div className="absolute inset-0 bg-gradient-to-t from-agro-950 via-transparent to-agro-950/50" />
      </div>

      {/* Floating subtle decorative pattern */}
      <div className="absolute inset-0 bg-agro-grid opacity-15 pointer-events-none" />

      {/* Hero Content */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-16 pb-20 sm:pt-24 sm:pb-28 lg:pt-32 lg:pb-36">
        <div className="max-w-3xl">
          {/* Top Pill / Badge */}
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-agro-200 text-xs sm:text-sm font-medium mb-6 animate-in fade-in duration-500">
            <span className="flex h-2 w-2 rounded-full bg-gold-400 animate-ping" />
            <span className="font-semibold text-white">Certified Cultivars for Sri Lanka</span>
          </div>

          {/* Large Headline */}
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-white leading-[1.1] mb-6 drop-shadow-sm font-display">
            Grow Better.{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-agro-300 via-emerald-300 to-gold-300">
              Harvest Better.
            </span>
          </h1>

          {/* Supporting Text */}
          <p className="text-base sm:text-lg lg:text-xl text-agro-100/90 leading-relaxed font-normal mb-8 sm:mb-10 max-w-2xl drop-shadow">
            Premium agricultural seeds carefully selected to help farmers grow healthier and more
            productive crops across Sri Lanka's dry, wet, and intermediate agro-ecological zones.
          </p>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4 sm:gap-4">
            <button
              onClick={() => navigateToCatalog('All')}
              className="inline-flex items-center justify-center gap-2.5 px-7 py-4 rounded-2xl bg-gradient-to-r from-agro-500 to-agro-600 hover:from-agro-400 hover:to-agro-500 active:scale-95 text-white font-bold text-base shadow-soft-lg hover:shadow-soft-xl transition-all duration-200 border border-agro-300/30 group"
            >
              <span>Shop Seeds</span>
              <ArrowRight className="w-5 h-5 transition-transform duration-200 group-hover:translate-x-1" />
            </button>

            <button
              onClick={() => {
                const el = document.getElementById('featured-varieties-section');
                if (el) {
                  el.scrollIntoView({ behavior: 'smooth' });
                } else {
                  navigateToCatalog('All');
                }
              }}
              className="inline-flex items-center justify-center gap-2 px-7 py-4 rounded-2xl bg-white/10 hover:bg-white/20 backdrop-blur-md text-white font-semibold text-base border border-white/20 transition-all duration-200 active:scale-95"
            >
              <Sprout className="w-5 h-5 text-agro-300" />
              <span>Explore Varieties</span>
            </button>
          </div>

          {/* Micro Stat Highlights */}
          <div className="grid grid-cols-3 gap-4 sm:gap-8 pt-10 mt-10 border-t border-white/15 max-w-xl">
            <div>
              <div className="text-2xl sm:text-3xl font-bold font-display text-white">94%+</div>
              <div className="text-xs text-agro-200/80 mt-0.5">Average Germination</div>
            </div>
            <div>
              <div className="text-2xl sm:text-3xl font-bold font-display text-gold-300">12k+</div>
              <div className="text-xs text-agro-200/80 mt-0.5">Farmers & Growers</div>
            </div>
            <div>
              <div className="text-2xl sm:text-3xl font-bold font-display text-white">25</div>
              <div className="text-xs text-agro-200/80 mt-0.5">Districts Delivered</div>
            </div>
          </div>
        </div>
      </div>

      {/* Trust Section Directly Below Hero */}
      <div className="relative z-20 bg-agro-900/90 border-t border-b border-agro-700/50 backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-5">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-agro-800 flex items-center justify-center text-agro-300 border border-agro-600/50 flex-shrink-0">
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              </div>
              <div>
                <span className="text-xs sm:text-sm font-semibold text-white block">Quality Seeds</span>
                <span className="text-[11px] text-agro-200/70 hidden sm:block">Tested batch viability</span>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-agro-800 flex items-center justify-center text-agro-300 border border-agro-600/50 flex-shrink-0">
                <ShieldCheck className="w-4 h-4 text-emerald-400" />
              </div>
              <div>
                <span className="text-xs sm:text-sm font-semibold text-white block">Selected Varieties</span>
                <span className="text-[11px] text-agro-200/70 hidden sm:block">Sri Lankan climate bred</span>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-agro-800 flex items-center justify-center text-agro-300 border border-agro-600/50 flex-shrink-0">
                <Truck className="w-4 h-4 text-emerald-400" />
              </div>
              <div>
                <span className="text-xs sm:text-sm font-semibold text-white block">Islandwide Delivery</span>
                <span className="text-[11px] text-agro-200/70 hidden sm:block">Prompt 2-3 day courier</span>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-agro-800 flex items-center justify-center text-agro-300 border border-agro-600/50 flex-shrink-0">
                <CreditCard className="w-4 h-4 text-gold-400" />
              </div>
              <div>
                <span className="text-xs sm:text-sm font-semibold text-white block">Secure Online Payment</span>
                <span className="text-[11px] text-agro-200/70 hidden sm:block">PayHere & COD ready</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
