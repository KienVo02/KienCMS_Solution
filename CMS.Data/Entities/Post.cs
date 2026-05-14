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

namespace CMS.Data.Entities
{

    public class Post
    {

        public int Id { get; set; }

        public string Title { get; set; } // Tiêu đề bài viết 

        public string Content { get; set; } // Nội dung chi tiết 

        public string ImageUrl { get; set; } // Hình ảnh đại diện 

        public DateTime CreatedDate { get; set; } = DateTime.Now;

        // Khóa ngoại liên kết tới Category 

        public int CategoryId { get; set; } // Id của danh mục mà bài viết thuộc về

        public virtual Category Category { get; set; } // Một bài viết thuộc một danh mục

    }

}