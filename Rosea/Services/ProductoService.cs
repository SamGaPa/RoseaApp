

using Rosea.Models;
using System.Net.Http;
using System.Security.Policy;
using System.Text;
using System.Text.Json;


namespace Rosea.Services
{

    public class ProductoService
    {
        private readonly HttpClient _httpClient;

        //.GetAsync($"https://localhost:7092/api/productos/buscar?texto={texto}");
       // public readonly string apiUrl= "https://localhost:44325";
         public readonly string apiUrl ="http://samgapa-001-site1.site4future.com"; //api/productos/buscar?texto=mas
        public ProductoService(HttpClient httpClient)
        {
            _httpClient = httpClient;
        }

        public async Task<List<ProductoViewModel>> BuscarProductos(string texto)
        {
            var response = await _httpClient
                .GetAsync(apiUrl + $"/api/productos/buscar?texto={texto}");

            if (!response.IsSuccessStatusCode)
            {
                return new List<ProductoViewModel>();
            }

            var json = await response.Content.ReadAsStringAsync();

            return JsonSerializer.Deserialize<List<ProductoViewModel>>(json,
                new JsonSerializerOptions { PropertyNameCaseInsensitive = true });
        }
        
        public async Task<List<ProductoViewModel>> BuscaquedaAvanzada(BusquedaAvanzadaDTO dto)
        {

            var json = JsonSerializer.Serialize(dto);
            var content = new StringContent(json, Encoding.UTF8, "application/json");

            var response = await _httpClient.PostAsync(apiUrl+"/api/Productos/busqueda-avanzada", content);

            if (!response.IsSuccessStatusCode)
                return new List<ProductoViewModel>();

            var resultJson = await response.Content.ReadAsStringAsync();
            return JsonSerializer.Deserialize<List<ProductoViewModel>>(resultJson,
                new JsonSerializerOptions { PropertyNameCaseInsensitive = true });
        }

        public async Task<List<ProductoViewModel>> ObtenerTodos()
        {
            var response = await _httpClient
                .GetAsync(apiUrl + "/api/productos");

            if (!response.IsSuccessStatusCode)
                return new List<ProductoViewModel>();

            var json = await response.Content.ReadAsStringAsync();

            return JsonSerializer.Deserialize<List<ProductoViewModel>>(json,
                new JsonSerializerOptions { PropertyNameCaseInsensitive = true });
        }

    }

}
