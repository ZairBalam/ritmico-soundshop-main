import React, { createContext, useContext, useState, useEffect } from 'react';
import { Product, CartItem } from '@/types';

interface CartTotals {
  subtotal: number;
  iva: number;
  envio: number;
  total: number;
}

interface CartContextType {
  items: CartItem[];
  itemCount: number;
  totals: CartTotals;
  addItem: (product: Product, quantity?: number) => void;
  removeItem: (productId: string) => void;
  incrementItem: (productId: string) => void;
  decrementItem: (productId: string) => void;
  clearCart: () => void;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

const ENVIO_GRATIS_MINIMO = 3000;
const COSTO_ENVIO = 149;
const IVA_RATE = 0.16;

export const CartProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [items, setItems] = useState<CartItem[]>([]);

  // Cargar carrito de localStorage
  useEffect(() => {
    const savedCart = localStorage.getItem('musiteca_cart');
    if (savedCart) {
      setItems(JSON.parse(savedCart));
    }
  }, []);

  // Guardar carrito en localStorage
  useEffect(() => {
    localStorage.setItem('musiteca_cart', JSON.stringify(items));
  }, [items]);

  // Calcular totales
  const totals: CartTotals = React.useMemo(() => {
    const subtotal = items.reduce((sum, item) => sum + item.product.precio * item.quantity, 0);
    const iva = Math.round(subtotal * IVA_RATE * 100) / 100;
    const envio = subtotal >= ENVIO_GRATIS_MINIMO ? 0 : COSTO_ENVIO;
    const total = subtotal + iva + envio;

    return { subtotal, iva, envio, total };
  }, [items]);

  const itemCount = items.reduce((sum, item) => sum + item.quantity, 0);

  const addItem = (product: Product, quantity: number = 1) => {
    setItems((current) => {
      const existingItem = current.find((item) => item.product.id === product.id);
      
      if (existingItem) {
        return current.map((item) =>
          item.product.id === product.id
            ? { ...item, quantity: Math.min(item.quantity + quantity, product.stock) }
            : item
        );
      }
      
      return [...current, { product, quantity: Math.min(quantity, product.stock) }];
    });
  };

  const removeItem = (productId: string) => {
    setItems((current) => current.filter((item) => item.product.id !== productId));
  };

  const incrementItem = (productId: string) => {
    setItems((current) =>
      current.map((item) =>
        item.product.id === productId
          ? { ...item, quantity: Math.min(item.quantity + 1, item.product.stock) }
          : item
      )
    );
  };

  const decrementItem = (productId: string) => {
    setItems((current) =>
      current.map((item) =>
        item.product.id === productId && item.quantity > 1
          ? { ...item, quantity: item.quantity - 1 }
          : item
      )
    );
  };

  const clearCart = () => {
    setItems([]);
  };

  return (
    <CartContext.Provider
      value={{
        items,
        itemCount,
        totals,
        addItem,
        removeItem,
        incrementItem,
        decrementItem,
        clearCart,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error('useCart debe usarse dentro de CartProvider');
  }
  return context;
};
