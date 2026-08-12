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

// Render a responsive carousel that shows 3 items per slide (md+).
// Strategy: group products into chunks of 3 and render each chunk as one carousel-item
// with a row of up to 3 columns (col-12 on xs -> stacks, col-md-4 for three-wide).
export function renderCarousel(productos = []) {
    const container = document.getElementById("CarrouselProductos");
    if (!container) return;

    if (!Array.isArray(productos)) productos = [];

    // Empty state
    if (productos.length === 0) {
        container.innerHTML = `<div class="text-center py-5 text-muted">No hay productos para mostrar.</div>`;
        return;
    }

    const perSlide = 3;
    const slides = [];
    for (let i = 0; i < productos.length; i += perSlide) {
        slides.push(productos.slice(i, i + perSlide));
    }

    const slidesHtml = slides.map((group, slideIdx) => {
        const cols = group.map((p) => {
            const safeNombre = escapeHtml(p.nombre ?? "");
            const safeDescripcion = escapeHtml(p.descripcion ?? "");
            const safePrecio = (p.precio !== undefined && p.precio !== null) ? Number(p.precio).toFixed(2) : "";


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


            return `
                <div class="col-12 col-md-4 mb-3 mb-md-0">
                    <div class="card h-100 border-0 shadow-sm">
                        <div class="card-body d-flex flex-column">
                            <h6 class="card-title text-rose fw-bold mb-2">${safeNombre}</h6>
                            <p class="card-text small text-muted mb-2 flex-grow-1">${safeDescripcion}</p>
                            <div class="d-flex align-items-center justify-content-between">
                                <div class="fw-bold text-rose">${safePrecio}</div>
                                <div class="fw-bold text-rose"><img src="${imgSrc}" alt="${safeNombre}" class="img-thumbnail" style="width:128px;height:96px;object-fit:cover;" /></div>                                 
                                <div class="d-flex align-items-center gap-2">
                                    <button class="btn btn-sm btn-outline-rose agregar"
                                            data-id="${p.id}"
                                            data-nombre="${safeNombre}"
                                            data-precio="${safePrecio}"
                                            data-imagen="${imgSrc}">
                                        🛒
                                    </button>
                                    <div class="input-group input-group-sm cantidad-control" style="width:110px;">
                                        <button class="btn btn-outline-secondary btn-cantidad" data-action="dec" data-id="${p.id}">−</button>
                                        <input class="form-control text-center cantidad-input" type="text" value="1" data-id="${p.id}" />
                                        <button class="btn btn-outline-secondary btn-cantidad" data-action="inc" data-id="${p.id}">+</button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            `;
        }).join("");

        // If last group has fewer than perSlide, add empty columns so layout keeps spacing
        const missing = perSlide - group.length;
        const emptyCols = missing > 0 ? Array.from({ length: missing }).map(() => `<div class="col-12 col-md-4"></div>`).join('') : '';

        return `
            <div class="carousel-item${slideIdx === 0 ? " active" : ""}">
                <div class="row gx-3">
                    ${cols}
                    ${emptyCols}
                </div>
            </div>
        `;
    }).join("");

    // Controls use visible circular buttons so prev/next are obvious.
    container.innerHTML = `
        <div id="storeCarousel" class="carousel slide" data-bs-ride="carousel">
            <div class="carousel-inner">
                ${slidesHtml}
            </div>

            <button class="carousel-control-prev" type="button" data-bs-target="#storeCarousel" data-bs-slide="prev" aria-label="Previous slide">
                <span aria-hidden="true" class="fw-bold" style="font-size:1.25rem;">‹</span>
            </button>

            <button class="carousel-control-next" type="button" data-bs-target="#storeCarousel" data-bs-slide="next" aria-label="Next slide">
                <span aria-hidden="true" class="fw-bold" style="font-size:1.25rem;">›</span>
            </button>

            <div class="carousel-indicators mt-3">
                ${slides.map((_, i) => `<button type="button" data-bs-target="#storeCarousel" data-bs-slide-to="${i}" ${i === 0 ? 'class="active" aria-current="true"' : ''} aria-label="Slide ${i + 1}"></button>`).join('')}
            </div>
        </div>
    `;
}

// Render a grid with 4 cards per row (responsive).
// Uses Bootstrap classes: col-12 on xs, col-sm-6 (2 per row on small), col-md-3 (4 per row on md+).
export function renderGrid(productos = []) {
    const container = document.getElementById("GridProductos");
    if (!container) return;

    if (!Array.isArray(productos)) productos = [];

    if (productos.length === 0) {
        container.innerHTML = `<div class="col-12 text-center py-4 text-muted">No hay productos para mostrar.</div>`;
        return;
    }

    const cards = productos.map(p => {
        const safeNombre = escapeHtml(p.nombre ?? "");
        const safeDescripcion = escapeHtml(p.descripcion ?? "");
        const safePrecio = (p.precio !== undefined && p.precio !== null) ? Number(p.precio).toFixed(2) : "";

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



        return `
<div class="col-12 col-sm-6 col-md-3">
    <div class="card h-100 border-0 shadow-sm">
        <div class="card-body d-flex flex-column">

            <h6 class="card-title text-rose fw-bold mb-2">${safeNombre}</h6>

            <p class="card-text small text-muted mb-2">
                ${safeDescripcion}
            </p>

            <!-- IMAGEN DEL PRODUCTO -->
            <div class="text-center mb-2">
                <img src="${imgSrc}" 
                     alt="${safeNombre}" 
                     class="img-fluid img-thumbnail producto-img"  style="width:512px;height:384px;object-fit:cover;"/>
            </div>

            <!-- PRECIO Y CONTROLES -->
            <div class="d-flex align-items-center justify-content-between mt-2">

                <div class="fw-bold text-rose">
                    ${safePrecio}
                </div>

                <div class="d-flex align-items-center gap-2">

                    <button class="btn btn-sm btn-outline-rose agregar" data-id="${p.id}">
                        🛒
                    </button>

                    <div class="input-group input-group-sm cantidad-control" style="width:110px;">
                        <button class="btn btn-outline-secondary btn-cantidad" data-action="dec" data-id="${p.id}">−</button>
                        <input class="form-control text-center cantidad-input" type="text" value="1" data-id="${p.id}" />
                        <button class="btn btn-outline-secondary btn-cantidad" data-action="inc" data-id="${p.id}">+</button>
                    </div>

                </div>

            </div>

        </div>
    </div>
</div>
        `;
    }).join("");

    container.innerHTML = cards;
}

// keep existing name for other parts if needed
export function limpiarFormulario() {
    // Add form fields (add panel)
    const nombre = document.getElementById("nombre");
    const descripcion = document.getElementById("descripcion");
    const precio = document.getElementById("precio");

    if (nombre) nombre.value = "";
    if (descripcion) descripcion.value = "";
    if (precio) precio.value = "";

    // Edit panel fields (left edit panel)
    const editId = document.getElementById("editId");
    const editNombre = document.getElementById("editNombre");
    const editDescripcion = document.getElementById("editDescripcion");
    const editPrecio = document.getElementById("editPrecio");

    if (editId) editId.value = "";
    if (editNombre) editNombre.value = "";
    if (editDescripcion) editDescripcion.value = "";
    if (editPrecio) editPrecio.value = "";

    // Restore panels: show add panel, hide edit panel (if present)
    const panelAgregar = document.getElementById("panelAgregar");
    const panelEditar = document.getElementById("panelEditar");
    if (panelAgregar) panelAgregar.classList.remove("d-none");
    if (panelEditar) panelEditar.classList.add("d-none");
}

