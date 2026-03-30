// Shopping cart helpers — add to your existing storage module.
// Exports: cart helpers + preserve other storage exports if present.

const CART_KEY = 'miPedido';

export function getCached(key) {
    try { return JSON.parse(localStorage.getItem(key)); } catch { return null; }
}
export function setCached(key, value) {
    try { localStorage.setItem(key, JSON.stringify(value)); } catch {}
}

// Cart API
export function getCart() {
    try { return JSON.parse(localStorage.getItem(CART_KEY) || '[]'); } catch { return []; }
}
export function setCart(items) {
    localStorage.setItem(CART_KEY, JSON.stringify(items));
}
export function addToCart(item) {
    const items = getCart();
    const existing = items.find(i => i.id == item.id);
    if (existing) existing.qty = (existing.qty || 1) + (item.qty || 1);
    else items.push(Object.assign({ qty: 1 }, item));
    setCart(items);
    return items;
}
export function removeFromCart(id) {
    const items = getCart().filter(i => i.id != id);
    setCart(items);
    return items;
}
export function clearCart() {
    localStorage.removeItem(CART_KEY);
}
export function getCartCount() {
    return getCart().reduce((s, i) => s + (i.qty || 0), 0);
}