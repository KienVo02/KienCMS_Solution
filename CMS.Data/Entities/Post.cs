/*
 * Sinh Vien: Vo Trung Kien
 * Ma SV: 2123110044
 * Ngay Tao: 14/5/2026
 * Version 1.0
 **/

using System.ComponentModel.DataAnnotations;

namespace CMS.Data.Entities
{
    public class Post
    {
        public int Id { get; set; }

        [Required(ErrorMessage = "Vui lòng nhập tiêu đề")]
        public string? Title { get; set; }

        [Required(ErrorMessage = "Vui lòng nhập nội dung")]
        public string? Content { get; set; }

        // Ảnh có thể null
        public string? ImageUrl { get; set; }

        public DateTime CreatedDate { get; set; } = DateTime.Now;

        // Foreign Key
        [Required(ErrorMessage = "Vui lòng chọn danh mục")]
        public int CategoryId { get; set; }

        // Navigation Property
        public virtual Category? Category { get; set; }
    }
}