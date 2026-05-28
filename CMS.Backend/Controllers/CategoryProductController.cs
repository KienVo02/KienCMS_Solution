using CMS.Data;
using CMS.Data.Entities;
using Microsoft.AspNetCore.Mvc;

namespace CMS.Backend.Controllers
{
    public class CategoryProductController : Controller
    {
        private readonly ApplicationDbContext _context;

        public CategoryProductController(ApplicationDbContext context)
        {
            _context = context;
        }

        // INDEX
        public IActionResult Index()
        {
            var data = _context.CategoriesProducts.ToList();

            return View(data);
        }

        // ================= CREATE =================

        [HttpGet]
        public IActionResult Create()
        {
            return View();
        }

        [HttpPost]
        public IActionResult Create(CategoryProduct model)
        {
            _context.CategoriesProducts.Add(model);

            _context.SaveChanges();

            return RedirectToAction("Index");
        }

        // ================= EDIT =================

        [HttpGet]
        public IActionResult Edit(int id)
        {
            var categoryProduct = _context.CategoriesProducts.Find(id);

            if (categoryProduct == null)
            {
                return NotFound();
            }

            return View(categoryProduct);
        }

        [HttpPost]
        public IActionResult Edit(CategoryProduct model)
        {
            _context.CategoriesProducts.Update(model);

            _context.SaveChanges();

            return RedirectToAction("Index");
        }

        // ================= DELETE =================

        public IActionResult Delete(int id)
        {
            var categoryProduct = _context.CategoriesProducts.Find(id);

            if (categoryProduct != null)
            {
                _context.CategoriesProducts.Remove(categoryProduct);

                _context.SaveChanges();
            }

            return RedirectToAction("Index");
        }
    }
}