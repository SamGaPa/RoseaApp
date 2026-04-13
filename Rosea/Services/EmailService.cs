namespace Rosea.Services
{
    using System.Net;
    using System.Net.Mail;

    namespace Rosea.Services
    {
        public class EmailService
        {
            private readonly IConfiguration _config;

            public EmailService(IConfiguration config)
            {
                _config = config;
            }

            public void Send(string to, string subject, string body)
            {
                var smtp = new SmtpClient(_config["Email:Host"])
                {
                    Port = int.Parse(_config["Email:Port"]),
                    Credentials = new NetworkCredential(
                        _config["Email:User"],
                        _config["Email:Pass"]),
                    EnableSsl = true
                };

                var mail = new MailMessage(
                    _config["Email:From"],
                    to,
                    subject,
                    body
                );

                mail.IsBodyHtml = true;

                smtp.Send(mail);
            }
        }
    }
}
