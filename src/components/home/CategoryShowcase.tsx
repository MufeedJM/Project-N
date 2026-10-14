import React from 'react';
import { useStore } from '../../context/StoreContext';
import { ProductCategory } from '../../types';
import { ArrowRight, Sprout } from 'lucide-react';

interface CategoryItem {
  title: ProductCategory;
  subtitle: string;
  image: string;
  count: string;
}

interface StoreCategoryItem {
  title: string;
  subtitle: string;
  image: string;
  category: ProductCategory;
}

const STORE_CATEGORY_ITEMS: StoreCategoryItem[] = [
  {
    title: 'Liquid Fertilizer',
    subtitle: 'Liquid plant nutrition',
    image: 'https://mtroyal.com.tr/en/wp-content/uploads/2025/04/Liquid-Fertilizer-Supplier.jpg',
    category: 'Fertilizer',
  },
  {
    title: 'Granule Fertilizer',
    subtitle: 'Granular plant nutrition',
    image: 'https://everagro.com/wp-content/uploads/2026/05/granular-fertilizer-banner.jpg',
    category: 'Fertilizer',
  },
  {
    title: 'Organic Fertilizers',
    subtitle: 'Organic soil and plant care',
    image: 'https://cdn.shopify.com/s/files/1/0569/9675/7697/files/what-is-plant-fertilizer-made-of_1024x1024.jpg?v=1655088556',
    category: 'Fertilizer',
  },
  {
    title: 'Gardening Tools',
    subtitle: 'Tools for garden care',
    image: 'https://m.media-amazon.com/images/I/61U3HRxzyRL._AC_UF894,1000_QL80_.jpg',
    category: 'Tools',
  },
  {
    title: 'Home Decor',
    subtitle: 'Hanging pots and home accents',
    image: 'https://m.media-amazon.com/images/I/81riOParNNL._AC_UF350,350_QL80_.jpg',
    category: 'Tools',
  },
];

const CATEGORY_ITEMS: CategoryItem[] = [
  {
    title: 'Vegetable Seeds',
    subtitle: 'Tomatoes, chilies, brinjals & gourds',
    image: 'https://images.unsplash.com/photo-1592924357228-91a4daadcfea?auto=format&fit=crop&w=600&q=80',
    count: '6 Varieties',
  },
  {
    title: 'Fruit Seeds',
    subtitle: 'Red Lady papaya & passion fruit',
    image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcT_Q02iRSv-yIfNfuoozksYWH5EU7UriOnjl-rw18QGiQ&s=10',
    count: '2 Varieties',
  },
  {
    title: 'Flower Seeds',
    subtitle: 'Golden marigolds & pollinators',
    image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSqklWJy5wCKgjoCZMaEUtzrXD98bXW8qtzfHZ5SilhPw&s=10',
    count: '1 Variety',
  },
  {
    title: 'Leafy Vegetables',
    subtitle: 'Wel gotukola, mukunuwenna greens',
    image: 'https://healthwire.pk/wp-content/uploads/2022/08/green-leafy-vegetables.jpg',
    count: '2 Varieties',
  },
  {
    title: 'Herbal Seeds',
    subtitle: 'Sacred Maduruthala & indigenous herbs',
    image: 'https://www.thespruceeats.com/thmb/GFvSucJcAVCi2WNtsmLh8I3Sbkw=/1500x0/filters:no_upscale():max_bytes(150000):strip_icc()/various-fresh-herbs-907728974-cc6c2be53aac46de9e6a4b47a0e630e4.jpg',
    count: '1 Variety',
  },
  {
    title: 'Other Agricultural Seeds',
    subtitle: 'Sweet corn & commercial field crops',
    image: 'https://food.fnr.sndimg.com/content/dam/images/food/fullset/2023/6/28/fresh-corn-on-the-cob-partially-shucked-on-dark-background.jpg.rend.hgtvcom.1280.1280.85.suffix/1687987003387.webp',
    count: '1 Variety',
  },
];

export const CategoryShowcase: React.FC = () => {
  const { navigateToCatalog } = useStore();

  return (
    <>
      <section className="pt-16 pb-8 sm:pt-20 sm:pb-10 bg-earth-50/40 border-b border-earth-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mb-8">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-agro-100 text-agro-800 text-xs font-bold mb-3 border border-agro-200">
              <Sprout className="w-3.5 h-3.5 text-agro-700" />
              <span>Garden Essentials</span>
            </div>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-charcoal-900 font-display">
              Browse by Granule &amp; Liquid Fertilizers, Tools
            </h2>
            <p className="text-xs sm:text-sm text-charcoal-800/80 mt-1">
              Explore fertilizers, gardening tools, and home décor for your growing space.
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-5 gap-4 sm:gap-6">
            {STORE_CATEGORY_ITEMS.map((item) => (
              <button
                key={item.title}
                type="button"
                onClick={() => navigateToCatalog(item.category)}
                className="group rounded-3xl border border-agro-100 bg-white p-3 text-left shadow-soft transition-all duration-300 hover:-translate-y-1 hover:shadow-soft-xl focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-agro-700"
                aria-label={`Browse ${item.title}`}
              >
                <div className="mb-3 aspect-square w-full overflow-hidden rounded-2xl bg-earth-100">
                  <img
                    src={item.image}
                    alt={item.title}
                    loading="lazy"
                    className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
                  />
                </div>
                <h3 className="line-clamp-1 text-xs font-bold text-charcoal-900 transition group-hover:text-agro-800 sm:text-sm">
                  {item.title}
                </h3>
                <p className="mt-0.5 line-clamp-1 text-[11px] text-gray-500">{item.subtitle}</p>
              </button>
            ))}
          </div>
        </div>
      </section>

      <section className="pt-8 pb-16 sm:pt-10 sm:pb-20 bg-earth-50/40 border-b border-earth-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-10">
            <div>
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-agro-100 text-agro-800 text-xs font-bold mb-3 border border-agro-200">
                <Sprout className="w-3.5 h-3.5 text-agro-700" />
                <span>Cultivation Categories</span>
              </div>
              <h2 className="text-3xl sm:text-4xl font-extrabold text-charcoal-900 font-display">
                Browse by Agricultural Crop
              </h2>
              <p className="text-xs sm:text-sm text-charcoal-800/80 mt-1">
                Select a category to view seed varieties suited for Sri Lankan farming conditions.
              </p>
            </div>

            <button
              onClick={() => navigateToCatalog('All')}
              className="inline-flex items-center gap-1.5 text-xs sm:text-sm font-bold text-agro-800 hover:text-agro-950 group"
            >
              <span>Explore All Categories</span>
              <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
            </button>
          </div>

          {/* 6 Category Cards Grid */}
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 sm:gap-6">
            {CATEGORY_ITEMS.map((cat, idx) => (
              <div
                key={idx}
                onClick={() => navigateToCatalog(cat.title)}
                className="group relative bg-white rounded-3xl p-3 border border-agro-100 shadow-soft hover:shadow-soft-xl hover:-translate-y-1 transition-all duration-300 cursor-pointer flex flex-col overflow-hidden"
              >
                {/* Photo */}
                <div className="aspect-square w-full rounded-2xl overflow-hidden bg-earth-100 mb-3 relative">
                  <img
                    src={cat.image}
                    alt={cat.title}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-black/10 group-hover:bg-black/0 transition-colors" />
                  <span className="absolute bottom-2 left-2 text-[10px] font-bold px-2 py-0.5 rounded-full bg-white/90 text-agro-900 backdrop-blur-xs shadow-xs">
                    {cat.count}
                  </span>
                </div>

                {/* Text */}
                <div className="px-1 pb-1">
                  <h3 className="text-xs sm:text-sm font-bold text-charcoal-900 group-hover:text-agro-800 transition line-clamp-1">
                    {cat.title}
                  </h3>
                  <p className="text-[11px] text-gray-500 line-clamp-1 mt-0.5">
                    {cat.subtitle}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
};
