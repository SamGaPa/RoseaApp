using Microsoft.AspNetCore.Mvc;
using Rosea.Models;
using Rosea.Services;
using System.Net.Http;
using System.Text;
using System.Text.Json;

namespace Rosea.Controllers
{
    public class CatalogoController : Controller
    {
        private readonly ProductoService _productoService;

        public CatalogoController(ProductoService productoService)
        {
            _productoService = productoService;
        }


        [HttpGet]
        public async Task<IActionResult> Buscar(string texto)
        {
            if (string.IsNullOrWhiteSpace(texto))
                return View(new List<ProductoViewModel>());

            var productos = await _productoService.BuscarProductos(texto);

            return View(productos);
        }


        [HttpPost]
        public async Task<IActionResult> BusquedaAvanzada(BusquedaAvanzadaDTO dto)
        {
            var productos =  _productoService.BuscaquedaAvanzada(dto);

           // return View(productos);

            return View("Buscar", productos);
        }



    }

}
