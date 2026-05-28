using CMS.Data;
using CMS.Data.Entities;
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

        // ================= INDEX =================

        public IActionResult Index()
        {
            var customers = _context.Customers.ToList();

            return View(customers);
        }

        // ================= CREATE =================

        [HttpGet]
        public IActionResult Create()
        {
            return View();
        }

        [HttpPost]
        public IActionResult Create(Customer model)
        {
            // Kiểm tra dữ liệu hợp lệ
            if (ModelState.IsValid == false)
            {
                return View(model);
            }

            _context.Customers.Add(model);

            _context.SaveChanges();

            return RedirectToAction("Index");
        }

        // ================= EDIT =================

        [HttpGet]
        public IActionResult Edit(int id)
        {
            var customer = _context.Customers.Find(id);

            if (customer == null)
            {
                return NotFound();
            }

            return View(customer);
        }

        [HttpPost]
        public IActionResult Edit(Customer model)
        {
            // Kiểm tra dữ liệu hợp lệ
            if (ModelState.IsValid == false)
            {
                return View(model);
            }

            _context.Customers.Update(model);

            _context.SaveChanges();

            return RedirectToAction("Index");
        }

        // ================= DELETE =================

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