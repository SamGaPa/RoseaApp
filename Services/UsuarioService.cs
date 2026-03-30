using MySql.Data.MySqlClient;
using Rosea.Models;
using static Rosea.Models.UsuarioViewModel;

namespace Rosea.Services
{
    public class UsuarioService
    {
        private readonly string connectionString =
            "Server=localhost;Database=RoseaDB;User=root;Password=TU_PASSWORD;";

        public Usuario GetByEmail(string email)
        {
            using var conn = new MySqlConnection(connectionString);
            conn.Open();

            string query = "SELECT * FROM Usuarios WHERE Email=@Email";
            using var cmd = new MySqlCommand(query, conn);
            cmd.Parameters.AddWithValue("@Email", email);

            using var reader = cmd.ExecuteReader();
            if (reader.Read())
            {
                return new Usuario
                {
                    Id = reader.GetInt32("Id"),
                    Nombre = reader.GetString("Nombre"),
                    Email = reader.GetString("Email"),
                    PasswordHash = reader.GetString("PasswordHash"),
                    Rol = reader.GetString("Rol")
                };
            }

            return null;
        }
    }
}

