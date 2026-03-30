//const API_URL = "https://localhost:7092/api/productos"; // cambia puerto
//
/*const API_URL = "http://host.docker.internal:7092/api/productos"; // cambia puerto*/
const API_URL = "http://localhost:5223/api/productos"; // cambia puerto

//export async function listarProductos() {
//    const res = await fetch(API_URL + "/listar");
//    return await res.json();
//}
export async function listarProductos() {
    const res = await fetch(API_URL+'/listar');

    if (!res.ok)
        throw new Error("Error cargando productos");

    return await res.json();
}

export async function crearProducto(producto) {
    return await fetch(API_URL + "/crear", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(producto)
    });
}
export async function crearProductoPromiseAll(producto) {

    const [crearRes, listaRes] = await Promise.all([

        fetch(API_URL + "/crear", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(producto)
        }),

        fetch(API_URL + "/listar")

    ]);

    const lista = await listaRes.json();

    return {
        crearRespuesta: crearRes,
        productosActualizados: lista
    };
}


export function debounce(func, delay) {

    let timer;

    return function (...args) {

        clearTimeout(timer);

        timer = setTimeout(() => {
            func.apply(this, args);
        }, delay);

    };
}

export const crearProductoDebounce = debounce(async function (producto) {

    console.log("Creando producto con debounce...");

    return await fetch(API_URL + "/crear", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(producto)
    });

}, 500);

export async function crearProductoMedido(producto) {

    console.time("crearProductoTiempo");

    const res = await fetch(API_URL + "/crear", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(producto)
    });

    console.timeEnd("crearProductoTiempo");

    return res;
}

let crearController = null;
export async function crearProductoAbortable(producto) {

    if (crearController) {
        crearController.abort(); // cancela la petición anterior
    }

    crearController = new AbortController();

    try {

        const res = await fetch(API_URL + "/crear", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(producto),
            signal: crearController.signal
        });

        return res;

    } catch (error) {

        if (error.name === "AbortError") {
            console.log("Petición cancelada");
        } else {
            console.error("Error:", error);
        }

    }
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


