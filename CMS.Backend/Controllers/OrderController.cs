using CMS.Data;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace CMS.Backend.Controllers
{
    public class OrderController : Controller
    {
        private readonly ApplicationDbContext _context;

        // Constructor Injection
        public OrderController(ApplicationDbContext context)
        {
            _context = context;
        }

        // Hiển thị danh sách đơn hàng
        public IActionResult Index()
        {
            var orders = _context.Orders
                                 .Include(o => o.Customer)
                                 .ToList();

            return View(orders);
        }
    }
}