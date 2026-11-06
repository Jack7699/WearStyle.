import React from 'react';
import { useStore } from '../context/StoreContext';
import { CheckCircle2, Truck, Package, MessageCircle, ArrowRight } from 'lucide-react';

interface OrderSuccessModalProps {
  onClose: () => void;
  onTrackOrder: (orderId: string) => void;
}

export const OrderSuccessModal: React.FC<OrderSuccessModalProps> = ({
  onClose,
  onTrackOrder,
}) => {
  const { lastPlacedOrder, setLastPlacedOrder } = useStore();

  if (!lastPlacedOrder) return null;

  const handleClose = () => {
    setLastPlacedOrder(null);
    onClose();
  };

  const handleTrack = () => {
    const id = lastPlacedOrder.id;
    setLastPlacedOrder(null);
    onTrackOrder(id);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-zinc-950/85 backdrop-blur-md">
      <div className="w-full max-w-lg bg-zinc-900 border border-zinc-800 rounded-xl p-6 sm:p-8 text-center shadow-2xl relative">
        <div className="w-16 h-16 bg-emerald-950/80 border border-emerald-700/60 text-emerald-400 rounded-full flex items-center justify-center mx-auto mb-4">
          <CheckCircle2 className="w-9 h-9" />
        </div>

        <div className="text-xs font-mono uppercase tracking-widest text-emerald-400 mb-1">
          Commande Reçue · Shoukran!
        </div>

        <h2 className="text-2xl sm:text-3xl font-black text-white font-display mb-2">
          Order Successfully Placed
        </h2>

        <p className="text-xs sm:text-sm text-zinc-400 max-w-md mx-auto mb-6">
          Thank you for choosing Wearstyle. Your order has been recorded and is currently waiting for admin review before dispatch.
        </p>

        {/* Order Details Card */}
        <div className="bg-zinc-950 border border-zinc-800 rounded-lg p-4 text-left text-xs space-y-2.5 mb-6">
          <div className="flex justify-between items-center pb-2 border-b border-zinc-800/80">
            <span className="text-zinc-400">Order Reference:</span>
            <span className="font-mono font-bold text-white text-sm">
              {lastPlacedOrder.id}
            </span>
          </div>

          <div className="flex justify-between">
            <span className="text-zinc-400">Recipient:</span>
            <span className="text-zinc-200 font-medium">{lastPlacedOrder.customer.fullName}</span>
          </div>

          <div className="flex justify-between">
            <span className="text-zinc-400">Destination:</span>
            <span className="text-zinc-200 font-medium">
              {lastPlacedOrder.customer.city} ({lastPlacedOrder.customer.district})
            </span>
          </div>

          <div className="flex justify-between">
            <span className="text-zinc-400">Phone for Courier Call:</span>
            <span className="text-zinc-200 font-mono">{lastPlacedOrder.customer.phone}</span>
          </div>

          <div className="flex justify-between">
            <span className="text-zinc-400">Payment:</span>
            <span className="text-zinc-200 font-medium">
              {lastPlacedOrder.paymentMethod === 'cod'
                ? 'Cash on Delivery (Paiement à la livraison)'
                : 'Credit Card (Paid)'}
            </span>
          </div>

          <div className="flex justify-between items-center pt-2 border-t border-zinc-800/80 font-bold text-sm">
            <span className="text-zinc-300">Total Amount:</span>
            <span className="font-mono text-emerald-400">{lastPlacedOrder.total} MAD</span>
          </div>
        </div>

        {/* Moroccan Courier Notice */}
        <div className="p-3 bg-zinc-950/60 border border-zinc-800/60 rounded-md text-left text-[11px] text-zinc-400 flex items-start gap-2.5 mb-6">
          <Truck className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
          <div>
            <strong className="text-zinc-200">What happens next:</strong> Our dispatch team in Casablanca will call your phone (<span className="text-zinc-300 font-mono">{lastPlacedOrder.customer.phone}</span>) to verify your delivery address before handing the parcel to our national courier.
          </div>
        </div>

        {/* Buttons */}
        <div className="space-y-2">
          <button
            onClick={handleTrack}
            className="w-full py-3 bg-white hover:bg-zinc-200 text-zinc-950 font-bold text-xs uppercase tracking-wider rounded-md transition-colors flex items-center justify-center gap-2 cursor-pointer shadow-md"
          >
            <span>Track This Order Live</span>
            <ArrowRight className="w-4 h-4" />
          </button>

          <button
            onClick={handleClose}
            className="w-full py-2.5 bg-zinc-800 hover:bg-zinc-700 text-zinc-300 font-medium text-xs rounded-md transition-colors"
          >
            Back to Wearstyle Catalog
          </button>
        </div>
      </div>
    </div>
  );
};
