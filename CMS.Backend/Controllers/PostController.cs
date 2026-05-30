using CMS.Data;
using CMS.Data.Entities;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace CMS.Backend.Controllers
{
    using Microsoft.AspNetCore.Authorization; // Cần thêm namespace này 



    [Authorize] // Bắt buộc phải đăng nhập mới được vào các hàm bên dưới 
    public class PostController : Controller
    {
        private readonly ApplicationDbContext _context;

        public PostController(ApplicationDbContext context)
        {
            _context = context;
        }

        // ================= INDEX =================

        public IActionResult Index()
        {
            // Lấy bài viết + Category
            var data = _context.Posts
                               .Include(p => p.Category)
                               .ToList();

            return View(data);
        }

        // ================= DETAILS =================

        public IActionResult Details(int id)
        {
            var post = _context.Posts
                               .Include(p => p.Category)
                               .FirstOrDefault(p => p.Id == id);

            if (post == null)
            {
                return NotFound();
            }

            return View(post);
        }

        // ================= CREATE =================

        [HttpGet]
        public IActionResult Create()
        {
            return View();
        }

        [HttpPost]
        public IActionResult Create(Post model)
        {
            if (ModelState.IsValid == false)
            {
                return View(model);
            }

            _context.Posts.Add(model);

            _context.SaveChanges();

            return RedirectToAction("Index");
        }

        // ================= EDIT =================

        [HttpGet]
        public IActionResult Edit(int id)
        {
            var post = _context.Posts.Find(id);

            if (post == null)
            {
                return NotFound();
            }

            return View(post);
        }

        [HttpPost]
        public IActionResult Edit(Post model)
        {
            if (ModelState.IsValid == false)
            {
                return View(model);
            }

            _context.Posts.Update(model);

            _context.SaveChanges();

            return RedirectToAction("Index");
        }

        // ================= DELETE =================

        public IActionResult Delete(int id)
        {
            var post = _context.Posts.Find(id);

            if (post != null)
            {
                _context.Posts.Remove(post);

                _context.SaveChanges();
            }

            return RedirectToAction("Index");
        }
    }
}