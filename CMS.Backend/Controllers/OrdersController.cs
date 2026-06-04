using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using CMS.Data;
using CMS.Data.Entities;

namespace CMS.Backend.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class OrdersController : ControllerBase
    {
        private readonly ApplicationDbContext _context;

        public OrdersController(ApplicationDbContext context)
        {
            _context = context;
        }

        // POST: api/Orders
        [HttpPost]
        public async Task<IActionResult> CreateOrder([FromBody] CreateOrderDTO input)
        {
            if (input == null)
            {
                return BadRequest(new { message = "Dữ liệu đơn hàng không hợp lệ" });
            }

            if (input.CustomerId <= 0)
            {
                return BadRequest(new { message = "CustomerId không hợp lệ" });
            }

            if (input.Items == null || input.Items.Count == 0)
            {
                return BadRequest(new { message = "Giỏ hàng đang trống" });
            }

            using var transaction = await _context.Database.BeginTransactionAsync();

            try
            {
                // 1. Kiểm tra khách hàng có tồn tại không
                var customerExists = await _context.Customers
                    .AnyAsync(c => c.Id == input.CustomerId);

                if (!customerExists)
                {
                    await transaction.RollbackAsync();
                    return BadRequest(new { message = "Khách hàng không tồn tại" });
                }

                // 2. Tạo đơn hàng mới
                var newOrder = new Order
                {
                    OrderDate = DateTime.Now,
                    CustomerId = input.CustomerId,
                    Status = 0,
                    Notes = input.Notes
                };

                _context.Orders.Add(newOrder);
                await _context.SaveChangesAsync();

                // 3. Duyệt từng sản phẩm trong giỏ hàng
                foreach (var item in input.Items)
                {
                    if (item.Quantity <= 0)
                    {
                        await transaction.RollbackAsync();
                        return BadRequest(new
                        {
                            message = "Số lượng mua phải lớn hơn 0"
                        });
                    }

                    var product = await _context.Products
                        .FirstOrDefaultAsync(p => p.Id == item.ProductId);

                    if (product == null)
                    {
                        await transaction.RollbackAsync();
                        return BadRequest(new
                        {
                            message = $"Không tìm thấy sản phẩm có Id = {item.ProductId}"
                        });
                    }

                    if (product.StockQuantity < item.Quantity)
                    {
                        await transaction.RollbackAsync();
                        return BadRequest(new
                        {
                            message = $"Sản phẩm {product.Name} không đủ số lượng tồn kho"
                        });
                    }

                    // 4. Tạo chi tiết đơn hàng
                    var orderDetail = new OrderDetail
                    {
                        OrderId = newOrder.Id,
                        ProductId = product.Id,
                        Quantity = item.Quantity,
                        UnitPrice = product.Price
                    };

                    _context.OrderDetails.Add(orderDetail);

                    // 5. Trừ số lượng tồn kho
                    product.StockQuantity -= item.Quantity;
                }

                await _context.SaveChangesAsync();

                await transaction.CommitAsync();

                return StatusCode(201, new
                {
                    message = "Đặt hàng thành công!",
                    orderId = newOrder.Id
                });
            }
            catch (Exception ex)
            {
                await transaction.RollbackAsync();

                return StatusCode(500, new
                {
                    message = "Lỗi xử lý tạo đơn hàng",
                    detail = ex.Message
                });
            }
        }

        // GET: api/Orders/customer/1
        [HttpGet("customer/{customerId}")]
        public async Task<IActionResult> GetOrdersByCustomer(int customerId)
        {
            try
            {
                var orders = await _context.Orders
                    .Where(o => o.CustomerId == customerId)
                    .OrderByDescending(o => o.OrderDate)
                    .Select(o => new
                    {
                        o.Id,
                        o.OrderDate,
                        o.Status,
                        o.Notes,
                        Details = o.OrderDetails.Select(d => new
                        {
                            d.ProductId,
                            ProductName = d.Product != null ? d.Product.Name : "",
                            d.Quantity,
                            d.UnitPrice,
                            Total = d.Quantity * d.UnitPrice
                        }).ToList()
                    })
                    .ToListAsync();

                return Ok(orders);
            }
            catch (Exception ex)
            {
                return StatusCode(500, new
                {
                    message = "Lỗi lấy lịch sử đơn hàng",
                    detail = ex.Message
                });
            }
        }
    }

    public class CreateOrderDTO
    {
        public int CustomerId { get; set; }

        public string? Notes { get; set; }

        public List<CreateOrderItemDTO> Items { get; set; } = new List<CreateOrderItemDTO>();
    }

    public class CreateOrderItemDTO
    {
        public int ProductId { get; set; }

        public int Quantity { get; set; }
    }
}