import React from 'react';
import { Sparkles, Flame, Shield, MapPin, Truck } from 'lucide-react';

export const StreetwearTicker: React.FC = () => {
  const tickerItems = [
    { text: 'CASABLANCA TO TANGIER & MARRAKECH', icon: MapPin },
    { text: 'CUSTOM MILLED 450 GSM FRENCH TERRY', icon: Shield },
    { text: 'LIVRAISON PARTOUT AU MAROC 24/48H', icon: Truck },
    { text: 'CASH ON DELIVERY (COD) ACCEPTE', icon: Sparkles },
    { text: 'DROP 04 ARCHITECTURAL APPAREL', icon: Flame },
    { text: 'PRE-SHRUNK COMBED MOROCCAN COTTON', icon: Shield },
    { text: 'SECURE CHECKOUT VIA CMI & VISA', icon: Sparkles },
  ];

  return (
    <div className="w-full bg-zinc-950 border-y border-zinc-800/80 overflow-hidden py-2.5 relative select-none">
      <div className="flex w-[200%] animate-marquee space-x-8 text-xs font-mono font-bold tracking-widest text-zinc-400 uppercase">
        {/* Double row for seamless loop */}
        {[...tickerItems, ...tickerItems].map((item, idx) => {
          const Icon = item.icon;
          return (
            <div key={idx} className="flex items-center space-x-2 shrink-0">
              <Icon className="w-3.5 h-3.5 text-amber-400" />
              <span className="text-zinc-200">{item.text}</span>
              <span className="text-zinc-700">///</span>
            </div>
          );
        })}
      </div>
    </div>
  );
};
