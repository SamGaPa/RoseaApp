using Microsoft.AspNetCore.Mvc;
using MySql.Data.MySqlClient;
using RoseaAPI.Models;
using RoseaAPI.Services;
using System.Data;
using static Org.BouncyCastle.Math.EC.ECCurve;

namespace RoseaAPI.Controllers
{
    [ApiController]
    [Route("api/pedidos")]
    public class PedidosController : ControllerBase
    {

        private readonly IConfiguration _configuration;

        public PedidosController(IConfiguration configuration)
        {
            _configuration = configuration;
        }



        [HttpPost]
        public IActionResult CrearPedido([FromBody] PedidoRequest request)
        {
            var random = new Random();

            string pedidoId = GeneradorID.GenerarID(); // random.Next(10000, 99999);


            string connectionString = _configuration.GetConnectionString("MySqlConnection");

            using var con = new MySqlConnection(connectionString);

            con.Open();

            var tx = con.BeginTransaction();

            try
            {

                var cmd = new MySqlCommand(@"

                    INSERT INTO pedido
                    (Nombre,Apellidos,Telefono,Direccion,CodigoPostal,Comentarios,Status,CreationDate,CodigoPedido)
                    VALUES
                    (@Nombre,@Apellidos,@Telefono,@Direccion,@CP,@Comentarios,'Nuevo',NOW(),@Codigo);
                    SELECT LAST_INSERT_ID();
                ", con, tx);

                cmd.Parameters.AddWithValue("@Nombre", request.Nombre);
                cmd.Parameters.AddWithValue("@Apellidos", request.Apellidos);
                cmd.Parameters.AddWithValue("@Telefono", request.Telefono);
                cmd.Parameters.AddWithValue("@Direccion", request.Direccion);
                cmd.Parameters.AddWithValue("@CP", request.CodigoPostal);
                cmd.Parameters.AddWithValue("@Comentarios", request.Comentarios);
                cmd.Parameters.AddWithValue("@Codigo", pedidoId);
                // aquí guardarías en DB
                // Pedido
                // PedidoItems
                int idPedido = Convert.ToInt32(cmd.ExecuteScalar());


                foreach (var item in request.Items)
                {

                    var cmdItem = new MySqlCommand(@"

                    INSERT INTO pedidoproductos
                    (idPedido,idProducto,Nombre,Descripcion,Precio,Cantidad)
                    VALUES
                    (@idPedido,@idProducto,@Nombre,'',@Precio,@Cantidad)

                    ", con, tx);

                    cmdItem.Parameters.AddWithValue("@idPedido", idPedido);
                    cmdItem.Parameters.AddWithValue("@idProducto", item.ProductoId);
                    cmdItem.Parameters.AddWithValue("@Nombre", item.Nombre);
                    cmdItem.Parameters.AddWithValue("@Precio", item.Precio);
                    cmdItem.Parameters.AddWithValue("@Cantidad", item.Cantidad);

                    cmdItem.ExecuteNonQuery();

                }



                var cmdHistory = new MySqlCommand(@"

                    INSERT INTO pedidostatushistory
                    (idPedido,oldStatus,newStatus,ChangeDate)
                    VALUES
                    (@idPedido,NULL,'Nuevo',NOW())

                    ", con, tx);

                cmdHistory.Parameters.AddWithValue("@idPedido", idPedido);

                cmdHistory.ExecuteNonQuery();
                tx.Commit();



                return Ok(new PedidoResponse
                {
                    idPedido = idPedido,
                    PedidoId = pedidoId,
                    Status = "Nuevo"
                });
            }
            catch (Exception ex)
            {

                tx.Rollback();
                return BadRequest();
            }
        }



        [HttpGet("{codigo}")]
        public IActionResult ConsultarPedido(string codigo)
        {

            string connectionString = _configuration.GetConnectionString("MySqlConnection");
            PedidoDTO pedido = new PedidoDTO();
            List<PedidoItemDTO> items = new List<PedidoItemDTO>();
            using (MySqlConnection conexion = new MySqlConnection(connectionString))
            {
                conexion.Open();
                string query = @"
                            SELECT *
                            FROM pedido
                            WHERE CodigoPedido=@id
                            ";


                MySqlCommand cmd = new MySqlCommand(query, conexion);
                cmd.Parameters.AddWithValue("@id", codigo);
                MySqlDataReader reader = cmd.ExecuteReader();

                while (reader.Read())
                {
                    pedido = new PedidoDTO
                    {
                        Nombre = reader.GetString("nombre"),
                        Apellidos = reader.GetString("Apellidos"),
                        Telefono = reader.GetString("Telefono"),
                        Direccion = reader.GetString("Direccion"),
                        CodigoPostal = reader.GetString("CodigoPostal"),
                        Comentarios = reader.GetString("Comentarios"),
                        pedidoCodigo = reader.GetString("CodigoPedido"),
                        idPedido = reader.GetInt32("idPedido"),
                        pedidoStatus= reader.GetString("status"),

                    };
                }
                //// traer los items  
                string queryItems = @"
                            SELECT *
                            FROM pedidoproductos
                            WHERE idPedido=@id
                            ";
                MySqlCommand cmdItems = new MySqlCommand(queryItems, conexion);
                cmdItems.Parameters.AddWithValue("@id", pedido.idPedido);
                reader.Close(); // Cerrar el reader anterior antes de ejecutar otro comando
                reader = cmdItems.ExecuteReader();
                while (reader.Read())
                {
                    items.Add(new PedidoItemDTO
                    {
                        ProductoId = reader.GetInt32("idProducto"),
                        Nombre = reader.GetString("Nombre"),
                        Descripcion = reader.GetString("Descripcion"),
                        Precio = reader.GetDecimal("Precio"),
                        Cantidad = reader.GetInt32("Cantidad")
                    });
                }

                return Ok(new
                {
                    pedido,
                    items
                });


            }
        }


        [HttpGet]

        public IActionResult GetPedidos()
        {

            List<PedidoDTO> pedidos = new List<PedidoDTO>();
            string connectionString = _configuration.GetConnectionString("MySqlConnection");
            //return Ok(productos);
            using (MySqlConnection conexion = new MySqlConnection(connectionString))
            {
                conexion.Open();
                string query = @"
                                SELECT
                                idPedido,
                                CodigoPedido,
                                Nombre,Apellidos,
                                Telefono,
                                Status,
                                Direccion,CodigoPostal,Comentarios,

                                CreationDate
                                FROM pedido
                                ORDER BY CreationDate DESC
                                ";

                using (MySqlCommand cmd = new MySqlCommand(query, conexion))
                using (MySqlDataReader reader = cmd.ExecuteReader())
                {
                    while (reader.Read())
                    {
                        pedidos.Add(new PedidoDTO
                        {
                            idPedido = reader.GetInt32("idPedido"),
                            pedidoCodigo = reader.GetString("CodigoPedido"),
                            Nombre = reader.GetString("Nombre"),
                            Telefono = reader.GetString("Telefono"),
                            pedidoStatus = reader.GetString("Status"),
                            creationDate = reader.GetDateTime("CreationDate"),
                            Apellidos = reader.GetString("Apellidos"),
                            Direccion  = reader.GetString("Direccion"),
                            CodigoPostal = reader.GetString("CodigoPostal"),
                          Comentarios = reader.GetString("Comentarios")
                        });
                    }
                }
            }

            return Ok(pedidos);

        }


        [HttpPut("status/{id}")]
        public IActionResult CambiarStatus(int id, [FromBody] string nuevoStatus)
        {
            string connectionString = _configuration.GetConnectionString("MySqlConnection");

            using (MySqlConnection conexion = new MySqlConnection(connectionString))
            {
                conexion.Open();

                string oldStatus = "";

                // 1️⃣ Obtener status actual
                string queryStatus = "SELECT Status FROM pedido WHERE idPedido = @id";

                using (MySqlCommand cmdStatus = new MySqlCommand(queryStatus, conexion))
                {
                    cmdStatus.Parameters.AddWithValue("@id", id);

                    using (MySqlDataReader reader = cmdStatus.ExecuteReader())
                    {
                        if (reader.Read())
                        {
                            oldStatus = reader.GetString("Status");
                        }
                        else
                        {
                            return NotFound("Pedido no encontrado");
                        }
                    }
                }

                // 2️⃣ Actualizar status
                string updateQuery = @"
            UPDATE pedido
            SET Status = @status,
                ModifiedDate = NOW()
            WHERE idPedido = @id
        ";

                using (MySqlCommand cmdUpdate = new MySqlCommand(updateQuery, conexion))
                {
                    cmdUpdate.Parameters.AddWithValue("@status", nuevoStatus);
                    cmdUpdate.Parameters.AddWithValue("@id", id);

                    cmdUpdate.ExecuteNonQuery();
                }

                // 3️⃣ Insertar historial
                string historyQuery = @"
            INSERT INTO pedidostatushistory
            (idPedido, oldStatus, newStatus, ChangeDate)
            VALUES
            (@idPedido, @oldStatus, @newStatus, NOW())
        ";

                using (MySqlCommand cmdHistory = new MySqlCommand(historyQuery, conexion))
                {
                    cmdHistory.Parameters.AddWithValue("@idPedido", id);
                    cmdHistory.Parameters.AddWithValue("@oldStatus", oldStatus);
                    cmdHistory.Parameters.AddWithValue("@newStatus", nuevoStatus);

                    cmdHistory.ExecuteNonQuery();
                }
            }

            return Ok(new { message = "Status actualizado correctamente" });
        }


        [HttpGet("{id}/productos")]
        public IActionResult GetProductosPedido(int id)
        {

            List<PedidoItemDTO> productos = new List<PedidoItemDTO>();

            string connectionString = _configuration.GetConnectionString("MySqlConnection");

            using (MySqlConnection conexion = new MySqlConnection(connectionString))
            {
                conexion.Open();

                string query = @"
        SELECT Nombre,Descripcion,Precio,Cantidad
        FROM pedidoproductos
        WHERE idPedido=@id
        ";

                using (MySqlCommand cmd = new MySqlCommand(query, conexion))
                {

                    cmd.Parameters.AddWithValue("@id", id);

                    using (MySqlDataReader reader = cmd.ExecuteReader())
                    {

                        while (reader.Read())
                        {
                            productos.Add(new PedidoItemDTO
                            {
                                Nombre = reader.GetString("Nombre"),
                                Descripcion = reader.GetString("Descripcion"),
                                Precio = Convert.ToDecimal(reader["Precio"]),
                                Cantidad = Convert.ToInt32(reader["Cantidad"])
                            });
                        }

                    }

                }

            }

            return Ok(productos);

        }


    }

}
