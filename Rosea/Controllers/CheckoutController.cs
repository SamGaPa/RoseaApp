using Microsoft.AspNetCore.Mvc;

namespace Rosea.Controllers
{
    public class CheckoutController : Controller
    {
        public IActionResult Index()
        {
            return View();
        }
    }
}
