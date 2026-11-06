import React, { useState } from 'react';
import { useStore } from '../context/StoreContext';
import { FREE_SHIPPING_THRESHOLD_MAD } from '../data/moroccoCities';
import { X, Trash2, Plus, Minus, ArrowRight, Tag, Check, AlertCircle } from 'lucide-react';

export const CartDrawer: React.FC = () => {
  const {
    cart,
    isCartOpen,
    setIsCartOpen,
    setIsCheckoutOpen,
    updateCartQuantity,
    removeFromCart,
    subtotal,
    appliedDiscount,
    applyDiscountCode,
    removeDiscountCode,
    calculateDiscountAmount,
  } = useStore();

  const [promoInput, setPromoInput] = useState('');
  const [promoFeedback, setPromoFeedback] = useState<{
    type: 'success' | 'error' | null;
    message: string;
  }>({ type: null, message: '' });

  if (!isCartOpen) return null;

  const discountAmount = calculateDiscountAmount(subtotal, appliedDiscount);
  const remainingForFreeShipping = Math.max(0, FREE_SHIPPING_THRESHOLD_MAD - subtotal);
  const freeShippingProgress = Math.min(100, (subtotal / FREE_SHIPPING_THRESHOLD_MAD) * 100);

  const handleApplyPromo = (e: React.FormEvent) => {
    e.preventDefault();
    if (!promoInput.trim()) return;

    const result = applyDiscountCode(promoInput, subtotal);
    if (result.success) {
      setPromoFeedback({ type: 'success', message: result.message });
      setPromoInput('');
    } else {
      setPromoFeedback({ type: 'error', message: result.message });
    }
    setTimeout(() => {
      setPromoFeedback({ type: null, message: '' });
    }, 4000);
  };

  const handleProceedToCheckout = () => {
    setIsCartOpen(false);
    setIsCheckoutOpen(true);
  };

  return (
    <div className="fixed inset-0 z-50 flex justify-end bg-zinc-950/80 backdrop-blur-sm transition-opacity">
      <div className="w-full max-w-md bg-zinc-900 border-l border-zinc-800 h-full flex flex-col justify-between shadow-2xl">
        {/* Header */}
        <div className="p-5 border-b border-zinc-800 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <h2 className="text-lg font-bold text-white font-display uppercase tracking-tight">
              Shopping Bag
            </h2>
            <span className="text-xs font-mono text-zinc-400 bg-zinc-800 px-2 py-0.5 rounded">
              {cart.reduce((sum, item) => sum + item.quantity, 0)} items
            </span>
          </div>
          <button
            onClick={() => setIsCartOpen(false)}
            className="p-1.5 text-zinc-400 hover:text-white rounded-md hover:bg-zinc-800 transition-colors"
            aria-label="Close cart"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Free Shipping Progress Meter */}
        <div className="px-5 py-3 bg-zinc-950 border-b border-zinc-800/80 text-xs">
          {remainingForFreeShipping > 0 ? (
            <p className="text-zinc-300 mb-2">
              Add <strong className="text-white font-mono">{remainingForFreeShipping} MAD</strong> more for <strong className="text-amber-400">Free Express Delivery</strong> anywhere in Morocco!
            </p>
          ) : (
            <p className="text-emerald-400 font-medium mb-2 flex items-center gap-1.5">
              <Check className="w-4 h-4" />
              <span>You unlocked Free Delivery across Morocco!</span>
            </p>
          )}
          <div className="w-full h-1.5 bg-zinc-800 rounded-full overflow-hidden">
            <div
              className={`h-full transition-all duration-300 ${
                remainingForFreeShipping === 0 ? 'bg-emerald-400' : 'bg-amber-400'
              }`}
              style={{ width: `${freeShippingProgress}%` }}
            />
          </div>
        </div>

        {/* Item List */}
        <div className="flex-1 overflow-y-auto p-5 space-y-4">
          {cart.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-center p-6 text-zinc-500">
              <p className="text-base text-zinc-300 mb-1">Your bag is empty.</p>
              <p className="text-xs text-zinc-500 mb-6">
                Discover our heavyweight t-shirts and hoodies milled from combed Moroccan cotton.
              </p>
              <button
                onClick={() => setIsCartOpen(false)}
                className="px-5 py-2.5 bg-white text-zinc-950 font-semibold text-xs rounded-md hover:bg-zinc-200 transition-colors"
              >
                Start Shopping
              </button>
            </div>
          ) : (
            cart.map((item) => (
              <div
                key={`${item.productId}-${item.size}`}
                className="flex gap-4 p-3 bg-zinc-950/60 rounded-lg border border-zinc-800/80"
              >
                {/* Image */}
                <div className="w-20 h-20 bg-zinc-900 rounded overflow-hidden shrink-0">
                  <img
                    src={item.image}
                    alt={item.name}
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-cover"
                  />
                </div>

                {/* Info */}
                <div className="flex-1 flex flex-col justify-between">
                  <div>
                    <div className="flex justify-between items-start">
                      <h4 className="text-sm font-semibold text-zinc-200 line-clamp-1">
                        {item.name}
                      </h4>
                      <button
                        onClick={() => removeFromCart(item.productId, item.size)}
                        className="text-zinc-500 hover:text-red-400 transition-colors p-1"
                        aria-label="Remove item"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>

                    <div className="text-xs text-zinc-500 flex items-center gap-2 mt-0.5">
                      <span>Size: <strong className="text-zinc-300 font-mono">{item.size}</strong></span>
                      <span aria-hidden="true">·</span>
                      <span>{item.color}</span>
                    </div>
                  </div>

                  <div className="flex items-center justify-between pt-2">
                    {/* Stepper */}
                    <div className="flex items-center border border-zinc-800 bg-zinc-900 rounded">
                      <button
                        onClick={() => updateCartQuantity(item.productId, item.size, -1)}
                        className="px-2 py-0.5 text-zinc-400 hover:text-white"
                        aria-label="Decrease quantity"
                      >
                        <Minus className="w-3 h-3" />
                      </button>
                      <span className="px-2 text-xs font-mono text-zinc-200 tabular-nums">
                        {item.quantity}
                      </span>
                      <button
                        disabled={item.quantity >= item.maxStock}
                        onClick={() => updateCartQuantity(item.productId, item.size, 1)}
                        className="px-2 py-0.5 text-zinc-400 hover:text-white disabled:opacity-30"
                        aria-label="Increase quantity"
                      >
                        <Plus className="w-3 h-3" />
                      </button>
                    </div>

                    <div className="text-sm font-bold text-white font-mono tabular-nums">
                      {item.price * item.quantity} MAD
                    </div>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Footer with Discount Code Input & Checkout CTA */}
        {cart.length > 0 && (
          <div className="p-5 border-t border-zinc-800 bg-zinc-950 space-y-4">
            {/* Promo Code Input */}
            <div>
              {appliedDiscount ? (
                <div className="flex items-center justify-between p-2.5 bg-emerald-950/40 border border-emerald-800/60 rounded-md text-xs">
                  <div className="flex items-center gap-2 text-emerald-400">
                    <Tag className="w-3.5 h-3.5" />
                    <span>
                      Code <strong>{appliedDiscount.code}</strong> applied ({appliedDiscount.type === 'percentage' ? `${appliedDiscount.value}% off` : `${appliedDiscount.value} MAD off`})
                    </span>
                  </div>
                  <button
                    onClick={removeDiscountCode}
                    className="text-zinc-400 hover:text-white text-xs underline"
                  >
                    Remove
                  </button>
                </div>
              ) : (
                <form onSubmit={handleApplyPromo} className="flex gap-2">
                  <div className="relative flex-1">
                    <input
                      type="text"
                      value={promoInput}
                      onChange={(e) => setPromoInput(e.target.value)}
                      placeholder="Promo code (e.g. WEAR10)"
                      className="w-full bg-zinc-900 border border-zinc-800 rounded-md px-3 py-2 text-xs text-white placeholder-zinc-500 uppercase tracking-wider font-mono focus:outline-none focus:border-zinc-600"
                    />
                  </div>
                  <button
                    type="submit"
                    className="px-3.5 py-2 bg-zinc-800 hover:bg-zinc-700 text-zinc-200 text-xs font-semibold rounded-md transition-colors"
                  >
                    Apply
                  </button>
                </form>
              )}

              {/* Promo feedback message */}
              {promoFeedback.type && (
                <div
                  className={`mt-1.5 text-[11px] flex items-center gap-1.5 ${
                    promoFeedback.type === 'success' ? 'text-emerald-400' : 'text-rose-400'
                  }`}
                >
                  {promoFeedback.type === 'success' ? (
                    <Check className="w-3 h-3" />
                  ) : (
                    <AlertCircle className="w-3 h-3" />
                  )}
                  <span>{promoFeedback.message}</span>
                </div>
              )}
            </div>

            {/* Calculations Breakdown */}
            <div className="space-y-1.5 text-xs text-zinc-400 pt-2 border-t border-zinc-900">
              <div className="flex justify-between">
                <span>Subtotal:</span>
                <span className="font-mono text-zinc-200 tabular-nums">{subtotal} MAD</span>
              </div>

              {discountAmount > 0 && (
                <div className="flex justify-between text-emerald-400">
                  <span>Discount ({appliedDiscount?.code}):</span>
                  <span className="font-mono tabular-nums">-{discountAmount} MAD</span>
                </div>
              )}

              <div className="flex justify-between">
                <span>Shipping:</span>
                <span className="font-mono text-zinc-400">
                  {remainingForFreeShipping === 0 ? 'FREE' : 'Calculated at checkout'}
                </span>
              </div>

              <div className="flex justify-between text-sm font-bold text-white pt-2 border-t border-zinc-800">
                <span>Estimated Total:</span>
                <span className="font-mono tabular-nums text-base">
                  {Math.max(0, subtotal - discountAmount)} MAD
                </span>
              </div>
            </div>

            {/* Checkout Button */}
            <button
              onClick={handleProceedToCheckout}
              className="w-full py-3.5 px-4 bg-white hover:bg-zinc-200 text-zinc-950 font-semibold text-xs uppercase tracking-wider rounded-md transition-colors flex items-center justify-center gap-2 cursor-pointer shadow-lg active:scale-[0.99]"
            >
              <span>Proceed to Moroccan Checkout</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
