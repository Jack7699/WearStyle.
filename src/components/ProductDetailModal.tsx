import React, { useState } from 'react';
import { Product, ProductSize } from '../types';
import { useStore } from '../context/StoreContext';
import { X, Check, ShieldCheck, Truck, RotateCcw, Ruler } from 'lucide-react';
import { soundEngine } from '../utils/audio';

interface ProductDetailModalProps {
  product: Product | null;
  onClose: () => void;
  onOpenCheckoutDirectly?: () => void;
}

export const ProductDetailModal: React.FC<ProductDetailModalProps> = ({
  product,
  onClose,
  onOpenCheckoutDirectly,
}) => {
  const { addToCart, setIsCheckoutOpen, formatPrice } = useStore();

  if (!product) return null;

  const [selectedSize, setSelectedSize] = useState<ProductSize>(() => {
    const firstInStock = product.sizes.find((s) => s.stock > 0);
    return firstInStock ? firstInStock.size : product.sizes[0].size;
  });
  const [selectedColor, setSelectedColor] = useState<string>(product.colors[0] || 'Default');
  const [quantity, setQuantity] = useState(1);
  const [isAdded, setIsAdded] = useState(false);
  const [showSizeGuide, setShowSizeGuide] = useState(false);

  const currentSizeObj = product.sizes.find((s) => s.size === selectedSize);
  const availableStock = currentSizeObj ? currentSizeObj.stock : 0;
  const isOutOfStock = availableStock <= 0;

  const handleAddToCart = () => {
    if (isOutOfStock) return;
    const success = addToCart(product, selectedSize, selectedColor, quantity);
    if (success) {
      setIsAdded(true);
      setTimeout(() => setIsAdded(false), 1500);
    }
  };

  const handleBuyNow = () => {
    if (isOutOfStock) return;
    addToCart(product, selectedSize, selectedColor, quantity);
    onClose();
    setIsCheckoutOpen(true);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-zinc-950/80 backdrop-blur-sm overflow-y-auto">
      <div className="relative w-full max-w-4xl bg-zinc-900 border border-zinc-800 rounded-xl overflow-hidden shadow-2xl my-8">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-10 p-2 text-zinc-400 hover:text-white bg-zinc-950/60 rounded-full border border-zinc-800 transition-colors"
          aria-label="Close details"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="grid grid-cols-1 md:grid-cols-12 max-h-[85vh] overflow-y-auto">
          {/* Left: Product Image & Gallery */}
          <div className="md:col-span-6 bg-zinc-950 relative flex items-center justify-center">
            <img
              src={product.image}
              alt={product.name}
              referrerPolicy="no-referrer"
              className="w-full h-full object-cover max-h-[480px] md:max-h-none"
            />
            <div className="absolute bottom-4 left-4">
              <span className="font-mono text-xs bg-zinc-950/80 text-zinc-300 px-3 py-1 rounded border border-zinc-800">
                {product.fabric.split('(')[0]}
              </span>
            </div>
          </div>

          {/* Right: Contiguous Purchase Module */}
          <div className="md:col-span-6 p-6 sm:p-8 flex flex-col justify-between space-y-6">
            <div>
              {/* Category & Title */}
              <div className="flex items-center gap-2 text-xs text-zinc-400 uppercase tracking-widest font-mono mb-2">
                <span>{product.category}</span>
                <span aria-hidden="true" className="text-zinc-600">·</span>
                <span>{product.fit}</span>
              </div>

              <h2 className="text-2xl sm:text-3xl font-bold text-white tracking-tight font-display mb-3">
                {product.name}
              </h2>

              {/* Price & Savings */}
              <div className="flex items-baseline gap-3 mb-6 pb-6 border-b border-zinc-800">
                <span className="text-2xl font-black text-white font-mono tabular-nums">
                  {formatPrice(product.price)}
                </span>
                {product.comparePrice && (
                  <>
                    <span className="text-sm text-zinc-500 line-through font-mono tabular-nums">
                      {product.comparePrice} MAD
                    </span>
                    <span className="text-xs text-emerald-400 font-mono font-medium">
                      Save {product.comparePrice - product.price} MAD
                    </span>
                  </>
                )}
              </div>

              {/* Description */}
              <p className="text-sm text-zinc-300 leading-relaxed mb-6">
                {product.description}
              </p>

              {/* Fabric Details */}
              <div className="mb-6 p-3.5 bg-zinc-950/60 border border-zinc-800/80 rounded-lg text-xs space-y-1.5">
                <div className="flex justify-between">
                  <span className="text-zinc-400">Composition:</span>
                  <span className="text-zinc-200 font-medium text-right">{product.fabric}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-zinc-400">Fit Profile:</span>
                  <span className="text-zinc-200 font-medium">{product.fit}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-zinc-400">Origin & Craft:</span>
                  <span className="text-zinc-200 font-medium">Custom Milled in Morocco</span>
                </div>
              </div>

              {/* Color Selector */}
              {product.colors.length > 0 && (
                <div className="mb-5">
                  <div className="text-xs font-semibold text-zinc-300 mb-2">
                    Colorway: <span className="text-zinc-400 font-normal">{selectedColor}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    {product.colors.map((color) => (
                      <button
                        key={color}
                        type="button"
                        onClick={() => setSelectedColor(color)}
                        className={`px-3 py-1.5 text-xs rounded border transition-colors ${
                          selectedColor === color
                            ? 'border-white bg-zinc-800 text-white font-medium'
                            : 'border-zinc-800 bg-zinc-950/60 text-zinc-400 hover:text-zinc-200'
                        }`}
                      >
                        {color}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Size Selector with Size Guide */}
              <div className="mb-6">
                <div className="flex items-center justify-between text-xs mb-2">
                  <span className="font-semibold text-zinc-300">
                    Select Size:
                  </span>
                  <button
                    type="button"
                    onClick={() => setShowSizeGuide(!showSizeGuide)}
                    className="text-xs text-zinc-400 hover:text-white flex items-center gap-1 underline transition-colors"
                  >
                    <Ruler className="w-3.5 h-3.5" />
                    <span>Size Guide (CM)</span>
                  </button>
                </div>

                <div className="grid grid-cols-5 gap-2">
                  {product.sizes.map(({ size, stock }) => {
                    const isSelected = selectedSize === size;
                    const isSoldOut = stock <= 0;
                    return (
                      <button
                        key={size}
                        type="button"
                        disabled={isSoldOut}
                        onClick={() => {
                          setSelectedSize(size);
                          setQuantity(1);
                        }}
                        className={`py-2.5 rounded text-center text-xs font-mono transition-all relative ${
                          isSelected
                            ? 'bg-white text-zinc-950 font-bold shadow-md'
                            : isSoldOut
                            ? 'bg-zinc-950 text-zinc-600 line-through border border-zinc-800/40 cursor-not-allowed'
                            : 'bg-zinc-800/80 text-zinc-200 hover:bg-zinc-700 border border-zinc-700/60'
                        }`}
                      >
                        <div>{size}</div>
                        <div className="text-[10px] opacity-75 mt-0.5">
                          {isSoldOut ? '0 left' : `${stock} left`}
                        </div>
                      </button>
                    );
                  })}
                </div>

                {/* Inline Size Guide dropdown */}
                {showSizeGuide && (
                  <div className="mt-3 p-3 bg-zinc-950 rounded border border-zinc-800 text-xs">
                    <div className="font-semibold text-zinc-300 mb-2">Streetwear Oversized Fit Chart:</div>
                    <div className="grid grid-cols-4 gap-2 text-[11px] text-zinc-400 font-mono">
                      <div>S: Chest 56cm / Length 71cm</div>
                      <div>M: Chest 59cm / Length 73cm</div>
                      <div>L: Chest 62cm / Length 75cm</div>
                      <div>XL: Chest 65cm / Length 77cm</div>
                    </div>
                    <p className="text-[10px] text-zinc-500 mt-2">
                      *Boxy streetwear fit. If you prefer a regular tailored fit, order one size down.
                    </p>
                  </div>
                )}
              </div>

              {/* Quantity selector */}
              {!isOutOfStock && (
                <div className="flex items-center gap-4 mb-6">
                  <span className="text-xs text-zinc-400">Quantity:</span>
                  <div className="flex items-center border border-zinc-800 bg-zinc-950 rounded-md">
                    <button
                      type="button"
                      disabled={quantity <= 1}
                      onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                      className="px-3 py-1 text-zinc-400 hover:text-white disabled:opacity-30"
                    >
                      -
                    </button>
                    <span className="px-3 py-1 text-xs font-mono tabular-nums text-white">
                      {quantity}
                    </span>
                    <button
                      type="button"
                      disabled={quantity >= availableStock}
                      onClick={() => setQuantity((q) => Math.min(availableStock, q + 1))}
                      className="px-3 py-1 text-zinc-400 hover:text-white disabled:opacity-30"
                    >
                      +
                    </button>
                  </div>
                  <span className="text-xs text-zinc-500 font-mono">
                    Max: {availableStock}
                  </span>
                </div>
              )}
            </div>

            {/* CTAs */}
            <div className="space-y-3 pt-4 border-t border-zinc-800">
              <div className="flex items-center gap-3">
                <button
                  type="button"
                  disabled={isOutOfStock}
                  onClick={handleAddToCart}
                  className={`flex-1 py-3 px-4 rounded-md text-xs font-semibold uppercase tracking-wider transition-all flex items-center justify-center gap-2 cursor-pointer ${
                    isAdded
                      ? 'bg-emerald-500 text-zinc-950'
                      : isOutOfStock
                      ? 'bg-zinc-800 text-zinc-500 cursor-not-allowed'
                      : 'bg-white text-zinc-950 hover:bg-zinc-200 active:scale-[0.98]'
                  }`}
                >
                  {isAdded ? (
                    <>
                      <Check className="w-4 h-4" />
                      <span>Added to Bag</span>
                    </>
                  ) : isOutOfStock ? (
                    <span>Out of Stock</span>
                  ) : (
                    <span>Add to Bag · {product.price * quantity} MAD</span>
                  )}
                </button>

                <button
                  type="button"
                  disabled={isOutOfStock}
                  onClick={handleBuyNow}
                  className="px-5 py-3 rounded-md text-xs font-semibold uppercase tracking-wider bg-zinc-800 hover:bg-zinc-700 text-white transition-colors cursor-pointer border border-zinc-700"
                >
                  Buy Now
                </button>
              </div>

              {/* Delivery info guarantee */}
              <div className="grid grid-cols-2 gap-2 text-[11px] text-zinc-400 pt-2">
                <div className="flex items-center gap-1.5">
                  <Truck className="w-3.5 h-3.5 text-amber-400" />
                  <span>Livraison 24-48h au Maroc</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <RotateCcw className="w-3.5 h-3.5 text-amber-400" />
                  <span>Free Size Exchanges</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
