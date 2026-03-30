using Microsoft.AspNetCore.Mvc.RazorPages;

namespace Rosea.Models
{
    public class IndexModel: PageModel
    {

        public bool IsAuthenticated { get; private set; }

        public void OnGet()
        {
            IsAuthenticated = User?.Identity?.IsAuthenticated ?? false;
        }
    }
}

