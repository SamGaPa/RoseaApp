using System.ComponentModel.DataAnnotations;

namespace RoseaAPI.Models
{
    public class LoginDTO
    {


       // public int Id { get; set; }
        //public string Nombre { get; set; }
        public string Email { get; set; }
        public string PasswordHash { get; set; }
        //public string Rol { get; set; }
    }
    
}
