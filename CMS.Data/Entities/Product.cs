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
    public class Product

    {
        [Key]
        public int Id { get; set; }// Khóa chính, tự động tăng

        [Required(ErrorMessage = "Tên sản phẩm không được để trống")]

        public string Name { get; set; } // Tên sản phẩm, bắt buộc phải có

        public string? Description { get; set; } // Mô tả sản phẩm, có thể để trống

        [Range(0, double.MaxValue)]

        [Column(TypeName = "decimal(18,2)")]

        public decimal Price { get; set; } // Giá sản phẩm, phải là số dương, có 2 chữ số thập phân

        public int StockQuantity { get; set; } // Số lượng hàng tồn kho, phải là số nguyên dương

        public string? ImageUrl { get; set; } // URL hình ảnh sản phẩm, có thể để trống

        // Khóa ngoại nối tới CategoryProduct 

        public int CategoryProductId { get; set; } // Mỗi sản phẩm thuộc một danh mục, nên có khóa ngoại tới CategoryProduct

        [ForeignKey("CategoryProductId")]

        public virtual CategoryProduct? CategoryProduct { get; set; } // Một sản phẩm thuộc một danh mục

    }

}