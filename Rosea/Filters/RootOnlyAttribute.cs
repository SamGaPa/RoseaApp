using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.Filters;

namespace Rosea.Filters
{
    public class RootOnlyAttribute : ActionFilterAttribute
    {
        public override void OnActionExecuting(ActionExecutingContext context)
        {
            var rol = context.HttpContext.Session.GetString("Rol");

            if (rol != "ROOT")
            {
                context.Result = new RedirectToActionResult("Index", "Store", null);
            }
        }
    }
}
