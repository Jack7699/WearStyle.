import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  Product,
  CartItem,
  Order,
  DiscountCode,
  OrderStatus,
  ProductSize,
} from '../types';
import {
  INITIAL_PRODUCTS,
  INITIAL_DISCOUNT_CODES,
  INITIAL_ORDERS,
} from '../data/initialData';
import { soundEngine } from '../utils/audio';

interface DiscountValidationResult {
  success: boolean;
  message: string;
  code?: DiscountCode;
}

interface StoreContextType {
  products: Product[];
  orders: Order[];
  discountCodes: DiscountCode[];
  cart: CartItem[];
  cartCount: number;
  subtotal: number;
  appliedDiscount: DiscountCode | null;

  // Cart operations
  addToCart: (product: Product, size: ProductSize, color: string, quantity?: number) => boolean;
  removeFromCart: (productId: string, size: ProductSize) => void;
  updateCartQuantity: (productId: string, size: ProductSize, delta: number) => void;
  clearCart: () => void;

  // Discount code actions
  applyDiscountCode: (codeStr: string, currentSubtotal?: number) => DiscountValidationResult;
  removeDiscountCode: () => void;
  calculateDiscountAmount: (subtotalAmount: number, code: DiscountCode | null) => number;

  // Order workflow
  createOrder: (orderPayload: {
    customer: Order['customer'];
    paymentMethod: Order['paymentMethod'];
    shippingFee: number;
    cardLast4?: string;
  }) => Order;

  // Admin access & operations
  isAdminLoggedIn: boolean;
  loginAdmin: (pass: string) => boolean;
  logoutAdmin: () => void;

  // Inventory / Product Admin actions
  addProduct: (product: Omit<Product, 'id' | 'createdAt'>) => Product;
  updateProduct: (id: string, updates: Partial<Product>) => void;
  deleteProduct: (id: string) => void;
  updateStock: (productId: string, size: ProductSize, stock: number) => void;

  // Order Approval Admin actions
  updateOrderStatus: (orderId: string, status: OrderStatus, trackingNumber?: string) => void;
  approveOrder: (orderId: string, trackingNumber?: string) => void;
  cancelOrder: (orderId: string) => void;
  clearAllOrders: () => void;
  seedTestOrder: () => Order;

  // Currency & International Preview
  selectedCurrency: 'MAD' | 'EUR' | 'USD';
  setSelectedCurrency: (curr: 'MAD' | 'EUR' | 'USD') => void;
  formatPrice: (madAmount: number) => string;

  // Tactile Audio & Vibe Engine
  isSoundEnabled: boolean;
  toggleSound: () => void;
  isVibePlaying: boolean;
  toggleVibe: () => void;

  // Discount Admin actions (from user prompt)
  addDiscountCode: (code: Omit<DiscountCode, 'id' | 'usageCount'>) => DiscountCode;
  updateDiscountCode: (id: string, updates: Partial<DiscountCode>) => void;
  deleteDiscountCode: (id: string) => void;
  toggleDiscountCodeStatus: (id: string) => void;

  // Navigation & Modals
  isCartOpen: boolean;
  setIsCartOpen: (open: boolean) => void;
  isCheckoutOpen: boolean;
  setIsCheckoutOpen: (open: boolean) => void;
  selectedProduct: Product | null;
  setSelectedProduct: (product: Product | null) => void;
  lastPlacedOrder: Order | null;
  setLastPlacedOrder: (order: Order | null) => void;
  isTrackingModalOpen: boolean;
  setIsTrackingModalOpen: (open: boolean) => void;
  activeView: 'shop' | 'admin' | 'tracking';
  setActiveView: (view: 'shop' | 'admin' | 'tracking') => void;
}

const StoreContext = createContext<StoreContextType | undefined>(undefined);

// High-security random admin passcode as requested
export const RANDOM_ADMIN_PASSCODE = 'Ws$7kR9#mX2!';

export const StoreProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Tactile sound engine
  const [isSoundEnabled, setIsSoundEnabled] = useState(false);
  const [isVibePlaying, setIsVibePlaying] = useState(false);

  // Currency converter (Default MAD)
  const [selectedCurrency, setSelectedCurrency] = useState<'MAD' | 'EUR' | 'USD'>('MAD');

  // Persistence with localStorage
  const [products, setProducts] = useState<Product[]>(() => {
    try {
      const saved = localStorage.getItem('wearstyle_products');
      return saved ? JSON.parse(saved) : INITIAL_PRODUCTS;
    } catch {
      return INITIAL_PRODUCTS;
    }
  });

  // Ensure all orders are removed and total revenue is 0
  const [orders, setOrders] = useState<Order[]>(() => {
    try {
      const resetDone = localStorage.getItem('wearstyle_orders_reset_zero_v2');
      if (!resetDone) {
        localStorage.setItem('wearstyle_orders_reset_zero_v2', 'true');
        localStorage.setItem('wearstyle_orders', '[]');
        return [];
      }
      const saved = localStorage.getItem('wearstyle_orders');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const [discountCodes, setDiscountCodes] = useState<DiscountCode[]>(() => {
    try {
      const saved = localStorage.getItem('wearstyle_discounts');
      return saved ? JSON.parse(saved) : INITIAL_DISCOUNT_CODES;
    } catch {
      return INITIAL_DISCOUNT_CODES;
    }
  });

  const [cart, setCart] = useState<CartItem[]>(() => {
    try {
      const saved = localStorage.getItem('wearstyle_cart');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const [appliedDiscount, setAppliedDiscount] = useState<DiscountCode | null>(() => {
    try {
      const saved = localStorage.getItem('wearstyle_applied_discount');
      return saved ? JSON.parse(saved) : null;
    } catch {
      return null;
    }
  });

  const [isAdminLoggedIn, setIsAdminLoggedIn] = useState<boolean>(() => {
    try {
      return localStorage.getItem('wearstyle_admin_auth') === 'true';
    } catch {
      return false;
    }
  });

  // Modals & Views
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [lastPlacedOrder, setLastPlacedOrder] = useState<Order | null>(null);
  const [isTrackingModalOpen, setIsTrackingModalOpen] = useState(false);
  const [activeView, setActiveView] = useState<'shop' | 'admin' | 'tracking'>('shop');

  // Sync to localStorage
  useEffect(() => {
    localStorage.setItem('wearstyle_products', JSON.stringify(products));
  }, [products]);

  useEffect(() => {
    localStorage.setItem('wearstyle_orders', JSON.stringify(orders));
  }, [orders]);

  useEffect(() => {
    localStorage.setItem('wearstyle_discounts', JSON.stringify(discountCodes));
  }, [discountCodes]);

  useEffect(() => {
    localStorage.setItem('wearstyle_cart', JSON.stringify(cart));
  }, [cart]);

  useEffect(() => {
    if (appliedDiscount) {
      localStorage.setItem('wearstyle_applied_discount', JSON.stringify(appliedDiscount));
    } else {
      localStorage.removeItem('wearstyle_applied_discount');
    }
  }, [appliedDiscount]);

  useEffect(() => {
    localStorage.setItem('wearstyle_admin_auth', isAdminLoggedIn ? 'true' : 'false');
  }, [isAdminLoggedIn]);

  // Totals
  const cartCount = cart.reduce((sum, item) => sum + item.quantity, 0);
  const subtotal = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);

  // Cart operations
  const addToCart = (
    product: Product,
    size: ProductSize,
    color: string,
    quantity: number = 1
  ): boolean => {
    const sizeStockObj = product.sizes.find((s) => s.size === size);
    const availableStock = sizeStockObj ? sizeStockObj.stock : 0;

    if (availableStock <= 0) return false;

    setCart((prev) => {
      const existingIndex = prev.findIndex(
        (item) => item.productId === product.id && item.size === size
      );

      if (existingIndex > -1) {
        const currentQty = prev[existingIndex].quantity;
        const newQty = Math.min(currentQty + quantity, availableStock);
        const updated = [...prev];
        updated[existingIndex] = {
          ...updated[existingIndex],
          quantity: newQty,
          maxStock: availableStock,
        };
        return updated;
      } else {
        const newItem: CartItem = {
          productId: product.id,
          name: product.name,
          image: product.image,
          price: product.price,
          size,
          color,
          quantity: Math.min(quantity, availableStock),
          maxStock: availableStock,
        };
        return [...prev, newItem];
      }
    });

    setIsCartOpen(true);
    return true;
  };

  const removeFromCart = (productId: string, size: ProductSize) => {
    setCart((prev) =>
      prev.filter((item) => !(item.productId === productId && item.size === size))
    );
  };

  const updateCartQuantity = (productId: string, size: ProductSize, delta: number) => {
    setCart((prev) =>
      prev
        .map((item) => {
          if (item.productId === productId && item.size === size) {
            const targetQty = item.quantity + delta;
            if (targetQty <= 0) return null;
            return {
              ...item,
              quantity: Math.min(targetQty, item.maxStock),
            };
          }
          return item;
        })
        .filter((item): item is CartItem => item !== null)
    );
  };

  const clearCart = () => {
    setCart([]);
    setAppliedDiscount(null);
  };

  // Discount code validation & calculations
  const calculateDiscountAmount = (subtotalAmount: number, code: DiscountCode | null): number => {
    if (!code || !code.isActive) return 0;
    if (code.minOrderAmount && subtotalAmount < code.minOrderAmount) return 0;

    if (code.type === 'percentage') {
      const discounted = (subtotalAmount * code.value) / 100;
      return Math.round(discounted * 100) / 100;
    } else {
      // Fixed amount MAD
      return Math.min(code.value, subtotalAmount);
    }
  };

  const applyDiscountCode = (codeStr: string, currentSubtotal?: number): DiscountValidationResult => {
    const trimmed = codeStr.trim().toUpperCase();
    if (!trimmed) {
      return { success: false, message: 'Please enter a discount code' };
    }

    const found = discountCodes.find((d) => d.code.toUpperCase() === trimmed);
    if (!found) {
      return { success: false, message: `Code "${trimmed}" is invalid` };
    }

    if (!found.isActive) {
      return { success: false, message: `Code "${trimmed}" is no longer active` };
    }

    // Check expiry
    const today = new Date().toISOString().split('T')[0];
    if (found.expiryDate && found.expiryDate < today) {
      return { success: false, message: `Code "${trimmed}" expired on ${found.expiryDate}` };
    }

    const orderSubtotal = currentSubtotal !== undefined ? currentSubtotal : subtotal;
    if (found.minOrderAmount && orderSubtotal < found.minOrderAmount) {
      return {
        success: false,
        message: `Minimum order of ${found.minOrderAmount} MAD required for this code`,
      };
    }

    setAppliedDiscount(found);
    return {
      success: true,
      message:
        found.type === 'percentage'
          ? `${found.value}% discount applied!`
          : `${found.value} MAD discount applied!`,
      code: found,
    };
  };

  const removeDiscountCode = () => {
    setAppliedDiscount(null);
  };

  // Order Placement
  const createOrder = ({
    customer,
    paymentMethod,
    shippingFee,
    cardLast4,
  }: {
    customer: Order['customer'];
    paymentMethod: Order['paymentMethod'];
    shippingFee: number;
    cardLast4?: string;
  }): Order => {
    const currentSubtotal = subtotal;
    const discountAmt = calculateDiscountAmount(currentSubtotal, appliedDiscount);
    const finalTotal = Math.max(0, currentSubtotal - discountAmt + shippingFee);

    // Generate Moroccan Order Code: WS-MA-XXXXX
    const randomNum = Math.floor(10000 + Math.random() * 90000);
    const newOrderId = `WS-MA-${randomNum}`;

    const newOrder: Order = {
      id: newOrderId,
      createdAt: new Date().toISOString(),
      customer,
      items: [...cart],
      subtotal: currentSubtotal,
      discountAmount: discountAmt,
      discountCode: appliedDiscount?.code,
      shippingFee,
      total: finalTotal,
      paymentMethod,
      status: 'pending_approval', // Requires Admin approval!
      cardLast4,
    };

    // 1. Decrement product inventory stock
    setProducts((prev) =>
      prev.map((prod) => {
        const itemsForProd = cart.filter((c) => c.productId === prod.id);
        if (itemsForProd.length === 0) return prod;

        const updatedSizes = prod.sizes.map((s) => {
          const match = itemsForProd.find((c) => c.size === s.size);
          if (match) {
            return {
              ...s,
              stock: Math.max(0, s.stock - match.quantity),
            };
          }
          return s;
        });

        return { ...prod, sizes: updatedSizes };
      })
    );

    // 2. Increment discount code usage if one was applied
    if (appliedDiscount) {
      setDiscountCodes((prev) =>
        prev.map((d) =>
          d.id === appliedDiscount.id ? { ...d, usageCount: d.usageCount + 1 } : d
        )
      );
    }

    // 3. Save new order
    setOrders((prev) => [newOrder, ...prev]);

    // 4. Clear cart & applied discount
    clearCart();
    setLastPlacedOrder(newOrder);

    soundEngine.playAddToCart();
    return newOrder;
  };

  // Admin Authentication with new random passcode
  const loginAdmin = (pass: string): boolean => {
    if (pass.trim() === RANDOM_ADMIN_PASSCODE) {
      setIsAdminLoggedIn(true);
      soundEngine.playClick();
      return true;
    }
    return false;
  };

  const logoutAdmin = () => {
    setIsAdminLoggedIn(false);
    soundEngine.playClick();
  };

  // Clear all orders and reset revenue to 0 MAD
  const clearAllOrders = () => {
    setOrders([]);
    localStorage.setItem('wearstyle_orders', '[]');
  };

  // Seed a sample Moroccan test order for admin testing
  const seedTestOrder = (): Order => {
    const testId = `WS-MA-${Math.floor(10000 + Math.random() * 90000)}`;
    const testOrder: Order = {
      id: testId,
      createdAt: new Date().toISOString(),
      customer: {
        fullName: 'Hamza Tazi',
        phone: '0661998877',
        email: 'hamza.tazi@gmail.com',
        city: 'Casablanca',
        district: 'Maarif Extension',
        address: '15 Boulevard Al Massira Al Khadra, Apt 7',
        notes: 'Ring intercom Tazi twice',
      },
      items: [
        {
          productId: products[0]?.id || 'prod-hoodie-01',
          name: products[0]?.name || 'Heavyweight Boxy Hoodie',
          image: products[0]?.image || '/src/assets/images/product_hoodie_heavyweight_black_1793989033781.jpg',
          price: products[0]?.price || 499,
          size: 'L',
          color: 'Onyx Black',
          quantity: 1,
          maxStock: 15,
        },
      ],
      subtotal: products[0]?.price || 499,
      discountAmount: 0,
      shippingFee: 35,
      total: (products[0]?.price || 499) + 35,
      paymentMethod: 'cod',
      status: 'pending_approval',
    };
    setOrders((prev) => [testOrder, ...prev]);
    return testOrder;
  };

  // Currency converter
  const formatPrice = (madAmount: number): string => {
    if (selectedCurrency === 'EUR') {
      const eur = Math.round(madAmount * 0.092);
      return `${madAmount} MAD (~€${eur})`;
    }
    if (selectedCurrency === 'USD') {
      const usd = Math.round(madAmount * 0.099);
      return `${madAmount} MAD (~$${usd})`;
    }
    return `${madAmount} MAD`;
  };

  // Audio helpers
  const toggleSound = () => {
    const enabled = soundEngine.toggleSound();
    setIsSoundEnabled(enabled);
    if (!enabled) setIsVibePlaying(false);
  };

  const toggleVibe = () => {
    const playing = soundEngine.toggleAmbientVibe();
    setIsVibePlaying(playing);
    setIsSoundEnabled(soundEngine.isSoundEnabled);
  };

  // Inventory / Product Admin operations
  const addProduct = (newProdData: Omit<Product, 'id' | 'createdAt'>): Product => {
    const newProduct: Product = {
      ...newProdData,
      id: `prod-${Date.now()}`,
      createdAt: new Date().toISOString(),
    };
    setProducts((prev) => [newProduct, ...prev]);
    return newProduct;
  };

  const updateProduct = (id: string, updates: Partial<Product>) => {
    setProducts((prev) =>
      prev.map((prod) => (prod.id === id ? { ...prod, ...updates } : prod))
    );
  };

  const deleteProduct = (id: string) => {
    setProducts((prev) => prev.filter((prod) => prod.id !== id));
  };

  const updateStock = (productId: string, size: ProductSize, stock: number) => {
    setProducts((prev) =>
      prev.map((prod) => {
        if (prod.id !== productId) return prod;
        const newSizes = prod.sizes.map((s) =>
          s.size === size ? { ...s, stock: Math.max(0, stock) } : s
        );
        return { ...prod, sizes: newSizes };
      })
    );
  };

  // Order Approval & Status Admin operations
  const updateOrderStatus = (orderId: string, status: OrderStatus, trackingNumber?: string) => {
    setOrders((prev) =>
      prev.map((order) => {
        if (order.id !== orderId) return order;
        return {
          ...order,
          status,
          approvedAt:
            status === 'approved' && !order.approvedAt
              ? new Date().toISOString()
              : order.approvedAt,
          trackingNumber: trackingNumber || order.trackingNumber,
        };
      })
    );
  };

  const approveOrder = (orderId: string, trackingNumber?: string) => {
    const defaultCarrierRef =
      trackingNumber ||
      `CTH-MA-${Math.floor(100000 + Math.random() * 900000)}`;
    updateOrderStatus(orderId, 'approved', defaultCarrierRef);
  };

  const cancelOrder = (orderId: string) => {
    updateOrderStatus(orderId, 'cancelled');
  };

  // Discount Codes Admin operations (New Feature!)
  const addDiscountCode = (
    codeData: Omit<DiscountCode, 'id' | 'usageCount'>
  ): DiscountCode => {
    const newCode: DiscountCode = {
      ...codeData,
      id: `disc-${Date.now()}`,
      code: codeData.code.trim().toUpperCase(),
      usageCount: 0,
    };
    setDiscountCodes((prev) => [newCode, ...prev]);
    return newCode;
  };

  const updateDiscountCode = (id: string, updates: Partial<DiscountCode>) => {
    setDiscountCodes((prev) =>
      prev.map((d) => {
        if (d.id !== id) return d;
        return {
          ...d,
          ...updates,
          code: updates.code ? updates.code.trim().toUpperCase() : d.code,
        };
      })
    );
  };

  const deleteDiscountCode = (id: string) => {
    setDiscountCodes((prev) => prev.filter((d) => d.id !== id));
    if (appliedDiscount?.id === id) {
      setAppliedDiscount(null);
    }
  };

  const toggleDiscountCodeStatus = (id: string) => {
    setDiscountCodes((prev) =>
      prev.map((d) => (d.id === id ? { ...d, isActive: !d.isActive } : d))
    );
  };

  return (
    <StoreContext.Provider
      value={{
        products,
        orders,
        discountCodes,
        cart,
        cartCount,
        subtotal,
        appliedDiscount,
        addToCart,
        removeFromCart,
        updateCartQuantity,
        clearCart,
        applyDiscountCode,
        removeDiscountCode,
        calculateDiscountAmount,
        createOrder,
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
        selectedCurrency,
        setSelectedCurrency,
        formatPrice,
        isSoundEnabled,
        toggleSound,
        isVibePlaying,
        toggleVibe,
        addDiscountCode,
        updateDiscountCode,
        deleteDiscountCode,
        toggleDiscountCodeStatus,
        isCartOpen,
        setIsCartOpen,
        isCheckoutOpen,
        setIsCheckoutOpen,
        selectedProduct,
        setSelectedProduct,
        lastPlacedOrder,
        setLastPlacedOrder,
        isTrackingModalOpen,
        setIsTrackingModalOpen,
        activeView,
        setActiveView,
      }}
    >
      {children}
    </StoreContext.Provider>
  );
};

export const useStore = () => {
  const context = useContext(StoreContext);
  if (!context) {
    throw new Error('useStore must be used within a StoreProvider');
  }
  return context;
};
