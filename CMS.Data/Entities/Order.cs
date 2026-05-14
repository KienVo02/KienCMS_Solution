/*
 * Sinh Vien: Vo Trung Kien
 * Ma SV: 2123110044
 * Ngay Tao: 14/5/2026
 * Version 1.0
 **/

using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
namespace CMS.Data.Entities

{
    public class Order
    {
        [Key]

        public int Id { get; set; }

        public DateTime OrderDate { get; set; } = DateTime.Now;

        public int CustomerId { get; set; } // Id của khách hàng đã đặt hàng

        public int Status { get; set; } // 0: Chờ duyệt, 1: Đang giao, 2: Đã xong 

        public string? Notes { get; set; } // Ghi chú thêm về đơn hàng (vd: Yêu cầu giao hàng nhanh)

        [ForeignKey("CustomerId")]

        public virtual Customer? Customer { get; set; } // Một đơn hàng thuộc về một khách hàng cụ thể

        public virtual ICollection<OrderDetail>? OrderDetails { get; set; } // Một đơn hàng có nhiều chi tiết đơn hàng (mỗi chi tiết tương ứng với một sản phẩm đã mua)

    }

}

