using CMS.Data;
using Microsoft.AspNetCore.Mvc;

namespace CMS.Backend.Controllers
{
    public class CustomerController : Controller
    {
        private readonly ApplicationDbContext _context;

        // Constructor Injection
        public CustomerController(ApplicationDbContext context)
        {
            _context = context;
        }

        // Hiển thị danh sách khách hàng
        public IActionResult Index()
        {
            var customers = _context.Customers.ToList();

            return View(customers);
        }
    }
}