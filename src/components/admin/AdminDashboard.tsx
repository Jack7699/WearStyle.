import React, { useState } from 'react';
import { useStore, RANDOM_ADMIN_PASSCODE } from '../../context/StoreContext';
import { Product, Order, OrderStatus, ProductSize, DiscountCode } from '../../types';
import { ProductFormModal } from './ProductFormModal';
import { DiscountCodeModal } from './DiscountCodeModal';
import {
  ShieldCheck,
  Package,
  ShoppingBag,
  Tag,
  BarChart3,
  Plus,
  CheckCircle,
  XCircle,
  Truck,
  Phone,
  MessageCircle,
  Edit2,
  Trash2,
  Lock,
  LogOut,
  AlertTriangle,
  Calendar,
  Check,
  ExternalLink,
  Eye,
  EyeOff,
  RefreshCw,
  Copy,
} from 'lucide-react';

export const AdminDashboard: React.FC = () => {
  const {
    products,
    orders,
    discountCodes,
    isAdminLoggedIn,
    loginAdmin,
    logoutAdmin,
    addProduct,
    updateProduct,
    deleteProduct,
    updateStock,
    updateOrderStatus,
    approveOrder,
    cancelOrder,
    clearAllOrders,
    seedTestOrder,
    addDiscountCode,
    updateDiscountCode,
    deleteDiscountCode,
    toggleDiscountCodeStatus,
    setActiveView,
  } = useStore();

  const [activeTab, setActiveTab] = useState<'orders' | 'inventory' | 'discounts' | 'analytics'>('orders');
  const [passcode, setPasscode] = useState('');
  const [showPasscode, setShowPasscode] = useState(false);
  const [loginError, setLoginError] = useState(false);
  const [copiedPasscode, setCopiedPasscode] = useState(false);

  // Order filters
  const [orderStatusFilter, setOrderStatusFilter] = useState<string>('all');
  const [orderSearchQuery, setOrderSearchQuery] = useState('');

  // Modals
  const [isProductModalOpen, setIsProductModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);

  const [isDiscountModalOpen, setIsDiscountModalOpen] = useState(false);
  const [editingDiscount, setEditingDiscount] = useState<DiscountCode | null>(null);

  // Quick Inline tracking assignment state
  const [trackingInputs, setTrackingInputs] = useState<Record<string, string>>({});

  // Login handler
  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    const success = loginAdmin(passcode);
    if (!success) {
      setLoginError(true);
    } else {
      setLoginError(false);
      setPasscode('');
    }
  };

  const handleCopyPasscode = () => {
    navigator.clipboard.writeText(RANDOM_ADMIN_PASSCODE);
    setCopiedPasscode(true);
    setTimeout(() => setCopiedPasscode(false), 2000);
  };

  // If not authenticated, render secure login gate
  if (!isAdminLoggedIn) {
    return (
      <div className="min-h-[75vh] flex items-center justify-center p-4">
        <div className="w-full max-w-md bg-zinc-900 border border-zinc-800 rounded-xl p-8 shadow-2xl">
          <div className="w-12 h-12 bg-zinc-950 border border-zinc-800 text-white rounded-lg flex items-center justify-center mx-auto mb-4">
            <Lock className="w-6 h-6 text-amber-400" />
          </div>

          <h2 className="text-xl font-bold text-white text-center font-display uppercase tracking-tight mb-1">
            Wearstyle Admin Portal
          </h2>
          <p className="text-xs text-zinc-400 text-center mb-6">
            Restricted access for store managers and order approval agents.
          </p>

          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-zinc-300 mb-1">
                Random Administrator Passcode
              </label>
              <div className="relative">
                <input
                  type={showPasscode ? 'text' : 'password'}
                  value={passcode}
                  onChange={(e) => setPasscode(e.target.value)}
                  placeholder="Enter random passcode..."
                  className="w-full bg-zinc-950 border border-zinc-800 rounded-md pl-3.5 pr-10 py-2.5 text-xs text-white placeholder-zinc-600 focus:outline-none focus:border-zinc-500 font-mono"
                />
                <button
                  type="button"
                  onClick={() => setShowPasscode(!showPasscode)}
                  className="absolute right-3 top-2.5 text-zinc-500 hover:text-zinc-300"
                >
                  {showPasscode ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
              {loginError && (
                <p className="text-[11px] text-rose-400 mt-1">Invalid administrator passcode</p>
              )}
            </div>

            <button
              type="submit"
              className="w-full py-2.5 bg-white hover:bg-zinc-200 text-zinc-950 font-bold text-xs uppercase tracking-wider rounded-md transition-colors"
            >
              Sign In to Admin
            </button>

            {/* Random Passcode Badge & Auto-fill */}
            <div className="pt-4 border-t border-zinc-800/80 space-y-2">
              <div className="p-3 bg-zinc-950 border border-zinc-800 rounded-lg text-xs space-y-2">
                <div className="flex items-center justify-between text-[11px] text-zinc-400">
                  <span>Current Random Key:</span>
                  <button
                    type="button"
                    onClick={handleCopyPasscode}
                    className="text-amber-400 hover:underline flex items-center gap-1 font-mono text-[10px]"
                  >
                    {copiedPasscode ? <Check className="w-3 h-3" /> : <Copy className="w-3 h-3" />}
                    <span>{copiedPasscode ? 'Copied' : 'Copy'}</span>
                  </button>
                </div>
                <div className="font-mono text-sm font-bold text-amber-400 select-all tracking-wider text-center py-1 bg-zinc-900 rounded border border-zinc-800">
                  {RANDOM_ADMIN_PASSCODE}
                </div>
                <button
                  type="button"
                  onClick={() => {
                    setPasscode(RANDOM_ADMIN_PASSCODE);
                    loginAdmin(RANDOM_ADMIN_PASSCODE);
                  }}
                  className="w-full py-1.5 text-[11px] font-semibold text-zinc-300 bg-zinc-800 hover:bg-zinc-700 rounded transition-colors text-center"
                >
                  1-Click Auto-Fill & Unlock
                </button>
              </div>
            </div>
          </form>
        </div>
      </div>
    );
  }

  // Analytics KPIs
  const totalRevenue = orders
    .filter((o) => o.status !== 'cancelled')
    .reduce((sum, o) => sum + o.total, 0);

  const pendingOrders = orders.filter((o) => o.status === 'pending_approval');
  const activeDiscountsCount = discountCodes.filter((d) => d.isActive).length;

  // Filtered orders
  const filteredOrders = orders.filter((o) => {
    if (orderStatusFilter !== 'all' && o.status !== orderStatusFilter) return false;
    if (orderSearchQuery.trim()) {
      const q = orderSearchQuery.toLowerCase();
      const matchId = o.id.toLowerCase().includes(q);
      const matchName = o.customer.fullName.toLowerCase().includes(q);
      const matchPhone = o.customer.phone.includes(q);
      const matchCity = o.customer.city.toLowerCase().includes(q);
      if (!matchId && !matchName && !matchPhone && !matchCity) return false;
    }
    return true;
  });

  return (
    <div className="min-h-screen bg-zinc-950 pb-20">
      {/* Admin Top Navigation Strip */}
      <div className="bg-zinc-900 border-b border-zinc-800 px-4 sm:px-6 lg:px-8 py-3">
        <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="p-1.5 bg-amber-400/10 border border-amber-400/30 rounded text-amber-400">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-base font-bold text-white font-display uppercase tracking-tight">
                  Wearstyle Backoffice
                </h1>
                <span className="text-[10px] font-mono bg-emerald-950 text-emerald-400 border border-emerald-800 px-1.5 py-0.2 rounded">
                  Admin Active
                </span>
              </div>
              <p className="text-[11px] text-zinc-400">Morocco Storefront & Warehouse Management</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => setActiveView('shop')}
              className="px-3 py-1.5 bg-zinc-800 hover:bg-zinc-700 text-zinc-300 hover:text-white text-xs font-semibold rounded-md transition-colors flex items-center gap-1.5"
            >
              <span>Back to Storefront</span>
            </button>
            <button
              onClick={logoutAdmin}
              className="p-1.5 text-zinc-400 hover:text-rose-400 transition-colors"
              title="Logout"
              aria-label="Logout"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8">
        {/* KPI Summary Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <div className="bg-zinc-900/80 border border-zinc-800 p-4 rounded-lg">
            <span className="text-xs text-zinc-400 block mb-1">Total Revenue</span>
            <div className="text-2xl font-bold font-mono text-white tabular-nums">
              {Math.round(totalRevenue)} MAD
            </div>
            <span className="text-[11px] text-zinc-500 mt-1 block">
              {orders.length} lifetime orders
            </span>
          </div>

          <div className="bg-zinc-900/80 border border-zinc-800 p-4 rounded-lg">
            <span className="text-xs text-zinc-400 block mb-1">Awaiting Approval</span>
            <div className="text-2xl font-bold font-mono text-amber-400 tabular-nums">
              {pendingOrders.length}
            </div>
            <span className="text-[11px] text-zinc-500 mt-1 block">
              Needs confirmation call
            </span>
          </div>

          <div className="bg-zinc-900/80 border border-zinc-800 p-4 rounded-lg">
            <span className="text-xs text-zinc-400 block mb-1">Active Catalog</span>
            <div className="text-2xl font-bold font-mono text-white tabular-nums">
              {products.length}
            </div>
            <span className="text-[11px] text-zinc-500 mt-1 block">
              T-shirts & Hoodies in stock
            </span>
          </div>

          <div className="bg-zinc-900/80 border border-zinc-800 p-4 rounded-lg">
            <span className="text-xs text-zinc-400 block mb-1">Active Discount Codes</span>
            <div className="text-2xl font-bold font-mono text-emerald-400 tabular-nums">
              {activeDiscountsCount}
            </div>
            <span className="text-[11px] text-zinc-500 mt-1 block">
              {discountCodes.reduce((s, d) => s + d.usageCount, 0)} total coupon redemptions
            </span>
          </div>
        </div>

        {/* Tab Controls */}
        <div className="flex items-center gap-2 border-b border-zinc-800 mb-6 overflow-x-auto pb-1">
          <button
            onClick={() => setActiveTab('orders')}
            className={`px-4 py-2 text-xs font-semibold rounded-t-md transition-colors flex items-center gap-2 whitespace-nowrap cursor-pointer ${
              activeTab === 'orders'
                ? 'bg-zinc-900 text-white border-t border-x border-zinc-800'
                : 'text-zinc-400 hover:text-zinc-200'
            }`}
          >
            <ShoppingBag className="w-4 h-4 text-amber-400" />
            <span>Orders & Approvals</span>
            {pendingOrders.length > 0 && (
              <span className="px-1.5 py-0.2 text-[10px] bg-amber-400 text-zinc-950 font-bold rounded-full">
                {pendingOrders.length}
              </span>
            )}
          </button>

          <button
            onClick={() => setActiveTab('inventory')}
            className={`px-4 py-2 text-xs font-semibold rounded-t-md transition-colors flex items-center gap-2 whitespace-nowrap cursor-pointer ${
              activeTab === 'inventory'
                ? 'bg-zinc-900 text-white border-t border-x border-zinc-800'
                : 'text-zinc-400 hover:text-zinc-200'
            }`}
          >
            <Package className="w-4 h-4 text-amber-400" />
            <span>Inventory & Products</span>
          </button>

          {/* New Feature Tab: Discount Codes Management */}
          <button
            onClick={() => setActiveTab('discounts')}
            className={`px-4 py-2 text-xs font-semibold rounded-t-md transition-colors flex items-center gap-2 whitespace-nowrap cursor-pointer ${
              activeTab === 'discounts'
                ? 'bg-zinc-900 text-white border-t border-x border-zinc-800'
                : 'text-zinc-400 hover:text-zinc-200'
            }`}
          >
            <Tag className="w-4 h-4 text-emerald-400" />
            <span>Discount Codes</span>
            <span className="px-1.5 py-0.2 text-[10px] bg-zinc-800 text-zinc-300 font-mono rounded">
              {discountCodes.length}
            </span>
          </button>

          <button
            onClick={() => setActiveTab('analytics')}
            className={`px-4 py-2 text-xs font-semibold rounded-t-md transition-colors flex items-center gap-2 whitespace-nowrap cursor-pointer ${
              activeTab === 'analytics'
                ? 'bg-zinc-900 text-white border-t border-x border-zinc-800'
                : 'text-zinc-400 hover:text-zinc-200'
            }`}
          >
            <BarChart3 className="w-4 h-4 text-sky-400" />
            <span>Morocco Analytics</span>
          </button>
        </div>

        {/* TAB 1: ORDERS & APPROVALS WORKFLOW */}
        {activeTab === 'orders' && (
          <div className="space-y-4">
            {/* Filter and Search Bar */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-4 bg-zinc-900 border border-zinc-800 rounded-lg">
              <div className="flex items-center gap-2 overflow-x-auto text-xs">
                {['all', 'pending_approval', 'approved', 'shipped', 'delivered', 'cancelled'].map(
                  (st) => (
                    <button
                      key={st}
                      onClick={() => setOrderStatusFilter(st)}
                      className={`px-3 py-1.5 rounded-md capitalize font-medium transition-colors whitespace-nowrap ${
                        orderStatusFilter === st
                          ? 'bg-white text-zinc-950 font-bold'
                          : 'text-zinc-400 hover:text-white bg-zinc-950'
                      }`}
                    >
                      {st.replace('_', ' ')}
                    </button>
                  )
                )}
              </div>

              <div className="flex items-center gap-2 w-full sm:w-auto">
                <input
                  type="text"
                  value={orderSearchQuery}
                  onChange={(e) => setOrderSearchQuery(e.target.value)}
                  placeholder="Search order ID, phone, city..."
                  className="w-full sm:w-56 bg-zinc-950 border border-zinc-800 rounded-md px-3 py-1.5 text-xs text-white placeholder-zinc-500 focus:outline-none focus:border-zinc-600"
                />

                <button
                  type="button"
                  onClick={seedTestOrder}
                  className="px-3 py-1.5 bg-zinc-800 hover:bg-zinc-700 text-amber-400 hover:text-amber-300 font-semibold text-xs rounded-md transition-colors whitespace-nowrap flex items-center gap-1.5"
                  title="Generate a test order for approval verification"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Test Order</span>
                </button>

                {orders.length > 0 && (
                  <button
                    type="button"
                    onClick={() => {
                      if (confirm('Clear all orders and reset total revenue to 0 MAD?')) {
                        clearAllOrders();
                      }
                    }}
                    className="p-1.5 bg-zinc-950 hover:bg-rose-950 text-zinc-500 hover:text-rose-400 border border-zinc-800 hover:border-rose-800 rounded transition-colors"
                    title="Wipe all orders (Reset to 0 MAD)"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                )}
              </div>
            </div>

            {/* Orders List & Empty 0-MAD State */}
            {filteredOrders.length === 0 ? (
              <div className="p-12 text-center bg-zinc-900 border border-zinc-800 rounded-xl space-y-4">
                <div className="w-12 h-12 bg-zinc-950 border border-zinc-800 rounded-full flex items-center justify-center mx-auto text-zinc-500">
                  <Package className="w-6 h-6" />
                </div>
                <div>
                  <h4 className="text-base font-bold text-white font-display mb-1">
                    0 Orders Recorded · Total Revenue: 0 MAD
                  </h4>
                  <p className="text-xs text-zinc-400 max-w-md mx-auto leading-relaxed">
                    The dispatch ledger is completely clean. When customers place orders via Cash on Delivery or Card across Morocco, they will appear here awaiting your administrative approval.
                  </p>
                </div>
                <div className="pt-2">
                  <button
                    type="button"
                    onClick={seedTestOrder}
                    className="px-4 py-2 bg-white hover:bg-zinc-200 text-zinc-950 font-bold text-xs uppercase tracking-wider rounded-md transition-colors inline-flex items-center gap-2 cursor-pointer shadow-md"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>Create Sample Moroccan Order (Test Flow)</span>
                  </button>
                </div>
              </div>
            ) : (
              <div className="space-y-4">
                {filteredOrders.map((order) => (
                  <div
                    key={order.id}
                    className="p-5 bg-zinc-900/90 border border-zinc-800 rounded-lg space-y-4 hover:border-zinc-700 transition-colors"
                  >
                    {/* Header Row */}
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-zinc-800">
                      <div className="flex items-center gap-3">
                        <span className="font-mono font-bold text-base text-white">
                          {order.id}
                        </span>
                        <span
                          className={`text-xs px-2 py-0.5 rounded font-medium capitalize ${
                            order.status === 'pending_approval'
                              ? 'bg-amber-950 text-amber-400 border border-amber-800'
                              : order.status === 'approved'
                              ? 'bg-sky-950 text-sky-400 border border-sky-800'
                              : order.status === 'shipped'
                              ? 'bg-indigo-950 text-indigo-400 border border-indigo-800'
                              : order.status === 'delivered'
                              ? 'bg-emerald-950 text-emerald-400 border border-emerald-800'
                              : 'bg-rose-950 text-rose-400 border border-rose-800'
                          }`}
                        >
                          {order.status.replace('_', ' ')}
                        </span>
                        <span className="text-zinc-500 text-xs">
                          {new Date(order.createdAt).toLocaleDateString('en-GB', {
                            day: 'numeric',
                            month: 'short',
                            hour: '2-digit',
                            minute: '2-digit',
                          })}
                        </span>
                      </div>

                      <div className="flex items-center gap-2">
                        <span className="text-xs text-zinc-400">Total:</span>
                        <span className="font-mono font-bold text-base text-white tabular-nums">
                          {order.total} MAD
                        </span>
                        <span className="text-[11px] font-mono text-zinc-400 bg-zinc-950 px-2 py-0.5 rounded border border-zinc-800">
                          {order.paymentMethod === 'cod' ? 'Cash on Delivery' : 'Card Paid'}
                        </span>
                      </div>
                    </div>

                    {/* Customer & Address Details */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
                      <div>
                        <span className="text-zinc-500 block mb-0.5">Customer & Phone:</span>
                        <div className="font-semibold text-zinc-200">{order.customer.fullName}</div>
                        <div className="flex items-center gap-2 mt-1">
                          <span className="font-mono text-amber-400">{order.customer.phone}</span>
                          <a
                            href={`https://wa.me/212${order.customer.phone.replace(/^0/, '').replace(/\s/g, '')}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-[11px] text-emerald-400 hover:underline flex items-center gap-1 bg-emerald-950/40 px-2 py-0.5 rounded border border-emerald-800/60"
                          >
                            <MessageCircle className="w-3 h-3" />
                            <span>WhatsApp</span>
                          </a>
                        </div>
                      </div>

                      <div>
                        <span className="text-zinc-500 block mb-0.5">Shipping Location:</span>
                        <div className="text-zinc-200">
                          <strong className="text-white">{order.customer.city}</strong> · {order.customer.district}
                        </div>
                        <div className="text-zinc-400 text-[11px] mt-0.5 truncate">
                          {order.customer.address}
                        </div>
                        {order.customer.notes && (
                          <div className="text-amber-400/90 text-[11px] mt-1 italic">
                            Note: &ldquo;{order.customer.notes}&rdquo;
                          </div>
                        )}
                      </div>

                      <div>
                        <span className="text-zinc-500 block mb-0.5">Items Ordered:</span>
                        <div className="space-y-1">
                          {order.items.map((item, i) => (
                            <div key={i} className="text-zinc-300 flex justify-between">
                              <span className="truncate max-w-[180px]">
                                {item.name} ({item.size})
                              </span>
                              <span className="font-mono text-zinc-400">
                                ×{item.quantity} ({item.price * item.quantity} MAD)
                              </span>
                            </div>
                          ))}
                        </div>
                        {order.discountCode && (
                          <div className="text-[11px] text-emerald-400 mt-1">
                            Discount Used: {order.discountCode} (-{order.discountAmount} MAD)
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Carrier Waybill & Approval Action Bar */}
                    <div className="pt-3 border-t border-zinc-800/80 flex flex-wrap items-center justify-between gap-3">
                      <div className="flex items-center gap-2 text-xs">
                        <Truck className="w-4 h-4 text-zinc-400" />
                        <span className="text-zinc-400">Carrier Waybill:</span>
                        {order.trackingNumber ? (
                          <span className="font-mono font-bold text-zinc-200 bg-zinc-950 px-2.5 py-1 rounded border border-zinc-800">
                            {order.trackingNumber}
                          </span>
                        ) : (
                          <div className="flex items-center gap-1">
                            <input
                              type="text"
                              value={trackingInputs[order.id] || ''}
                              onChange={(e) =>
                                setTrackingInputs({
                                  ...trackingInputs,
                                  [order.id]: e.target.value,
                                })
                              }
                              placeholder="CTH-MA-XXXXXX"
                              className="bg-zinc-950 border border-zinc-800 rounded px-2 py-0.5 text-xs text-white font-mono w-32"
                            />
                            <button
                              type="button"
                              onClick={() => {
                                const tr = trackingInputs[order.id];
                                if (tr) updateOrderStatus(order.id, order.status, tr);
                              }}
                              className="px-2 py-0.5 bg-zinc-800 hover:bg-zinc-700 text-zinc-300 text-xs rounded"
                            >
                              Save
                            </button>
                          </div>
                        )}
                      </div>

                      {/* Approval Buttons */}
                      <div className="flex items-center gap-2">
                        {order.status === 'pending_approval' && (
                          <>
                            <button
                              onClick={() => approveOrder(order.id)}
                              className="px-3 py-1.5 bg-emerald-500 hover:bg-emerald-400 text-zinc-950 font-bold text-xs rounded transition-colors flex items-center gap-1.5 cursor-pointer shadow-sm"
                            >
                              <CheckCircle className="w-3.5 h-3.5" />
                              <span>Approve & Confirm Order</span>
                            </button>
                            <button
                              onClick={() => cancelOrder(order.id)}
                              className="px-3 py-1.5 bg-zinc-800 hover:bg-rose-900/60 text-zinc-400 hover:text-rose-300 text-xs rounded transition-colors"
                            >
                              Reject
                            </button>
                          </>
                        )}

                        {order.status === 'approved' && (
                          <button
                            onClick={() => updateOrderStatus(order.id, 'shipped')}
                            className="px-3 py-1.5 bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-xs rounded transition-colors flex items-center gap-1.5 cursor-pointer"
                          >
                            <Truck className="w-3.5 h-3.5" />
                            <span>Mark as Shipped with Courier</span>
                          </button>
                        )}

                        {order.status === 'shipped' && (
                          <button
                            onClick={() => updateOrderStatus(order.id, 'delivered')}
                            className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white font-semibold text-xs rounded transition-colors flex items-center gap-1.5 cursor-pointer"
                          >
                            <Check className="w-3.5 h-3.5" />
                            <span>Confirm Doorstep Delivery</span>
                          </button>
                        )}

                        {order.status !== 'cancelled' && order.status !== 'delivered' && (
                          <button
                            onClick={() => cancelOrder(order.id)}
                            className="p-1.5 text-zinc-500 hover:text-rose-400 rounded hover:bg-zinc-800 transition-colors"
                            title="Cancel Order"
                          >
                            <XCircle className="w-4 h-4" />
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* TAB 2: INVENTORY & PRODUCTS MANAGEMENT */}
        {activeTab === 'inventory' && (
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 bg-zinc-900 border border-zinc-800 rounded-lg">
              <div>
                <h3 className="text-sm font-bold text-white uppercase tracking-wider">
                  Product Catalog & Stock Management
                </h3>
                <p className="text-xs text-zinc-400">
                  Manage garments, prices in MAD, and live inventory per size.
                </p>
              </div>

              <button
                onClick={() => {
                  setEditingProduct(null);
                  setIsProductModalOpen(true);
                }}
                className="px-4 py-2 bg-white hover:bg-zinc-200 text-zinc-950 font-bold text-xs uppercase tracking-wider rounded-md transition-colors flex items-center gap-2 cursor-pointer shadow-md self-start sm:self-auto"
              >
                <Plus className="w-4 h-4" />
                <span>Create New Product</span>
              </button>
            </div>

            {/* Products & Inventory Table */}
            <div className="bg-zinc-900 border border-zinc-800 rounded-lg overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-zinc-950 border-b border-zinc-800 text-zinc-400 font-mono uppercase tracking-wider">
                  <tr>
                    <th className="p-3.5">Piece</th>
                    <th className="p-3.5">Category</th>
                    <th className="p-3.5">Price (MAD)</th>
                    <th className="p-3.5">Stock by Size (S / M / L / XL / XXL)</th>
                    <th className="p-3.5">Total Units</th>
                    <th className="p-3.5 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-zinc-800/60">
                  {products.map((prod) => {
                    const totalUnits = prod.sizes.reduce((sum, s) => sum + s.stock, 0);
                    return (
                      <tr key={prod.id} className="hover:bg-zinc-800/40 transition-colors">
                        <td className="p-3.5">
                          <div className="flex items-center gap-3">
                            <img
                              src={prod.image}
                              alt={prod.name}
                              referrerPolicy="no-referrer"
                              className="w-12 h-12 rounded object-cover bg-zinc-950 shrink-0"
                            />
                            <div>
                              <div className="font-semibold text-zinc-100">{prod.name}</div>
                              <div className="text-[11px] text-zinc-500 font-mono">
                                {prod.fabric.split('(')[0]}
                              </div>
                            </div>
                          </div>
                        </td>

                        <td className="p-3.5">
                          <span className="capitalize px-2 py-0.5 rounded bg-zinc-950 font-mono text-[11px] text-zinc-300 border border-zinc-800">
                            {prod.category}
                          </span>
                        </td>

                        <td className="p-3.5 font-mono font-bold text-zinc-100 tabular-nums">
                          {prod.price} MAD
                        </td>

                        {/* Inline Stock matrix */}
                        <td className="p-3.5">
                          <div className="flex items-center gap-1.5">
                            {prod.sizes.map(({ size, stock }) => (
                              <div
                                key={size}
                                className={`flex flex-col items-center p-1 rounded border ${
                                  stock <= 0
                                    ? 'bg-rose-950/30 border-rose-900/60 text-rose-400'
                                    : stock < 5
                                    ? 'bg-amber-950/30 border-amber-900/60 text-amber-300'
                                    : 'bg-zinc-950 border-zinc-800 text-zinc-300'
                                }`}
                              >
                                <span className="font-mono text-[10px] opacity-75">{size}</span>
                                <div className="flex items-center gap-1 font-mono text-xs font-bold tabular-nums">
                                  <button
                                    onClick={() => updateStock(prod.id, size, stock - 1)}
                                    className="text-zinc-500 hover:text-white px-0.5"
                                  >
                                    -
                                  </button>
                                  <span>{stock}</span>
                                  <button
                                    onClick={() => updateStock(prod.id, size, stock + 1)}
                                    className="text-zinc-500 hover:text-white px-0.5"
                                  >
                                    +
                                  </button>
                                </div>
                              </div>
                            ))}
                          </div>
                        </td>

                        <td className="p-3.5">
                          <span
                            className={`font-mono font-bold tabular-nums ${
                              totalUnits <= 0
                                ? 'text-rose-400'
                                : totalUnits < 15
                                ? 'text-amber-400'
                                : 'text-emerald-400'
                            }`}
                          >
                            {totalUnits} units
                          </span>
                        </td>

                        <td className="p-3.5 text-right">
                          <div className="flex items-center justify-end gap-2">
                            <button
                              onClick={() => {
                                setEditingProduct(prod);
                                setIsProductModalOpen(true);
                              }}
                              className="p-1.5 text-zinc-400 hover:text-white rounded hover:bg-zinc-800 transition-colors"
                              title="Edit Product"
                            >
                              <Edit2 className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => {
                                if (confirm(`Delete product "${prod.name}"?`)) {
                                  deleteProduct(prod.id);
                                }
                              }}
                              className="p-1.5 text-zinc-400 hover:text-rose-400 rounded hover:bg-zinc-800 transition-colors"
                              title="Delete Product"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* TAB 3: DISCOUNT CODES MANAGEMENT (User Prompt Feature!) */}
        {activeTab === 'discounts' && (
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 bg-zinc-900 border border-zinc-800 rounded-lg">
              <div>
                <h3 className="text-sm font-bold text-white uppercase tracking-wider">
                  Discount Codes & Coupon Engine
                </h3>
                <p className="text-xs text-zinc-400">
                  Create and manage promo codes with percentage or fixed MAD discounts, expiry dates, and usage stats.
                </p>
              </div>

              <button
                onClick={() => {
                  setEditingDiscount(null);
                  setIsDiscountModalOpen(true);
                }}
                className="px-4 py-2 bg-emerald-500 hover:bg-emerald-400 text-zinc-950 font-bold text-xs uppercase tracking-wider rounded-md transition-colors flex items-center gap-2 cursor-pointer shadow-md self-start sm:self-auto"
              >
                <Plus className="w-4 h-4" />
                <span>Create Discount Code</span>
              </button>
            </div>

            {/* Discount Codes Table */}
            <div className="bg-zinc-900 border border-zinc-800 rounded-lg overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-zinc-950 border-b border-zinc-800 text-zinc-400 font-mono uppercase tracking-wider">
                  <tr>
                    <th className="p-3.5">Code</th>
                    <th className="p-3.5">Discount Rate</th>
                    <th className="p-3.5">Min. Order</th>
                    <th className="p-3.5">Expiry Date</th>
                    <th className="p-3.5">Times Used</th>
                    <th className="p-3.5">Active Status</th>
                    <th className="p-3.5 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-zinc-800/60">
                  {discountCodes.map((discount) => {
                    const today = new Date().toISOString().split('T')[0];
                    const isExpired = discount.expiryDate && discount.expiryDate < today;

                    return (
                      <tr key={discount.id} className="hover:bg-zinc-800/40 transition-colors">
                        <td className="p-3.5">
                          <div className="flex items-center gap-2">
                            <span className="font-mono font-bold text-sm text-white bg-zinc-950 px-2.5 py-1 rounded border border-zinc-800">
                              {discount.code}
                            </span>
                            {isExpired && (
                              <span className="text-[10px] font-mono text-rose-400 bg-rose-950/60 border border-rose-800 px-1.5 py-0.5 rounded">
                                Expired
                              </span>
                            )}
                          </div>
                        </td>

                        <td className="p-3.5">
                          <span className="font-mono font-bold text-emerald-400 text-sm tabular-nums">
                            {discount.type === 'percentage'
                              ? `${discount.value}% OFF`
                              : `${discount.value} MAD OFF`}
                          </span>
                        </td>

                        <td className="p-3.5 font-mono text-zinc-300 tabular-nums">
                          {discount.minOrderAmount ? `${discount.minOrderAmount} MAD` : 'None'}
                        </td>

                        <td className="p-3.5">
                          <div className="flex items-center gap-1.5 text-zinc-300 font-mono">
                            <Calendar className="w-3.5 h-3.5 text-zinc-500" />
                            <span>{discount.expiryDate}</span>
                          </div>
                        </td>

                        <td className="p-3.5 font-mono text-zinc-200 tabular-nums font-semibold">
                          {discount.usageCount} orders
                        </td>

                        <td className="p-3.5">
                          <button
                            type="button"
                            onClick={() => toggleDiscountCodeStatus(discount.id)}
                            className={`px-2.5 py-1 rounded text-[11px] font-semibold transition-colors cursor-pointer ${
                              discount.isActive && !isExpired
                                ? 'bg-emerald-950 text-emerald-400 border border-emerald-800'
                                : 'bg-zinc-800 text-zinc-500 border border-zinc-700'
                            }`}
                          >
                            {discount.isActive && !isExpired ? 'Active' : 'Disabled'}
                          </button>
                        </td>

                        <td className="p-3.5 text-right">
                          <div className="flex items-center justify-end gap-2">
                            <button
                              onClick={() => {
                                setEditingDiscount(discount);
                                setIsDiscountModalOpen(true);
                              }}
                              className="p-1.5 text-zinc-400 hover:text-white rounded hover:bg-zinc-800 transition-colors"
                              title="Edit Discount Code"
                            >
                              <Edit2 className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => {
                                if (confirm(`Delete code "${discount.code}"?`)) {
                                  deleteDiscountCode(discount.id);
                                }
                              }}
                              className="p-1.5 text-zinc-400 hover:text-rose-400 rounded hover:bg-zinc-800 transition-colors"
                              title="Delete Discount Code"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* TAB 4: MOROCCO ANALYTICS */}
        {activeTab === 'analytics' && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Moroccan City Sales Breakdown */}
            <div className="bg-zinc-900 border border-zinc-800 rounded-lg p-5">
              <h3 className="text-sm font-bold text-white uppercase tracking-wider mb-4">
                Regional Moroccan Order Volume
              </h3>
              <div className="space-y-3">
                {['Casablanca', 'Rabat', 'Marrakech', 'Tangier', 'Fes', 'Agadir'].map((city) => {
                  const cityOrders = orders.filter((o) => o.customer.city === city);
                  const count = cityOrders.length;
                  const percentage = orders.length > 0 ? (count / orders.length) * 100 : 0;
                  return (
                    <div key={city} className="space-y-1">
                      <div className="flex justify-between text-xs">
                        <span className="text-zinc-200 font-medium">{city}</span>
                        <span className="font-mono text-zinc-400 tabular-nums">
                          {count} orders ({Math.round(percentage)}%)
                        </span>
                      </div>
                      <div className="w-full h-2 bg-zinc-950 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-amber-400 rounded-full"
                          style={{ width: `${Math.max(5, percentage)}%` }}
                        />
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Payment Method Split */}
            <div className="bg-zinc-900 border border-zinc-800 rounded-lg p-5">
              <h3 className="text-sm font-bold text-white uppercase tracking-wider mb-4">
                Payment Method Split
              </h3>
              <div className="space-y-4">
                {/* COD */}
                <div className="p-4 bg-zinc-950 rounded-lg border border-zinc-800 flex items-center justify-between">
                  <div>
                    <div className="font-bold text-zinc-100 text-xs">
                      Cash on Delivery (Paiement à la livraison)
                    </div>
                    <div className="text-[11px] text-zinc-500">Standard preference across Moroccan e-commerce</div>
                  </div>
                  <div className="text-right">
                    <span className="font-mono font-bold text-lg text-white">
                      {orders.filter((o) => o.paymentMethod === 'cod').length}
                    </span>
                    <span className="text-[10px] text-zinc-500 block">Orders</span>
                  </div>
                </div>

                {/* Card */}
                <div className="p-4 bg-zinc-950 rounded-lg border border-zinc-800 flex items-center justify-between">
                  <div>
                    <div className="font-bold text-zinc-100 text-xs">
                      Online Card Payment (CMI / 3D-Secure)
                    </div>
                    <div className="text-[11px] text-zinc-500">Instant card processing</div>
                  </div>
                  <div className="text-right">
                    <span className="font-mono font-bold text-lg text-white">
                      {orders.filter((o) => o.paymentMethod === 'card').length}
                    </span>
                    <span className="text-[10px] text-zinc-500 block">Orders</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Product Form Modal */}
      {isProductModalOpen && (
        <ProductFormModal
          productToEdit={editingProduct}
          onClose={() => setIsProductModalOpen(false)}
          onSave={(data) => {
            if (editingProduct) {
              updateProduct(editingProduct.id, data);
            } else {
              addProduct(data);
            }
          }}
        />
      )}

      {/* Discount Code Form Modal */}
      {isDiscountModalOpen && (
        <DiscountCodeModal
          codeToEdit={editingDiscount}
          onClose={() => setIsDiscountModalOpen(false)}
          onSave={(data) => {
            if (editingDiscount) {
              updateDiscountCode(editingDiscount.id, data);
            } else {
              addDiscountCode(data);
            }
          }}
        />
      )}
    </div>
  );
};
