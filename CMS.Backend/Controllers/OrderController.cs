using CMS.Data;
using CMS.Data.Entities;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.Rendering;
using Microsoft.EntityFrameworkCore;

namespace CMS.Backend.Controllers
{
    public class OrderController : Controller
    {
        private readonly ApplicationDbContext _context;

        // Constructor Injection
        public OrderController(ApplicationDbContext context)
        {
            _context = context;
        }

        // ================= INDEX =================

        public IActionResult Index()
        {
            var orders = _context.Orders
                                 .Include(o => o.Customer)
                                 .ToList();

            return View(orders);
        }

        // ================= CREATE =================

        [HttpGet]
        public IActionResult Create()
        {
            ViewBag.Customers = new SelectList(
                _context.Customers,
                "Id",
                "FullName"
            );

            return View();
        }

        [HttpPost]
        public IActionResult Create(Order model)
        {
            if (ModelState.IsValid == false)
            {
                ViewBag.Customers = new SelectList(
                    _context.Customers,
                    "Id",
                    "FullName"
                );

                return View(model);
            }

            _context.Orders.Add(model);

            _context.SaveChanges();

            return RedirectToAction("Index");
        }

        // ================= EDIT =================

        [HttpGet]
        public IActionResult Edit(int id)
        {
            var order = _context.Orders.Find(id);

            if (order == null)
            {
                return NotFound();
            }

            ViewBag.Customers = new SelectList(
                _context.Customers,
                "Id",
                "FullName",
                order.CustomerId
            );

            return View(order);
        }

        [HttpPost]
        public IActionResult Edit(Order model)
        {
            if (ModelState.IsValid == false)
            {
                ViewBag.Customers = new SelectList(
                    _context.Customers,
                    "Id",
                    "FullName",
                    model.CustomerId
                );

                return View(model);
            }

            _context.Orders.Update(model);

            _context.SaveChanges();

            return RedirectToAction("Index");
        }

        // ================= DELETE =================

        public IActionResult Delete(int id)
        {
            var order = _context.Orders.Find(id);

            if (order != null)
            {
                _context.Orders.Remove(order);

                _context.SaveChanges();
            }

            return RedirectToAction("Index");
        }
    }
}