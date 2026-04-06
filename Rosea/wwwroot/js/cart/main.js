import { getCart, removeFromCart, clearCart } from "../storage.js";
import { renderCart } from "./ui.js";
import { actualizarContadorCarrito } from "./cartCounter.js";

document.addEventListener("DOMContentLoaded", () => {

    renderCart();

    document.getElementById("btnClearCart")
        ?.addEventListener("click", () => {

            clearCart();
            renderCart();
            actualizarContadorCarrito();
        });

});


document.addEventListener("click", e => {

    if (e.target.classList.contains("remove-item")) {

        const id = e.target.dataset.id;

        removeFromCart(id);

        renderCart();

        actualizarContadorCarrito();
    }

});