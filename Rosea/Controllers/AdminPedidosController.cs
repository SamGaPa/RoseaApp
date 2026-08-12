using Microsoft.AspNetCore.Mvc;

namespace Rosea.Controllers
{
    public class AdminPedidosController : Controller
    {
        public IActionResult Index()
        {
            return View();
        }
    }
}
