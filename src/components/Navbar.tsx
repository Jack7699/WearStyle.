import React from 'react';
import { ShoppingBag, ShieldCheck, Search, Truck, Volume2, VolumeX, Sparkles } from 'lucide-react';
import { useStore } from '../context/StoreContext';
import { soundEngine } from '../utils/audio';

interface NavbarProps {
  onSelectCategory: (cat: 'all' | 't-shirts' | 'hoodies') => void;
  selectedCategory: 'all' | 't-shirts' | 'hoodies';
  searchQuery: string;
  setSearchQuery: (q: string) => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  onSelectCategory,
  selectedCategory,
  searchQuery,
  setSearchQuery,
}) => {
  const {
    cartCount,
    setIsCartOpen,
    activeView,
    setActiveView,
    setIsTrackingModalOpen,
    isAdminLoggedIn,
    selectedCurrency,
    setSelectedCurrency,
    isSoundEnabled,
    toggleSound,
  } = useStore();

  const handleNavClick = (view: 'shop' | 'admin', category?: 'all' | 't-shirts' | 'hoodies') => {
    setActiveView(view);
    if (category) {
      onSelectCategory(category);
    }
  };

  return (
    <header className="sticky top-0 z-40 bg-zinc-950/90 backdrop-blur-md border-b border-zinc-800/80">
      {/* Top micro announcement bar */}
      <div className="bg-zinc-900/90 text-zinc-400 text-xs py-1.5 px-4 text-center border-b border-zinc-800/50 flex items-center justify-center gap-2">
        <span className="text-zinc-200 font-medium">LIVRAISON PARTOUT AU MAROC</span>
        <span aria-hidden="true" className="text-zinc-600">·</span>
        <span>Free shipping over 500 MAD</span>
        <span aria-hidden="true" className="text-zinc-600">·</span>
        <span className="text-amber-400/90 font-medium">Use code WEAR10 for 10% off</span>
      </div>

      {/* Main Top Bar strictly obeying the 3-zone contract */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-8">
        {/* Zone 1: Single text element wordmark */}
        <button
          onClick={() => handleNavClick('shop', 'all')}
          className="text-xl sm:text-2xl font-black tracking-tighter text-white uppercase font-display whitespace-nowrap shrink-0 hover:opacity-90 transition-opacity flex items-center gap-2"
        >
          <span>WEARSTYLE</span>
          <span className="text-[10px] tracking-widest text-zinc-500 font-mono font-normal">MA</span>
        </button>

        {/* Zone 2: Concise single-line text navigation links */}
        <nav className="hidden md:flex items-center gap-7 text-sm font-medium text-zinc-400">
          <button
            onClick={() => handleNavClick('shop', 'all')}
            className={`whitespace-nowrap shrink-0 transition-colors hover:text-white ${
              activeView === 'shop' && selectedCategory === 'all'
                ? 'text-white border-b-2 border-white pb-0.5'
                : ''
            }`}
          >
            All Apparel
          </button>
          <button
            onClick={() => handleNavClick('shop', 'hoodies')}
            className={`whitespace-nowrap shrink-0 transition-colors hover:text-white ${
              activeView === 'shop' && selectedCategory === 'hoodies'
                ? 'text-white border-b-2 border-white pb-0.5'
                : ''
            }`}
          >
            Hoodies
          </button>
          <button
            onClick={() => handleNavClick('shop', 't-shirts')}
            className={`whitespace-nowrap shrink-0 transition-colors hover:text-white ${
              activeView === 'shop' && selectedCategory === 't-shirts'
                ? 'text-white border-b-2 border-white pb-0.5'
                : ''
            }`}
          >
            T-Shirts
          </button>
          <button
            onClick={() => setIsTrackingModalOpen(true)}
            className="whitespace-nowrap shrink-0 transition-colors hover:text-white flex items-center gap-1.5"
          >
            <Truck className="w-3.5 h-3.5 text-zinc-400" />
            <span>Track Order</span>
          </button>
          <button
            onClick={() => setActiveView(activeView === 'admin' ? 'shop' : 'admin')}
            className={`whitespace-nowrap shrink-0 transition-colors flex items-center gap-1.5 ${
              activeView === 'admin'
                ? 'text-amber-400 border-b-2 border-amber-400 pb-0.5'
                : 'text-zinc-400 hover:text-white'
            }`}
          >
            <ShieldCheck className="w-3.5 h-3.5 text-zinc-400" />
            <span>Admin Portal</span>
            {isAdminLoggedIn && (
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400"></span>
            )}
          </button>
        </nav>

        {/* Zone 3: 1 primary action (Bag with count + audio & currency utilities) */}
        <div className="flex items-center gap-2 sm:gap-3 shrink-0">
          {/* Currency Toggle */}
          <div className="hidden sm:flex items-center bg-zinc-900 border border-zinc-800 rounded-md p-0.5 text-[11px] font-mono">
            {(['MAD', 'EUR', 'USD'] as const).map((curr) => (
              <button
                key={curr}
                type="button"
                onClick={() => {
                  soundEngine.playClick();
                  setSelectedCurrency(curr);
                }}
                className={`px-2 py-1 rounded transition-colors ${
                  selectedCurrency === curr
                    ? 'bg-zinc-100 text-zinc-950 font-bold'
                    : 'text-zinc-400 hover:text-zinc-200'
                }`}
                title={`Display prices in ${curr}`}
              >
                {curr === 'MAD' ? 'MAD' : curr}
              </button>
            ))}
          </div>

          {/* Sound & Ambient Vibe Button */}
          <button
            type="button"
            onClick={toggleSound}
            className={`p-2 rounded-md border text-xs font-mono transition-colors flex items-center gap-1.5 ${
              isSoundEnabled
                ? 'bg-amber-400/10 border-amber-400/40 text-amber-300'
                : 'bg-zinc-900 border-zinc-800 text-zinc-500 hover:text-zinc-300'
            }`}
            title={isSoundEnabled ? 'Audio FX & Vibe: ON (Click to mute)' : 'Audio FX: MUTED (Click to activate clicks & ambient)'}
            aria-label="Toggle Streetwear Audio"
          >
            {isSoundEnabled ? <Volume2 className="w-3.5 h-3.5" /> : <VolumeX className="w-3.5 h-3.5" />}
            <span className="hidden lg:inline text-[10px] uppercase font-bold tracking-wider">
              {isSoundEnabled ? 'Audio On' : 'Audio Off'}
            </span>
          </button>

          {/* Quick search input (desktop) */}
          <div className="hidden xl:flex items-center relative">
            <Search className="w-3.5 h-3.5 text-zinc-500 absolute left-3 pointer-events-none" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search heavyweight..."
              className="bg-zinc-900 border border-zinc-800 rounded-md pl-8 pr-3 py-1.5 text-xs text-zinc-200 placeholder-zinc-500 focus:outline-none focus:border-zinc-600 transition-colors w-36 focus:w-48"
            />
          </div>

          {/* Mobile Admin toggle */}
          <button
            onClick={() => {
              soundEngine.playClick();
              setActiveView(activeView === 'admin' ? 'shop' : 'admin');
            }}
            className="md:hidden p-2 text-zinc-400 hover:text-white transition-colors"
            title="Admin Dashboard"
            aria-label="Admin Dashboard"
          >
            <ShieldCheck className="w-5 h-5" />
          </button>

          {/* Primary Action Button: Bag */}
          <button
            onClick={() => {
              soundEngine.playClick();
              setIsCartOpen(true);
            }}
            className="px-3.5 sm:px-4 py-2 text-xs font-semibold text-zinc-950 bg-white hover:bg-zinc-200 rounded-md transition-colors whitespace-nowrap shrink-0 flex items-center gap-2 cursor-pointer shadow-sm active:scale-95"
            aria-label="View Shopping Cart"
          >
            <ShoppingBag className="w-4 h-4 text-zinc-950" />
            <span className="hidden sm:inline">Bag</span>
            <span className="font-mono text-xs tabular-nums bg-zinc-900 text-white rounded px-1.5 py-0.2">
              {cartCount}
            </span>
          </button>
        </div>
      </div>
    </header>
  );
};
