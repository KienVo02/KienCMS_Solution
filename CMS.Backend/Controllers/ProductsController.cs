using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using CMS.Data;

namespace CMS.Backend.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class ProductsController : ControllerBase
    {
        private readonly ApplicationDbContext _context;

        public ProductsController(ApplicationDbContext context)
        {
            _context = context;
        }

        // GET: api/Products
        [HttpGet]
        public async Task<IActionResult> GetAll()
        {
            try
            {
                var products = await _context.Products
                    .Include(p => p.CategoryProduct)
                    .OrderByDescending(p => p.Id)
                    .Select(p => new
                    {
                        p.Id,
                        p.Name,
                        p.Price,
                        p.ImageUrl,
                        p.StockQuantity,

                        // Dòng này bắt buộc để React lọc theo danh mục
                        p.CategoryProductId,

                        CategoryName = p.CategoryProduct != null
                            ? p.CategoryProduct.Name
                            : ""
                    })
                    .ToListAsync();

                return Ok(products);
            }
            catch (Exception ex)
            {
                return StatusCode(500, new
                {
                    message = "Lỗi lấy danh sách sản phẩm",
                    detail = ex.Message
                });
            }
        }

        // GET: api/Products/category/1
        [HttpGet("category/{categoryProductId}")]
        public async Task<IActionResult> GetByCategoryProduct(int categoryProductId)
        {
            try
            {
                var products = await _context.Products
                    .Include(p => p.CategoryProduct)
                    .Where(p => p.CategoryProductId == categoryProductId)
                    .OrderByDescending(p => p.Id)
                    .Select(p => new
                    {
                        p.Id,
                        p.Name,
                        p.Price,
                        p.ImageUrl,
                        p.StockQuantity,
                        p.CategoryProductId,

                        CategoryName = p.CategoryProduct != null
                            ? p.CategoryProduct.Name
                            : ""
                    })
                    .ToListAsync();

                return Ok(products);
            }
            catch (Exception ex)
            {
                return StatusCode(500, new
                {
                    message = "Lỗi lọc sản phẩm theo danh mục",
                    detail = ex.Message
                });
            }
        }

        // GET: api/Products/1
        [HttpGet("{id}")]
        public async Task<IActionResult> GetDetail(int id)
        {
            try
            {
                var product = await _context.Products
                    .Include(p => p.CategoryProduct)
                    .Where(p => p.Id == id)
                    .Select(p => new
                    {
                        p.Id,
                        p.Name,
                        p.Price,
                        p.ImageUrl,
                        p.StockQuantity,
                        p.Description,
                        p.CategoryProductId,

                        CategoryName = p.CategoryProduct != null
                            ? p.CategoryProduct.Name
                            : ""
                    })
                    .FirstOrDefaultAsync();

                if (product == null)
                {
                    return NotFound(new
                    {
                        message = "Không tìm thấy sản phẩm này trong hệ thống"
                    });
                }

                return Ok(product);
            }
            catch (Exception ex)
            {
                return StatusCode(500, new
                {
                    message = "Lỗi lấy chi tiết sản phẩm",
                    detail = ex.Message
                });
            }
        }
    }
}