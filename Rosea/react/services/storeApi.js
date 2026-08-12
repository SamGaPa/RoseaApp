import apiClient from "./apiClient";

export function obtenerProductos() {
    return apiClient("/productos");
}

export function buscarProductos(texto) {
    return apiClient(
        `/productos/buscar?texto=${encodeURIComponent(texto)
        }`
    );
}

// export async function obtenerProductos() {
//     return await apiClient("/productos/listar");
// }

// export async function buscarProductos(texto) {
//     const textoSeguro = encodeURIComponent(texto.trim());

//     return await apiClient(
//         `/Productos/buscar?texto=${textoSeguro}`
//     );
// }