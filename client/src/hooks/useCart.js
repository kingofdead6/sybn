import { useCallback, useEffect, useState } from 'react';

const CART_KEY = 'siyb-cart';

function readCart() {
  try {
    const raw = window.localStorage.getItem(CART_KEY);
    const parsed = raw ? JSON.parse(raw) : [];
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

function writeCart(items) {
  try {
    window.localStorage.setItem(CART_KEY, JSON.stringify(items));
  } catch {
    // ignore storage errors (private browsing, quota, etc.)
  }
}

/**
 * Minimal localStorage-backed cart shared across the store pages.
 * Items are shaped { productId, slug, title, price, qty }.
 */
export function useCart() {
  const [items, setItems] = useState(() => readCart());

  useEffect(() => {
    writeCart(items);
  }, [items]);

  useEffect(() => {
    function onStorage(e) {
      if (e.key === CART_KEY) setItems(readCart());
    }
    window.addEventListener('storage', onStorage);
    return () => window.removeEventListener('storage', onStorage);
  }, []);

  const addItem = useCallback((item, qty = 1) => {
    setItems((prev) => {
      const existing = prev.find((i) => i.productId === item.productId);
      if (existing) {
        return prev.map((i) =>
          i.productId === item.productId ? { ...i, qty: i.qty + qty } : i
        );
      }
      return [...prev, { ...item, qty }];
    });
  }, []);

  const removeItem = useCallback((productId) => {
    setItems((prev) => prev.filter((i) => i.productId !== productId));
  }, []);

  const updateQty = useCallback((productId, qty) => {
    setItems((prev) =>
      prev
        .map((i) => (i.productId === productId ? { ...i, qty: Math.max(1, qty) } : i))
        .filter((i) => i.qty > 0)
    );
  }, []);

  const clear = useCallback(() => setItems([]), []);

  const total = items.reduce((sum, i) => sum + i.price * i.qty, 0);

  return { items, addItem, removeItem, updateQty, clear, total };
}
