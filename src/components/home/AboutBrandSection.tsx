import React from 'react';
import { useStore } from '../../context/StoreContext';
import {
  Sprout,
  ShieldCheck,
  Award,
  Users,
  CheckCircle2,
  ArrowRight,
  Leaf,
} from 'lucide-react';

export const AboutBrandSection: React.FC = () => {
  const { navigateToCatalog } = useStore();

  return (
    <section id="about-section" className="py-16 sm:py-24 bg-white relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
          {/* Left Visual Composition (5 cols on lg) */}
          <div className="lg:col-span-5 relative">
            <div className="relative mx-auto max-w-md lg:max-w-none">
              {/* Primary Image */}
              <div className="aspect-[4/5] rounded-3xl sm:rounded-4xl overflow-hidden shadow-soft-xl border border-agro-100 bg-earth-100">
                <img
                  src="https://images.unsplash.com/photo-1595974482597-4b8da8879bc5?auto=format&fit=crop&w=1000&q=80"
                  alt="Sri Lankan farmer holding healthy harvested crops"
                  className="w-full h-full object-cover"
                />
              </div>

              {/* Floating Seed Testing Badge */}
              <div className="absolute -bottom-6 -right-4 sm:-bottom-8 sm:-right-6 bg-white rounded-3xl p-5 shadow-soft-xl border border-agro-100 max-w-[240px] animate-in fade-in">
                <div className="flex items-center gap-3 mb-2">
                  <div className="w-10 h-10 rounded-2xl bg-agro-100 text-agro-800 flex items-center justify-center">
                    <Sprout className="w-5 h-5 text-agro-700" />
                  </div>
                  <div>
                    <span className="text-xl font-extrabold text-charcoal-900 font-display block">
                      94%+
                    </span>
                    <span className="text-[10px] text-gray-500 font-medium">Lab Tested Viability</span>
                  </div>
                </div>
                <p className="text-[11px] text-charcoal-800/80 leading-snug">
                  Every batch tested for strong germination and dependable field performance.
                </p>
              </div>

              {/* Decorative accent backdrop */}
              <div className="absolute -top-6 -left-6 w-32 h-32 bg-agro-200/40 rounded-full blur-2xl pointer-events-none -z-10" />
            </div>
          </div>

          {/* Right Text & Story (7 cols on lg) */}
          <div className="lg:col-span-7">
            {/* Section Tag */}
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-agro-100 text-agro-800 text-xs font-bold mb-4 border border-agro-200">
              <Leaf className="w-3.5 h-3.5 text-agro-600" />
              <span>Our Agricultural Heritage</span>
            </div>

            {/* Headline */}
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-charcoal-900 font-display leading-[1.15]">
              Growing Sri Lanka,{' '}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-agro-700 to-emerald-600">
                One Seed at a Time.
              </span>
            </h2>

            {/* Body copy */}
            <p className="mt-6 text-sm sm:text-base text-charcoal-800/85 leading-relaxed">
              At FLORA SEEDS, our mission is to empower farmers, home gardeners, and agricultural
              enthusiasts across Sri Lanka with certified, resilient, high-yield seed cultivars.
            </p>

            <p className="mt-3 text-sm sm:text-base text-charcoal-800/85 leading-relaxed">
              We specialize in carefully selected varieties—such as the resilient T-245 tomato and
              legendary MI-2 hot chili—chosen specifically for tropical disease tolerance and peak
              performance during both the <strong>Maha</strong> and <strong>Yala</strong> cultivation seasons.
            </p>

            {/* 3 Core Pillars */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-8 pt-6 border-t border-earth-100">
              <div className="p-4 rounded-2xl bg-earth-50/70 border border-earth-200/60">
                <ShieldCheck className="w-5 h-5 text-agro-700 mb-2" />
                <h4 className="text-sm font-bold text-charcoal-900">Bred for Tropics</h4>
                <p className="text-xs text-charcoal-800/75 mt-1 leading-snug">
                  High tolerance to humid leaf curl, bacterial wilt, and local pests.
                </p>
              </div>

              <div className="p-4 rounded-2xl bg-earth-50/70 border border-earth-200/60">
                <Award className="w-5 h-5 text-gold-600 mb-2" />
                <h4 className="text-sm font-bold text-charcoal-900">Hermetic Packs</h4>
                <p className="text-xs text-charcoal-800/75 mt-1 leading-snug">
                  Triple-layer moisture barrier foil safeguards seed energy.
                </p>
              </div>

              <div className="p-4 rounded-2xl bg-earth-50/70 border border-earth-200/60">
                <Users className="w-5 h-5 text-emerald-600 mb-2" />
                <h4 className="text-sm font-bold text-charcoal-900">Farmer Advisory</h4>
                <p className="text-xs text-charcoal-800/75 mt-1 leading-snug">
                  Direct agronomist assistance via WhatsApp for all registered growers.
                </p>
              </div>
            </div>

            {/* CTA */}
            <div className="mt-8 flex items-center gap-4">
              <button
                onClick={() => navigateToCatalog('All')}
                className="inline-flex items-center gap-2 px-6 py-3.5 rounded-2xl bg-agro-700 hover:bg-agro-800 text-white font-bold text-sm shadow-soft transition active:scale-95"
              >
                <span>Browse Certified Seeds</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
