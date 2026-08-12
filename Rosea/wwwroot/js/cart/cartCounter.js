import { getCartCount } from "../storage.js";

export function actualizarContadorCarrito() {

    const contador = document.getElementById("contadorCarrito");

    if (!contador) return;

    const total = getCartCount();

    contador.textContent = total;
}

document.addEventListener("DOMContentLoaded", () => {
    actualizarContadorCarrito();
});