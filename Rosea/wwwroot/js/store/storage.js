export function guardarCache(productos) {
    localStorage.setItem("productos", JSON.stringify(productos));
}

export function obtenerCache() {
    return JSON.parse(localStorage.getItem("productos")) || [];
}
export function addToCart(producto) {

    const cart = getCart();

    const existente = cart.find(p => p.id == producto.id);

    if (existente) {
        existente.qty++;
    }
    else {
        cart.push(producto);
    }

    localStorage.setItem("cart", JSON.stringify(cart));
}