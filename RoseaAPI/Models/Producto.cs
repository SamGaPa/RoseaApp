namespace RoseaAPI.Models
{

        public class Producto
        {
            public int Id { get; set; }
            public string Nombre { get; set; }
            public string Descripcion { get; set; }
            public decimal Precio { get; set; }
            
        // test
            public string? Imagen { get; set; }
            public decimal?  IdCategoria { get; set; }
             public string? NameCategoria { get; set; }



        }
    

}
