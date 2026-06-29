using CMS.Backend.Services;
using CMS.Data;
using CMS.Data.Entities;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Caching.Memory;
using System.Security.Cryptography;

namespace CMS.Backend.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class AuthController : ControllerBase
    {
        private const int ResetCodeMinutes = 10;
        private const int MaxVerifyAttempts = 5;

        private readonly ApplicationDbContext _context;
        private readonly IEmailSender _emailSender;
        private readonly IMemoryCache _memoryCache;

        public AuthController(ApplicationDbContext context, IEmailSender emailSender, IMemoryCache memoryCache)
        {
            _context = context;
            _emailSender = emailSender;
            _memoryCache = memoryCache;
        }

        [HttpPost("CustomerRegister")]
        public async Task<IActionResult> CustomerRegister([FromBody] CustomerRegisterDTO input)
        {
            if (input == null)
            {
                return BadRequest(new { message = "Dữ liệu đăng ký không hợp lệ" });
            }

            if (string.IsNullOrWhiteSpace(input.FullName) ||
                string.IsNullOrWhiteSpace(input.Email) ||
                string.IsNullOrWhiteSpace(input.Password) ||
                string.IsNullOrWhiteSpace(input.Phone) ||
                string.IsNullOrWhiteSpace(input.Address))
            {
                return BadRequest(new
                {
                    message = "Vui lòng nhập đầy đủ họ tên, email, mật khẩu, số điện thoại và địa chỉ"
                });
            }

            var email = NormalizeEmail(input.Email);
            var existedEmail = await _context.Customers
                .AnyAsync(c => c.Email.ToLower() == email);

            if (existedEmail)
            {
                return BadRequest(new { message = "Email này đã được đăng ký" });
            }

            var customer = new Customer
            {
                FullName = input.FullName.Trim(),
                Email = email,
                PasswordHash = PasswordHashService.HashPassword(input.Password),
                Phone = input.Phone.Trim(),
                Address = input.Address.Trim()
            };

            _context.Customers.Add(customer);
            await _context.SaveChangesAsync();

            return StatusCode(201, new
            {
                message = "Đăng ký tài khoản thành công",
                customerId = customer.Id,
                fullName = customer.FullName,
                email = customer.Email,
                phone = customer.Phone,
                address = customer.Address
            });
        }

        [HttpPost("CustomerLogin")]
        public async Task<IActionResult> CustomerLogin([FromBody] CustomerLoginDTO input)
        {
            if (input == null)
            {
                return BadRequest(new { message = "Dữ liệu đăng nhập không hợp lệ" });
            }

            if (string.IsNullOrWhiteSpace(input.Email) ||
                string.IsNullOrWhiteSpace(input.Password))
            {
                return BadRequest(new { message = "Vui lòng nhập email và mật khẩu" });
            }

            var email = NormalizeEmail(input.Email);
            var customer = await _context.Customers
                .FirstOrDefaultAsync(c => c.Email.ToLower() == email);

            if (customer == null || !PasswordHashService.VerifyPassword(input.Password, customer.PasswordHash))
            {
                return Unauthorized(new { message = "Email hoặc mật khẩu không đúng" });
            }

            if (PasswordHashService.NeedsRehash(customer.PasswordHash))
            {
                customer.PasswordHash = PasswordHashService.HashPassword(input.Password);
                await _context.SaveChangesAsync();
            }

            return Ok(new
            {
                message = "Đăng nhập thành công",
                customer = new
                {
                    customer.Id,
                    customer.FullName,
                    customer.Email,
                    customer.Phone,
                    customer.Address
                }
            });
        }

        [HttpPost("ForgotPassword")]
        public async Task<IActionResult> ForgotPassword([FromBody] ForgotPasswordDTO input)
        {
            if (input == null || string.IsNullOrWhiteSpace(input.Email))
            {
                return BadRequest(new { message = "Vui lòng nhập email đã đăng ký" });
            }

            var email = NormalizeEmail(input.Email);
            var customer = await _context.Customers
                .FirstOrDefaultAsync(c => c.Email.ToLower() == email);

            if (customer == null)
            {
                return BadRequest(new { message = "Email này chưa tồn tại trong hệ thống" });
            }

            var resetCode = GenerateSixDigitCode();
            var resetState = new PasswordResetState
            {
                CustomerId = customer.Id,
                Email = customer.Email,
                CodeHash = HashResetCode(resetCode),
                ExpiresAt = DateTimeOffset.Now.AddMinutes(ResetCodeMinutes)
            };

            _memoryCache.Set(
                GetResetCacheKey(email),
                resetState,
                TimeSpan.FromMinutes(ResetCodeMinutes));

            var htmlBody = $"""
                <h2>KienCMS.SnackFood - Mã xác nhận quên mật khẩu</h2>
                <p>Xin chào <strong>{customer.FullName}</strong>,</p>
                <p>Mã xác nhận đặt lại mật khẩu của bạn là:</p>
                <p style="font-size:28px;letter-spacing:6px;font-weight:800;color:#d83a1a">{resetCode}</p>
                <p>Mã này có hiệu lực trong {ResetCodeMinutes} phút. Không chia sẻ mã này cho người khác.</p>
                """;

            var emailSent = await _emailSender.SendAsync(
                customer.Email,
                "KienCMS.SnackFood - Mã xác nhận quên mật khẩu",
                htmlBody);

            return Ok(new
            {
                message = "Mã xác nhận gồm 6 số đã được gửi đến email của bạn.",
                emailSent,
                expiresInMinutes = ResetCodeMinutes
            });
        }

        [HttpPost("VerifyResetCode")]
        public IActionResult VerifyResetCode([FromBody] VerifyResetCodeDTO input)
        {
            if (input == null ||
                string.IsNullOrWhiteSpace(input.Email) ||
                string.IsNullOrWhiteSpace(input.Code))
            {
                return BadRequest(new { message = "Vui lòng nhập email và mã xác nhận" });
            }

            var email = NormalizeEmail(input.Email);
            if (!TryGetValidResetState(email, out var resetState))
            {
                return BadRequest(new { message = "Mã xác nhận đã hết hạn hoặc không tồn tại" });
            }

            if (!IsResetCodeMatch(input.Code, resetState))
            {
                resetState.Attempts += 1;

                if (resetState.Attempts >= MaxVerifyAttempts)
                {
                    _memoryCache.Remove(GetResetCacheKey(email));
                    return BadRequest(new { message = "Bạn đã nhập sai quá số lần cho phép. Vui lòng gửi lại mã mới." });
                }

                _memoryCache.Set(GetResetCacheKey(email), resetState, resetState.ExpiresAt);
                return BadRequest(new { message = "Mã xác nhận không đúng" });
            }

            resetState.Verified = true;
            _memoryCache.Set(GetResetCacheKey(email), resetState, resetState.ExpiresAt);

            return Ok(new { message = "Mã xác nhận chính xác. Vui lòng nhập mật khẩu mới." });
        }

        [HttpPost("ResetPassword")]
        public async Task<IActionResult> ResetPassword([FromBody] ResetPasswordDTO input)
        {
            if (input == null ||
                string.IsNullOrWhiteSpace(input.Email) ||
                string.IsNullOrWhiteSpace(input.Code) ||
                string.IsNullOrWhiteSpace(input.NewPassword) ||
                string.IsNullOrWhiteSpace(input.ConfirmPassword))
            {
                return BadRequest(new { message = "Vui lòng nhập đầy đủ thông tin đặt lại mật khẩu" });
            }

            if (input.NewPassword.Length < 6)
            {
                return BadRequest(new { message = "Mật khẩu mới phải có ít nhất 6 ký tự" });
            }

            if (input.NewPassword != input.ConfirmPassword)
            {
                return BadRequest(new { message = "Mật khẩu xác nhận không khớp" });
            }

            var email = NormalizeEmail(input.Email);
            if (!TryGetValidResetState(email, out var resetState) ||
                !resetState.Verified ||
                !IsResetCodeMatch(input.Code, resetState))
            {
                return BadRequest(new { message = "Vui lòng xác thực mã trước khi đặt lại mật khẩu" });
            }

            var customer = await _context.Customers
                .FirstOrDefaultAsync(c => c.Id == resetState.CustomerId && c.Email.ToLower() == email);

            if (customer == null)
            {
                _memoryCache.Remove(GetResetCacheKey(email));
                return BadRequest(new { message = "Không tìm thấy tài khoản cần đặt lại mật khẩu" });
            }

            customer.PasswordHash = PasswordHashService.HashPassword(input.NewPassword);
            await _context.SaveChangesAsync();

            _memoryCache.Remove(GetResetCacheKey(email));

            return Ok(new { message = "Đặt lại mật khẩu thành công. Bạn có thể đăng nhập bằng mật khẩu mới." });
        }

        private static string NormalizeEmail(string email)
        {
            return email.Trim().ToLowerInvariant();
        }

        private static string GetResetCacheKey(string email)
        {
            return $"customer-reset-code:{email}";
        }

        private bool TryGetValidResetState(string email, out PasswordResetState resetState)
        {
            if (_memoryCache.TryGetValue(GetResetCacheKey(email), out PasswordResetState? cachedState) &&
                cachedState != null &&
                cachedState.ExpiresAt >= DateTimeOffset.Now)
            {
                resetState = cachedState;
                return true;
            }

            _memoryCache.Remove(GetResetCacheKey(email));
            resetState = new PasswordResetState();
            return false;
        }

        private static bool IsResetCodeMatch(string code, PasswordResetState resetState)
        {
            var normalizedCode = code.Trim();
            return normalizedCode.Length == 6 &&
                normalizedCode.All(char.IsDigit) &&
                HashResetCode(normalizedCode) == resetState.CodeHash;
        }

        private static string GenerateSixDigitCode()
        {
            return RandomNumberGenerator.GetInt32(0, 1000000).ToString("D6");
        }

        private static string HashResetCode(string code)
        {
            var bytes = System.Text.Encoding.UTF8.GetBytes(code);
            var hash = SHA256.HashData(bytes);
            return Convert.ToHexString(hash);
        }
    }

    public class CustomerRegisterDTO
    {
        public string FullName { get; set; } = string.Empty;

        public string Email { get; set; } = string.Empty;

        public string Password { get; set; } = string.Empty;

        public string Phone { get; set; } = string.Empty;

        public string Address { get; set; } = string.Empty;
    }

    public class CustomerLoginDTO
    {
        public string Email { get; set; } = string.Empty;

        public string Password { get; set; } = string.Empty;
    }

    public class ForgotPasswordDTO
    {
        public string Email { get; set; } = string.Empty;
    }

    public class VerifyResetCodeDTO
    {
        public string Email { get; set; } = string.Empty;

        public string Code { get; set; } = string.Empty;
    }

    public class ResetPasswordDTO
    {
        public string Email { get; set; } = string.Empty;

        public string Code { get; set; } = string.Empty;

        public string NewPassword { get; set; } = string.Empty;

        public string ConfirmPassword { get; set; } = string.Empty;
    }

    public class PasswordResetState
    {
        public int CustomerId { get; set; }

        public string Email { get; set; } = string.Empty;

        public string CodeHash { get; set; } = string.Empty;

        public DateTimeOffset ExpiresAt { get; set; }

        public int Attempts { get; set; }

        public bool Verified { get; set; }
    }
}
