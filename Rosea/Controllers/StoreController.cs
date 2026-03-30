using Microsoft.AspNetCore.Mvc;

namespace Rosea.Controllers
{
    public class StoreController : Controller
    {

        /// <summary>
        /// test comment
        /// </summary>
        /// <returns></returns>
        public IActionResult Index()
        {
            return View();
        }
    }
}
