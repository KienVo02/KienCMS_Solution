using CMS.Data;
using Microsoft.AspNetCore.Mvc;

namespace CMS.Backend.Controllers
{
    public class PostController : Controller
    {
        private readonly ApplicationDbContext _context;

        // Constructor Injection
        public PostController(ApplicationDbContext context)
        {
            _context = context;
        }

        // Action Index
        public IActionResult Index()
        {
            var posts = _context.Posts.ToList();

            return View(posts);
        }
    }
}