using CMS.Data;
using CMS.Data.Entities;
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

        // ================= INDEX =================

        public IActionResult Index()
        {
            var products = _context.Products
                                   .Include(p => p.CategoryProduct)
                                   .ToList();

            return View(products);
        }

        // ================= CREATE =================

        [HttpGet]
        public IActionResult Create()
        {
            return View();
        }

        [HttpPost]
        public IActionResult Create(Product model)
        {
            if (ModelState.IsValid)
            {
                _context.Products.Add(model);

                _context.SaveChanges();

                return RedirectToAction("Index");
            }

            return View(model);
        }

        // ================= EDIT =================

        [HttpGet]
        public IActionResult Edit(int id)
        {
            var product = _context.Products.Find(id);

            if (product == null)
            {
                return NotFound();
            }

            return View(product);
        }

        [HttpPost]
        public IActionResult Edit(Product model)
        {
            if (ModelState.IsValid)
            {
                _context.Products.Update(model);

                _context.SaveChanges();

                return RedirectToAction("Index");
            }

            return View(model);
        }

        // ================= DELETE =================

        public IActionResult Delete(int id)
        {
            var product = _context.Products.Find(id);

            if (product != null)
            {
                _context.Products.Remove(product);

                _context.SaveChanges();
            }

            return RedirectToAction("Index");
        }
    }
}