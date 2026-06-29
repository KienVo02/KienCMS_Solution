using System.Net;
using System.Net.Mail;
using System.Text;
using System.Text.RegularExpressions;

namespace CMS.Backend.Services
{
    public class EmailSender : IEmailSender
    {
        private readonly IConfiguration _configuration;
        private readonly IWebHostEnvironment _environment;
        private readonly ILogger<EmailSender> _logger;

        public EmailSender(IConfiguration configuration, IWebHostEnvironment environment, ILogger<EmailSender> logger)
        {
            _configuration = configuration;
            _environment = environment;
            _logger = logger;
        }

        public async Task<bool> SendAsync(string toEmail, string subject, string htmlBody)
        {
            if (string.IsNullOrWhiteSpace(toEmail))
            {
                return false;
            }

            var smtpSection = _configuration.GetSection("Smtp");
            var host = smtpSection["Host"];
            var username = smtpSection["Username"];
            var password = smtpSection["Password"];

            if (!string.IsNullOrWhiteSpace(host) &&
                !string.IsNullOrWhiteSpace(username) &&
                !string.IsNullOrWhiteSpace(password) &&
                !username.Contains("your-gmail", StringComparison.OrdinalIgnoreCase) &&
                !password.Contains("your-gmail-app-password", StringComparison.OrdinalIgnoreCase))
            {
                var sent = await TrySendSmtpAsync(smtpSection, toEmail, subject, htmlBody);
                if (sent)
                {
                    return true;
                }
            }

            await SaveToOutboxAsync(toEmail, subject, htmlBody);
            return false;
        }

        private async Task<bool> TrySendSmtpAsync(IConfiguration smtpSection, string toEmail, string subject, string htmlBody)
        {
            try
            {
                var fromEmail = smtpSection["FromEmail"]?.Trim() ?? "no-reply@kiencms.snackfood";
                var fromName = smtpSection["FromName"] ?? "KienCMS.SnackFood";
                var port = int.TryParse(smtpSection["Port"], out var parsedPort) ? parsedPort : 587;
                var enableSsl = bool.TryParse(smtpSection["EnableSsl"], out var parsedSsl) && parsedSsl;
                var username = smtpSection["Username"]?.Trim();
                var password = Regex.Replace(smtpSection["Password"] ?? string.Empty, @"\s+", string.Empty);

                using var message = new MailMessage
                {
                    From = new MailAddress(fromEmail, fromName, Encoding.UTF8),
                    Subject = subject,
                    Body = htmlBody,
                    IsBodyHtml = true,
                    BodyEncoding = Encoding.UTF8,
                    SubjectEncoding = Encoding.UTF8
                };
                message.To.Add(toEmail);

                using var client = new SmtpClient(smtpSection["Host"], port)
                {
                    DeliveryMethod = SmtpDeliveryMethod.Network,
                    EnableSsl = enableSsl,
                    UseDefaultCredentials = false
                };

                if (!string.IsNullOrWhiteSpace(username) && !string.IsNullOrWhiteSpace(password))
                {
                    client.Credentials = new NetworkCredential(username, password);
                }

                await client.SendMailAsync(message);
                return true;
            }
            catch (Exception ex)
            {
                _logger.LogWarning(ex, "SMTP send failed. Email was saved to local outbox instead.");
                return false;
            }
        }

        private async Task SaveToOutboxAsync(string toEmail, string subject, string htmlBody)
        {
            var outboxPath = Path.Combine(_environment.WebRootPath, "email-outbox");
            Directory.CreateDirectory(outboxPath);

            var safeSubject = Regex.Replace(subject, "[^a-zA-Z0-9_-]+", "-").Trim('-');
            if (string.IsNullOrWhiteSpace(safeSubject))
            {
                safeSubject = "email";
            }

            var fileName = $"{DateTime.Now:yyyyMMddHHmmssfff}-{safeSubject}.html";
            var filePath = Path.Combine(outboxPath, fileName);
            var body = $"""
                <!doctype html>
                <html>
                <head>
                    <meta charset="utf-8" />
                    <title>{WebUtility.HtmlEncode(subject)}</title>
                </head>
                <body>
                    <p><strong>To:</strong> {WebUtility.HtmlEncode(toEmail)}</p>
                    <p><strong>Subject:</strong> {WebUtility.HtmlEncode(subject)}</p>
                    <hr />
                    {htmlBody}
                </body>
                </html>
                """;

            await File.WriteAllTextAsync(filePath, body, Encoding.UTF8);
        }
    }
}
