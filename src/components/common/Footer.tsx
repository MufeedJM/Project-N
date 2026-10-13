import React, { useState } from 'react';
import { BrandLogo } from './BrandLogo';
import { useStore } from '../../context/StoreContext';
import { BRAND_CONFIG } from '../../data/products';
import {
  Mail,
  Phone,
  MessageSquare,
  MapPin,
  Send,
  CheckCircle2,
  ShieldCheck,
  CreditCard,
  Sprout,
  Heart,
} from 'lucide-react';

export const Footer: React.FC = () => {
  const { navigateToHome, navigateToCatalog, setActiveView, addToast } = useStore();
  const [newsletterEmail, setNewsletterEmail] = useState('');
  const [isSubscribed, setIsSubscribed] = useState(false);

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(newsletterEmail)) {
      addToast('Invalid Email', 'Please enter a valid email address for farming tips.', 'warning');
      return;
    }
    setIsSubscribed(true);
    addToast('Subscribed!', 'You will receive seasonal planting alerts & harvest tips.', 'success');
    setNewsletterEmail('');
  };

  return (
    <footer className="bg-charcoal-900 text-agro-100 border-t border-agro-800/80 pt-16 pb-12 relative overflow-hidden">
      {/* Subtle background glow */}
      <div className="absolute top-0 right-1/4 w-96 h-96 bg-agro-700/10 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-10 lg:gap-12 pb-12 border-b border-agro-800/60">
          {/* Brand & Mission (4 cols) */}
          <div className="lg:col-span-4 space-y-4">
            <div onClick={navigateToHome} className="cursor-pointer inline-block">
              <BrandLogo variant="dark" size="md" />
            </div>

            <p className="text-xs sm:text-sm text-agro-200/80 leading-relaxed max-w-sm">
              Sri Lanka's dedicated agricultural seed supplier. Empowering smallholder farmers,
              commercial growers, and home kitchen gardeners with certified, high-germination seed stock.
            </p>

            {/* Accreditation Badge */}
            <div className="flex items-center gap-2 text-xs text-agro-300/90 pt-2">
              <ShieldCheck className="w-4 h-4 text-emerald-400 flex-shrink-0" />
              <span>Certified for reliable field performance</span>
            </div>

            <div className="flex items-center gap-3 pt-2">
              <span className="text-xs font-semibold text-white">Payment Ready:</span>
              <div className="flex items-center gap-1.5 text-[10px] font-bold text-agro-200">
                <span className="px-2 py-0.5 rounded bg-agro-800 border border-agro-700">PayHere</span>
                <span className="px-2 py-0.5 rounded bg-agro-800 border border-agro-700">Bank Transfer</span>
                <span className="px-2 py-0.5 rounded bg-agro-800 border border-agro-700">COD</span>
              </div>
            </div>
          </div>

          {/* Quick Links (2 cols) */}
          <div className="lg:col-span-2 space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-white">Quick Links</h4>
            <ul className="space-y-2 text-xs sm:text-sm text-agro-200/80">
              <li>
                <button
                  onClick={navigateToHome}
                  className="hover:text-white transition"
                >
                  Home
                </button>
              </li>
              <li>
                <button
                  onClick={() => navigateToCatalog('All')}
                  className="hover:text-white transition"
                >
                  Shop All Seeds
                </button>
              </li>
              <li>
                <button
                  onClick={() => navigateToCatalog('Vegetable Seeds')}
                  className="hover:text-white transition"
                >
                  Vegetable Varieties
                </button>
              </li>
              <li>
                <a
                  href="#about-section"
                  onClick={(e) => {
                    e.preventDefault();
                    navigateToHome();
                    setTimeout(() => {
                      document.getElementById('about-section')?.scrollIntoView({ behavior: 'smooth' });
                    }, 100);
                  }}
                  className="hover:text-white transition"
                >
                  About Our Agriculture
                </a>
              </li>
              <li>
                <a
                  href="#question-section"
                  onClick={(e) => {
                    e.preventDefault();
                    navigateToHome();
                    setTimeout(() => {
                      document.getElementById('question-section')?.scrollIntoView({ behavior: 'smooth' });
                    }, 100);
                  }}
                  className="hover:text-white transition"
                >
                  Agri Advisory & Contact
                </a>
              </li>
              <li>
                <button
                  onClick={() => setActiveView('admin')}
                  className="text-gold-400 hover:text-gold-300 font-semibold transition"
                >
                  Admin Portal (Preview)
                </button>
              </li>
            </ul>
          </div>

          {/* Customer Support & Contact Info (3 cols) */}
          <div className="lg:col-span-3 space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-white">Customer Support</h4>
            <div className="space-y-2.5 text-xs sm:text-sm text-agro-200/80">
              <a
                href={`mailto:${BRAND_CONFIG.email}`}
                className="flex items-center gap-2 hover:text-white transition"
              >
                <Mail className="w-4 h-4 text-agro-400 flex-shrink-0" />
                <span className="truncate">{BRAND_CONFIG.email}</span>
              </a>

              <a
                href={`tel:${BRAND_CONFIG.hotline.replace(/\s/g, '')}`}
                className="flex items-center gap-2 hover:text-white transition"
              >
                <Phone className="w-4 h-4 text-agro-400 flex-shrink-0" />
                <span>{BRAND_CONFIG.hotline}</span>
              </a>

              <a
                href={`https://wa.me/${BRAND_CONFIG.whatsapp.replace(/\D/g, '')}`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 hover:text-white transition text-emerald-400 font-medium"
              >
                <MessageSquare className="w-4 h-4 text-emerald-400 flex-shrink-0" />
                <span>WhatsApp: {BRAND_CONFIG.whatsapp}</span>
              </a>

              <div className="flex items-start gap-2 pt-1 text-xs text-agro-300/70">
                <MapPin className="w-4 h-4 text-agro-400 flex-shrink-0 mt-0.5" />
                <span>{BRAND_CONFIG.address}</span>
              </div>
            </div>
          </div>

          {/* Newsletter Signup (3 cols) */}
          <div className="lg:col-span-3 space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-white">Grower Newsletter</h4>
            <p className="text-xs text-agro-200/80 leading-relaxed">
              Get agricultural tips, Yala/Maha seasonal planting schedules, and notification of new seed releases.
            </p>

            {isSubscribed ? (
              <div className="flex items-center gap-2 p-3 rounded-xl bg-agro-800 text-agro-200 text-xs border border-agro-700">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0" />
                <span>Subscribed! Check your inbox soon.</span>
              </div>
            ) : (
              <form onSubmit={handleSubscribe} className="space-y-2">
                <div className="relative">
                  <input
                    type="email"
                    required
                    value={newsletterEmail}
                    onChange={(e) => setNewsletterEmail(e.target.value)}
                    placeholder="Enter your email address..."
                    className="w-full pl-3 pr-10 py-2.5 rounded-xl bg-agro-950/80 border border-agro-700 text-xs text-white placeholder:text-agro-400/60 focus:outline-none focus:ring-2 focus:ring-agro-500"
                  />
                  <button
                    type="submit"
                    className="absolute right-2 top-1/2 -translate-y-1/2 p-1 text-agro-300 hover:text-white"
                    aria-label="Subscribe to newsletter"
                  >
                    <Send className="w-4 h-4" />
                  </button>
                </div>
                <button
                  type="submit"
                  className="w-full py-2.5 px-4 rounded-xl bg-agro-600 hover:bg-agro-500 text-white font-bold text-xs tracking-wide shadow-sm transition"
                >
                  Subscribe for Free Tips
                </button>
              </form>
            )}
          </div>
        </div>

        {/* Bottom Copyright & Disclaimer */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-agro-300/70">
          <div>
            &copy; {new Date().getFullYear()} {BRAND_CONFIG.brandName}. All rights reserved. Cultivated in Sri Lanka.
          </div>

          <div className="flex items-center gap-4 text-[11px]">
            <span>Privacy Policy</span>
            <span>•</span>
            <span>Terms of Service</span>
            <span>•</span>
            <span>Seed Viability Guarantee</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
