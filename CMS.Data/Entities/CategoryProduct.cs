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

namespace CMS.Data.Entities

{
    public class CategoryProduct

    {
        [Key]
        public int Id { get; set; } 

        [Required(ErrorMessage = "Tên danh mục không được để trống")]

        [StringLength(100)]

        public string Name { get; set; } // Tên danh mục sản phẩm, bắt buộc phải có, tối đa 100 ký tự

        public string? Description { get; set; } // Mô tả danh mục sản phẩm, có thể để trống

        // Quan hệ: Một danh mục có nhiều sản phẩm 

        public virtual ICollection<Product>? Products { get; set; } // Một danh mục có thể có nhiều sản phẩm, nên có một tập hợp các sản phẩm liên quan

    }

}