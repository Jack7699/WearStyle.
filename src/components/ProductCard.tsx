import React, { useState } from 'react';
import { Product, ProductSize } from '../types';
import { useStore } from '../context/StoreContext';
import { ShoppingBag, Check } from 'lucide-react';
import { soundEngine } from '../utils/audio';

interface ProductCardProps {
  product: Product;
  onOpenDetail: (product: Product) => void;
}

export const ProductCard: React.FC<ProductCardProps> = ({ product, onOpenDetail }) => {
  const { addToCart, formatPrice } = useStore();
  const [selectedSize, setSelectedSize] = useState<ProductSize>(() => {
    const firstInStock = product.sizes.find((s) => s.stock > 0);
    return firstInStock ? firstInStock.size : product.sizes[0].size;
  });
  const [isAdded, setIsAdded] = useState(false);

  // Total stock across sizes
  const totalStock = product.sizes.reduce((sum, s) => sum + s.stock, 0);
  const isOutOfStock = totalStock <= 0;
  const currentSizeStock = product.sizes.find((s) => s.size === selectedSize)?.stock || 0;

  const handleQuickAdd = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (currentSizeStock <= 0) return;

    const success = addToCart(product, selectedSize, product.colors[0], 1);
    if (success) {
      setIsAdded(true);
      setTimeout(() => setIsAdded(false), 1400);
    }
  };

  const handleOpen = () => {
    soundEngine.playClick();
    onOpenDetail(product);
  };

  return (
    <div
      onClick={handleOpen}
      className="group flex flex-col bg-zinc-900/60 border border-zinc-800/80 rounded-lg overflow-hidden cursor-pointer hover:border-zinc-700 transition-all duration-200 hover:-translate-y-0.5"
    >
      {/* Product Image Area */}
      <div className="relative aspect-[4/3] bg-zinc-900 overflow-hidden">
        <img
          src={product.image}
          alt={product.name}
          referrerPolicy="no-referrer"
          className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-300"
        />

        {/* Quiet top corner status */}
        <div className="absolute top-3 left-3 flex items-center gap-1.5 text-[11px] font-mono">
          {isOutOfStock ? (
            <span className="bg-zinc-950/90 text-zinc-400 px-2 py-0.5 rounded border border-zinc-800">
              Sold Out
            </span>
          ) : totalStock < 10 ? (
            <span className="bg-zinc-950/90 text-amber-400 px-2 py-0.5 rounded border border-zinc-800">
              Low Stock ({totalStock})
            </span>
          ) : product.isFeatured ? (
            <span className="bg-zinc-950/90 text-zinc-200 px-2 py-0.5 rounded border border-zinc-800">
              Featured Drop
            </span>
          ) : null}
        </div>

        {/* Fabric badge in bottom corner */}
        <div className="absolute bottom-2.5 right-2.5">
          <span className="text-[10px] font-mono text-zinc-400 bg-zinc-950/80 px-2 py-0.5 rounded border border-zinc-800/60 backdrop-blur">
            {product.category === 'hoodies' ? '450 GSM' : '280 GSM'}
          </span>
        </div>
      </div>

      {/* Card Content & Metadata */}
      <div className="p-4 flex flex-col flex-1 justify-between gap-3">
        <div>
          <div className="flex items-center justify-between text-xs text-zinc-500 mb-1">
            <span className="uppercase tracking-wider font-mono text-[11px]">
              {product.category}
            </span>
            <span>{product.fit.split('/')[0]}</span>
          </div>

          <h3 className="text-base font-semibold text-zinc-100 group-hover:text-white transition-colors line-clamp-1 font-display">
            {product.name}
          </h3>

          <div className="flex items-baseline gap-2 mt-1.5">
            <span className="text-base font-bold text-white font-mono tabular-nums">
              {formatPrice(product.price)}
            </span>
            {product.comparePrice && (
              <span className="text-xs text-zinc-500 line-through font-mono tabular-nums">
                {product.comparePrice} MAD
              </span>
            )}
          </div>
        </div>

        {/* Size Selection & Quick Action */}
        <div className="pt-2 border-t border-zinc-800/60 flex items-center justify-between gap-2" onClick={(e) => e.stopPropagation()}>
          <div className="flex items-center gap-1">
            {product.sizes.map(({ size, stock }) => {
              const outOfStockForSize = stock <= 0;
              const isSelected = selectedSize === size;
              return (
                <button
                  key={size}
                  type="button"
                  disabled={outOfStockForSize}
                  onClick={() => setSelectedSize(size)}
                  className={`text-xs w-7 h-7 rounded font-mono transition-colors ${
                    isSelected
                      ? 'bg-zinc-100 text-zinc-950 font-bold'
                      : outOfStockForSize
                      ? 'opacity-30 line-through text-zinc-600 cursor-not-allowed'
                      : 'text-zinc-400 hover:text-zinc-200 bg-zinc-800/60'
                  }`}
                  title={outOfStockForSize ? `${size} (Out of Stock)` : `${size} (${stock} in stock)`}
                >
                  {size}
                </button>
              );
            })}
          </div>

          <button
            type="button"
            disabled={isOutOfStock || currentSizeStock <= 0}
            onClick={handleQuickAdd}
            className={`p-2 rounded-md transition-colors ${
              isAdded
                ? 'bg-emerald-500 text-zinc-950'
                : isOutOfStock || currentSizeStock <= 0
                ? 'bg-zinc-800 text-zinc-600 cursor-not-allowed'
                : 'bg-zinc-800 text-zinc-200 hover:bg-zinc-700 hover:text-white'
            }`}
            title="Add selected size to cart"
            aria-label="Add to cart"
          >
            {isAdded ? (
              <Check className="w-4 h-4" />
            ) : (
              <ShoppingBag className="w-4 h-4" />
            )}
          </button>
        </div>
      </div>
    </div>
  );
};
