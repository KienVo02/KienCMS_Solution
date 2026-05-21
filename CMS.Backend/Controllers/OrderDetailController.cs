using CMS.Data;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace CMS.Backend.Controllers
{
    public class OrderDetailController : Controller
    {
        private readonly ApplicationDbContext _context;

        // Constructor Injection
        public OrderDetailController(ApplicationDbContext context)
        {
            _context = context;
        }

        // Hiển thị danh sách chi tiết đơn hàng
        public IActionResult Index()
        {
            var orderDetails = _context.OrderDetails
                                       .Include(o => o.Order)
                                       .Include(o => o.Product)
                                       .ToList();

            return View(orderDetails);
        }
    }
}