using Microsoft.AspNetCore.Mvc;

namespace Rosea.wwwroot.js
{
    public class carrito : Controller
    {
        public IActionResult Index()
        {
            return View();
        }

        function obtenerCarrito() {
            return JSON.parse(localStorage.getItem("carrito")) || [];
        }

        function guardarCarrito(carrito) {
            localStorage.setItem("carrito", JSON.stringify(carrito));
            actualizarContador();
        }

        function agregarProducto(producto) {

            let carrito = obtenerCarrito();

            const existente = carrito.find(p => p.id === producto.id);

            if (existente) {
                existente.cantidad += producto.cantidad;
            }
            else {
                carrito.push(producto);
            }

            guardarCarrito(carrito);

            mostrarNotificacion("🛒 Producto agregado");

        }

        function actualizarContador() {

            const carrito = obtenerCarrito();

            let total = carrito.reduce((s, p) => s + p.cantidad, 0);

            const contador = document.getElementById("contadorCarrito");

            if (contador) {
                contador.innerText = total;
            }

        }

        document.addEventListener("DOMContentLoaded", actualizarContador);
    }
}
