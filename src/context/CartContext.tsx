import React, { createContext, useContext, useEffect, useState } from "react";
import { api } from "../lib/api";

interface CartItem {
  id: string;
  productId: string;
  variantId?: string | null;
  productName: string;
  productSlug: string;
  variantName?: string | null;
  productImage?: string | null;
  unitPrice: number;
  quantity: number;
  totalPrice: number;
  availableStock: number;
}

interface Cart {
  cartId: string;
  items: CartItem[];
  itemCount: number;
  subtotal: number;
  shipping: number;
  discount: number;
  appliedCoupon: { code: string; description: string; discount: number } | null;
  total: number;
  freeShippingThreshold: number;
  amountToFreeShipping: number;
}

interface CartContextType {
  cart: Cart | null;
  loading: boolean;
  isOpen: boolean;
  openCart: () => void;
  closeCart: () => void;
  toggleCart: () => void;
  addToCart: (data: { productId: string; variantId?: string; quantity?: number }) => Promise<void>;
  updateQuantity: (itemId: string, quantity: number) => Promise<void>;
  removeItem: (itemId: string) => Promise<void>;
  refreshCart: (coupon?: string) => Promise<void>;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [cart, setCart] = useState<Cart | null>(null);
  const [loading, setLoading] = useState(true);
  const [isOpen, setIsOpen] = useState(false);

  const refreshCart = async (coupon?: string) => {
    try {
      const res = await api.getCart(coupon);
      setCart(res.cart);
    } catch (err) {
      console.error("Failed to load cart", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    refreshCart();
  }, []);

  const openCart = () => setIsOpen(true);
  const closeCart = () => setIsOpen(false);
  const toggleCart = () => setIsOpen((prev) => !prev);

  const addToCart = async (data: { productId: string; variantId?: string; quantity?: number }) => {
    const res = await api.addToCart(data);
    setCart(res.cart);
    setIsOpen(true);
  };

  const updateQuantity = async (itemId: string, quantity: number) => {
    const res = await api.updateCartItem(itemId, quantity);
    setCart(res.cart);
  };

  const removeItem = async (itemId: string) => {
    const res = await api.removeCartItem(itemId);
    setCart(res.cart);
  };

  return (
    <CartContext.Provider
      value={{
        cart,
        loading,
        isOpen,
        openCart,
        closeCart,
        toggleCart,
        addToCart,
        updateQuantity,
        removeItem,
        refreshCart,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error("useCart must be used within a CartProvider");
  }
  return context;
}
