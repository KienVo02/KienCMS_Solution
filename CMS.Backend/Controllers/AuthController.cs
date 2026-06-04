using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using CMS.Data;
using CMS.Data.Entities;

namespace CMS.Backend.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class AuthController : ControllerBase
    {
        private readonly ApplicationDbContext _context;

        public AuthController(ApplicationDbContext context)
        {
            _context = context;
        }

        // POST: api/Auth/CustomerRegister
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

            var existedEmail = await _context.Customers
                .AnyAsync(c => c.Email == input.Email);

            if (existedEmail)
            {
                return BadRequest(new { message = "Email này đã được đăng ký" });
            }

            var customer = new Customer
            {
                FullName = input.FullName,
                Email = input.Email,
                Password = input.Password,
                Phone = input.Phone,
                Address = input.Address
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

        // POST: api/Auth/CustomerLogin
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

            var customer = await _context.Customers
                .FirstOrDefaultAsync(c =>
                    c.Email == input.Email &&
                    c.Password == input.Password);

            if (customer == null)
            {
                return Unauthorized(new { message = "Email hoặc mật khẩu không đúng" });
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
}