import { getCart, clearCart } from "../storage.js";

//const API = "/api/pedidos";

const API = "http://localhost:5223/api/pedidos"; // cambia puerto

document.getElementById("formPedido")
    .addEventListener("submit", async e => {

        e.preventDefault();

        const form = e.target;

        const data = new FormData(form);

        const items = getCart();

        if (items.length === 0) {
            alert("El carrito está vacío");
            return;
        }

        const payload = {

            nombre: data.get("nombre"),
            apellidos: data.get("apellidos"),
            telefono: data.get("telefono"),
            direccion: data.get("direccion"),
            codigoPostal: data.get("cp"),
            comentarios: data.get("comentarios"),

            items: items.map(p => ({
                productoId: p.id,
                nombre: p.nombre,
                precio: p.precio,
                cantidad: p.qty
            }))

        };

        const res = await fetch(API, {

            method: "POST",

            headers: {
                "Content-Type": "application/json"
            },

            body: JSON.stringify(payload)
        });

        const result = await res.json();

        clearCart();

        alert("Pedido generado #" + result.pedidoId);

        window.location.href = "/Pedido/Confirmacion?id=" + result.pedidoId;

    });