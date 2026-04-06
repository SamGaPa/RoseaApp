using Microsoft.AspNetCore.Mvc;

namespace Rosea.Controllers
{
    public class CartController : Controller
    {
        public IActionResult Index()
        {
            return View();
        }

        public IActionResult Checkout() {

            return View();
        }
    }
}