using CMS.Data;
using Microsoft.AspNetCore.Mvc;

namespace CMS.Backend.Controllers
{
    public class UserController : Controller
    {
        private readonly ApplicationDbContext _context;

        // Constructor Injection
        public UserController(ApplicationDbContext context)
        {
            _context = context;
        }

        // Hiển thị danh sách thành viên
        public IActionResult Index()
        {
            var users = _context.Users.ToList();

            return View(users);
        }
    }
}