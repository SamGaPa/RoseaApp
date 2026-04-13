using System;

namespace Rosea.Models
{
    public class UserAdminViewModel
    {
        public int Id { get; set; }
        public string Nombre { get; set; } = string.Empty;
        public string Email { get; set; } = string.Empty;
        public string Rol { get; set; } = string.Empty; // ROOT, ADMIN, user
        public DateTime FechaRegistro { get; set; }
        public bool MfaEnabled { get; set; }
    }
}
