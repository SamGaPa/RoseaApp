namespace RoseaAPI.Services
{
    using System;
    using System.Text;

    public class GeneradorID
    {
        private static Random _random = new Random();

        public static string GenerarID()
        {
            string letras = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
            string numeros = "0123456789";
            StringBuilder idBuilder = new StringBuilder();

            // Generar 5 letras aleatorias
            for (int i = 0; i < 5; i++)
            {
                idBuilder.Append(letras[_random.Next(letras.Length)]);
            }

            // Generar 5 números aleatorios
            for (int i = 0; i < 5; i++)
            {
                idBuilder.Append(numeros[_random.Next(numeros.Length)]);
            }
            // agregar al id  yymm ano y mes  en 4 carateres extras para identificar el año y mes de creación del id
            idBuilder.Append(DateTime.Now.ToString("yyMM"));

            return idBuilder.ToString();
        }

    }

}
