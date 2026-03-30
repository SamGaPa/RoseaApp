using Microsoft.AspNetCore.Mvc;
using Rosea.Filters;

namespace Rosea.Controllers
{
    [AdminOnly] // protege todo el dashboard
    public class AdminController : Controller
    {
        public IActionResult Index()
        {
            return View();
        }
    }
}
