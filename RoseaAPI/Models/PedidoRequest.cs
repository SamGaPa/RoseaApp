using System.Security.Policy;

namespace RoseaAPI.Models
{
    public class PedidoRequest
    {
        public string Nombre { get; set; }
        public string Apellidos { get; set; }
        public string Telefono { get; set; }
        public string Direccion { get; set; }
        public string CodigoPostal { get; set; }
        public string? Comentarios { get; set; }

        public List<PedidoItem> Items { get; set; }
    }
}
