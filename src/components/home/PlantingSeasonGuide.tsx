import React from 'react';
import { useStore } from '../../context/StoreContext';
import { CloudRain, Sun, Calendar, CheckCircle2, ArrowRight } from 'lucide-react';

export const PlantingSeasonGuide: React.FC = () => {
  const { navigateToCatalog } = useStore();

  return (
    <section className="py-16 sm:py-24 bg-white relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-gradient-to-br from-agro-900 via-agro-950 to-charcoal-950 text-white rounded-3xl sm:rounded-4xl p-8 sm:p-12 lg:p-16 relative overflow-hidden shadow-soft-xl">
          {/* Subtle background glow */}
          <div className="absolute top-0 right-0 w-96 h-96 bg-agro-500/10 rounded-full blur-3xl pointer-events-none" />

          <div className="relative z-10 max-w-3xl">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-gold-300 text-xs font-bold mb-4">
              <Calendar className="w-3.5 h-3.5" />
              <span>Sri Lanka Cultivation Calendar</span>
            </div>

            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-white font-display leading-tight">
              Sow at the Right Time with the Yala &amp; Maha Seasons.
            </h2>

            <p className="mt-4 text-xs sm:text-base text-agro-100/90 leading-relaxed">
              Timing your seed planting with Sri Lanka’s monsoon rhythms ensures abundant soil moisture,
              vigorous seedling emergence, and maximum harvest yields.
            </p>

            {/* Seasons Comparison */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6 mt-8">
              {/* Maha Season */}
              <div className="p-5 rounded-2xl bg-white/10 backdrop-blur-md border border-white/15">
                <div className="flex items-center gap-2 mb-2 text-agro-300">
                  <CloudRain className="w-5 h-5 text-sky-400" />
                  <span className="text-xs font-bold uppercase tracking-wider">Maha Season</span>
                </div>
                <h4 className="text-lg font-bold text-white font-display">September – March</h4>
                <p className="text-xs text-agro-100/80 mt-1 leading-relaxed">
                  Driven by the Northeast Monsoon. Prime season for field vegetables like T-245 tomatoes,
                  MI-2 chilies, pumpkins, and legumes across the dry zone.
                </p>
                <div className="mt-3 flex items-center gap-1.5 text-[11px] text-emerald-300 font-semibold">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  <span>Abundant rainfall &amp; soil moisture</span>
                </div>
              </div>

              {/* Yala Season */}
              <div className="p-5 rounded-2xl bg-white/10 backdrop-blur-md border border-white/15">
                <div className="flex items-center gap-2 mb-2 text-gold-300">
                  <Sun className="w-5 h-5 text-amber-400" />
                  <span className="text-xs font-bold uppercase tracking-wider">Yala Season</span>
                </div>
                <h4 className="text-lg font-bold text-white font-display">April – August</h4>
                <p className="text-xs text-agro-100/80 mt-1 leading-relaxed">
                  Influenced by the Southwest Monsoon. Ideal for heat-tolerant Green Star cucumbers,
                  Haritha okra, bitter gourds, and leafy greens under managed irrigation.
                </p>
                <div className="mt-3 flex items-center gap-1.5 text-[11px] text-emerald-300 font-semibold">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  <span>Optimal solar radiation &amp; rapid fruit set</span>
                </div>
              </div>
            </div>

            {/* CTA */}
            <div className="mt-8 flex flex-col sm:flex-row items-start sm:items-center gap-4">
              <button
                onClick={() => navigateToCatalog('All')}
                className="inline-flex items-center gap-2 px-6 py-3.5 rounded-2xl bg-agro-500 hover:bg-agro-400 text-white font-bold text-xs sm:text-sm shadow-soft transition active:scale-95"
              >
                <span>Find Suitable Seeds for Your District</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <span className="text-xs text-agro-200/70">
                Need guidance? Ask our agronomist via WhatsApp: <strong>+94 77 123 4567</strong>
              </span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
