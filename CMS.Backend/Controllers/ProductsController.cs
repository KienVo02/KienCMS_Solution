using CMS.Data;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

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

        [HttpGet]
        public async Task<IActionResult> GetAll()
        {
            try
            {
                var products = await ProjectProducts(_context.Products)
                    .OrderByDescending(p => p.Id)
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

        [HttpGet("latest")]
        public async Task<IActionResult> GetLatest([FromQuery] int take = 3)
        {
            try
            {
                var safeTake = Math.Clamp(take, 1, 12);
                var products = await ProjectProducts(_context.Products)
                    .OrderByDescending(p => p.Id)
                    .Take(safeTake)
                    .ToListAsync();

                return Ok(products);
            }
            catch (Exception ex)
            {
                return StatusCode(500, new
                {
                    message = "Lỗi lấy sản phẩm mới nhất",
                    detail = ex.Message
                });
            }
        }

        [HttpGet("best-sellers")]
        public async Task<IActionResult> GetBestSellers([FromQuery] int take = 3)
        {
            try
            {
                var safeTake = Math.Clamp(take, 1, 12);
                var products = await ProjectProducts(_context.Products)
                    .OrderByDescending(p => p.SoldQuantity)
                    .ThenByDescending(p => p.Id)
                    .Take(safeTake)
                    .ToListAsync();

                return Ok(products);
            }
            catch (Exception ex)
            {
                return StatusCode(500, new
                {
                    message = "Lỗi lấy sản phẩm bán chạy",
                    detail = ex.Message
                });
            }
        }

        [HttpGet("search")]
        public async Task<IActionResult> Search(
            [FromQuery] string? keyword,
            [FromQuery] int? categoryProductId,
            [FromQuery] decimal? minPrice,
            [FromQuery] decimal? maxPrice)
        {
            try
            {
                var query = _context.Products.AsQueryable();

                if (categoryProductId.HasValue && categoryProductId.Value > 0)
                {
                    query = query.Where(p => p.CategoryProductId == categoryProductId.Value);
                }

                if (minPrice.HasValue && minPrice.Value >= 0)
                {
                    query = query.Where(p => p.Price >= minPrice.Value);
                }

                if (maxPrice.HasValue && maxPrice.Value >= 0)
                {
                    query = query.Where(p => p.Price <= maxPrice.Value);
                }

                if (!string.IsNullOrWhiteSpace(keyword))
                {
                    var normalizedKeyword = keyword.Trim().ToLower();
                    query = query.Where(p =>
                        p.Name.ToLower().Contains(normalizedKeyword) ||
                        (p.CategoryProduct != null && p.CategoryProduct.Name.ToLower().Contains(normalizedKeyword)));
                }

                var products = await ProjectProducts(query)
                    .OrderByDescending(p => p.Id)
                    .ToListAsync();

                return Ok(products);
            }
            catch (Exception ex)
            {
                return StatusCode(500, new
                {
                    message = "Lỗi tìm kiếm hoặc lọc sản phẩm",
                    detail = ex.Message
                });
            }
        }

        [HttpGet("category/{categoryProductId}")]
        public async Task<IActionResult> GetByCategoryProduct(int categoryProductId)
        {
            try
            {
                var products = await ProjectProducts(
                        _context.Products.Where(p => p.CategoryProductId == categoryProductId))
                    .OrderByDescending(p => p.Id)
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

        [HttpGet("{id}")]
        public async Task<IActionResult> GetDetail(int id)
        {
            try
            {
                var product = await ProjectProducts(_context.Products.Where(p => p.Id == id))
                    .Select(p => new
                    {
                        p.Id,
                        p.Name,
                        p.Price,
                        p.ImageUrl,
                        p.StockQuantity,
                        p.Description,
                        p.CategoryProductId,
                        p.CategoryName,
                        p.SoldQuantity
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

        private IQueryable<ProductListItemDTO> ProjectProducts(IQueryable<CMS.Data.Entities.Product> query)
        {
            return query
                .Include(p => p.CategoryProduct)
                .Select(p => new ProductListItemDTO
                {
                    Id = p.Id,
                    Name = p.Name,
                    Price = p.Price,
                    ImageUrl = p.ImageUrl,
                    StockQuantity = p.StockQuantity,
                    Description = p.Description,
                    CategoryProductId = p.CategoryProductId,
                    CategoryName = p.CategoryProduct != null ? p.CategoryProduct.Name : "",
                    SoldQuantity = _context.OrderDetails
                        .Where(d => d.ProductId == p.Id)
                        .Sum(d => (int?)d.Quantity) ?? 0
                });
        }
    }

    public class ProductListItemDTO
    {
        public int Id { get; set; }

        public string Name { get; set; } = string.Empty;

        public decimal Price { get; set; }

        public string? ImageUrl { get; set; }

        public int StockQuantity { get; set; }

        public string? Description { get; set; }

        public int CategoryProductId { get; set; }

        public string CategoryName { get; set; } = string.Empty;

        public int SoldQuantity { get; set; }
    }
}
