// Store page glue: renders carousel, filters, and uses storage/cart functions.
// Assumes you already have an `api.js` exporting `listarProductos` and optional `advancedSearch`.
// Uses ui.js if you have helpers to render product lists; otherwise this file renders carousel items.

import * as api from './api.js';
import * as ui from './ui.js';
import { getCart, addToCart, removeFromCart, getCartCount, setCart } from './storage.js';
ui.showToast?.("🛒 Producto agregado al carrito");

const carouselInner = document.getElementById('carouselInner');
const carouselIndicators = document.getElementById('carouselIndicators');

const btnFiltrar = document.getElementById('btnFiltrar');
const filtroCategoria = document.getElementById('filtroCategoria');
const filtroNombre = document.getElementById('filtroNombre');
const filtroDescripcion = document.getElementById('filtroDescripcion');

const cartList = document.getElementById('cartList');
const cartCount = document.getElementById('cartCount');
const cartEmpty = document.getElementById('cartEmpty');
const btnConfirmar = document.getElementById('btnConfirmarPedido');

document.addEventListener('DOMContentLoaded', () => {
    loadProducts();
    renderCartUI();
    if (btnFiltrar) btnFiltrar.addEventListener('click', applyFilters);
    if (btnConfirmar) btnConfirmar.addEventListener('click', confirmPedido);
});

// Try to use api.advancedSearch/listarProductos if available.
// If not present, fall back to fetch('/api/productos') or fetch('/api/productos/advanced-search').
async function loadProducts(filters) {
    let products = [];
    try {
        if (filters && (filters.categoria || filters.nombre || filters.descripcion)) {
            if (typeof api.advancedSearch === 'function') {
                products = await api.advancedSearch(filters);
            } else {
                const res = await fetch('/api/productos/advanced-search', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(filters)
                });
                products = res.ok ? await res.json() : [];
            }
        } else {
            if (typeof api.listarProductos === 'function') {
                products = await api.listarProductos();
            } else {
                const res = await fetch('/api/productos');
                products = res.ok ? await res.json() : [];
            }
        }
    } catch (e) {
        console.error('Failed to load products', e);
    }

    renderCarousel(products || []);
}



function renderCarousel(products) {
    if (!carouselInner) return;

    carouselInner.innerHTML = '';
    if (carouselIndicators) carouselIndicators.innerHTML = '';

    if (!products || products.length === 0) {
        carouselInner.innerHTML = '<div class="p-5 text-center">No products found.</div>';
        return;
    }

    products.forEach((p, idx) => {
        const item = document.createElement('div');
        item.className = `carousel-item ${idx === 0 ? 'active' : ''}`;
        item.innerHTML = `
            <div class="row gx-3">
                <div class="col-md-4 d-flex align-items-center justify-content-center">
                <img src="${p.imagen}">
                    <img src="${escapeHtml(p.imagen ?? '/img/placeholder.png')}" class="img-fluid" style="max-height:220px;" alt="${escapeHtml(p.nombre ?? '')}"/>
                </div>
                <div class="col-md-8">
                    <h4>${escapeHtml(p.nombre ?? '')}</h4>
                    <p class="text-muted">${escapeHtml(p.descripcion ?? '')}</p>
                    <p><strong>${(p.precio !== undefined && p.precio !== null) ? Number(p.precio).toFixed(2) : ''} USD</strong></p>
                    <p><small class="text-muted">Categoria: ${escapeHtml(p.categoria ?? '')}</small></p>
                    <div>
                        <button class="btn btn-sm btn-outline-primary me-2 add-to-cart" data-id="${p.id}">Agregar</button>
                        <button class="btn btn-sm btn-outline-secondary view-details" data-id="${p.id}">Ver detalles</button>
                    </div>
                </div>
            </div>
        `;
        carouselInner.appendChild(item);

        if (carouselIndicators) {
            const indicator = document.createElement('button');
            indicator.type = 'button';
            indicator.setAttribute('data-bs-target', '#storeCarousel');
            indicator.setAttribute('data-bs-slide-to', String(idx));
            indicator.className = idx === 0 ? 'active' : '';
            indicator.setAttribute('aria-label', `Slide ${idx + 1}`);
            carouselIndicators.appendChild(indicator);
        }
    });

    // wire up buttons
    document.querySelectorAll('.add-to-cart').forEach(btn => {
        btn.addEventListener('click', (e) => {
            const id = e.currentTarget.getAttribute('data-id');
            const slide = e.currentTarget.closest('.carousel-item');
            const nombre = slide.querySelector('h4')?.textContent || '';
            const precioText = slide.querySelector('strong')?.textContent || '';
            const precio = parseFloat(precioText) || 0;
            const img = slide.querySelector("img")?.src || "";

            addToCart({ id, nombre, precio, img, const img = slide.querySelector("img")?.src || "";

addToCart({
    id,
    nombre,
    precio,
    img,
    qty:1
}); });
            renderCartUI();
        });
    });

    document.querySelectorAll('.view-details').forEach(btn => {
        btn.addEventListener('click', (e) => {
            const id = e.currentTarget.getAttribute('data-id');
            location.href = `/Home/Details/${id}`;
        });
    });
}

function applyFilters() {
    const filters = {
        categoria: filtroCategoria?.value.trim(),
        nombre: filtroNombre?.value.trim(),
        descripcion: filtroDescripcion?.value.trim()
    };
    loadProducts(filters);
}

function renderCartUI() {
    if (!cartList || !cartCount || !cartEmpty) return;
    const items = getCart();
    cartCount.textContent = String(items.reduce((s, i) => s + (i.qty || 0), 0));
    if (!items.length) {
        cartEmpty.classList.remove('d-none');
        cartList.classList.add('d-none');
        cartList.innerHTML = '';
        return;
    }
    cartEmpty.classList.add('d-none');
    cartList.classList.remove('d-none');
    cartList.innerHTML = '';
    items.forEach(i => {
        const li = document.createElement('li');
        li.className = 'list-group-item d-flex justify-content-between align-items-center';
        li.innerHTML = `
            <div>
                <div class="fw-bold">${escapeHtml(i.nombre)}</div>
                <div class="small text-muted">${(i.precio || 0).toFixed(2)} USD x ${i.qty}</div>
            </div>
            <div>
                <button class="btn btn-sm btn-outline-danger remove-item" data-id="${i.id}">&times;</button>
            </div>`;
        cartList.appendChild(li);
    });
    cartList.querySelectorAll('.remove-item').forEach(b => b.addEventListener('click', (e) => {
        const id = e.currentTarget.getAttribute('data-id');
        removeFromCart(id);
        renderCartUI();
    }));
}

function confirmPedido() {
    const isAuth = window.__isAuthenticated === true || window.__isAuthenticated === 'true';
    if (!isAuth) {
        const returnUrl = encodeURIComponent('/Store/Confirm');
        location.href = `/Account/Login?returnUrl=${returnUrl}`;
        return;
    }
    location.href = '/Pedido/Confirm';
}

function escapeHtml(str) {
    return String(str || '')
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#039;");
}