import React from 'react';
import { useStore } from '../context/StoreContext';
import { Truck, ShieldCheck, Banknote, CreditCard, MapPin } from 'lucide-react';

export const Footer: React.FC = () => {
  const { setActiveView, setIsTrackingModalOpen } = useStore();

  return (
    <footer className="bg-zinc-950 border-t border-zinc-800 text-zinc-400 text-xs">
      {/* Trust Badges Strip */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 border-b border-zinc-800/80">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-zinc-900 border border-zinc-800 rounded-md text-amber-400">
              <Truck className="w-5 h-5" />
            </div>
            <div>
              <div className="font-semibold text-zinc-200 text-xs">Livraison Partout au Maroc</div>
              <p className="text-[11px] text-zinc-500">24-48h Casablanca, Rabat, Marrakech...</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-zinc-900 border border-zinc-800 rounded-md text-emerald-400">
              <Banknote className="w-5 h-5" />
            </div>
            <div>
              <div className="font-semibold text-zinc-200 text-xs">Cash on Delivery (COD)</div>
              <p className="text-[11px] text-zinc-500">Paiement à la livraison au livreur</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-zinc-900 border border-zinc-800 rounded-md text-sky-400">
              <CreditCard className="w-5 h-5" />
            </div>
            <div>
              <div className="font-semibold text-zinc-200 text-xs">Paiement Sécurisé CMI</div>
              <p className="text-[11px] text-zinc-500">Cartes marocaines & internationales</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-zinc-900 border border-zinc-800 rounded-md text-purple-400">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <div className="font-semibold text-zinc-200 text-xs">Qualité Heavyweight</div>
              <p className="text-[11px] text-zinc-500">French Terry 450 GSM & Coton 280 GSM</p>
            </div>
          </div>
        </div>
      </div>

      {/* Main Footer Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8">
          {/* Brand Info */}
          <div className="md:col-span-5 space-y-3">
            <div className="text-xl font-black text-white uppercase font-display tracking-tight flex items-center gap-2">
              <span>WEARSTYLE</span>
              <span className="text-[11px] font-mono font-normal text-zinc-500">STUDIO MA</span>
            </div>
            <p className="text-xs text-zinc-400 leading-relaxed max-w-sm">
              Independent Moroccan streetwear label creating heavyweight combed cotton garments designed for durability, architectural silhouettes, and effortless everyday wear.
            </p>
            <div className="flex items-center gap-1.5 text-zinc-400 text-xs">
              <MapPin className="w-3.5 h-3.5 text-amber-400" />
              <span>Atelier & Distribution: Maarif / Gauthier, Casablanca, Morocco</span>
            </div>
          </div>

          {/* Quick Links */}
          <div className="md:col-span-3 space-y-2">
            <div className="font-semibold text-zinc-200 uppercase tracking-wider text-[11px]">
              Customer Service
            </div>
            <ul className="space-y-1.5 text-zinc-400">
              <li>
                <button
                  onClick={() => setIsTrackingModalOpen(true)}
                  className="hover:text-white transition-colors"
                >
                  Track Moroccan Parcel
                </button>
              </li>
              <li>
                <span className="text-zinc-500">Shipping & Delivery Policies</span>
              </li>
              <li>
                <span className="text-zinc-500">Size & Fit Guide (Oversized)</span>
              </li>
              <li>
                <span className="text-zinc-500">WhatsApp Support: +212 661-000000</span>
              </li>
            </ul>
          </div>

          {/* Administrative Perms */}
          <div className="md:col-span-4 space-y-2">
            <div className="font-semibold text-zinc-200 uppercase tracking-wider text-[11px]">
              Store Management
            </div>
            <p className="text-[11px] text-zinc-500 leading-relaxed">
              Store administrators have dedicated access to manage inventory, set discount percentages and fixed promo codes, and verify Moroccan cash-on-delivery orders.
            </p>
            <div className="pt-1">
              <button
                onClick={() => setActiveView('admin')}
                className="px-3 py-1.5 bg-zinc-900 hover:bg-zinc-800 text-zinc-200 border border-zinc-800 rounded text-xs font-semibold flex items-center gap-1.5 transition-colors"
              >
                <ShieldCheck className="w-3.5 h-3.5 text-amber-400" />
                <span>Open Administrator Dashboard</span>
              </button>
            </div>
          </div>
        </div>

        {/* Copyright */}
        <div className="pt-8 mt-8 border-t border-zinc-900 flex flex-col sm:flex-row items-center justify-between text-[11px] text-zinc-600 gap-2">
          <div>
            © {new Date().getFullYear()} Wearstyle Morocco S.A.R.L. All rights reserved.
          </div>
          <div className="flex items-center gap-4">
            <span>Casablanca</span>
            <span>·</span>
            <span>Rabat</span>
            <span>·</span>
            <span>Marrakech</span>
            <span>·</span>
            <span>Tangier</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
