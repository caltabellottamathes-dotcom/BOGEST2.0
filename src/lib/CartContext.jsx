import React, { createContext, useContext, useState } from 'react';

const CartContext = createContext();

export function CartProvider({ children }) {
  const [items, setItems] = useState([]);
  const [cartMeta, setCartMeta] = useState({}); // Store extra data per type (location, pickup time, etc)

  const addItem = (item, type, meta = {}) => {
    // Allow mixing takeaway, giftcard, and giftpackage
    // Add item with type attached
    setItems(prev => {
      const existing = prev.find(i => i.id === item.id && i.itemType === type);
      if (existing) {
        return prev.map(i => i.id === item.id && i.itemType === type ? { ...i, qty: i.qty + 1 } : i);
      }
      return [...prev, { ...item, itemType: type, qty: 1 }];
    });
    
    // Merge meta for this type
    setCartMeta(prev => ({
      ...prev,
      [type]: { ...prev[type], ...meta },
    }));
  };

  const updateQty = (id, qty, itemType) => {
    if (qty <= 0) {
      removeItem(id, itemType);
      return;
    }
    setItems(prev => prev.map(i =>
      i.id === id && (itemType ? i.itemType === itemType : true) ? { ...i, qty } : i
    ));
  };

  const removeItem = (id, itemType) => {
    setItems(prev => prev.filter(i =>
      !(i.id === id && (itemType ? i.itemType === itemType : true))
    ));
  };

  const clearCart = () => {
    setItems([]);
    setCartMeta({});
  };

  const total = items.reduce((sum, i) => sum + (i.price * i.qty), 0);
  const count = items.reduce((sum, i) => sum + i.qty, 0);

  return (
    <CartContext.Provider value={{ items, cartMeta, setCartMeta, addItem, updateQty, removeItem, clearCart, total, count }}>
      {children}
    </CartContext.Provider>
  );
}

export const useCart = () => useContext(CartContext);