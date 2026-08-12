using Microsoft.AspNetCore.Mvc;

namespace Rosea.Controllers
{
    public class PedidoController : Controller
    {

        public IActionResult Confirmacion(string id)
        {
            ViewBag.PedidoId = id;
            return View();
        }


        public IActionResult Consultar()
        {

            return View();
        }
    }
}
