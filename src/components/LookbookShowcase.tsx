import React, { useState } from 'react';
import { Camera, ArrowRight, Sparkles, MapPin, ExternalLink } from 'lucide-react';
import { soundEngine } from '../utils/audio';
import { useStore } from '../context/StoreContext';

export const LookbookShowcase: React.FC = () => {
  const { setSelectedProduct, products } = useStore();
  const [activeSlide, setActiveSlide] = useState(0);

  const lookbookItems = [
    {
      title: 'Monolith Drop 04 // Look 01',
      modelInfo: 'Reda is 185cm wearing size L (Heavyweight Boxy Hoodie in Onyx Black)',
      location: 'Casablanca Concrete Complex, Boulevard d’Anfa',
      image: '/src/assets/images/hero_wearstyle_editorial_1793989033163.jpg',
      productId: 'prod-hoodie-01',
      tag: 'Heavyweight Fleece',
    },
    {
      title: 'Architects of Chaos // Look 02',
      modelInfo: 'Amine is 181cm wearing size XL (Vintage Acid Wash Hoodie in Stone Grey)',
      location: 'Old Medina Ramparts, Tangier',
      image: '/src/assets/images/product_hoodie_washed_grey_1793989034247.jpg',
      productId: 'prod-hoodie-02',
      tag: 'Mineral Enzyme Wash',
    },
    {
      title: 'Minimalist Graphic // Look 03',
      modelInfo: 'Zineb is 174cm wearing size M (Architects of Chaos Vintage Tee)',
      location: 'Gueliz Design District, Marrakech',
      image: '/src/assets/images/product_tshirt_vintage_black_1793989034591.jpg',
      productId: 'prod-tee-01',
      tag: '280 GSM Heavy Jersey',
    },
  ];

  const current = lookbookItems[activeSlide];

  const handleSelectProduct = (productId: string) => {
    soundEngine.playClick();
    const found = products.find((p) => p.id === productId);
    if (found) {
      setSelectedProduct(found);
    }
  };

  return (
    <section className="py-16 bg-zinc-950 border-b border-zinc-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-8 gap-4">
          <div>
            <div className="flex items-center gap-2 text-xs font-mono uppercase tracking-widest text-zinc-400 mb-2">
              <Camera className="w-4 h-4 text-amber-400" />
              <span>Editorial Series 2026</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-black text-white font-display uppercase tracking-tight">
              On The Streets of Morocco
            </h2>
          </div>

          {/* Lookbook navigation */}
          <div className="flex items-center gap-2">
            {lookbookItems.map((_, i) => (
              <button
                key={i}
                onClick={() => {
                  soundEngine.playClick();
                  setActiveSlide(i);
                }}
                className={`h-2 transition-all rounded-full cursor-pointer ${
                  activeSlide === i ? 'w-8 bg-amber-400' : 'w-2 bg-zinc-800 hover:bg-zinc-700'
                }`}
                aria-label={`Go to look ${i + 1}`}
              />
            ))}
          </div>
        </div>

        {/* Featured Look Card */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center bg-zinc-900/50 border border-zinc-800 rounded-xl overflow-hidden p-6 sm:p-8">
          <div className="lg:col-span-7 relative aspect-[16/10] sm:aspect-[16/9] rounded-lg overflow-hidden bg-zinc-950 border border-zinc-800">
            <img
              src={current.image}
              alt={current.title}
              referrerPolicy="no-referrer"
              className="w-full h-full object-cover object-center filter contrast-105"
            />
            <div className="absolute top-3 left-3 bg-zinc-950/80 backdrop-blur px-2.5 py-1 rounded text-xs font-mono text-zinc-300 border border-zinc-800">
              {current.tag}
            </div>
          </div>

          <div className="lg:col-span-5 space-y-6">
            <div>
              <div className="flex items-center gap-1.5 text-xs text-amber-400 font-mono mb-2">
                <MapPin className="w-3.5 h-3.5" />
                <span>{current.location}</span>
              </div>

              <h3 className="text-2xl font-bold text-white font-display">
                {current.title}
              </h3>

              <p className="text-xs sm:text-sm text-zinc-400 mt-3 leading-relaxed">
                Shot on location. Built to endure the coastal humidity of Casablanca and the intense desert warmth of Marrakech without sacrificing heavy cotton presence.
              </p>
            </div>

            <div className="p-4 bg-zinc-950 border border-zinc-800 rounded-lg text-xs space-y-1">
              <span className="text-zinc-500 font-mono block">Fit & Size Reference:</span>
              <p className="text-zinc-200 font-medium">{current.modelInfo}</p>
            </div>

            <button
              onClick={() => handleSelectProduct(current.productId)}
              className="w-full sm:w-auto px-6 py-3 bg-white hover:bg-zinc-200 text-zinc-950 font-bold text-xs uppercase tracking-wider rounded-md transition-colors flex items-center justify-center gap-2 cursor-pointer shadow-lg active:scale-95"
            >
              <span>Inspect This Garment</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};
