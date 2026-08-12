using Microsoft.AspNetCore.Mvc;
using MySql.Data.MySqlClient;
using Rosea.Models;

namespace Rosea.Controllers
{
    public class PedidoHistorialController : Controller
    {
        private readonly string cs = "";// "server=localhost;database=roseadb;user=root;password=sam93;""";



        public PedidoHistorialController(IConfiguration config)
        {
            cs = config.GetConnectionString("MySqlConnection");
        }


        public IActionResult Index()
        {
            var pedidos = new Dictionary<int, PedidoHistorialViewModel>();

            using var conn = new MySqlConnection(cs);
            conn.Open();

            var cmd = new MySqlCommand(@"
        SELECT * FROM pedido ped 
        LEFT JOIN pedidostatushistory pedh
        ON pedh.idPedido = ped.idPedido
        ORDER BY ped.idPedido, pedh.ChangeDate ASC", conn);

            using var reader = cmd.ExecuteReader();

            while (reader.Read())
            {
                var id = reader.GetInt32("idPedido");

                if (!pedidos.ContainsKey(id))
                {
                    pedidos[id] = new PedidoHistorialViewModel
                    {
                        IdPedido = id,
                        CodigoPedido = reader["CodigoPedido"]?.ToString(),
                        Nombre = reader["Nombre"]?.ToString(),
                        Apellidos = reader["Apellidos"]?.ToString(),
                        Telefono = reader["Telefono"]?.ToString(),
                        Direccion = reader["Direccion"]?.ToString(),
                        CodigoPostal = reader["CodigoPostal"]?.ToString(),
                        Comentarios = reader["Comentarios"]?.ToString(),

                        CreationDate = reader["CreationDate"] != DBNull.Value
         ? Convert.ToDateTime(reader["CreationDate"])
         : DateTime.MinValue,

                        ModifiedDate = reader["ModifiedDate"] != DBNull.Value
         ? Convert.ToDateTime(reader["ModifiedDate"])
         : DateTime.MinValue,
                    };
                }

                if (reader["ChangeDate"] != DBNull.Value)
                {
                    pedidos[id].Historial.Add(new PedidoStatusHistory
                    {
                        OldStatus = reader["oldStatus"].ToString(),
                        NewStatus = reader["newStatus"].ToString(),
                        ChangeDate = reader.GetDateTime("ChangeDate")
                    });
                }
            }

            return View(pedidos.Values.ToList());
        }
    }
}
