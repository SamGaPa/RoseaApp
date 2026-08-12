
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;
using Microsoft.IdentityModel.Tokens;


namespace RoseaAPI.Services
{

    public class JwtService
    {
        private readonly string key = "SUPER_SECRETO_ROSEA_2026_2250_NO_SE_LO_DICES_A_NADIE";

        public string GenerateToken(string email, string rol)
        {
            var tokenHandler = new JwtSecurityTokenHandler();
            var keyBytes = Encoding.UTF8.GetBytes(key);

            var claims = new[]
            {
            new Claim(ClaimTypes.Name, email),
            new Claim(ClaimTypes.Role, rol)
        };

            var descriptor = new SecurityTokenDescriptor
            {
                Subject = new ClaimsIdentity(claims),
                Expires = DateTime.UtcNow.AddHours(2),
                SigningCredentials = new SigningCredentials(
                    new SymmetricSecurityKey(keyBytes),
                    SecurityAlgorithms.HmacSha256Signature)
            };


            try
            {
                var token = tokenHandler.CreateToken(descriptor);
                return tokenHandler.WriteToken(token);
            }
            catch (Exception e)
            {

                throw;
            }
  
            

           
        }
    }
}