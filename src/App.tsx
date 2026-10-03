import React from 'react';
import { StoreProvider, useStore } from './context/StoreContext';
import { CartProvider } from './context/CartContext';
import { Navbar } from './components/common/Navbar';
import { Footer } from './components/common/Footer';
import { ToastNotification } from './components/common/ToastNotification';
import { Hero } from './components/home/Hero';
import { CategoryShowcase } from './components/home/CategoryShowcase';
import { FeaturedProducts } from './components/home/FeaturedProducts';
import { AboutBrandSection } from './components/home/AboutBrandSection';
import { WhyChooseUs } from './components/home/WhyChooseUs';
import { PlantingSeasonGuide } from './components/home/PlantingSeasonGuide';
import { ProductCatalog } from './components/catalog/ProductCatalog';
import { ProductDetails } from './components/catalog/ProductDetails';
import { CartDrawer } from './components/cart/CartDrawer';
import { CheckoutPage } from './components/checkout/CheckoutPage';
import { OrderConfirmation } from './components/checkout/OrderConfirmation';
import { QuestionForm } from './components/inquiry/QuestionForm';
import { AdminPreview } from './components/admin/AdminPreview';

const MainLayout: React.FC = () => {
  const { activeView, selectedProduct } = useStore();

  if (activeView === 'admin') {
    return (
      <div className="min-h-screen bg-earth-50">
        <AdminPreview />
        <ToastNotification />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-[#faf8f4] text-charcoal-900">
      {/* Sticky Navigation */}
      <Navbar />

      {/* Main View Router */}
      <main className="flex-1">
        {activeView === 'home' && (
          <>
            <Hero />
            <CategoryShowcase />
            <FeaturedProducts />
            <AboutBrandSection />
            <WhyChooseUs />
            <PlantingSeasonGuide />
            <QuestionForm />
          </>
        )}

        {activeView === 'catalog' && (
          <>
            <ProductCatalog />
            <WhyChooseUs />
            <QuestionForm />
          </>
        )}

        {activeView === 'details' && selectedProduct && (
          <>
            <ProductDetails product={selectedProduct} />
            <QuestionForm />
          </>
        )}

        {activeView === 'checkout' && <CheckoutPage />}

        {activeView === 'order-success' && <OrderConfirmation />}
      </main>

      {/* Slide-over Cart Drawer */}
      <CartDrawer />

      {/* Floating Notifications */}
      <ToastNotification />

      {/* Footer */}
      <Footer />
    </div>
  );
};

export function App() {
  return (
    <StoreProvider>
      <CartProvider>
        <MainLayout />
      </CartProvider>
    </StoreProvider>
  );
}

export default App;
