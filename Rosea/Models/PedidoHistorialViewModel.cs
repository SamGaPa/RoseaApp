namespace Rosea.Models
{
    public class PedidoHistorialViewModel
    {
        public int IdPedido { get; set; }
        public string CodigoPedido { get; set; }
        public string Nombre { get; set; }
        public string Apellidos { get; set; }
        public string Telefono { get; set; }
        public string Direccion { get; set; }
        public string CodigoPostal { get; set; }
        public string Comentarios { get; set; }

        public DateTime CreationDate { get; set; }
        public DateTime ModifiedDate { get; set; }

        public string UltimoStatus { get; set; }

        public List<PedidoStatusHistory> Historial { get; set; } = new();
    }

    public class PedidoStatusHistory
    {
        public string OldStatus { get; set; }
        public string NewStatus { get; set; }
        public DateTime ChangeDate { get; set; }
    }
}
