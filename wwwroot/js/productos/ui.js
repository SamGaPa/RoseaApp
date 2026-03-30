// Small utility to avoid XSS when injecting strings into innerHTML
function escapeHtml(str) {
    return String(str)
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#039;");
}

// placeholder SVG data URL (used when no image exists)
const placeholderSvg = `<svg xmlns="http://www.w3.org/2000/svg" width="120" height="90" viewBox="0 0 120 90">
  <rect width="120" height="90" fill="#f8f9fa"/>
  <text x="50%" y="50%" dominant-baseline="middle" text-anchor="middle" fill="#adb5bd" font-size="10">No image</text>
</svg>`;
const PLACEHOLDER = "data:image/svg+xml;charset=UTF-8," + encodeURIComponent(placeholderSvg);

// Lightweight UI helpers for productos
// Exports used by main.js: renderTabla, limpiarFormulario

function isLikelyBase64(str) {
    if (typeof str !== 'string') return false;
    // Remove whitespace/newlines which can appear in Base64 blocks
    const s = str.replace(/\s+/g, '');
    // Basic Base64 validation: chars + optional up-to-two paddings, length multiple-of-4
    return /^[A-Za-z0-9+/]+={0,2}$/.test(s) && (s.length % 4 === 0);
}

export function renderTabla(productos = []) {
    const tbody = document.querySelector("#tablaProductos tbody");
    if (!tbody) return; // defensive: avoid crashing when table isn't present

    // Simple rendering: expect productos to be an array of objects with id, nombre, descripcion, precio, imagen
    tbody.innerHTML = productos.map(p => {
        const safePrecio = (p.precio !== undefined && p.precio !== null) ? Number(p.precio).toFixed(2) : "";

        // Build an appropriate image src:
        // - if the server already returned a data URI (starts with "data:") use it
        // - if it's a raw Base64 payload, prepend a safe default mime (image/png)
        // - if it's an absolute or relative URL, use it
        // - otherwise use placeholder
        let imgSrc = PLACEHOLDER;
        if (p.imagen) {
            const val = String(p.imagen).trim();
            if (val.startsWith("data:")) {
                imgSrc = val;
            } else if (isLikelyBase64(val)) {
                // default to PNG if no mime available; strip whitespace/newlines just in case
                imgSrc = "data:image/png;base64," + val.replace(/\s+/g, "");
            } else if (/^https?:\/\//i.test(val) || val.startsWith("/")) {
                imgSrc = val;
            } else {
                // Unknown format - fallback to placeholder
                imgSrc = PLACEHOLDER;
            }
        }

        // Only escape user-visible text; do not escape src (it would break data URIs).
        const safeName = escapeHtml(p.nombre ?? "");
        const safeDesc = escapeHtml(p.descripcion ?? "");

        return `
            <tr data-id="${p.id ?? ""}">
                <td style="width:80px;">
                    <img src="${imgSrc}" alt="${safeName}" class="img-thumbnail" style="width:64px;height:48px;object-fit:cover;" />
                </td>
				<td>
					<strong class="text-rose">${safeName}</strong>
					<div class="small text-muted">${safeDesc}</div>
				</td>
                <td class="fw-bold text-rose">${safePrecio}</td>
                <td>
                    <button class="btn btn-sm btn-outline-rose editar me-2" data-id="${p.id ?? ""}"> ✏️</button>
                    <button class="btn btn-sm btn-rose eliminar" data-id="${p.id ?? ""}">🗑️</button>
                </td>
            </tr>
        `;
    }).join("");
}

export function limpiarFormulario() {
    // Add form fields (add panel)
    const nombre = document.getElementById("nombre");
    const descripcion = document.getElementById("descripcion");
    const precio = document.getElementById("precio");
    const imagen = document.getElementById("imagen");
    const preview = document.getElementById("previewImage");

    if (nombre) nombre.value = "";
    if (descripcion) descripcion.value = "";
    if (precio) precio.value = "";
    if (imagen) imagen.value = "";
    if (preview) preview.src = PLACEHOLDER;

    // Edit panel fields (left edit panel)
    const editId = document.getElementById("editId");
    const editNombre = document.getElementById("editNombre");
    const editDescripcion = document.getElementById("editDescripcion");
    const editPrecio = document.getElementById("editPrecio");
    const editImagen = document.getElementById("editImagen");
    const editPreview = document.getElementById("editPreviewImage");
    const editImagenData = document.getElementById("editImagenData");

    if (editId) editId.value = "";
    if (editNombre) editNombre.value = "";
    if (editDescripcion) editDescripcion.value = "";
    if (editPrecio) editPrecio.value = "";
    if (editImagen) editImagen.value = "";
    if (editPreview) editPreview.src = PLACEHOLDER;
    if (editImagenData) editImagenData.value = "";

    // Restore panels: show add panel, hide edit panel (if present)
    const panelAgregar = document.getElementById("panelAgregar");
    const panelEditar = document.getElementById("panelEditar");
    if (panelAgregar) panelAgregar.classList.remove("d-none");
    if (panelEditar) panelEditar.classList.add("d-none");
}

