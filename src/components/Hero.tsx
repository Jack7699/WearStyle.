import React from 'react';
import { ArrowDown, Sparkles, Shield, Clock, MapPin } from 'lucide-react';
import { HERO_IMAGE } from '../data/initialData';

interface HeroProps {
  onExploreClick: () => void;
}

export const Hero: React.FC<HeroProps> = ({ onExploreClick }) => {
  return (
    <section className="relative border-b border-zinc-800 bg-zinc-950 overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-20">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12 items-center">
          {/* Left Column: Typography & Intent */}
          <div className="lg:col-span-6 flex flex-col justify-center">
            <div className="flex items-center gap-2 text-xs font-mono uppercase tracking-widest text-zinc-400 mb-4">
              <span>Morocco Exclusive</span>
              <span aria-hidden="true" className="text-zinc-600">·</span>
              <span>Drop 04 / 2026</span>
              <span aria-hidden="true" className="text-zinc-600">·</span>
              <span>450 GSM Heavy Cotton</span>
            </div>

            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black text-white tracking-tight uppercase leading-[0.95] mb-6 font-display">
              Engineered For The Modern Street.
            </h1>

            <p className="text-base sm:text-lg text-zinc-400 max-w-xl mb-8 leading-relaxed font-normal">
              Heavyweight boxy hoodies and drop-shoulder t-shirts cut from luxury custom-milled combed cotton. Designed in Casablanca, shipped to every city across Morocco.
            </p>

            <div className="flex flex-wrap items-center gap-4 mb-10">
              <button
                onClick={onExploreClick}
                className="px-6 py-3.5 text-sm font-semibold text-zinc-950 bg-white hover:bg-zinc-200 transition-colors rounded-md flex items-center gap-2 cursor-pointer shadow-lg active:scale-95"
              >
                <span>Shop Collection</span>
                <ArrowDown className="w-4 h-4" />
              </button>
              <div className="text-xs text-zinc-400 flex flex-col">
                <span className="font-semibold text-zinc-200">Paiement à la livraison (COD)</span>
                <span>Pay when your parcel arrives at your doorstep</span>
              </div>
            </div>

            {/* Adjacent Proof Points (Moroccan delivery guarantee) */}
            <div className="pt-8 border-t border-zinc-800/80 grid grid-cols-3 gap-4 text-xs">
              <div>
                <div className="font-semibold text-zinc-200 flex items-center gap-1.5 mb-1">
                  <MapPin className="w-3.5 h-3.5 text-amber-400" />
                  <span>All Morocco</span>
                </div>
                <p className="text-zinc-500">24-48h express via Amana & Cathedis</p>
              </div>

              <div>
                <div className="font-semibold text-zinc-200 flex items-center gap-1.5 mb-1">
                  <Shield className="w-3.5 h-3.5 text-amber-400" />
                  <span>Quality Assured</span>
                </div>
                <p className="text-zinc-500">Preshrunk 450 GSM & 280 GSM cotton</p>
              </div>

              <div>
                <div className="font-semibold text-zinc-200 flex items-center gap-1.5 mb-1">
                  <Clock className="w-3.5 h-3.5 text-amber-400" />
                  <span>Fast Approvals</span>
                </div>
                <p className="text-zinc-500">Orders verified and packed same day</p>
              </div>
            </div>
          </div>

          {/* Right Column: High-Fidelity Editorial Visual */}
          <div className="lg:col-span-6 relative">
            <div className="relative rounded-lg overflow-hidden border border-zinc-800 aspect-[16/10] sm:aspect-[16/9] lg:aspect-[4/3] bg-zinc-900 shadow-2xl">
              <img
                src={HERO_IMAGE}
                alt="Wearstyle Streetwear Editorial Lookbook"
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover object-center filter contrast-[1.04]"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-zinc-950/70 via-transparent to-transparent pointer-events-none" />

              {/* Quiet editorial watermark/tag in corner */}
              <div className="absolute bottom-4 left-4 right-4 flex items-center justify-between text-xs text-zinc-300">
                <span className="font-mono text-[11px] bg-zinc-950/80 backdrop-blur px-2.5 py-1 rounded border border-zinc-800">
                  WEARSTYLE STUDIO · CASABLANCA
                </span>
                <span className="font-medium text-white drop-shadow">
                  Heavyweight Series
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
