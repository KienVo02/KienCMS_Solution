/*
 * Sinh Vien: Vo Trung Kien
 * Ma SV: 2123110044
 * Ngay Tao: 14/5/2026
 * Version 1.0
 **/

using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;

namespace CMS.Data.Entities
{
    public class CategoryProduct
    {
        [Key]
        public int Id { get; set; }

        [Required(ErrorMessage = "Tên danh mục không được để trống")]
        [StringLength(100)]
        public string Name { get; set; } = string.Empty;

        public string? Description { get; set; }

        // Thứ tự hiển thị danh mục ngoài giao diện
        public int DisplayOrder { get; set; }

        // Trạng thái hoạt động của danh mục
        public bool IsActive { get; set; } = true;

        // Quan hệ: Một danh mục có nhiều sản phẩm
        public virtual ICollection<Product>? Products { get; set; }
    }
}