using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Http;

namespace Rosea.Controllers
{
    [ApiController]
    [Route("Account")]
    public class SessionController : ControllerBase
    {
        public class SessionDto
        {
            public string Usuario { get; set; }
            public string Rol { get; set; }
        }

        [HttpPost("SetSession")]
        public IActionResult SetSession([FromBody] SessionDto dto)
        {
            if (dto == null) return BadRequest();

            HttpContext.Session.SetString("Usuario", dto.Usuario ?? "");
            HttpContext.Session.SetString("Rol", dto.Rol ?? "");

            return Ok();
        }
    }
}