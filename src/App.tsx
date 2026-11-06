/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { StoreProvider, useStore } from './context/StoreContext';
import { Navbar } from './components/Navbar';
import { Hero } from './components/Hero';
import { ProductCatalog } from './components/ProductCatalog';
import { ProductDetailModal } from './components/ProductDetailModal';
import { CartDrawer } from './components/CartDrawer';
import { CheckoutModal } from './components/CheckoutModal';
import { OrderSuccessModal } from './components/OrderSuccessModal';
import { OrderTrackingModal } from './components/OrderTrackingModal';
import { AdminDashboard } from './components/admin/AdminDashboard';
import { Footer } from './components/Footer';

import { StreetwearTicker } from './components/StreetwearTicker';
import { FabricWeightVisualizer } from './components/FabricWeightVisualizer';
import { LookbookShowcase } from './components/LookbookShowcase';

function MainApp() {
  const {
    products,
    selectedProduct,
    setSelectedProduct,
    lastPlacedOrder,
    isTrackingModalOpen,
    setIsTrackingModalOpen,
    activeView,
    setActiveView,
  } = useStore();

  const [selectedCategory, setSelectedCategory] = useState<'all' | 't-shirts' | 'hoodies'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [trackingOrderId, setTrackingOrderId] = useState<string | undefined>(undefined);

  const handleScrollToCatalog = () => {
    setActiveView('shop');
    const catalogEl = document.getElementById('catalog-section');
    if (catalogEl) {
      catalogEl.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleTrackSpecificOrder = (orderId: string) => {
    setTrackingOrderId(orderId);
    setIsTrackingModalOpen(true);
  };

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100 flex flex-col font-sans">
      {/* Top Navigation */}
      <Navbar
        selectedCategory={selectedCategory}
        onSelectCategory={setSelectedCategory}
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
      />

      {/* Main View Router */}
      <main className="flex-1">
        {activeView === 'shop' ? (
          <>
            {/* Hero Section */}
            <Hero onExploreClick={handleScrollToCatalog} />

            {/* Streetwear Marquee Tape */}
            <StreetwearTicker />

            {/* Catalog Section */}
            <ProductCatalog
              products={products}
              selectedCategory={selectedCategory}
              onSelectCategory={setSelectedCategory}
              searchQuery={searchQuery}
              onClearSearch={() => setSearchQuery('')}
              onOpenDetail={(product) => setSelectedProduct(product)}
            />

            {/* Tactical Fabric & GSM Architecture */}
            <FabricWeightVisualizer />

            {/* Editorial Streetwear Lookbook */}
            <LookbookShowcase />
          </>
        ) : (
          /* Admin Portal */
          <AdminDashboard />
        )}
      </main>

      {/* Footer */}
      <Footer />

      {/* Modals & Overlays */}
      <CartDrawer />

      <ProductDetailModal
        product={selectedProduct}
        onClose={() => setSelectedProduct(null)}
      />

      <CheckoutModal
        onSuccess={(orderId) => {
          // Handled via lastPlacedOrder inside StoreContext
        }}
      />

      <OrderSuccessModal
        onClose={() => {}}
        onTrackOrder={handleTrackSpecificOrder}
      />

      <OrderTrackingModal
        initialOrderId={trackingOrderId}
        onClose={() => {
          setIsTrackingModalOpen(false);
          setTrackingOrderId(undefined);
        }}
      />
    </div>
  );
}

export default function App() {
  return (
    <StoreProvider>
      <MainApp />
    </StoreProvider>
  );
}
