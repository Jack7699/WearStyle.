import React, { useState } from 'react';
import { useStore } from '../context/StoreContext';
import { MOROCCAN_CITIES, FREE_SHIPPING_THRESHOLD_MAD } from '../data/moroccoCities';
import { PaymentMethod, ShippingAddress } from '../types';
import {
  X,
  CreditCard,
  Banknote,
  ShieldCheck,
  Truck,
  Tag,
  Check,
  AlertCircle,
  Lock,
  ArrowLeft,
  ChevronRight,
} from 'lucide-react';

interface CheckoutModalProps {
  onSuccess: (orderId: string) => void;
}

export const CheckoutModal: React.FC<CheckoutModalProps> = ({ onSuccess }) => {
  const {
    cart,
    subtotal,
    appliedDiscount,
    applyDiscountCode,
    removeDiscountCode,
    calculateDiscountAmount,
    createOrder,
    isCheckoutOpen,
    setIsCheckoutOpen,
  } = useStore();

  // Customer shipping information
  const [formData, setFormData] = useState<ShippingAddress>({
    fullName: '',
    phone: '',
    email: '',
    city: 'Casablanca',
    district: '',
    address: '',
    postalCode: '',
    notes: '',
  });

  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('cod');

  // Simulated Card Details
  const [cardNumber, setCardNumber] = useState('');
  const [cardHolder, setCardHolder] = useState('');
  const [cardExpiry, setCardExpiry] = useState('');
  const [cardCvv, setCardCvv] = useState('');

  // Discount code field inside checkout
  const [checkoutCodeInput, setCheckoutCodeInput] = useState('');
  const [discountStatus, setDiscountStatus] = useState<{
    type: 'success' | 'error' | null;
    message: string;
  }>({ type: null, message: '' });

  // Processing state & errors
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [validationErrors, setValidationErrors] = useState<Record<string, string>>({});

  if (!isCheckoutOpen) return null;

  // Selected city object
  const selectedCityObj = MOROCCAN_CITIES.find((c) => c.name === formData.city) || MOROCCAN_CITIES[0];

  // Shipping calculation
  const isFreeShipping = subtotal >= FREE_SHIPPING_THRESHOLD_MAD;
  const shippingFee = isFreeShipping ? 0 : selectedCityObj.shippingRate;

  // Discount calculation
  const discountAmount = calculateDiscountAmount(subtotal, appliedDiscount);
  const grandTotal = Math.max(0, subtotal - discountAmount + shippingFee);

  const handleApplyDiscount = (e: React.FormEvent) => {
    e.preventDefault();
    if (!checkoutCodeInput.trim()) return;

    const res = applyDiscountCode(checkoutCodeInput, subtotal);
    if (res.success) {
      setDiscountStatus({ type: 'success', message: res.message });
      setCheckoutCodeInput('');
    } else {
      setDiscountStatus({ type: 'error', message: res.message });
    }
  };

  const validateForm = () => {
    const errors: Record<string, string> = {};

    if (!formData.fullName.trim() || formData.fullName.trim().length < 3) {
      errors.fullName = 'Please enter your full name';
    }

    // Moroccan phone format check: must be at least 10 digits (e.g. 06..., 07..., 05..., or +212...)
    const phoneClean = formData.phone.replace(/[\s-]/g, '');
    if (!phoneClean) {
      errors.phone = 'Moroccan phone number is required';
    } else if (!/^((\+212|0)[5-7]\d{8})$/.test(phoneClean) && phoneClean.length < 9) {
      errors.phone = 'Enter a valid Moroccan phone (e.g. 0661234567)';
    }

    if (!formData.district.trim()) {
      errors.district = 'Neighborhood / Quartier is required for delivery';
    }

    if (!formData.address.trim()) {
      errors.address = 'Street address and building/apartment number are required';
    }

    if (paymentMethod === 'card') {
      const cardClean = cardNumber.replace(/\s/g, '');
      if (cardClean.length < 15) {
        errors.cardNumber = 'Enter a valid 16-digit card number';
      }
      if (!cardHolder.trim()) {
        errors.cardHolder = 'Cardholder name is required';
      }
      if (!cardExpiry.includes('/') || cardExpiry.length < 5) {
        errors.cardExpiry = 'MM/YY required';
      }
      if (cardCvv.length < 3) {
        errors.cardCvv = 'CVV required';
      }
    }

    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmitOrder = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;

    setIsSubmitting(true);

    // Simulate payment / verification delay
    setTimeout(() => {
      const order = createOrder({
        customer: formData,
        paymentMethod,
        shippingFee,
        cardLast4: paymentMethod === 'card' ? cardNumber.slice(-4) || '4242' : undefined,
      });

      setIsSubmitting(false);
      setIsCheckoutOpen(false);
      onSuccess(order.id);
    }, 1200);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-zinc-950/85 backdrop-blur-md overflow-y-auto">
      <div className="relative w-full max-w-4xl bg-zinc-900 border border-zinc-800 rounded-xl overflow-hidden shadow-2xl my-6">
        {/* Header */}
        <div className="p-4 sm:p-6 border-b border-zinc-800 flex items-center justify-between bg-zinc-950">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setIsCheckoutOpen(false)}
              className="p-1.5 text-zinc-400 hover:text-white rounded-md hover:bg-zinc-800 transition-colors"
            >
              <ArrowLeft className="w-5 h-5" />
            </button>
            <div>
              <h2 className="text-lg sm:text-xl font-bold text-white font-display uppercase tracking-tight">
                Secure Moroccan Checkout
              </h2>
              <div className="flex items-center gap-2 text-xs text-zinc-400">
                <span className="flex items-center gap-1 text-emerald-400">
                  <Lock className="w-3 h-3" /> 256-Bit SSL Encrypted
                </span>
                <span aria-hidden="true" className="text-zinc-600">·</span>
                <span>Delivery across all 12 regions of Morocco</span>
              </div>
            </div>
          </div>
          <button
            onClick={() => setIsCheckoutOpen(false)}
            className="p-2 text-zinc-400 hover:text-white rounded-md hover:bg-zinc-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Form */}
        <form onSubmit={handleSubmitOrder}>
          <div className="grid grid-cols-1 lg:grid-cols-12 max-h-[80vh] overflow-y-auto">
            {/* Left 7 Columns: Checkout Details Form */}
            <div className="lg:col-span-7 p-6 space-y-6">
              {/* Section 1: Customer & Shipping Address */}
              <div>
                <h3 className="text-sm font-bold text-zinc-200 uppercase tracking-wider mb-4 flex items-center gap-2">
                  <Truck className="w-4 h-4 text-amber-400" />
                  <span>1. Moroccan Shipping Destination</span>
                </h3>

                <div className="space-y-4">
                  {/* Full Name */}
                  <div>
                    <label className="block text-xs font-semibold text-zinc-300 mb-1">
                      Full Name (Nom & Prénom) *
                    </label>
                    <input
                      type="text"
                      value={formData.fullName}
                      onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                      placeholder="e.g. Youssef Bennani"
                      className={`w-full bg-zinc-950 border rounded-md px-3.5 py-2.5 text-xs text-white placeholder-zinc-500 focus:outline-none transition-colors ${
                        validationErrors.fullName ? 'border-rose-500' : 'border-zinc-800 focus:border-zinc-600'
                      }`}
                    />
                    {validationErrors.fullName && (
                      <p className="text-[11px] text-rose-400 mt-1">{validationErrors.fullName}</p>
                    )}
                  </div>

                  {/* Phone & Email */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-semibold text-zinc-300 mb-1">
                        Phone Number (Téléphone) *
                      </label>
                      <input
                        type="tel"
                        value={formData.phone}
                        onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                        placeholder="06 XX XX XX XX / 07 XX..."
                        className={`w-full bg-zinc-950 border rounded-md px-3.5 py-2.5 text-xs text-white placeholder-zinc-500 font-mono focus:outline-none transition-colors ${
                          validationErrors.phone ? 'border-rose-500' : 'border-zinc-800 focus:border-zinc-600'
                        }`}
                      />
                      <p className="text-[10px] text-zinc-500 mt-0.5">Required for delivery courier confirmation</p>
                      {validationErrors.phone && (
                        <p className="text-[11px] text-rose-400 mt-0.5">{validationErrors.phone}</p>
                      )}
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-zinc-300 mb-1">
                        Email Address (Optional)
                      </label>
                      <input
                        type="email"
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        placeholder="you@email.com"
                        className="w-full bg-zinc-950 border border-zinc-800 focus:border-zinc-600 rounded-md px-3.5 py-2.5 text-xs text-white placeholder-zinc-500 focus:outline-none transition-colors"
                      />
                    </div>
                  </div>

                  {/* City Selector */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-semibold text-zinc-300 mb-1">
                        City (Ville au Maroc) *
                      </label>
                      <select
                        value={formData.city}
                        onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                        className="w-full bg-zinc-950 border border-zinc-800 focus:border-zinc-600 rounded-md px-3.5 py-2.5 text-xs text-white focus:outline-none transition-colors cursor-pointer"
                      >
                        {MOROCCAN_CITIES.map((c) => (
                          <option key={c.name} value={c.name} className="bg-zinc-900">
                            {c.name} ({c.deliveryTime})
                          </option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-zinc-300 mb-1">
                        Neighborhood / Quartier *
                      </label>
                      <input
                        type="text"
                        value={formData.district}
                        onChange={(e) => setFormData({ ...formData, district: e.target.value })}
                        placeholder="e.g. Maarif, Agdal, Gueliz..."
                        className={`w-full bg-zinc-950 border rounded-md px-3.5 py-2.5 text-xs text-white placeholder-zinc-500 focus:outline-none transition-colors ${
                          validationErrors.district ? 'border-rose-500' : 'border-zinc-800 focus:border-zinc-600'
                        }`}
                      />
                      {validationErrors.district && (
                        <p className="text-[11px] text-rose-400 mt-1">{validationErrors.district}</p>
                      )}
                    </div>
                  </div>

                  {/* Street Address */}
                  <div>
                    <label className="block text-xs font-semibold text-zinc-300 mb-1">
                      Street Address & Building / Apt *
                    </label>
                    <input
                      type="text"
                      value={formData.address}
                      onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                      placeholder="e.g. Rue 14, Immeuble B, Appartement 4"
                      className={`w-full bg-zinc-950 border rounded-md px-3.5 py-2.5 text-xs text-white placeholder-zinc-500 focus:outline-none transition-colors ${
                        validationErrors.address ? 'border-rose-500' : 'border-zinc-800 focus:border-zinc-600'
                      }`}
                    />
                    {validationErrors.address && (
                      <p className="text-[11px] text-rose-400 mt-1">{validationErrors.address}</p>
                    )}
                  </div>

                  {/* Optional Delivery notes */}
                  <div>
                    <label className="block text-xs font-semibold text-zinc-300 mb-1">
                      Courier Instructions (Notes de livraison)
                    </label>
                    <input
                      type="text"
                      value={formData.notes}
                      onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                      placeholder="e.g. Call before ringing or deliver after 2pm"
                      className="w-full bg-zinc-950 border border-zinc-800 focus:border-zinc-600 rounded-md px-3.5 py-2 text-xs text-white placeholder-zinc-500 focus:outline-none transition-colors"
                    />
                  </div>
                </div>
              </div>

              {/* Section 2: Payment Method */}
              <div className="pt-4 border-t border-zinc-800">
                <h3 className="text-sm font-bold text-zinc-200 uppercase tracking-wider mb-4 flex items-center gap-2">
                  <CreditCard className="w-4 h-4 text-amber-400" />
                  <span>2. Moroccan Payment Method</span>
                </h3>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-4">
                  {/* Cash on Delivery option */}
                  <div
                    onClick={() => setPaymentMethod('cod')}
                    className={`p-4 rounded-lg border cursor-pointer transition-all ${
                      paymentMethod === 'cod'
                        ? 'border-white bg-zinc-950 text-white shadow-md'
                        : 'border-zinc-800 bg-zinc-950/60 text-zinc-400 hover:border-zinc-700'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <Banknote className="w-5 h-5 text-amber-400" />
                        <span className="text-xs font-bold text-zinc-100">
                          Cash on Delivery (COD)
                        </span>
                      </div>
                      <span className="text-[10px] uppercase font-mono px-1.5 py-0.5 rounded bg-zinc-800 text-zinc-300">
                        Popular
                      </span>
                    </div>
                    <p className="text-[11px] text-zinc-400 leading-relaxed">
                      Paiement à la livraison. Pay cash in Dirhams directly to the delivery courier upon receiving your parcel.
                    </p>
                  </div>

                  {/* Card Payment option */}
                  <div
                    onClick={() => setPaymentMethod('card')}
                    className={`p-4 rounded-lg border cursor-pointer transition-all ${
                      paymentMethod === 'card'
                        ? 'border-white bg-zinc-950 text-white shadow-md'
                        : 'border-zinc-800 bg-zinc-950/60 text-zinc-400 hover:border-zinc-700'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <CreditCard className="w-5 h-5 text-emerald-400" />
                        <span className="text-xs font-bold text-zinc-100">
                          Credit / Debit Card
                        </span>
                      </div>
                      <span className="text-[10px] uppercase font-mono px-1.5 py-0.5 rounded bg-zinc-800 text-zinc-300">
                        CMI / Visa
                      </span>
                    </div>
                    <p className="text-[11px] text-zinc-400 leading-relaxed">
                      Instant card settlement via Moroccan CMI / 3D-Secure. Visa, Mastercard, and CIH/Attijari cards accepted.
                    </p>
                  </div>
                </div>

                {/* Card input fields if Card selected */}
                {paymentMethod === 'card' && (
                  <div className="p-4 bg-zinc-950 border border-zinc-800 rounded-lg space-y-3">
                    <div>
                      <label className="block text-xs font-semibold text-zinc-300 mb-1">
                        Card Number *
                      </label>
                      <input
                        type="text"
                        maxLength={19}
                        value={cardNumber}
                        onChange={(e) => {
                          const val = e.target.value.replace(/\D/g, '').replace(/(.{4})/g, '$1 ').trim();
                          setCardNumber(val);
                        }}
                        placeholder="4242 4242 4242 4242"
                        className="w-full bg-zinc-900 border border-zinc-800 rounded-md px-3.5 py-2 text-xs text-white font-mono placeholder-zinc-600 focus:outline-none focus:border-zinc-600"
                      />
                      {validationErrors.cardNumber && (
                        <p className="text-[11px] text-rose-400 mt-1">{validationErrors.cardNumber}</p>
                      )}
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="block text-xs font-semibold text-zinc-300 mb-1">
                          Cardholder Name *
                        </label>
                        <input
                          type="text"
                          value={cardHolder}
                          onChange={(e) => setCardHolder(e.target.value)}
                          placeholder="e.g. YOUSSEF BENNANI"
                          className="w-full bg-zinc-900 border border-zinc-800 rounded-md px-3.5 py-2 text-xs text-white uppercase placeholder-zinc-600 focus:outline-none focus:border-zinc-600"
                        />
                        {validationErrors.cardHolder && (
                          <p className="text-[11px] text-rose-400 mt-1">{validationErrors.cardHolder}</p>
                        )}
                      </div>

                      <div className="grid grid-cols-2 gap-2">
                        <div>
                          <label className="block text-xs font-semibold text-zinc-300 mb-1">
                            Expiry *
                          </label>
                          <input
                            type="text"
                            maxLength={5}
                            value={cardExpiry}
                            onChange={(e) => {
                              let val = e.target.value.replace(/\D/g, '');
                              if (val.length >= 2) {
                                val = `${val.slice(0, 2)}/${val.slice(2, 4)}`;
                              }
                              setCardExpiry(val);
                            }}
                            placeholder="MM/YY"
                            className="w-full bg-zinc-900 border border-zinc-800 rounded-md px-2.5 py-2 text-xs text-white font-mono text-center placeholder-zinc-600 focus:outline-none focus:border-zinc-600"
                          />
                        </div>
                        <div>
                          <label className="block text-xs font-semibold text-zinc-300 mb-1">
                            CVV *
                          </label>
                          <input
                            type="password"
                            maxLength={4}
                            value={cardCvv}
                            onChange={(e) => setCardCvv(e.target.value.replace(/\D/g, ''))}
                            placeholder="•••"
                            className="w-full bg-zinc-900 border border-zinc-800 rounded-md px-2.5 py-2 text-xs text-white font-mono text-center placeholder-zinc-600 focus:outline-none focus:border-zinc-600"
                          />
                        </div>
                      </div>
                    </div>
                    {validationErrors.cardExpiry && (
                      <p className="text-[11px] text-rose-400">{validationErrors.cardExpiry}</p>
                    )}
                  </div>
                )}
              </div>
            </div>

            {/* Right 5 Columns: Order Summary & Discount Code */}
            <div className="lg:col-span-5 p-6 bg-zinc-950/70 border-t lg:border-t-0 lg:border-l border-zinc-800 flex flex-col justify-between">
              <div>
                <h3 className="text-sm font-bold text-zinc-200 uppercase tracking-wider mb-4">
                  Order Summary ({cart.length} items)
                </h3>

                {/* Items preview */}
                <div className="space-y-3 max-h-52 overflow-y-auto pr-1 mb-6">
                  {cart.map((item) => (
                    <div
                      key={`${item.productId}-${item.size}`}
                      className="flex items-center gap-3 text-xs"
                    >
                      <img
                        src={item.image}
                        alt={item.name}
                        referrerPolicy="no-referrer"
                        className="w-12 h-12 object-cover rounded bg-zinc-900 shrink-0"
                      />
                      <div className="flex-1 min-w-0">
                        <div className="font-medium text-zinc-200 truncate">{item.name}</div>
                        <div className="text-zinc-500 text-[11px] font-mono">
                          Size {item.size} × {item.quantity}
                        </div>
                      </div>
                      <div className="font-mono text-zinc-100 tabular-nums">
                        {item.price * item.quantity} MAD
                      </div>
                    </div>
                  ))}
                </div>

                {/* Discount Code Input Section */}
                <div className="mb-6 pt-4 border-t border-zinc-800">
                  <div className="text-xs font-semibold text-zinc-300 mb-2 flex items-center gap-1.5">
                    <Tag className="w-3.5 h-3.5 text-amber-400" />
                    <span>Have a Promo Code?</span>
                  </div>

                  {appliedDiscount ? (
                    <div className="flex items-center justify-between p-2.5 bg-emerald-950/50 border border-emerald-800 rounded-md text-xs">
                      <div className="text-emerald-400">
                        <span className="font-bold">{appliedDiscount.code}</span> applied:{' '}
                        {appliedDiscount.type === 'percentage'
                          ? `${appliedDiscount.value}% off`
                          : `${appliedDiscount.value} MAD off`}
                      </div>
                      <button
                        type="button"
                        onClick={removeDiscountCode}
                        className="text-zinc-400 hover:text-white text-[11px] underline"
                      >
                        Remove
                      </button>
                    </div>
                  ) : (
                    <div className="flex gap-2">
                      <input
                        type="text"
                        value={checkoutCodeInput}
                        onChange={(e) => setCheckoutCodeInput(e.target.value)}
                        placeholder="Discount code (e.g. WEAR10)"
                        className="flex-1 bg-zinc-900 border border-zinc-800 rounded-md px-3 py-2 text-xs text-white placeholder-zinc-500 uppercase font-mono focus:outline-none focus:border-zinc-600"
                      />
                      <button
                        type="button"
                        onClick={handleApplyDiscount}
                        className="px-3.5 py-2 bg-zinc-800 hover:bg-zinc-700 text-zinc-200 text-xs font-semibold rounded-md transition-colors"
                      >
                        Apply
                      </button>
                    </div>
                  )}

                  {discountStatus.message && (
                    <div
                      className={`mt-1.5 text-[11px] flex items-center gap-1.5 ${
                        discountStatus.type === 'success' ? 'text-emerald-400' : 'text-rose-400'
                      }`}
                    >
                      {discountStatus.type === 'success' ? (
                        <Check className="w-3 h-3" />
                      ) : (
                        <AlertCircle className="w-3 h-3" />
                      )}
                      <span>{discountStatus.message}</span>
                    </div>
                  )}
                </div>

                {/* Calculations */}
                <div className="space-y-2 text-xs text-zinc-400 pt-4 border-t border-zinc-800">
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
                    <span>
                      Delivery ({selectedCityObj.name} · {selectedCityObj.deliveryTime}):
                    </span>
                    <span className="font-mono text-zinc-200 tabular-nums">
                      {shippingFee === 0 ? (
                        <span className="text-emerald-400 font-semibold">FREE</span>
                      ) : (
                        `${shippingFee} MAD`
                      )}
                    </span>
                  </div>

                  <div className="flex justify-between text-base font-bold text-white pt-3 border-t border-zinc-800">
                    <span>Grand Total:</span>
                    <span className="font-mono tabular-nums text-lg text-white">
                      {grandTotal} MAD
                    </span>
                  </div>
                </div>
              </div>

              {/* Submit CTA */}
              <div className="pt-6 mt-6 border-t border-zinc-800">
                <button
                  type="submit"
                  disabled={isSubmitting || cart.length === 0}
                  className="w-full py-3.5 px-4 bg-white hover:bg-zinc-200 text-zinc-950 font-bold text-xs uppercase tracking-wider rounded-md transition-all flex items-center justify-center gap-2 cursor-pointer shadow-xl active:scale-[0.99] disabled:opacity-50"
                >
                  {isSubmitting ? (
                    <span>Confirming Order...</span>
                  ) : paymentMethod === 'cod' ? (
                    <>
                      <span>Place Order · Pay {grandTotal} MAD on Delivery</span>
                      <ChevronRight className="w-4 h-4" />
                    </>
                  ) : (
                    <>
                      <span>Pay {grandTotal} MAD via Card</span>
                      <Lock className="w-3.5 h-3.5" />
                    </>
                  )}
                </button>

                <p className="text-[11px] text-zinc-500 text-center mt-3">
                  By clicking Place Order, your order will be submitted to the Wearstyle dispatch center in Casablanca.
                </p>
              </div>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};
