export function guardarCache(productos) {
    localStorage.setItem("productos", JSON.stringify(productos));
}

export function obtenerCache() {
    return JSON.parse(localStorage.getItem("productos")) || [];
}
