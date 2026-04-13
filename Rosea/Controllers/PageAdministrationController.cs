using Microsoft.AspNetCore.Mvc;
using MySql.Data.MySqlClient;
using Rosea.Filters;
using Rosea.Models;
using System.Collections.Generic;

namespace Rosea.Controllers
{
    [RootOnly]
    public class PageAdministrationController : Controller
    {
        private readonly string cs = "server=localhost;database=roseadb;user=root;password=sam93;";

        public PageAdministrationController(IConfiguration config)
        {
            cs = config.GetConnectionString("MySqlConnection");
        }


        public IActionResult Index()
        {
            var users = new List<UserAdminViewModel>();

            using var conn = new MySqlConnection(cs);
            conn.Open();

            var cmd = new MySqlCommand("SELECT id, Nombre, email, rol, fecha_registro, mfa_enabled FROM usuarios where rol<>'ROOT' ORDER BY fecha_registro DESC", conn);

            using var reader = cmd.ExecuteReader();

            while (reader.Read())
            {
                users.Add(new UserAdminViewModel
                {
                    Id = reader.GetInt32("id"),
                    Nombre = reader.GetString("Nombre"),
                    Email = reader.GetString("email"),
                    Rol = reader.GetString("rol"),
                    FechaRegistro = reader.GetDateTime("fecha_registro"),
                    MfaEnabled = reader.GetBoolean("mfa_enabled")
                });
            }

            return View(users);
        }



        [HttpPost]
        public IActionResult UpdateUser(int id, string nombre, string email, string rol)
        {
            using var conn = new MySqlConnection(cs);
            conn.Open();


            // Prevent changing ROOT
            var checkCmd = new MySqlCommand("SELECT rol FROM usuarios WHERE id=@id", conn);
            checkCmd.Parameters.AddWithValue("@id", id);
            var current = checkCmd.ExecuteScalar()?.ToString();
            if (current == "ROOT")
            {
                return BadRequest("Cannot modify ROOT user");
            }


            var update = new MySqlCommand("UPDATE usuarios SET Nombre=@nombre, email=@email, rol=@rol WHERE id=@id", conn);
            update.Parameters.AddWithValue("@nombre", nombre);
            update.Parameters.AddWithValue("@email", email);
            update.Parameters.AddWithValue("@rol", rol);
            update.Parameters.AddWithValue("@id", id);
            update.ExecuteNonQuery();

            return RedirectToAction("Index");
        }

        //[HttpPost]
        //public IActionResult UpdateUser(int id, string nombre, string email, string rol, bool MfaEnabled = false)
        //{
        //    using var conn = new MySqlConnection(cs);
        //    conn.Open();

        //    // Prevent changing ROOT
        //    var checkCmd = new MySqlCommand("SELECT rol FROM usuarios WHERE id=@id", conn);
        //    checkCmd.Parameters.AddWithValue("@id", id);
        //    var current = checkCmd.ExecuteScalar()?.ToString();
        //    if (current == "ROOT")  
        //    {
        //        return BadRequest("Cannot modify ROOT user");
        //    }

        //    var update = new MySqlCommand("UPDATE usuarios SET Nombre=@nombre, email=@email, rol=@rol WHERE id=@id", conn);
        //    update.Parameters.AddWithValue("@nombre", nombre);
        //    update.Parameters.AddWithValue("@email", email);
        //    update.Parameters.AddWithValue("@rol", rol);
        //    update.Parameters.AddWithValue("@id", id);
        //    update.ExecuteNonQuery();

        //    if (MfaEnabled)
        //    {
        //        var mfa = new MySqlCommand("UPDATE usuarios SET mfa_enabled=0 WHERE id=@id", conn);
        //        mfa.Parameters.AddWithValue("@id", id);
        //        mfa.ExecuteNonQuery();
        //    }

        //    return RedirectToAction("Index");
        //}

        [HttpPost]
        public IActionResult DisableMfa(int id)
        {
            using var conn = new MySqlConnection(cs);
            conn.Open();

            var cmd = new MySqlCommand("UPDATE usuarios SET mfa_enabled=0 WHERE id=@id", conn);
            cmd.Parameters.AddWithValue("@id", id);
            cmd.ExecuteNonQuery();

            return RedirectToAction("Index");
        }

        [HttpPost]
        public IActionResult DeleteUser(int id)
        {
            using var conn = new MySqlConnection(cs);
            conn.Open();

            // Evitar borrar ROOT
            var checkCmd = new MySqlCommand("SELECT rol FROM usuarios WHERE id=@id", conn);
            checkCmd.Parameters.AddWithValue("@id", id);
            var role = checkCmd.ExecuteScalar()?.ToString();

            if (role == "ROOT")
            {
                return BadRequest("Cannot delete ROOT user");
            }

            var delete = new MySqlCommand("DELETE FROM usuarios WHERE id=@id", conn);
            delete.Parameters.AddWithValue("@id", id);
            delete.ExecuteNonQuery();

            return RedirectToAction("Index");
        }
    }
}
