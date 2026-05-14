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
    public class OrderDetail

    {
        [Key]
        public int Id { get; set; } // Khóa chính, tự động tăng

        public int OrderId { get; set; } // Id của đơn hàng mà chi tiết này thuộc về

        public int ProductId { get; set; } // Id của sản phẩm mà chi tiết này liên quan đến

        public int Quantity { get; set; } // Số lượng sản phẩm đã mua

        [Column(TypeName = "decimal(18,2)")]

        public decimal UnitPrice { get; set; } // Giá tại thời điểm mua 

        [ForeignKey("OrderId")]

        public virtual Order? Order { get; set; } // Một chi tiết đơn hàng thuộc về một đơn hàng

        [ForeignKey("ProductId")]

        public virtual Product? Product { get; set; } // Một chi tiết đơn hàng liên quan đến một sản phẩm cụ thể

    }

}