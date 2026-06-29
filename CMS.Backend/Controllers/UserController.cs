using CMS.Backend.Services;
using CMS.Data;
using CMS.Data.Entities;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace CMS.Backend.Controllers
{
    [Authorize(Roles = "Admin")]
    public class UserController : Controller
    {
        private readonly ApplicationDbContext _context;

        public UserController(ApplicationDbContext context)
        {
            _context = context;
        }

        public IActionResult Index()
        {
            var users = _context.Users.ToList();
            return View(users);
        }

        [HttpGet]
        public IActionResult Create()
        {
            return View();
        }

        [HttpPost]
        public IActionResult Create(User model)
        {
            if (string.IsNullOrWhiteSpace(model.PasswordHash))
            {
                ModelState.AddModelError(nameof(model.PasswordHash), "Mật khẩu không được để trống");
            }

            var usernameExists = _context.Users.Any(u => u.Username == model.Username);
            if (usernameExists)
            {
                ModelState.AddModelError(nameof(model.Username), "Tên đăng nhập đã tồn tại");
            }

            if (!ModelState.IsValid)
            {
                return View(model);
            }

            model.PasswordHash = PasswordHashService.HashPassword(model.PasswordHash);
            _context.Users.Add(model);
            _context.SaveChanges();

            return RedirectToAction("Index");
        }

        [HttpGet]
        public IActionResult Edit(int id)
        {
            var user = _context.Users.Find(id);

            if (user == null)
            {
                return NotFound();
            }

            user.PasswordHash = string.Empty;
            return View(user);
        }

        [HttpPost]
        public IActionResult Edit(User model)
        {
            ModelState.Remove(nameof(model.PasswordHash));

            var usernameExists = _context.Users.Any(u => u.Id != model.Id && u.Username == model.Username);
            if (usernameExists)
            {
                ModelState.AddModelError(nameof(model.Username), "Tên đăng nhập đã tồn tại");
            }

            if (!ModelState.IsValid)
            {
                return View(model);
            }

            var user = _context.Users.Find(model.Id);
            if (user == null)
            {
                return NotFound();
            }

            user.FullName = model.FullName;
            user.Username = model.Username;
            user.Role = model.Role;

            if (!string.IsNullOrWhiteSpace(model.PasswordHash))
            {
                user.PasswordHash = PasswordHashService.HashPassword(model.PasswordHash);
            }

            _context.SaveChanges();
            return RedirectToAction("Index");
        }

        public IActionResult Delete(int id)
        {
            var user = _context.Users.Find(id);

            if (user != null)
            {
                _context.Users.Remove(user);
                _context.SaveChanges();
            }

            return RedirectToAction("Index");
        }
    }
}
