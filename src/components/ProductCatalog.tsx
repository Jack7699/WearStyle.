import React, { useState, useMemo } from 'react';
import { Product, ProductSize } from '../types';
import { ProductCard } from './ProductCard';
import { SlidersHorizontal, ArrowUpDown, X } from 'lucide-react';

interface ProductCatalogProps {
  products: Product[];
  selectedCategory: 'all' | 't-shirts' | 'hoodies';
  onSelectCategory: (category: 'all' | 't-shirts' | 'hoodies') => void;
  searchQuery: string;
  onClearSearch: () => void;
  onOpenDetail: (product: Product) => void;
}

export const ProductCatalog: React.FC<ProductCatalogProps> = ({
  products,
  selectedCategory,
  onSelectCategory,
  searchQuery,
  onClearSearch,
  onOpenDetail,
}) => {
  const [selectedSizeFilter, setSelectedSizeFilter] = useState<ProductSize | 'ALL'>('ALL');
  const [sortBy, setSortBy] = useState<'featured' | 'price-asc' | 'price-desc' | 'newest'>('featured');

  const filteredProducts = useMemo(() => {
    return products
      .filter((p) => {
        // Category filter
        if (selectedCategory !== 'all' && p.category !== selectedCategory) {
          return false;
        }
        // Search query
        if (searchQuery.trim()) {
          const q = searchQuery.toLowerCase();
          const matchName = p.name.toLowerCase().includes(q);
          const matchDesc = p.description.toLowerCase().includes(q);
          const matchFabric = p.fabric.toLowerCase().includes(q);
          if (!matchName && !matchDesc && !matchFabric) return false;
        }
        // Size filter
        if (selectedSizeFilter !== 'ALL') {
          const sizeObj = p.sizes.find((s) => s.size === selectedSizeFilter);
          if (!sizeObj || sizeObj.stock <= 0) return false;
        }
        return true;
      })
      .sort((a, b) => {
        if (sortBy === 'price-asc') return a.price - b.price;
        if (sortBy === 'price-desc') return b.price - a.price;
        if (sortBy === 'newest') {
          return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
        }
        // Featured default
        if (a.isFeatured && !b.isFeatured) return -1;
        if (!a.isFeatured && b.isFeatured) return 1;
        return 0;
      });
  }, [products, selectedCategory, searchQuery, selectedSizeFilter, sortBy]);

  const sizes: ProductSize[] = ['S', 'M', 'L', 'XL', 'XXL'];

  return (
    <section id="catalog-section" className="py-12 bg-zinc-950">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Controls & Filter Bar */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-zinc-800">
          {/* Category Tabs (Functional Segmented Control) */}
          <div className="flex items-center gap-1.5 p-1 bg-zinc-900 border border-zinc-800 rounded-lg overflow-x-auto">
            <button
              onClick={() => onSelectCategory('all')}
              className={`px-4 py-2 text-xs font-semibold rounded-md transition-colors whitespace-nowrap cursor-pointer ${
                selectedCategory === 'all'
                  ? 'bg-white text-zinc-950 shadow-sm'
                  : 'text-zinc-400 hover:text-white'
              }`}
            >
              All Pieces
            </button>
            <button
              onClick={() => onSelectCategory('hoodies')}
              className={`px-4 py-2 text-xs font-semibold rounded-md transition-colors whitespace-nowrap cursor-pointer ${
                selectedCategory === 'hoodies'
                  ? 'bg-white text-zinc-950 shadow-sm'
                  : 'text-zinc-400 hover:text-white'
              }`}
            >
              Heavyweight Hoodies
            </button>
            <button
              onClick={() => onSelectCategory('t-shirts')}
              className={`px-4 py-2 text-xs font-semibold rounded-md transition-colors whitespace-nowrap cursor-pointer ${
                selectedCategory === 't-shirts'
                  ? 'bg-white text-zinc-950 shadow-sm'
                  : 'text-zinc-400 hover:text-white'
              }`}
            >
              Oversized T-Shirts
            </button>
          </div>

          {/* Secondary Filters: Size & Sort */}
          <div className="flex flex-wrap items-center gap-3">
            {/* Size Filter */}
            <div className="flex items-center gap-1 text-xs">
              <span className="text-zinc-500 mr-1 hidden sm:inline">Size:</span>
              <button
                onClick={() => setSelectedSizeFilter('ALL')}
                className={`px-2.5 py-1 rounded text-xs font-mono transition-colors ${
                  selectedSizeFilter === 'ALL'
                    ? 'bg-zinc-800 text-white font-bold'
                    : 'text-zinc-400 hover:text-zinc-200'
                }`}
              >
                All
              </button>
              {sizes.map((sz) => (
                <button
                  key={sz}
                  onClick={() =>
                    setSelectedSizeFilter(selectedSizeFilter === sz ? 'ALL' : sz)
                  }
                  className={`px-2 py-1 rounded text-xs font-mono transition-colors ${
                    selectedSizeFilter === sz
                      ? 'bg-zinc-100 text-zinc-950 font-bold'
                      : 'text-zinc-400 hover:text-zinc-200 bg-zinc-900/80 border border-zinc-800'
                  }`}
                >
                  {sz}
                </button>
              ))}
            </div>

            {/* Sort Selector */}
            <div className="flex items-center gap-1.5 bg-zinc-900 border border-zinc-800 rounded-md px-2.5 py-1 text-xs text-zinc-300">
              <ArrowUpDown className="w-3.5 h-3.5 text-zinc-500" />
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as any)}
                aria-label="Sort products by"
                className="bg-transparent text-zinc-200 text-xs focus:outline-none cursor-pointer"
              >
                <option value="featured" className="bg-zinc-900">Featured</option>
                <option value="price-asc" className="bg-zinc-900">Price: Low to High</option>
                <option value="price-desc" className="bg-zinc-900">Price: High to Low</option>
                <option value="newest" className="bg-zinc-900">New Arrivals</option>
              </select>
            </div>
          </div>
        </div>

        {/* Search Active Notification & Item Count */}
        <div className="py-4 flex items-center justify-between text-xs text-zinc-400">
          <div className="flex items-center gap-2">
            <span>Showing <strong className="text-zinc-200 font-mono">{filteredProducts.length}</strong> items</span>
            {searchQuery && (
              <>
                <span aria-hidden="true" className="text-zinc-600">·</span>
                <span className="text-zinc-300">
                  Search: &ldquo;{searchQuery}&rdquo;
                </span>
                <button
                  onClick={onClearSearch}
                  className="text-amber-400 hover:underline flex items-center gap-1 ml-1"
                >
                  <X className="w-3 h-3" /> Clear
                </button>
              </>
            )}
            {selectedSizeFilter !== 'ALL' && (
              <>
                <span aria-hidden="true" className="text-zinc-600">·</span>
                <span>Size: {selectedSizeFilter}</span>
              </>
            )}
          </div>

          <div className="text-zinc-500 hidden sm:block">
            All prices in MAD (Dirham)
          </div>
        </div>

        {/* Product Grid */}
        {filteredProducts.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
            {filteredProducts.map((product) => (
              <ProductCard
                key={product.id}
                product={product}
                onOpenDetail={onOpenDetail}
              />
            ))}
          </div>
        ) : (
          <div className="py-20 text-center border border-dashed border-zinc-800 rounded-lg">
            <p className="text-zinc-400 text-base mb-2">No streetwear pieces match your filter.</p>
            <p className="text-zinc-600 text-xs mb-4">Try clearing your search query or selecting a different size.</p>
            <button
              onClick={() => {
                onSelectCategory('all');
                onClearSearch();
                setSelectedSizeFilter('ALL');
              }}
              className="px-4 py-2 text-xs font-semibold text-zinc-950 bg-white hover:bg-zinc-200 rounded-md transition-colors"
            >
              Reset Filters
            </button>
          </div>
        )}
      </div>
    </section>
  );
};
