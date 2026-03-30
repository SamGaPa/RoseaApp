using System.ComponentModel.DataAnnotations;

namespace Rosea.Models
{
    public class LoginViewModel
    {
        [Required(ErrorMessage = "El usuario es obligatorio")]
        [EmailAddress(ErrorMessage = "Formato de correo inválido")]
        public string Usuario { get; set; }

        [Required(ErrorMessage = "La contraseña es obligatoria")]
        [StringLength(50, MinimumLength = 5, ErrorMessage = "La contraseña debe tener mínimo 5 caracteres")]
        public string Password { get; set; }
    }
}
