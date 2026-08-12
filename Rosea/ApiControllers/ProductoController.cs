using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc;
using MySql.Data.MySqlClient;
using RoseaAPI.Models;
using RoseaAPI.Models;
using System.Data;



namespace RoseaAPI.Controllers
{


        [ApiController]
        [Route("api/[controller]")]
        public class ProductosController : ControllerBase
        {
            private readonly IConfiguration _configuration;

            public ProductosController(IConfiguration configuration)
            {
                _configuration = configuration;
            }

      
        [HttpGet("listar")]
        public IActionResult ListarProductos()
        {
            List<Producto> productos = new List<Producto>();
            string connectionString = _configuration.GetConnectionString("MySqlConnection");
            //return Ok(productos);
            using (MySqlConnection conexion = new MySqlConnection(connectionString))
            {
                conexion.Open();
                string query = "SELECT id_producto, nombre, descripcion, precio,imagen, id_categoria FROM producto";

                using (MySqlCommand cmd = new MySqlCommand(query, conexion))
                using (MySqlDataReader reader = cmd.ExecuteReader())
                {
                    while (reader.Read())
                    {
                        productos.Add(new Producto
                        {
                            Id = reader.GetInt32("id_producto"),
                            Nombre = reader.GetString("nombre"),
                             Descripcion = reader.GetString("descripcion"),
                            Precio = reader.GetDecimal("precio"),
                            Imagen = reader.IsDBNull(4) ? null : Convert.ToBase64String(reader.GetFieldValue<byte[]>(4)),
                            IdCategoria = reader.IsDBNull(5) ? null : reader.GetInt32(5)

                        });
                    }
                }
            }

            return Ok(productos);
        }

       // [Authorize(Roles = "ADMIN")]
        [HttpPost("crear")]
        public IActionResult CrearProducto([FromBody] Producto producto)
        {
            if (producto == null)
                return BadRequest("Datos inválidos");

            string connectionString = _configuration.GetConnectionString("MySqlConnection");

            using (MySqlConnection conexion = new MySqlConnection(connectionString))
            {
                conexion.Open();
                string query = @"INSERT INTO producto (nombre, descripcion, precio, id_categoria,imagen)
                         VALUES (@nombre, @descripcion, @precio,@categoria,@imagen)";

                using (MySqlCommand cmd = new MySqlCommand(query, conexion))
                {
                    cmd.Parameters.AddWithValue("@nombre", producto.Nombre);
                    cmd.Parameters.AddWithValue("@descripcion", producto.Descripcion);
                    cmd.Parameters.AddWithValue("@precio", producto.Precio);
                    cmd.Parameters.AddWithValue("@categoria",1); //cmd.Parameters.AddWithValue("@categoria", producto.IdCategoria);
                    string? base64 = producto.Imagen;
if (!string.IsNullOrEmpty(base64))
{
    // Remove possible data URI prefix: "data:{mime};base64,"
    var comma = base64.IndexOf(',');
    if (comma >= 0) base64 = base64.Substring(comma + 1);

    try
    {
        byte[] bytes = Convert.FromBase64String(base64);
        // use 'bytes' as before
        cmd.Parameters.Add("@imagen", MySqlDbType.Blob).Value = bytes;
    }
    catch (FormatException)
    {
        // invalid payload: return BadRequest or set to DBNull.Value
        return BadRequest("Imagen field is not valid Base64.");
    }
}
else
{
    cmd.Parameters.Add("@imagen", MySqlDbType.Blob).Value = DBNull.Value;
}
                    cmd.ExecuteNonQuery();
                }
            }

            return Ok("Producto creado correctamente");
        }


        [HttpGet("error500")]
        public IActionResult Error500()
        {
            throw new Exception("Error intencional para pruebas");
        }

        [HttpGet("slow")]
        public async Task<IActionResult> Slow()
        {
            await Task.Delay(800); // 800 ms
            return Ok("Respuesta lenta");
        }

       // [Authorize(Roles = "ADMIN")]
        [HttpPut("actualizar/{id}")]
        public IActionResult ActualizarProducto(int id, [FromBody] Producto producto)
        {
            string connectionString = _configuration.GetConnectionString("MySqlConnection");

            using (MySqlConnection conexion = new MySqlConnection(connectionString))
            {
                conexion.Open();
                string query = @"UPDATE producto 
                         SET nombre = @nombre,
                             descripcion = @descripcion,
                             precio = @precio,
                             id_categoria=@categoria,
                             imagen= @imagen

                         WHERE id_producto = @id";

                using (MySqlCommand cmd = new MySqlCommand(query, conexion))
                {
                    cmd.Parameters.AddWithValue("@nombre", producto.Nombre);
                    cmd.Parameters.AddWithValue("@descripcion", producto.Descripcion);
                    cmd.Parameters.AddWithValue("@precio", producto.Precio);
                    cmd.Parameters.AddWithValue("@categoria",1);//cmd.Parameters.AddWithValue("@categoria", producto.IdCategoria);
                    string? base64 = producto.Imagen;
if (!string.IsNullOrEmpty(base64))
{
    // Remove possible data URI prefix: "data:{mime};base64,"
    var comma = base64.IndexOf(',');
    if (comma >= 0) base64 = base64.Substring(comma + 1);

    try
    {
        byte[] bytes = Convert.FromBase64String(base64);
        // use 'bytes' as before
        cmd.Parameters.Add("@imagen", MySqlDbType.Blob).Value = bytes;
    }
    catch (FormatException)
    {
        // invalid payload: return BadRequest or set to DBNull.Value
        return BadRequest("Imagen field is not valid Base64.");
    }
}
else
{
    cmd.Parameters.Add("@imagen", MySqlDbType.Blob).Value = DBNull.Value;
}
                    cmd.Parameters.AddWithValue("@id", id);


                    int filas = cmd.ExecuteNonQuery();

                    if (filas == 0)
                        return NotFound("Producto no encontrado");
                }
            }

            return Ok("Producto actualizado");
        }

        [Authorize(Roles = "ADMIN")]
        [HttpDelete("eliminar/{id}")]
        public IActionResult EliminarProducto(int id)
        {
            string connectionString = _configuration.GetConnectionString("MySqlConnection");

            using (MySqlConnection conexion = new MySqlConnection(connectionString))
            {
                conexion.Open();
                string query = "DELETE FROM producto WHERE id_producto = @id";

                using (MySqlCommand cmd = new MySqlCommand(query, conexion))
                {
                    cmd.Parameters.AddWithValue("@id", id);

                    int filas = cmd.ExecuteNonQuery();
                    if (filas == 0)
                        return NotFound("Producto no encontrado");
                }
            }

            return Ok("Producto eliminado");
        }


        // GET: api/productos/buscar
  
        [HttpGet("buscar")]
            public IActionResult BuscarProducto(string texto)
            {
                if (string.IsNullOrEmpty(texto))
                    return BadRequest("Debe proporcionar un texto de búsqueda.");

                List<Producto> productos = new List<Producto>();

                string connectionString = _configuration.GetConnectionString("MySqlConnection");

                using (MySqlConnection conexion = new MySqlConnection(connectionString))
                {
                    conexion.Open();

                    string query = @"
                    SELECT id_producto, nombre, descripcion, precio, imagen, id_categoria
                    FROM producto
                    WHERE nombre LIKE @texto
                       OR descripcion LIKE @texto";

                    using (MySqlCommand cmd = new MySqlCommand(query, conexion))
                    {
                        cmd.Parameters.AddWithValue("@texto", "%" + texto + "%");

                        using (MySqlDataReader reader = cmd.ExecuteReader())
                        {
                            while (reader.Read())
                            {
                                productos.Add(new Producto
                                {
                                    Id = reader.GetInt32("id_producto"),
                                    Nombre = reader.GetString("nombre"),
                                    Descripcion = reader.GetString("descripcion"),
                                    Precio = reader.GetDecimal(3),
                                    //Imagen = reader.IsDBNull(4) ? null : Convert.ToBase64String(reader.GetFieldValue<byte[]>(4)),
                                    Imagen = reader.IsDBNull(4)
                                    ? null
                                    : "data:image/png;base64," + Convert.ToBase64String(reader.GetFieldValue<byte[]>(4)),
                                    IdCategoria = reader.IsDBNull(5) ? null : reader.GetInt32(5)
                                });
                            }
                        }
                    }
                }

                return Ok(productos);
            }



        [HttpPost("busqueda-avanzada")]
        public IActionResult BusquedaAvanzada([FromBody] BusquedaAvanzadaDTO dto)
        {
            List<Producto> productos = new List<Producto>();
            string connectionString = _configuration.GetConnectionString("MySqlConnection");

            using (MySqlConnection conexion = new MySqlConnection(connectionString))
            {
                conexion.Open();

                string query = @"
        SELECT id_producto, nombre, descripcion, precio,imagen, id_categoria
        FROM producto
        WHERE 1=1 ";

                List<MySqlParameter> parametros = new List<MySqlParameter>();

                if (!string.IsNullOrEmpty(dto.Nombre))
                {
                    query += " AND nombre LIKE @nombre ";
                    parametros.Add(new MySqlParameter("@nombre", "%" + dto.Nombre + "%"));
                }

                if (dto.PrecioMin.HasValue)
                {
                    query += " AND precio >= @precioMin ";
                    parametros.Add(new MySqlParameter("@precioMin", dto.PrecioMin.Value));
                }

                if (dto.PrecioMax.HasValue)
                {
                    query += " AND precio <= @precioMax ";
                    parametros.Add(new MySqlParameter("@precioMax", dto.PrecioMax.Value));
                }

                if (!string.IsNullOrEmpty(dto.Descripcion))
                {
                    query += " AND descripcion LIKE @ingrediente ";
                    parametros.Add(new MySqlParameter("@ingrediente", "%" + dto.Descripcion + "%"));
                }

                using (MySqlCommand cmd = new MySqlCommand(query, conexion))
                {
                    cmd.Parameters.AddRange(parametros.ToArray());

                    using (MySqlDataReader reader = cmd.ExecuteReader())
                    {
                        while (reader.Read())
                        {
                            productos.Add(new Producto
                            {
                                Id = reader.GetInt32("id_producto"),
                                Nombre = reader.GetString("nombre"),
                                Descripcion = reader.GetString("descripcion"),
                                Precio = reader.GetDecimal("precio"),
                                Imagen = reader.IsDBNull(4) ? null
                                : Convert.ToBase64String(reader.GetFieldValue<byte[]>(4)),
                                IdCategoria = reader.IsDBNull(5) ? null : reader.GetInt32(5)
                            });
                        }
                    }
                }
            }

            return Ok(productos);
        }


    }


}
