import * as api from "./api.js";
import * as ui from "./ui.js";
import * as storage from "./storage.js";

let productoAEliminar = null;
// 🌷 Mostrar Toast
function mostrarToast(mensaje) {
    const toastElement = document.getElementById('roseToast');
    if (toastElement) {
        const body = toastElement.querySelector('.toast-body');
        if (body) body.textContent = mensaje;
        const toast = new bootstrap.Toast(toastElement);
        toast.show();
    } else {
        // fallback
        console.log("Toast:", mensaje);
    }
}



// helper: read File as data URL (base64) -> returns Promise<string>
function readFileAsDataURL(file) {
    return new Promise((resolve, reject) => {
        if (!file) { resolve(null); return; }
        const fr = new FileReader();
        fr.onload = () => resolve(fr.result);
        fr.onerror = reject;
        fr.readAsDataURL(file);
    });
}

// Normalize image value returned from server or local storage into a usable img.src
function isLikelyBase64(str) {
    if (typeof str !== 'string') return false;
    const s = str.replace(/\s+/g, '');
    return /^[A-Za-z0-9+/]+={0,2}$/.test(s) && (s.length % 4 === 0);
}
function normalizeImageSrc(val, defaultPlaceholder) {
    if (!val) return defaultPlaceholder;
    const v = String(val).trim();
    if (v.startsWith("data:")) return v;
    if (isLikelyBase64(v)) return "data:image/png;base64," + v.replace(/\s+/g, "");
    if (/^https?:\/\//i.test(v) || v.startsWith("/")) return v;
    return defaultPlaceholder;
}

// 🌿 Cargar productos
async function cargarProductos() {
    const productos = await api.listarProductos();
    ui.renderCarousel(productos);
    ui.renderGrid(productos);
    storage.guardarCache(productos);

    // Ensure Bootstrap carousel instance is created (so controls work reliably)
    const carouselEl = document.querySelector('#storeCarousel');
    if (carouselEl) {
        // Keep autoplay off by default; allow manual navigation
        bootstrap.Carousel.getOrCreateInstance(carouselEl, { interval: 5000, pause: "hover" });
    }
}

document.addEventListener("DOMContentLoaded", function () {
    cargarProductos();

    // Guard references
    const panelAgregar = document.getElementById("panelAgregar");
    const panelEditar = document.getElementById("panelEditar");

    const btnGuardar = document.getElementById("btnGuardar");
    const btnActualizar = document.getElementById("btnActualizar");
    const btnCancelarEdit = document.getElementById("btnCancelarEdit");
    const btnBuscar = document.getElementById("btnBuscar");

    // 🔍 Buscar
    if (btnBuscar) {
        btnBuscar.addEventListener("click", async () => {
            const texto = document.getElementById("txtBuscar").value;
            const productos = await api.buscarProducto(texto);
            ui.renderCarousel(productos);
            ui.renderGrid(productos);

            const carouselEl = document.querySelector('#storeCarousel');
            if (carouselEl) bootstrap.Carousel.getOrCreateInstance(carouselEl, { interval: 5000, pause: "hover" });
        });
    }

    function onProductContainerClick(e, container) {
        const target = e.target;

        // cantidad controls
        if (target.classList.contains("btn-cantidad")) {
            const action = target.dataset.action;
            const id = target.dataset.id;
            // search input across the provided container for the product
            const input = container.querySelector(`.cantidad-input[data-id="${id}"]`);
            if (!input) return;
            let val = parseInt(input.value || "1", 10);
            if (isNaN(val)) val = 1;
            if (action === "dec") val = Math.max(1, val - 1);
            else if (action === "inc") val = val + 1;
            input.value = val;
        }

        // agregar al carrito (placeholder behavior)
        if (target.classList.contains("agregar")) {
            const id = target.dataset.id;
            const cantidad = container.querySelector(`.cantidad-input[data-id="${id}"]`)?.value || "1";
            mostrarToast(`Agregado ${cantidad} unidad(es) al carrito (id: ${id})`);
            // TODO: wire real cart add via storage/api
        }

      
    }

    // Attach listeners to both containers
    const carouselContainer = document.getElementById("CarrouselProductos");
    const gridContainer = document.getElementById("GridProductos");

    if (carouselContainer) carouselContainer.addEventListener("click", (e) => onProductContainerClick(e, carouselContainer));
    if (gridContainer) gridContainer.addEventListener("click", (e) => onProductContainerClick(e, gridContainer));

});

