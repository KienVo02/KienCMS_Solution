using CMS.Data;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace CMS.Backend.Controllers
{
    public class ProductController : Controller
    {
        private readonly ApplicationDbContext _context;

        // Constructor Injection
        public ProductController(ApplicationDbContext context)
        {
            _context = context;
        }

        // Hiển thị danh sách sản phẩm
        public IActionResult Index()
        {
            var products = _context.Products
                                   .Include(p => p.CategoryProduct)
                                   .ToList();

            return View(products);
        }
    }
}