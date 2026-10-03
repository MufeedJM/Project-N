import React from 'react';
import { BRAND_CONFIG } from '../../data/products';

interface BrandLogoProps {
  variant?: 'light' | 'dark';
  size?: 'sm' | 'md' | 'lg';
  showTagline?: boolean;
}

/**
 * REPLACING WITH YOUR ACTUAL LOGO:
 * --------------------------------
 * To use your custom logo image, simply replace the SVG icon below with:
 * <img src="/assets/your-logo.png" alt={BRAND_CONFIG.brandName} className="h-10 w-auto" />
 */
export const BrandLogo: React.FC<BrandLogoProps> = ({
  variant = 'light',
  size = 'md',
  showTagline = true,
}) => {
  const isDark = variant === 'dark';

  const iconSizes = {
    sm: 'w-8 h-8',
    md: 'w-10 h-10',
    lg: 'w-12 h-12',
  };

  const titleSizes = {
    sm: 'text-lg',
    md: 'text-xl',
    lg: 'text-2xl',
  };

  return (
    <div className="flex items-center gap-2.5 select-none group cursor-pointer">
      {/* Seed & Sprout SVG Badge */}
      <div
        className={`${iconSizes[size]} rounded-2xl flex items-center justify-center transition-transform duration-300 group-hover:scale-105 ${
          isDark
            ? 'bg-gradient-to-br from-agro-500 to-agro-800 text-white shadow-md'
            : 'bg-gradient-to-br from-agro-700 via-agro-800 to-agro-900 text-agro-200 shadow-soft'
        } border border-agro-400/20`}
      >
        <svg
          viewBox="0 0 32 32"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="w-3/5 h-3/5"
        >
          {/* Seed droplet / soil base */}
          <path
            d="M16 28C21.5228 28 26 23.5228 26 18C26 14 21 8 16 3C11 8 6 14 6 18C6 23.5228 10.4772 28 16 28Z"
            fill="currentColor"
            fillOpacity="0.18"
          />
          {/* Main Leaf */}
          <path
            d="M16 6C16 6 22 10.5 22 18C22 21.3137 19.3137 24 16 24C12.6863 24 10 21.3137 10 18C10 10.5 16 6 16 6Z"
            fill="#52b788"
          />
          {/* Sprout Vein */}
          <path
            d="M16 23V11M16 15L19 13M16 18L13 16.5"
            stroke="#1b402c"
            strokeWidth="1.75"
            strokeLinecap="round"
          />
          {/* Golden seed embryo spark */}
          <circle cx="16" cy="22" r="2.2" fill="#f59e0b" />
        </svg>
      </div>

      <div className="flex flex-col">
        <div className="flex items-center gap-1">
          <span
            className={`font-display font-bold tracking-tight ${titleSizes[size]} ${
              isDark ? 'text-white' : 'text-agro-950'
            }`}
          >
            <span className="text-agro-600 font-extrabold">FLORA</span>
          </span>
          <span className="text-[10px] uppercase font-bold tracking-widest px-1.5 py-0.5 rounded bg-agro-100 text-agro-800 border border-agro-200">
            SEEDS
          </span>
        </div>
        {showTagline && (
          <span
            className={`text-[11px] font-medium tracking-wide -mt-0.5 ${
              isDark ? 'text-agro-200/70' : 'text-earth-700'
            }`}
          >
            Premium Agri Seeds • Sri Lanka
          </span>
        )}
      </div>
    </div>
  );
};
