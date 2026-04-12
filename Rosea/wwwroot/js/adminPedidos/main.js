//const API = "/api/pedidos";

const API = "/api/pedidos"; // cambia puerto

//const API = "http://localhost:5223/api/pedidos"; // cambia puerto

async function cargar() {

    const res = await fetch(API);

    const pedidos = await res.json();


    const rows = pedidos.map(p => `

<tr>

<td>${p.pedidoCodigo}</td>

<td>
${p.nombre} ${p.apellidos ?? ""} 
<br>
${p.direccion ?? ""} ${p.codigoPostal ?? ""}
<br>
${p.comentarios ?? ""}
</td>

<td>${p.telefono}</td>
<td>${p.creationDate}</td>

<td>

<select data-id="${p.idPedido}" class="status">

<option ${p.pedidoStatus === "Nuevo" ? "selected" : ""}>Nuevo</option>
<option ${p.pedidoStatus === "Aceptado" ? "selected" : ""}>Aceptado</option>
<option ${p.pedidoStatus === "Rechazado" ? "selected" : ""}>Rechazado</option>
<option ${p.pedidoStatus === "En progreso" ? "selected" : ""}>En progreso</option>
<option ${p.pedidoStatus === "Completado" ? "selected" : ""}>Completado</option>

</select>

</td>

<td>

<button class="btn btn-sm btn-outline-rose ver-productos"
data-id="${p.idPedido}">
Ver
</button>

</td>

</tr>

`).join("");

//    const rows = pedidos.map(p => `

//<tr>

//<td>${p.pedidoCodigo}</td>

//<td>${p.nombre}  ${p.apellidos ?? ""} ${p.direccion ?? ""}  ${p.codigoPostal ?? ""}  ${p.Comentarios ?? ""} </td>

//<td>${p.telefono}</td>

//<td>

//<select data-id="${p.id}" class="status">

//<option>Nuevo</option>
//<option>Aceptado</option>
//<option>Rechazado</option>
//<option>En progreso</option>
//<option>Completado</option>

//</select>

//</td>

//</tr>

//`).join("");

    document.querySelector("#tablaPedidos tbody").innerHTML = rows;

}

cargar();


document.addEventListener("change", async e => {

    if (!e.target.classList.contains("status")) return;

    const id = e.target.dataset.id;
    const status = e.target.value;

    await fetch(`${API}/status/${id}`, {

        method: "PUT",

        headers: {
            "Content-Type": "application/json"
        },

        body: JSON.stringify(status)

    });

});


document.addEventListener("click", async e => {

    if (!e.target.classList.contains("ver-productos")) return;

    const id = e.target.dataset.id;

    const res = await fetch(`${API}/${id}/productos`);

    const productos = await res.json();

    const rows = productos.map(p => `

<tr>

<td>${p.nombre}</td>

<td>${p.descripcion}</td>

<td>${p.precio}</td>

<td>${p.cantidad}</td>

</tr>

`).join("");

    document.querySelector("#tablaProductos tbody").innerHTML = rows;

    const modal = new bootstrap.Modal(document.getElementById("modalProductos"));

    modal.show();

});