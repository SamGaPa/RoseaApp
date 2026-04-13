using Microsoft.AspNetCore.Identity.Data;
using Microsoft.AspNetCore.Mvc;
using Microsoft.VisualStudio.Web.CodeGenerators.Mvc.Templates.BlazorIdentity.Pages.Manage;
using MySql.Data.MySqlClient;
using Org.BouncyCastle.Crypto.Generators;
using OtpNet;
using Rosea.Services.Rosea.Services;
using RoseaAPI.Models;
using RoseaAPI.Services;
using System.Data;

using System.Security.Cryptography;
namespace RoseaAPI.Controllers

{
    [ApiController]
    [Route("api/auth")]
    public class AuthController : ControllerBase
    {
        //  private readonly string cs = "server=localhost;database=roseadb;user=root;password=sam93"; 
        private readonly string cs = "Server=MYSQL5045.site4now.net;Database=db_ac7b84_roseadb;Uid=ac7b84_roseadb;password=uPdM9mL!Hw4_N5d";


        private readonly JwtService _jwt;
        private readonly IConfiguration _config;
        private readonly EmailService _email;

        //public AuthController(JwtService jwt)
        //{
        //    _jwt = jwt;
        //}

        public AuthController(JwtService jwt, IConfiguration config, EmailService email)
        {
            _jwt = jwt;
            _config = config;
            _email = email;
        }

        [HttpPost("login")]
        public async Task<IActionResult> Login(LoginDTO model)
        {
           // string cs = "server=localhost;database=roseadb;user=root;password=sam93;";
            string rol = "";
            bool mfaEnabled = false;

            using var conn = new MySqlConnection(cs);

            await conn.OpenAsync();

            string sql = @"SELECT rol, mfa_enabled
                   FROM usuarios
                   WHERE email=@email
                   AND password_hash = SHA2(@pass,256) and email_confirmed=1";

            var cmd = new MySqlCommand(sql, conn);

            cmd.Parameters.AddWithValue("@email", model.Email);
            cmd.Parameters.AddWithValue("@pass", model.PasswordHash);

            using var reader = await cmd.ExecuteReaderAsync();

            if (!reader.Read())
                return Unauthorized();

            rol = reader.GetString("rol");
           
            mfaEnabled = reader.GetBoolean("mfa_enabled");

            //rol = "ADMIN";
            //mfaEnabled = false;

            if (mfaEnabled)
            {
                return Ok(new
                {
                    requiresMfa = true,
                    email = model.Email
                });
            }

            var token =_jwt.GenerateToken(model.Email, rol);

            return Ok(new
            {
                token = "test-token",
                rol
            });
        }


        [HttpPost("verify-mfa")]
        public async Task<IActionResult> VerifyMfa(MFADTo data)
        {
            string secret = "";

            //string cs = "server=localhost;database=roseadb;user=root;password=sam93;";

            using var conn = new MySqlConnection(cs);

            await conn.OpenAsync();

            var cmd = new MySqlCommand(
                "SELECT mfa_secret, rol FROM usuarios WHERE email=@email", conn);

            cmd.Parameters.AddWithValue("@email", data.Email);

            using var reader = await cmd.ExecuteReaderAsync();

            if (!reader.Read())
                return Unauthorized();

            secret = reader.GetString("mfa_secret");

            string rol = reader.GetString("rol");

            var totp = new Totp(Base32Encoding.ToBytes(secret));

            bool valid = totp.VerifyTotp(data.Code, out long step);

            if (!valid)
                return Unauthorized("Código incorrecto");

            var token = _jwt.GenerateToken(data.Email, rol);

            return Ok(new
            {
                token,
                rol
            });
        }


     

[HttpPost("enable-mfa")]
    public async Task<IActionResult> EnableMfa(MFADTo data)
    {
       // string cs = "server=localhost;database=roseadb;user=root;password=sam93;";
        string secret = "";

        using var conn = new MySqlConnection(cs);
        await conn.OpenAsync();

        // Obtener secret del usuario
        var cmd = new MySqlCommand(
            "SELECT mfa_secret FROM usuarios WHERE email=@email",
            conn);

        cmd.Parameters.AddWithValue("@email", data.Email);

        var result = await cmd.ExecuteScalarAsync();

        if (result == null)
            return BadRequest("Usuario no encontrado");

        secret = result.ToString();

        // Validar código
        var totp = new Totp(Base32Encoding.ToBytes(secret));

        bool valid = totp.VerifyTotp(data.Code, out long step);

        if (!valid)
            return BadRequest(new { success = false });

        // Activar MFA
        var updateCmd = new MySqlCommand(
            "UPDATE usuarios SET mfa_enabled=1 WHERE email=@email",
            conn);

        updateCmd.Parameters.AddWithValue("@email", data.Email);

        await updateCmd.ExecuteNonQueryAsync();

        return Ok(new { success = true });
    }


        [HttpGet("mfa-status/{email}")]
        public async Task<IActionResult> GetMfaStatus(string email)
        {
           // string cs = "server=localhost;database=roseadb;user=root;password=sam93;";

            using var conn = new MySqlConnection(cs);
            await conn.OpenAsync();

            var cmd = new MySqlCommand(
                "SELECT mfa_enabled FROM usuarios WHERE email=@email",
                conn);

            cmd.Parameters.AddWithValue("@email", email);

            var result = await cmd.ExecuteScalarAsync();

            bool enabled = result != null && Convert.ToBoolean(result);

            return Ok(new { enabled });
        }


        [HttpPost("disable-mfa")]
        public async Task<IActionResult> DisableMfa(MFADTo data)
        {
          //  string cs = "server=localhost;database=roseadb;user=root;password=sam93;";
            string secret;

            using var conn = new MySqlConnection(cs);
            await conn.OpenAsync();

            var cmd = new MySqlCommand(
                "SELECT mfa_secret FROM usuarios WHERE email=@email",
                conn);

            cmd.Parameters.AddWithValue("@email", data.Email);

            var result = await cmd.ExecuteScalarAsync();

            if (result == null)
                return BadRequest();

            secret = result.ToString();

            var totp = new Totp(Base32Encoding.ToBytes(secret));

            bool valid = totp.VerifyTotp(data.Code, out long step);

            if (!valid)
                return BadRequest(new { success = false });

            var update = new MySqlCommand(
                "UPDATE usuarios SET mfa_enabled=0 WHERE email=@email",
                conn);

            update.Parameters.AddWithValue("@email", data.Email);

            await update.ExecuteNonQueryAsync();

            return Ok(new { success = true });
        }

        [HttpPost("change-password")]
        public async Task<IActionResult> ChangePassword(ChangePasswordDto data)
        {


            if (data.NewPassword != data.ConfirmPassword)
                return BadRequest("las contrasenas no coinciden");



           // string cs = "server=localhost;database=roseadb;user=root;password=sam93;";

            using var conn = new MySqlConnection(cs);
            await conn.OpenAsync();

            // 1️⃣ obtener hash actual
            var cmd = new MySqlCommand(
                "SELECT password_hash FROM usuarios WHERE email=@email",
                conn);

            cmd.Parameters.AddWithValue("@email", data.Email);

            var result = await cmd.ExecuteScalarAsync();

            if (result == null)
                return BadRequest("Usuario no encontrado");


            string currentHash = result.ToString();


            var cmd2 = new MySqlCommand(
           "SELECT  SHA2(@pass,256) FROM dual",
           conn);

            cmd2.Parameters.AddWithValue("@pass", data.CurrentPassword);
            var result2 = await cmd2.ExecuteScalarAsync();
            string oldHash = result2.ToString();


            if (oldHash != currentHash)
                return BadRequest("Password actual incorrecto");


            //// 2️⃣ validar password actual
            //if (!BCrypt.Net.BCrypt.Verify(data.CurrentPassword, currentHash))
            //    return BadRequest(new { success = false, message = "Password actual incorrecto" });

            //// 3️⃣ validar confirmación
            //if (data.NewPassword != data.ConfirmPassword)
            //    return BadRequest(new { success = false, message = "Los passwords no coinciden" });

            //// 4️⃣ generar nuevo hash
            //string newHash = BCrypt.Net.BCrypt.HashPassword(data.NewPassword);

            // 5️⃣ actualizar password
            var update = new MySqlCommand(
                "UPDATE usuarios SET password_hash= SHA2(@pass,256) WHERE email=@email",
                conn);

            update.Parameters.AddWithValue("@pass", data.NewPassword);
            update.Parameters.AddWithValue("@email", data.Email);

            await update.ExecuteNonQueryAsync();

            return Ok(new { success = true });
        }



        [HttpPost("setup-mfa")]
        public async Task<IActionResult> SetupMfa(SetupMFADto data)
        {
            try
            {


                var bytes = new byte[20];
                using (var rng = RandomNumberGenerator.Create())
                {
                    rng.GetBytes(bytes);
                }

                var base32Secret = Base32Encoding.ToString(bytes);

               // var secret = KeyGeneration.GenerateRandomKey(20);
                //var base32Secret = Base32Encoding.ToString(secret);

                using var conn = new MySqlConnection(cs);
                await conn.OpenAsync();

                var sql = "UPDATE usuarios SET mfa_secret=@secret WHERE email=@email";

                var cmd = new MySqlCommand(sql, conn);

                cmd.Parameters.AddWithValue("@secret", base32Secret);
                cmd.Parameters.AddWithValue("@email", data.Email);

                await cmd.ExecuteNonQueryAsync();

                return Ok(new { secret = base32Secret });
            }
            catch (Exception ex)
            {
                return StatusCode(500, ex.Message); // 👈 CLAVE
            }
        }
        //    [HttpPost("setup-mfa")]
        //public async Task<IActionResult> SetupMfa(SetupMFADto data)
        //{
        //    var secret = KeyGeneration.GenerateRandomKey(20);

        //    var base32Secret = Base32Encoding.ToString(secret);

        //   // string cs = "server=localhost;database=roseadb;user=root;password=sam93;";

        //    using var conn = new MySqlConnection(cs);

        //    await conn.OpenAsync();

        //    var sql = "UPDATE usuarios SET mfa_secret=@secret WHERE email=@email";

        //    var cmd = new MySqlCommand(sql, conn);

        //    cmd.Parameters.AddWithValue("@secret", base32Secret);
        //    cmd.Parameters.AddWithValue("@email", data.Email);

        //    await cmd.ExecuteNonQueryAsync();

        //    return Ok(new
        //    {
        //        secret = base32Secret
        //    });
        //}


        [HttpPost("register")]
        public IActionResult Register([FromBody] RoseaRegisterRequest model)
        {
            using var conn = new MySqlConnection(cs);
            conn.Open();

            // verificar si ya existe
            var check = new MySqlCommand("SELECT COUNT(*) FROM usuarios WHERE email=@e", conn);
            check.Parameters.AddWithValue("@e", model.Email);

            if (Convert.ToInt32(check.ExecuteScalar()) > 0)
                return BadRequest("Email already exists");

            // token
            var token = Guid.NewGuid().ToString();

            var cmd = new MySqlCommand(@"
        INSERT INTO usuarios
        (nombre,email,password_hash,rol,fecha_registro,mfa_enabled,email_confirmed,email_token,email_token_expiration)
        VALUES(
            @n,
            @e,
            SHA2(@p,256),
            'user',
            NOW(),
            0,
            0,
            @t,
            DATE_ADD(NOW(), INTERVAL 1 DAY)
        )", conn);

            cmd.Parameters.AddWithValue("@n", model.Nombre);
            cmd.Parameters.AddWithValue("@e", model.Email);
            cmd.Parameters.AddWithValue("@p", model.Password);
            cmd.Parameters.AddWithValue("@t", token);

            cmd.ExecuteNonQuery();

            // link
            var baseUrl = _config["App:BaseUrl"];
            var link = $"{baseUrl}/api/auth/confirm?token={token}";

            _email.Send(model.Email, "Activate your account",
                $"Click here: <a href='{link}'>Activate</a>");

            return Ok("Usuario creado, revisa tu email .");
        }


        [HttpGet("confirm")]
        public IActionResult Confirm(string token)
        {
            using var conn = new MySqlConnection(cs);
            conn.Open();

            var cmd = new MySqlCommand(@"
        UPDATE usuarios 
        SET email_confirmed = 1, email_token = NULL
        WHERE email_token = @t 
        AND email_token_expiration > NOW()", conn);

            cmd.Parameters.AddWithValue("@t", token);

            var rows = cmd.ExecuteNonQuery();

            if (rows == 0)
                return Content("Invalid or expired token");

            return Content("Account activated successfully");
        }

        //[HttpGet("test-email")]
        //public IActionResult TestEmail()
        //{
        //    _email.Send(
        //        "samanthagapad@gmail.com",
        //        "Test desde localhost",
        //        "<h1>Funciona 🚀</h1>"
        //    );

        //    return Ok("Correo enviado");
        //}
    }






}
