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
        return;
    }
    // fallback
    console.log("Toast:", mensaje);
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

// 🌸 Cargar productos
async function cargarProductos() {
    const productos = await api.listarProductos();
    ui.renderTabla(productos);
    storage.guardarCache(productos);
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

    const imagenInput = document.getElementById("imagen");
    const previewImage = document.getElementById("previewImage");
    const editImagenInput = document.getElementById("editImagen");
    const editPreviewImage = document.getElementById("editPreviewImage");
    const editImagenData = document.getElementById("editImagenData");

    // Ensure each preview has a stable placeholder stored in dataset.placeholder
    const defaultPlaceholder = previewImage?.src || "data:image/svg+xml;charset=UTF-8,%3Csvg%20xmlns='http://www.w3.org/2000/svg'%20width='120'%20height='90'%20viewBox='0%200%20120%2090'%3E%3Crect%20width='120'%20height='90'%20fill='%23f8f9fa'/%3E%3Ctext%20x='50%25'%20y='50%25'%20dominant-baseline='middle'%20text-anchor='middle'%20fill='%23adb5bd'%20font-size='10'%3ENo%20image%3C/text%3E%3C/svg%3E";
    if (previewImage && !previewImage.dataset.placeholder) previewImage.dataset.placeholder = previewImage.src || defaultPlaceholder;
    if (editPreviewImage && !editPreviewImage.dataset.placeholder) editPreviewImage.dataset.placeholder = editPreviewImage.src || defaultPlaceholder;

    // live preview for add image
    if (imagenInput && previewImage) {
        imagenInput.addEventListener("change", async () => {
            const file = imagenInput.files[0];
            if (!file) {
                previewImage.src = previewImage.dataset.placeholder || previewImage.src;
                return;
            }
            try {
                const dataUrl = await readFileAsDataURL(file);
                previewImage.src = dataUrl;
            } catch (err) {
                console.error("Failed reading image file:", err);
            }
        });
    }

    // live preview for edit image
    if (editImagenInput && editPreviewImage) {
        editImagenInput.addEventListener("change", async () => {
            const file = editImagenInput.files[0];
            if (!file) {
                // if user cleared selection, restore the previously stored image data or placeholder
                const stored = editImagenData?.value;
                editPreviewImage.src = normalizeImageSrc(stored, editPreviewImage.dataset.placeholder || defaultPlaceholder);
                return;
            }
            try {
                const dataUrl = await readFileAsDataURL(file);
                editPreviewImage.src = dataUrl;
            } catch (err) {
                console.error("Failed reading edit image file:", err);
            }
        });
    }

    // 💗 Guardar producto
    if (btnGuardar) {
        btnGuardar.addEventListener("click", async () => {
            const producto = {
                nombre: document.getElementById("nombre").value,
                descripcion: document.getElementById("descripcion").value,
                precio: parseFloat(document.getElementById("precio").value)
            };

            // include image as base64 data URL if user provided one
            const file = imagenInput?.files?.[0];
            if (file) {
                try {
                    producto.imagen = await readFileAsDataURL(file);
                } catch (err) {
                    console.error("Error reading image:", err);
                    producto.imagen = null;
                }
            } else {
                producto.imagen = null; // API will use default or null
            }

            await api.crearProducto(producto);

            mostrarToast("Producto agregado correctamente 🌸");
            ui.limpiarFormulario();
            cargarProductos();
        });
    }

    // 🔍 Buscar
    if (btnBuscar) {
        btnBuscar.addEventListener("click", async () => {
            const texto = document.getElementById("txtBuscar").value;
            const productos = await api.buscarProducto(texto);
            ui.renderTabla(productos);
        });
    }

    // Cancel editing
    if (btnCancelarEdit) {
        btnCancelarEdit.addEventListener("click", () => {
            document.getElementById("editId").value = "";
            document.getElementById("editNombre").value = "";
            document.getElementById("editDescripcion").value = "";
            document.getElementById("editPrecio").value = "";
            if (editImagenInput) editImagenInput.value = "";
            if (editImagenData) editImagenData.value = "";
            if (editPreviewImage) editPreviewImage.src = editPreviewImage.dataset.placeholder || editPreviewImage.src;
            panelEditar.classList.add("d-none");
            panelAgregar.classList.remove("d-none");
        });
    }

    // 💗 Actualizar producto desde left panel
    if (btnActualizar) {
        btnActualizar.addEventListener("click", async () => {

            const id = document.getElementById("editId").value;

            const producto = {
                nombre: document.getElementById("editNombre").value,
                descripcion: document.getElementById("editDescripcion").value,
                precio: parseFloat(document.getElementById("editPrecio").value)
            };

            // If user selected a new file, read it; otherwise send existing image data stored in editImagenData.
            const newFile = editImagenInput?.files?.[0];
            if (newFile) {
                try {
                    producto.imagen = await readFileAsDataURL(newFile);
                } catch (err) {
                    console.error("Error reading new image:", err);
                    producto.imagen = editImagenData?.value || null;
                }
            } else {
                producto.imagen = editImagenData?.value || null;
            }

            await api.actualizarProducto(id, producto);

            // switch back to add panel and clear edit fields
            document.getElementById("editId").value = "";
            document.getElementById("editNombre").value = "";
            document.getElementById("editDescripcion").value = "";
            document.getElementById("editPrecio").value = "";
            if (editImagenInput) editImagenInput.value = "";
            if (editImagenData) editImagenData.value = "";

            panelEditar.classList.add("d-none");
            panelAgregar.classList.remove("d-none");

            mostrarToast("Producto actualizado correctamente ✏️💗");
            cargarProductos();
        });
    }

    // 🌷 Delegación de eventos en tabla (editar / eliminar)
    const tbody = document.querySelector("#tablaProductos tbody");
    if (tbody) {
        tbody.addEventListener("click", async (e) => {

            // ✏️ Editar
            if (e.target.classList.contains("editar")) {

                const id = e.target.dataset.id;
                const productos = storage.obtenerCache();
                const p = productos.find(x => x.id == id);
                if (!p) return;

                // populate left edit panel
                document.getElementById("editId").value = p.id;
                document.getElementById("editNombre").value = p.nombre;
                document.getElementById("editDescripcion").value = p.descripcion;
                document.getElementById("editPrecio").value = p.precio;

                // set existing image data so update can reuse it if user doesn't upload a new one
                if (editImagenData) editImagenData.value = p.imagen || "";

                // Normalize and set preview src (fallback to dataset.placeholder)
                if (editPreviewImage) {
                    editPreviewImage.src = normalizeImageSrc(p.imagen, editPreviewImage.dataset.placeholder || defaultPlaceholder);
                }

                // clear any selected file
                if (editImagenInput) editImagenInput.value = "";

                // show edit panel, hide add panel
                panelAgregar.classList.add("d-none");
                panelEditar.classList.remove("d-none");
                // focus first field
                document.getElementById("editNombre").focus();
            }

            // 🗑️ Eliminar (open confirm modal only if present)
            if (e.target.classList.contains("eliminar")) {

                productoAEliminar = e.target.dataset.id;

                const modalEl = document.getElementById('modalConfirmar');
                if (modalEl) {
                    // Bootstrap 5.3: getOrCreateInstance is safe; fall back when not available
                    const modal = (bootstrap.Modal.getOrCreateInstance)
                        ? bootstrap.Modal.getOrCreateInstance(modalEl)
                        : new bootstrap.Modal(modalEl);
                    modal.show();
                }
            }
        });
    }

    // Confirm delete button handler
    const btnConfirmarEliminar = document.getElementById("btnConfirmarEliminar");
    if (btnConfirmarEliminar) {
        btnConfirmarEliminar.addEventListener("click", async () => {

            if (!productoAEliminar) return;

            // Capture the id now so the timeout callback doesn't see a later mutation.
            const idToDelete = productoAEliminar;

            const fila = document.querySelector(`[data-id="${idToDelete}"]`)?.closest("tr");
            if (fila) fila.classList.add("fade-out");

            setTimeout(async () => {
                try {
                    await api.eliminarProducto(idToDelete);
                } catch (err) {
                    console.error("Failed to delete product:", err);
                }

                const modalElement = document.getElementById('modalConfirmar');
                // Safe modal hide: check element and instance exist.
                if (modalElement) {
                    const modal = (bootstrap.Modal.getInstance)
                        ? bootstrap.Modal.getInstance(modalElement)
                        : null;
                    if (modal && typeof modal.hide === "function") modal.hide();
                }

                mostrarToast("Producto eliminado correctamente 🗑️💗");
                cargarProductos();

                // Clear the shared variable after deletion to avoid races.
                productoAEliminar = null;

            }, 300);

            // Optionally keep this here if you prefer immediate clearing:
            // productoAEliminar = null;
        });
    }
});

