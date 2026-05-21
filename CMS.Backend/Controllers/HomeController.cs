using CMS.Backend.Models;
using CMS.Data;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.Diagnostics;
using System.Linq;

namespace CMS.Backend.Controllers
{
    public class HomeController : Controller
    {
        private readonly ApplicationDbContext _context;

        // Constructor Injection
        public HomeController(ApplicationDbContext context)
        {
            _context = context;
        }

        // Trang ch?
        public IActionResult Index()
        {
            // L?y 3 bài vi?t m?i nh?t
            var latestPosts = _context.Posts
                                      .Include(p => p.Category)
                                      .OrderByDescending(p => p.CreatedDate)
                                      .Take(3)
                                      .ToList();

            return View(latestPosts);
        }

        public IActionResult Privacy()
        {
            return View();
        }

        [ResponseCache(Duration = 0,
                       Location = ResponseCacheLocation.None,
                       NoStore = true)]

        public IActionResult Error()
        {
            return View(new ErrorViewModel
            {
                RequestId = Activity.Current?.Id
                            ?? HttpContext.TraceIdentifier
            });
        }
    }
}