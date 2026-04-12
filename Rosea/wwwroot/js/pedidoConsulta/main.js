//const API = "/api/pedidos";
import { renderTabla } from "./ui.js";
//const API = "http://localhost:5223/api/pedidos"; // cambia puerto
const API = "/api/pedidos"; // cambia puerto

document.getElementById("formConsulta")
    .addEventListener("submit", async e => {

        e.preventDefault();

        const data = new FormData(e.target);

        const id = data.get("pedidoId");
        const apellido = data.get("apellido");

        const res = await fetch(`${API}/${id}?apellido=${apellido}`);

        const responseData = await res.json();

        document.getElementById("resultado").innerHTML = `
    <div class="row">
            <h4>Pedido #${responseData.pedido.pedidoCodigo}</h4>
            Estado: ${responseData.pedido.pedidoStatus}
    </div>
    <div class="row">

        <div class="col-md-6 mb-3">
            <label>Nombre: ${responseData.pedido.nombre}</label>
           
        </div>

        <div class="col-md-6 mb-3">
            <label>Apellidos: ${responseData.pedido.apellidos}</label>
        </div>

        <div class="col-md-6 mb-3">
            <label>Telefono: ${responseData.pedido.telefono}</label>
        </div>

        <div class="col-md-6 mb-3">
            <label>Codigo Postal: ${responseData.pedido.codigoPostal}</label>
        </div>

        <div class="col-12 mb-3">
            <label>Direccion: ${responseData.pedido.direccion}</label>
        </div>
        
        <div class="col-12 mb-3">
            <label>Comentarios: ${responseData.pedido.comentarios}</label>

        </div>

     <div id="cartContainer">    
    <div class="producto-card">
        <table class="table align-middle" id="tablaProductos">
            <thead>
                <tr class="text-rose">
                    <th hidden="hidden">ID</th>
                   
                    <th>Nombre</th>
                    <th>Precio</th>
                    <th>Cantidad</th>
                  
                </tr>
            </thead>
            <tbody></tbody>
        </table>
    </div>
</div>

    </div>

`;

        renderTabla(responseData.items);

//        document.getElementById("resultado").innerHTML = `

//<h4>Pedido #${pedido.id}</h4>

//Estado: ${pedido.status}

//`;

    });

