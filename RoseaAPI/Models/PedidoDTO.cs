using System.Security.Policy;

namespace RoseaAPI.Models
{
    public class PedidoDTO
    {
        public string Nombre { get; set; }
        public string Apellidos { get; set; }
        public string Telefono { get; set; }
        public string Direccion { get; set; }
        public string CodigoPostal { get; set; }
        public string Comentarios { get; set; }

        public string? pedidoCodigo { get; set; }
        public string? pedidoStatus { get; set; }
        public int? idPedido { get; set; }

        public DateTime? creationDate { get; set; }

        public List<PedidoItemDTO> Items { get; set; }
    }
}
