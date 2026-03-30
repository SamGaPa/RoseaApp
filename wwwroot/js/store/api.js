//const API_URL = "https://localhost:7092/api/productos"; // cambia puerto
//const API_URL = "http://host.docker.internal:5223/api/productos"; // cambia puerto
//const API_URL = "http://host.docker.internal:7092/api/productos"; // cambia puerto
const API_URL = "http://localhost:5223/api/productos"; // cambia puerto
export async function listarProductos() {
    const res = await fetch(API_URL + "/listar");
    return await res.json();
}

export async function crearProducto(producto) {
    return await fetch(API_URL + "/crear", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(producto)
    });
}

export async function actualizarProducto(id, producto) {
    return await fetch(API_URL + `/actualizar/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(producto)
    });
}

export async function eliminarProducto(id) {
    return await fetch(API_URL + `/eliminar/${id}`, {
        method: "DELETE"
    });
}

export async function buscarProducto(texto) {

    if (texto == null || texto === "") {
        // Variable is null OR an empty string
        const res = await fetch(API_URL + "/listar");
        return await res.json();
    }
    else {
        const res = await fetch(API_URL + `/buscar?texto=${texto}`);
        return await res.json();

    }
  
}
