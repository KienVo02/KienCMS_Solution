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

    public class Category
    {

        public int Id { get; set; } // Khóa chính, tự động tăng
        public string Name { get; set; } // Tên danh mục (vd: Tin Giáo Dục) 
        public string Description { get; set; } // Mô tả ngắn về danh mục (vd: Chuyên mục tin tức về giáo dục)

        // Quan hệ: Một danh mục có nhiều bài viết 
        public virtual ICollection<Post> Posts { get; set; }// Một danh mục có thể có nhiều bài viết, nên có một tập hợp các bài viết liên quan

    }

}
