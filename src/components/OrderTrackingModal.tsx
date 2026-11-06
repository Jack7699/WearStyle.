import React, { useState, useEffect } from 'react';
import { useStore } from '../context/StoreContext';
import { X, Search, Truck, CheckCircle2, Clock, PackageCheck, AlertCircle } from 'lucide-react';
import { Order, OrderStatus } from '../types';

interface OrderTrackingModalProps {
  initialOrderId?: string;
  onClose: () => void;
}

export const OrderTrackingModal: React.FC<OrderTrackingModalProps> = ({
  initialOrderId,
  onClose,
}) => {
  const { orders, isTrackingModalOpen } = useStore();
  const [searchVal, setSearchVal] = useState(initialOrderId || '');
  const [matchedOrder, setMatchedOrder] = useState<Order | null>(null);
  const [searchAttempted, setSearchAttempted] = useState(false);

  useEffect(() => {
    if (initialOrderId) {
      setSearchVal(initialOrderId);
      const found = orders.find(
        (o) => o.id.toLowerCase() === initialOrderId.toLowerCase()
      );
      if (found) {
        setMatchedOrder(found);
        setSearchAttempted(true);
      }
    }
  }, [initialOrderId, orders]);

  if (!isTrackingModalOpen) return null;

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const clean = searchVal.trim().toLowerCase();
    if (!clean) return;

    setSearchAttempted(true);
    const found = orders.find(
      (o) =>
        o.id.toLowerCase() === clean ||
        o.customer.phone.replace(/\s/g, '').includes(clean)
    );
    setMatchedOrder(found || null);
  };

  const getStepState = (currentStatus: OrderStatus, step: 'pending' | 'approved' | 'shipped' | 'delivered') => {
    if (currentStatus === 'cancelled') return 'cancelled';

    const orderHierarchy: Record<OrderStatus, number> = {
      pending_approval: 1,
      approved: 2,
      preparing: 2,
      shipped: 3,
      delivered: 4,
      cancelled: 0,
    };

    const stepHierarchy = {
      pending: 1,
      approved: 2,
      shipped: 3,
      delivered: 4,
    };

    const currentRank = orderHierarchy[currentStatus];
    const targetRank = stepHierarchy[step];

    if (currentRank > targetRank) return 'completed';
    if (currentRank === targetRank) return 'current';
    return 'upcoming';
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-zinc-950/85 backdrop-blur-md overflow-y-auto">
      <div className="relative w-full max-w-2xl bg-zinc-900 border border-zinc-800 rounded-xl overflow-hidden shadow-2xl p-6 sm:p-8">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 text-zinc-400 hover:text-white rounded-md hover:bg-zinc-800 transition-colors"
          aria-label="Close tracking"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-2 text-xs font-mono text-amber-400 uppercase tracking-widest mb-1">
          <Truck className="w-4 h-4" />
          <span>Morocco Logistics Hub</span>
        </div>

        <h2 className="text-2xl font-bold text-white font-display uppercase tracking-tight mb-2">
          Track Your Wearstyle Order
        </h2>

        <p className="text-xs text-zinc-400 mb-6">
          Enter your Wearstyle order code (e.g. <strong className="text-zinc-200">WS-MA-78291</strong>) or your Moroccan phone number to check dispatch status.
        </p>

        {/* Search input form */}
        <form onSubmit={handleSearch} className="flex gap-2 mb-6">
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-zinc-500 absolute left-3 top-3" />
            <input
              type="text"
              value={searchVal}
              onChange={(e) => setSearchVal(e.target.value)}
              placeholder="Order ID (WS-MA-XXXXX) or Phone number..."
              className="w-full bg-zinc-950 border border-zinc-800 rounded-md pl-9 pr-3 py-2.5 text-xs text-white uppercase placeholder-zinc-500 font-mono focus:outline-none focus:border-zinc-600"
            />
          </div>
          <button
            type="submit"
            className="px-5 py-2.5 bg-white text-zinc-950 hover:bg-zinc-200 font-bold text-xs uppercase tracking-wider rounded-md transition-colors"
          >
            Track
          </button>
        </form>

        {/* Search Result */}
        {matchedOrder ? (
          <div className="bg-zinc-950 border border-zinc-800 rounded-lg p-5 space-y-6">
            {/* Order Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-zinc-800 gap-2">
              <div>
                <span className="text-[11px] font-mono text-zinc-500">Order Reference</span>
                <div className="text-lg font-mono font-bold text-white">{matchedOrder.id}</div>
              </div>

              <div className="text-right sm:text-right">
                <span className="text-[11px] font-mono text-zinc-500">Destination</span>
                <div className="text-sm font-semibold text-zinc-200">
                  {matchedOrder.customer.city} · {matchedOrder.customer.district}
                </div>
              </div>
            </div>

            {/* Stepper Flow */}
            {matchedOrder.status === 'cancelled' ? (
              <div className="p-3 bg-rose-950/40 border border-rose-800/80 rounded-md text-xs text-rose-300 flex items-center gap-2">
                <AlertCircle className="w-4 h-4 text-rose-400 shrink-0" />
                <span>This order was cancelled. Please contact Wearstyle support for assistance.</span>
              </div>
            ) : (
              <div className="space-y-4">
                <div className="grid grid-cols-4 gap-2 text-center text-xs">
                  {/* Step 1: Placed */}
                  <div className="flex flex-col items-center">
                    <div className="w-8 h-8 rounded-full bg-emerald-500 text-zinc-950 flex items-center justify-center font-bold text-xs mb-1.5">
                      ✓
                    </div>
                    <span className="font-semibold text-white text-[11px]">Placed</span>
                    <span className="text-[10px] text-zinc-500">Received</span>
                  </div>

                  {/* Step 2: Approved */}
                  <div className="flex flex-col items-center">
                    <div
                      className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-xs mb-1.5 ${
                        getStepState(matchedOrder.status, 'approved') === 'completed'
                          ? 'bg-emerald-500 text-zinc-950'
                          : getStepState(matchedOrder.status, 'approved') === 'current'
                          ? 'bg-amber-400 text-zinc-950 animate-pulse'
                          : 'bg-zinc-800 text-zinc-500'
                      }`}
                    >
                      {getStepState(matchedOrder.status, 'approved') === 'completed' ? '✓' : '2'}
                    </div>
                    <span className="font-semibold text-white text-[11px]">Approved</span>
                    <span className="text-[10px] text-zinc-500">
                      {matchedOrder.status === 'pending_approval' ? 'Pending Review' : 'Confirmed'}
                    </span>
                  </div>

                  {/* Step 3: Shipped */}
                  <div className="flex flex-col items-center">
                    <div
                      className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-xs mb-1.5 ${
                        getStepState(matchedOrder.status, 'shipped') === 'completed'
                          ? 'bg-emerald-500 text-zinc-950'
                          : getStepState(matchedOrder.status, 'shipped') === 'current'
                          ? 'bg-amber-400 text-zinc-950 animate-pulse'
                          : 'bg-zinc-800 text-zinc-500'
                      }`}
                    >
                      {getStepState(matchedOrder.status, 'shipped') === 'completed' ? '✓' : '3'}
                    </div>
                    <span className="font-semibold text-white text-[11px]">Shipped</span>
                    <span className="text-[10px] text-zinc-500">
                      {matchedOrder.trackingNumber ? 'In Transit' : 'Awaiting Courier'}
                    </span>
                  </div>

                  {/* Step 4: Delivered */}
                  <div className="flex flex-col items-center">
                    <div
                      className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-xs mb-1.5 ${
                        matchedOrder.status === 'delivered'
                          ? 'bg-emerald-500 text-zinc-950'
                          : 'bg-zinc-800 text-zinc-500'
                      }`}
                    >
                      {matchedOrder.status === 'delivered' ? '✓' : '4'}
                    </div>
                    <span className="font-semibold text-white text-[11px]">Delivered</span>
                    <span className="text-[10px] text-zinc-500">Doorstep</span>
                  </div>
                </div>

                {/* Tracking Code if Shipped */}
                {matchedOrder.trackingNumber && (
                  <div className="p-3 bg-zinc-900 border border-zinc-800 rounded text-xs flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Truck className="w-4 h-4 text-amber-400" />
                      <span className="text-zinc-300">Carrier Waybill (Cathedis/Amana):</span>
                    </div>
                    <span className="font-mono font-bold text-white">{matchedOrder.trackingNumber}</span>
                  </div>
                )}
              </div>
            )}

            {/* Items summary */}
            <div className="pt-4 border-t border-zinc-800 text-xs">
              <span className="font-semibold text-zinc-300 mb-2 block">Parcel Contents:</span>
              <div className="space-y-1.5">
                {matchedOrder.items.map((item, idx) => (
                  <div key={idx} className="flex justify-between text-zinc-400">
                    <span>
                      {item.name} ({item.size}) × {item.quantity}
                    </span>
                    <span className="font-mono text-zinc-200">{item.price * item.quantity} MAD</span>
                  </div>
                ))}
              </div>
              <div className="flex justify-between pt-2 mt-2 border-t border-zinc-800/80 font-bold text-zinc-200">
                <span>Total to Pay:</span>
                <span className="font-mono text-white text-sm">
                  {matchedOrder.total} MAD ({matchedOrder.paymentMethod === 'cod' ? 'Cash on Delivery' : 'Paid by Card'})
                </span>
              </div>
            </div>
          </div>
        ) : searchAttempted ? (
          <div className="p-8 text-center bg-zinc-950 border border-dashed border-zinc-800 rounded-lg text-xs text-zinc-400">
            <p className="text-zinc-200 text-sm font-semibold mb-1">No order found with &ldquo;{searchVal}&rdquo;</p>
            <p className="text-zinc-500">
              Please double-check your order number (e.g. WS-MA-78291) or the phone number used during checkout.
            </p>
          </div>
        ) : null}
      </div>
    </div>
  );
};
