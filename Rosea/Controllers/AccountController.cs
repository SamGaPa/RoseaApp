using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Http;
using Rosea.Models;
using System.Threading.Tasks;
using MySql.Data.MySqlClient; 

namespace Rosea.Controllers
{
    public class AccountController : Controller
    {
        // GET Login
        public IActionResult Login()
        {
            return View();
        }

        public IActionResult AccountSettings()
        {
            return View();
        }

        // POST Login REAL con MySQL
        //[HttpPost]
        //public async Task<IActionResult> Login(LoginViewModel model)
        //{
        //    if (!ModelState.IsValid)
        //        return View(model);

        //    string rol = "";
        //    string cs = "server=localhost;database=roseadb;user=root;password=sam93;";

        //    using (var conn = new MySqlConnection(cs))
        //    {
        //        await conn.OpenAsync();

        //        string sql = @"SELECT rol FROM usuarios 
        //                       WHERE email=@email 
        //                       AND password_hash = SHA2(@pass,256)";

        //        var cmd = new MySqlCommand(sql, conn);
        //        cmd.Parameters.AddWithValue("@email", model.Usuario);
        //        cmd.Parameters.AddWithValue("@pass", model.Password);

        //        var result = await cmd.ExecuteScalarAsync();

        //        if (result == null)
        //        {
        //            ModelState.AddModelError("", "Usuario o contraseña incorrectos");
        //            return View(model);
        //        }

        //        // preserve original role value for storage/display
        //        rol = result.ToString();
        //    }

        //    // Guardar sesión
        //    HttpContext.Session.SetString("Usuario", model.Usuario);
        //    HttpContext.Session.SetString("Rol", rol);

        //    // Redirect based on role (server-side decision)
        //    var rolNormalized = (rol ?? "").Trim().ToUpperInvariant();
        //    if (rolNormalized == "ADMIN")
        //    {
        //        return RedirectToAction("Index", "Admin");
        //    }
        //    else
        //    {
        //        return RedirectToAction("Index", "Store");
        //    }
        //}

        // LOGOUT
        public IActionResult Logout()
        {
            HttpContext.Session.Clear();
            return RedirectToAction("Login");
        }
    }
}


