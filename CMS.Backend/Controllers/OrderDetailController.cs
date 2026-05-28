using CMS.Data;
using CMS.Data.Entities;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.Rendering;
using Microsoft.EntityFrameworkCore;

namespace CMS.Backend.Controllers
{
    public class OrderDetailController : Controller
    {
        private readonly ApplicationDbContext _context;

        // Constructor Injection
        public OrderDetailController(ApplicationDbContext context)
        {
            _context = context;
        }

        // ================= INDEX =================

        public IActionResult Index()
        {
            var orderDetails = _context.OrderDetails
                                       .Include(o => o.Order)
                                       .Include(o => o.Product)
                                       .ToList();

            return View(orderDetails);
        }

        // ================= CREATE =================

        [HttpGet]
        public IActionResult Create()
        {
            ViewBag.Orders = new SelectList(
                _context.Orders,
                "Id",
                "Id"
            );

            ViewBag.Products = new SelectList(
                _context.Products,
                "Id",
                "Name"
            );

            return View();
        }

        [HttpPost]
        public IActionResult Create(OrderDetail model)
        {
            if (ModelState.IsValid == false)
            {
                ViewBag.Orders = new SelectList(
                    _context.Orders,
                    "Id",
                    "Id"
                );

                ViewBag.Products = new SelectList(
                    _context.Products,
                    "Id",
                    "Name"
                );

                return View(model);
            }

            _context.OrderDetails.Add(model);

            _context.SaveChanges();

            return RedirectToAction("Index");
        }

        // ================= EDIT =================

        [HttpGet]
        public IActionResult Edit(int id)
        {
            var orderDetail = _context.OrderDetails.Find(id);

            if (orderDetail == null)
            {
                return NotFound();
            }

            ViewBag.Orders = new SelectList(
                _context.Orders,
                "Id",
                "Id",
                orderDetail.OrderId
            );

            ViewBag.Products = new SelectList(
                _context.Products,
                "Id",
                "Name",
                orderDetail.ProductId
            );

            return View(orderDetail);
        }

        [HttpPost]
        public IActionResult Edit(OrderDetail model)
        {
            if (ModelState.IsValid == false)
            {
                ViewBag.Orders = new SelectList(
                    _context.Orders,
                    "Id",
                    "Id",
                    model.OrderId
                );

                ViewBag.Products = new SelectList(
                    _context.Products,
                    "Id",
                    "Name",
                    model.ProductId
                );

                return View(model);
            }

            _context.OrderDetails.Update(model);

            _context.SaveChanges();

            return RedirectToAction("Index");
        }

        // ================= DELETE =================

        public IActionResult Delete(int id)
        {
            var orderDetail = _context.OrderDetails.Find(id);

            if (orderDetail != null)
            {
                _context.OrderDetails.Remove(orderDetail);

                _context.SaveChanges();
            }

            return RedirectToAction("Index");
        }
    }
}