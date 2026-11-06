import React, { useState } from 'react';
import { Layers, CheckCircle2, Ruler, Sparkles, Scale } from 'lucide-react';
import { soundEngine } from '../utils/audio';

export const FabricWeightVisualizer: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'hoodie' | 'tee'>('hoodie');

  const handleTabChange = (tab: 'hoodie' | 'tee') => {
    soundEngine.playClick();
    setActiveTab(tab);
  };

  return (
    <section className="py-14 bg-zinc-950 border-b border-zinc-800/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 gap-4">
          <div>
            <div className="flex items-center gap-2 text-xs font-mono uppercase tracking-widest text-amber-400 mb-2">
              <Scale className="w-4 h-4" />
              <span>Tactile Engineering</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-black text-white font-display uppercase tracking-tight">
              The Architecture of Heavyweight Cotton
            </h2>
          </div>

          <div className="flex items-center gap-1.5 p-1 bg-zinc-900 border border-zinc-800 rounded-lg self-start md:self-auto">
            <button
              onClick={() => handleTabChange('hoodie')}
              className={`px-4 py-2 text-xs font-bold rounded-md transition-colors cursor-pointer ${
                activeTab === 'hoodie'
                  ? 'bg-white text-zinc-950 shadow-sm'
                  : 'text-zinc-400 hover:text-white'
              }`}
            >
              450 GSM Fleece (Hoodies)
            </button>
            <button
              onClick={() => handleTabChange('tee')}
              className={`px-4 py-2 text-xs font-bold rounded-md transition-colors cursor-pointer ${
                activeTab === 'tee'
                  ? 'bg-white text-zinc-950 shadow-sm'
                  : 'text-zinc-400 hover:text-white'
              }`}
            >
              280 GSM Jersey (T-Shirts)
            </button>
          </div>
        </div>

        {/* Comparison Showcase */}
        {activeTab === 'hoodie' ? (
          <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-center bg-zinc-900/60 border border-zinc-800 rounded-xl p-6 sm:p-8">
            <div className="md:col-span-5 relative aspect-[4/3] rounded-lg overflow-hidden bg-zinc-950 border border-zinc-800">
              <img
                src="/src/assets/images/product_hoodie_heavyweight_black_1793989033781.jpg"
                alt="450 GSM Heavy French Terry Hoodie"
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover"
              />
              <div className="absolute top-3 left-3 bg-zinc-950/85 backdrop-blur px-2.5 py-1 rounded text-xs font-mono font-bold text-amber-400 border border-zinc-800">
                450 GSM · ULTRA-DENSE
              </div>
            </div>

            <div className="md:col-span-7 space-y-5">
              <div>
                <span className="text-xs font-mono text-zinc-400 uppercase tracking-widest block mb-1">
                  Custom Milled in Morocco
                </span>
                <h3 className="text-xl sm:text-2xl font-bold text-white font-display">
                  Sculpted Boxy Silhouette That Never Collapses
                </h3>
                <p className="text-xs sm:text-sm text-zinc-400 mt-2 leading-relaxed">
                  Unlike thin fast-fashion fleece that thins out after three washes, Wearstyle 450 GSM diagonal loopback French Terry retains a rigid, architectural drape. The double-layered crossover hood stands upright without unsightly strings.
                </p>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 text-xs pt-2">
                <div className="p-3 bg-zinc-950 border border-zinc-800 rounded-lg">
                  <span className="text-zinc-500 block mb-1">Fabric Weight</span>
                  <span className="font-mono font-bold text-white text-sm">450 GSM</span>
                  <span className="text-[10px] text-zinc-500 block mt-0.5">Heavy French Terry</span>
                </div>

                <div className="p-3 bg-zinc-950 border border-zinc-800 rounded-lg">
                  <span className="text-zinc-500 block mb-1">Ribbed Cuffs & Hem</span>
                  <span className="font-mono font-bold text-white text-sm">520 GSM Rib</span>
                  <span className="text-[10px] text-zinc-500 block mt-0.5">Snug zero-stretch recovery</span>
                </div>

                <div className="p-3 bg-zinc-950 border border-zinc-800 rounded-lg col-span-2 sm:col-span-1">
                  <span className="text-zinc-500 block mb-1">Preshrunk Treatment</span>
                  <span className="font-mono font-bold text-emerald-400 text-sm">0% Shrinkage</span>
                  <span className="text-[10px] text-zinc-500 block mt-0.5">Cold wash and hang dry</span>
                </div>
              </div>

              <div className="flex items-center gap-2 text-xs text-zinc-400 pt-2 border-t border-zinc-800/80">
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                <span>Individually dye-batched in Casablanca to prevent color fade</span>
              </div>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-center bg-zinc-900/60 border border-zinc-800 rounded-xl p-6 sm:p-8">
            <div className="md:col-span-5 relative aspect-[4/3] rounded-lg overflow-hidden bg-zinc-950 border border-zinc-800">
              <img
                src="/src/assets/images/product_tshirt_vintage_black_1793989034591.jpg"
                alt="280 GSM Heavyweight T-Shirt"
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover"
              />
              <div className="absolute top-3 left-3 bg-zinc-950/85 backdrop-blur px-2.5 py-1 rounded text-xs font-mono font-bold text-amber-400 border border-zinc-800">
                280 GSM · HEAVYWEIGHT JERSEY
              </div>
            </div>

            <div className="md:col-span-7 space-y-5">
              <div>
                <span className="text-xs font-mono text-zinc-400 uppercase tracking-widest block mb-1">
                  100% Combed Carded Cotton
                </span>
                <h3 className="text-xl sm:text-2xl font-bold text-white font-display">
                  True Drop-Shoulder Streetwear Cut
                </h3>
                <p className="text-xs sm:text-sm text-zinc-400 mt-2 leading-relaxed">
                  Engineered with an elongated boxy body, wider chest circumference, and drop shoulders that drape naturally. Featuring our signature 1.25-inch thick neck ribbing that guarantees your collar never bacon-edges or sags over time.
                </p>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 text-xs pt-2">
                <div className="p-3 bg-zinc-950 border border-zinc-800 rounded-lg">
                  <span className="text-zinc-500 block mb-1">Yarn Count</span>
                  <span className="font-mono font-bold text-white text-sm">16s Single Yarn</span>
                  <span className="text-[10px] text-zinc-500 block mt-0.5">Heavy gauge compact knit</span>
                </div>

                <div className="p-3 bg-zinc-950 border border-zinc-800 rounded-lg">
                  <span className="text-zinc-500 block mb-1">Collar Rib Width</span>
                  <span className="font-mono font-bold text-white text-sm">3.2 cm (1.25&quot;)</span>
                  <span className="text-[10px] text-zinc-500 block mt-0.5">Reinforced dual-needle stitch</span>
                </div>

                <div className="p-3 bg-zinc-950 border border-zinc-800 rounded-lg col-span-2 sm:col-span-1">
                  <span className="text-zinc-500 block mb-1">Wash Treatment</span>
                  <span className="font-mono font-bold text-amber-400 text-sm">Enzyme Stone Wash</span>
                  <span className="text-[10px] text-zinc-500 block mt-0.5">Vintage hand-feel from day 1</span>
                </div>
              </div>

              <div className="flex items-center gap-2 text-xs text-zinc-400 pt-2 border-t border-zinc-800/80">
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                <span>Blind hem stitching along sleeve and bottom hem for a clean streetwear finish</span>
              </div>
            </div>
          </div>
        )}
      </div>
    </section>
  );
};
