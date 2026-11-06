import React, { useState } from 'react';
import { DiscountCode, DiscountType } from '../../types';
import { X, Tag, Calendar, Percent, Banknote } from 'lucide-react';

interface DiscountCodeModalProps {
  codeToEdit?: DiscountCode | null;
  onClose: () => void;
  onSave: (data: Omit<DiscountCode, 'id' | 'usageCount'>) => void;
}

export const DiscountCodeModal: React.FC<DiscountCodeModalProps> = ({
  codeToEdit,
  onClose,
  onSave,
}) => {
  const [code, setCode] = useState(codeToEdit?.code || '');
  const [type, setType] = useState<DiscountType>(codeToEdit?.type || 'percentage');
  const [value, setValue] = useState(codeToEdit?.value?.toString() || '15');
  const [minOrderAmount, setMinOrderAmount] = useState(
    codeToEdit?.minOrderAmount?.toString() || '200'
  );

  // Default expiry date: 90 days from today
  const defaultExpiry = () => {
    const d = new Date();
    d.setDate(d.getDate() + 90);
    return d.toISOString().split('T')[0];
  };

  const [expiryDate, setExpiryDate] = useState(
    codeToEdit?.expiryDate || defaultExpiry()
  );
  const [isActive, setIsActive] = useState(codeToEdit?.isActive ?? true);
  const [error, setError] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const cleanCode = code.trim().toUpperCase();

    if (!cleanCode) {
      setError('Please provide a discount code');
      return;
    }

    const numValue = parseFloat(value);
    if (isNaN(numValue) || numValue <= 0) {
      setError('Please provide a valid discount value greater than 0');
      return;
    }

    if (type === 'percentage' && numValue > 90) {
      setError('Percentage discount cannot exceed 90%');
      return;
    }

    if (!expiryDate) {
      setError('Please specify an expiry date');
      return;
    }

    onSave({
      code: cleanCode,
      type,
      value: numValue,
      minOrderAmount: minOrderAmount ? parseFloat(minOrderAmount) : undefined,
      expiryDate,
      isActive,
    });

    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-zinc-950/85 backdrop-blur-md">
      <div className="relative w-full max-w-md bg-zinc-900 border border-zinc-800 rounded-xl overflow-hidden shadow-2xl p-6">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 text-zinc-400 hover:text-white rounded-md hover:bg-zinc-800 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-2 text-xs font-mono text-amber-400 uppercase tracking-widest mb-1">
          <Tag className="w-4 h-4" />
          <span>Promotion Engine</span>
        </div>

        <h2 className="text-xl font-bold text-white font-display mb-1">
          {codeToEdit ? 'Edit Promo Code' : 'Create New Discount Code'}
        </h2>

        <p className="text-xs text-zinc-400 mb-6">
          Set customer coupon codes with percentage or fixed MAD discounts and expiry dates.
        </p>

        {error && (
          <div className="mb-4 p-2.5 bg-rose-950/50 border border-rose-800 rounded text-xs text-rose-300">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Code String */}
          <div>
            <label className="block text-xs font-semibold text-zinc-300 mb-1">
              Discount Code Name *
            </label>
            <input
              type="text"
              required
              value={code}
              onChange={(e) => setCode(e.target.value.toUpperCase())}
              placeholder="e.g. WEAR15, MARRAKECH50"
              className="w-full bg-zinc-950 border border-zinc-800 rounded-md px-3.5 py-2 text-xs text-white uppercase font-mono tracking-wider focus:outline-none focus:border-zinc-600"
            />
          </div>

          {/* Type Selector (Percentage vs Fixed MAD) */}
          <div>
            <label className="block text-xs font-semibold text-zinc-300 mb-1.5">
              Discount Type *
            </label>
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => setType('percentage')}
                className={`py-2 px-3 rounded-md text-xs font-semibold flex items-center justify-center gap-2 border transition-colors ${
                  type === 'percentage'
                    ? 'border-white bg-zinc-800 text-white'
                    : 'border-zinc-800 bg-zinc-950 text-zinc-400 hover:text-zinc-200'
                }`}
              >
                <Percent className="w-3.5 h-3.5 text-amber-400" />
                <span>Percentage (%)</span>
              </button>

              <button
                type="button"
                onClick={() => setType('fixed')}
                className={`py-2 px-3 rounded-md text-xs font-semibold flex items-center justify-center gap-2 border transition-colors ${
                  type === 'fixed'
                    ? 'border-white bg-zinc-800 text-white'
                    : 'border-zinc-800 bg-zinc-950 text-zinc-400 hover:text-zinc-200'
                }`}
              >
                <Banknote className="w-3.5 h-3.5 text-emerald-400" />
                <span>Fixed Amount (MAD)</span>
              </button>
            </div>
          </div>

          {/* Value & Min Order */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-zinc-300 mb-1">
                {type === 'percentage' ? 'Percentage (e.g. 15 for 15%)' : 'Amount in MAD'} *
              </label>
              <input
                type="number"
                required
                min={1}
                max={type === 'percentage' ? 90 : 5000}
                value={value}
                onChange={(e) => setValue(e.target.value)}
                placeholder={type === 'percentage' ? '15' : '50'}
                className="w-full bg-zinc-950 border border-zinc-800 rounded-md px-3.5 py-2 text-xs text-white font-mono focus:outline-none focus:border-zinc-600"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-zinc-300 mb-1">
                Min. Order Amount (MAD)
              </label>
              <input
                type="number"
                min={0}
                value={minOrderAmount}
                onChange={(e) => setMinOrderAmount(e.target.value)}
                placeholder="0"
                className="w-full bg-zinc-950 border border-zinc-800 rounded-md px-3.5 py-2 text-xs text-white font-mono focus:outline-none focus:border-zinc-600"
              />
            </div>
          </div>

          {/* Expiry Date */}
          <div>
            <label className="block text-xs font-semibold text-zinc-300 mb-1">
              Expiry Date *
            </label>
            <div className="relative">
              <input
                type="date"
                required
                value={expiryDate}
                onChange={(e) => setExpiryDate(e.target.value)}
                className="w-full bg-zinc-950 border border-zinc-800 rounded-md px-3.5 py-2 text-xs text-white font-mono focus:outline-none focus:border-zinc-600 cursor-pointer"
              />
            </div>
          </div>

          {/* Active Status Toggle */}
          <div className="flex items-center gap-2 pt-2">
            <input
              type="checkbox"
              id="isActiveCode"
              checked={isActive}
              onChange={(e) => setIsActive(e.target.checked)}
              className="w-4 h-4 rounded bg-zinc-950 border-zinc-800 text-white cursor-pointer"
            />
            <label htmlFor="isActiveCode" className="text-xs text-zinc-300 cursor-pointer">
              Enable discount code immediately for customers at checkout
            </label>
          </div>

          {/* Submit */}
          <div className="pt-4 border-t border-zinc-800 flex justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs font-medium text-zinc-400 hover:text-white rounded-md bg-zinc-800 hover:bg-zinc-700 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2 text-xs font-bold uppercase tracking-wider text-zinc-950 bg-white hover:bg-zinc-200 rounded-md transition-colors"
            >
              {codeToEdit ? 'Save Code' : 'Create Code'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
