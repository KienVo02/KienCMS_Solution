using CMS.Backend.Services;
using CMS.Data;
using CMS.Data.Entities;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.Globalization;
using System.Net;

namespace CMS.Backend.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class OrdersController : ControllerBase
    {
        private readonly ApplicationDbContext _context;
        private readonly IEmailSender _emailSender;

        public OrdersController(ApplicationDbContext context, IEmailSender emailSender)
        {
            _context = context;
            _emailSender = emailSender;
        }

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
                var customer = await _context.Customers
                    .FirstOrDefaultAsync(c => c.Id == input.CustomerId);

                if (customer == null)
                {
                    await transaction.RollbackAsync();
                    return BadRequest(new { message = "Khách hàng không tồn tại" });
                }

                var newOrder = new Order
                {
                    OrderDate = DateTime.Now,
                    CustomerId = input.CustomerId,
                    Status = 0,
                    Notes = input.Notes
                };

                _context.Orders.Add(newOrder);
                await _context.SaveChangesAsync();

                var emailItems = new List<OrderEmailItem>();

                foreach (var item in input.Items)
                {
                    if (item.Quantity <= 0)
                    {
                        await transaction.RollbackAsync();
                        return BadRequest(new { message = "Số lượng mua phải lớn hơn 0" });
                    }

                    var product = await _context.Products
                        .FirstOrDefaultAsync(p => p.Id == item.ProductId);

                    if (product == null)
                    {
                        await transaction.RollbackAsync();
                        return BadRequest(new { message = $"Không tìm thấy sản phẩm có Id = {item.ProductId}" });
                    }

                    if (product.StockQuantity < item.Quantity)
                    {
                        await transaction.RollbackAsync();
                        return BadRequest(new { message = $"Sản phẩm {product.Name} không đủ số lượng tồn kho" });
                    }

                    var orderDetail = new OrderDetail
                    {
                        OrderId = newOrder.Id,
                        ProductId = product.Id,
                        Quantity = item.Quantity,
                        UnitPrice = product.Price
                    };

                    _context.OrderDetails.Add(orderDetail);
                    product.StockQuantity -= item.Quantity;

                    emailItems.Add(new OrderEmailItem(
                        product.Name,
                        item.Quantity,
                        product.Price));
                }

                await _context.SaveChangesAsync();
                await transaction.CommitAsync();

                var emailSent = await SendOrderEmailAsync(customer, newOrder, emailItems);

                return StatusCode(201, new
                {
                    message = "Đặt hàng thành công!",
                    orderId = newOrder.Id,
                    emailSent
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

        private async Task<bool> SendOrderEmailAsync(Customer customer, Order order, List<OrderEmailItem> items)
        {
            var culture = CultureInfo.GetCultureInfo("vi-VN");
            var total = items.Sum(item => item.Quantity * item.UnitPrice);
            var rows = string.Join("", items.Select(item => $"""
                <tr>
                    <td style="padding:8px;border-bottom:1px solid #eee">{WebUtility.HtmlEncode(item.ProductName)}</td>
                    <td style="padding:8px;border-bottom:1px solid #eee;text-align:center">{item.Quantity}</td>
                    <td style="padding:8px;border-bottom:1px solid #eee;text-align:right">{item.UnitPrice.ToString("N0", culture)} đ</td>
                    <td style="padding:8px;border-bottom:1px solid #eee;text-align:right">{(item.Quantity * item.UnitPrice).ToString("N0", culture)} đ</td>
                </tr>
                """));

            var htmlBody = $"""
                <h2>KienCMS.SnackFood - Xác nhận đơn hàng #{order.Id}</h2>
                <p>Xin chào <strong>{WebUtility.HtmlEncode(customer.FullName)}</strong>,</p>
                <p>Cảm ơn bạn đã đặt hàng tại KienCMS.SnackFood. Thông tin đơn hàng của bạn như sau:</p>
                <table style="width:100%;border-collapse:collapse">
                    <thead>
                        <tr>
                            <th style="padding:8px;border-bottom:2px solid #ddd;text-align:left">Sản phẩm</th>
                            <th style="padding:8px;border-bottom:2px solid #ddd;text-align:center">SL</th>
                            <th style="padding:8px;border-bottom:2px solid #ddd;text-align:right">Đơn giá</th>
                            <th style="padding:8px;border-bottom:2px solid #ddd;text-align:right">Thành tiền</th>
                        </tr>
                    </thead>
                    <tbody>{rows}</tbody>
                </table>
                <p style="font-size:18px"><strong>Tổng cộng: {total.ToString("N0", culture)} đ</strong></p>
                <p>Ghi chú: {WebUtility.HtmlEncode(order.Notes ?? "Không có")}</p>
                """;

            return await _emailSender.SendAsync(customer.Email, $"KienCMS.SnackFood - Đơn hàng #{order.Id}", htmlBody);
        }

        private record OrderEmailItem(string ProductName, int Quantity, decimal UnitPrice);
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
