import apiClient from "./apiClient";
export function crearPedido(pedido) {
    return apiClient("/pedidos", {
        method: "POST",
        body: JSON.stringify(pedido)
    });
}



// export async function crearPedido(pedido) {
//     return apiClient("/pedidos", {
//         method: "POST",
//         body: JSON.stringify(pedido)
//     });
// }