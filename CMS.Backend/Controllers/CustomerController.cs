using CMS.Backend.Services;
using CMS.Data;
using CMS.Data.Entities;
using Microsoft.AspNetCore.Mvc;

namespace CMS.Backend.Controllers
{
    public class CustomerController : Controller
    {
        private readonly ApplicationDbContext _context;

        public CustomerController(ApplicationDbContext context)
        {
            _context = context;
        }

        public IActionResult Index()
        {
            var customers = _context.Customers.ToList();
            return View(customers);
        }

        [HttpGet]
        public IActionResult Create()
        {
            return View();
        }

        [HttpPost]
        public IActionResult Create(Customer model)
        {
            if (string.IsNullOrWhiteSpace(model.PasswordHash))
            {
                ModelState.AddModelError(nameof(model.PasswordHash), "Mật khẩu không được để trống");
            }

            var emailExists = _context.Customers.Any(c => c.Email == model.Email);
            if (emailExists)
            {
                ModelState.AddModelError(nameof(model.Email), "Email này đã được đăng ký");
            }

            if (!ModelState.IsValid)
            {
                return View(model);
            }

            model.PasswordHash = PasswordHashService.HashPassword(model.PasswordHash);
            _context.Customers.Add(model);
            _context.SaveChanges();

            return RedirectToAction("Index");
        }

        [HttpGet]
        public IActionResult Edit(int id)
        {
            var customer = _context.Customers.Find(id);

            if (customer == null)
            {
                return NotFound();
            }

            customer.PasswordHash = string.Empty;
            return View(customer);
        }

        [HttpPost]
        public IActionResult Edit(Customer model)
        {
            ModelState.Remove(nameof(model.PasswordHash));

            var emailExists = _context.Customers.Any(c => c.Id != model.Id && c.Email == model.Email);
            if (emailExists)
            {
                ModelState.AddModelError(nameof(model.Email), "Email này đã được đăng ký");
            }

            if (!ModelState.IsValid)
            {
                return View(model);
            }

            var customer = _context.Customers.Find(model.Id);
            if (customer == null)
            {
                return NotFound();
            }

            customer.FullName = model.FullName;
            customer.Email = model.Email;
            customer.Phone = model.Phone;
            customer.Address = model.Address;

            if (!string.IsNullOrWhiteSpace(model.PasswordHash))
            {
                customer.PasswordHash = PasswordHashService.HashPassword(model.PasswordHash);
            }

            _context.SaveChanges();
            return RedirectToAction("Index");
        }

        public IActionResult Delete(int id)
        {
            var customer = _context.Customers.Find(id);

            if (customer != null)
            {
                _context.Customers.Remove(customer);
                _context.SaveChanges();
            }

            return RedirectToAction("Index");
        }
    }
}
