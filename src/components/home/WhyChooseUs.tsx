import React from 'react';
import { ShieldCheck, Users, Truck, Lock, Sparkles, CheckCircle2 } from 'lucide-react';

export const WhyChooseUs: React.FC = () => {
  const cards = [
    {
      icon: <ShieldCheck className="w-7 h-7 text-agro-600" />,
      badge: 'Viability Certified',
      title: 'Quality Assured',
      description:
        'Carefully selected seed varieties with high germination viability (>90%) and rigorous disease inspection.',
      bullet: 'Govt. standards compliant',
    },
    {
      icon: <Users className="w-7 h-7 text-emerald-600" />,
      badge: 'Grower Tested',
      title: 'Farmer Focused',
      description:
        'Products selected with growers in mind, adapted specifically to thrive in Sri Lanka’s distinct agro-ecological zones.',
      bullet: 'Practical grower guides',
    },
    {
      icon: <Truck className="w-7 h-7 text-gold-600" />,
      badge: 'All 25 Districts',
      title: 'Islandwide Delivery',
      description:
        'Convenient delivery throughout Sri Lanka via reliable courier services right to your doorstep within 2 to 3 days.',
      bullet: 'Free delivery over LKR 3,000',
    },
    {
      icon: <Lock className="w-7 h-7 text-agro-700" />,
      badge: 'Payment Ready',
      title: 'Secure Shopping',
      description:
        'Safe and reliable online ordering. Pay securely via Sri Lanka PayHere gateway, direct bank wire, or Cash on Delivery.',
      bullet: 'Verified checkout protocol',
    },
  ];

  return (
    <section className="py-16 sm:py-24 bg-earth-50/50 relative overflow-hidden border-t border-b border-earth-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Heading */}
        <div className="text-center max-w-2xl mx-auto mb-12 sm:mb-16">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-agro-100 text-agro-800 text-xs font-bold mb-3 border border-agro-200">
            <Sparkles className="w-3.5 h-3.5 text-gold-600" />
            <span>The FLORA SEEDS Advantage</span>
          </div>

          <h2 className="text-3xl sm:text-4xl font-extrabold text-charcoal-900 font-display">
            Why Choose Our Agricultural Seeds?
          </h2>

          <p className="text-xs sm:text-sm text-charcoal-800/80 mt-2.5 leading-relaxed">
            From subsistence home gardens to large commercial acreages in Jaffna, Nuwara Eliya, and
            Hambantota, we provide the highest quality seed stock in Sri Lanka.
          </p>
        </div>

        {/* 4 Modern Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8">
          {cards.map((card, idx) => (
            <div
              key={idx}
              className="group bg-white rounded-3xl p-6 sm:p-7 border border-agro-100 shadow-soft hover:shadow-soft-xl hover:-translate-y-1.5 transition-all duration-300 flex flex-col justify-between"
            >
              <div>
                {/* Icon & Badge Header */}
                <div className="flex items-center justify-between mb-5">
                  <div className="w-14 h-14 rounded-2xl bg-earth-50 group-hover:bg-agro-50 flex items-center justify-center border border-earth-200/60 group-hover:border-agro-200 transition-colors">
                    {card.icon}
                  </div>
                  <span className="text-[10px] font-bold uppercase tracking-wider text-agro-800 bg-agro-50 px-2 py-0.5 rounded-md border border-agro-100">
                    {card.badge}
                  </span>
                </div>

                {/* Title */}
                <h3 className="text-lg font-bold text-charcoal-900 font-display group-hover:text-agro-800 transition">
                  {card.title}
                </h3>

                {/* Description */}
                <p className="text-xs sm:text-sm text-charcoal-800/75 mt-2 leading-relaxed">
                  {card.description}
                </p>
              </div>

              {/* Bottom Bullet */}
              <div className="pt-4 mt-4 border-t border-earth-100 flex items-center gap-1.5 text-xs font-semibold text-agro-800">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 flex-shrink-0" />
                <span>{card.bullet}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
