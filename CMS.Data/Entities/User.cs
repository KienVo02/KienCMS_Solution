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

    public class User
    {

        public int Id { get; set; } // Khóa chính, tự động tăng

        public string Username { get; set; } // Tên đăng nhập của người dùng, phải là duy nhất

        public string PasswordHash { get; set; } // Mật khẩu đã được băm để bảo mật

        public string FullName { get; set; } // Họ và tên đầy đủ của người dùng

        public string Role { get; set; } // Quản trị viên hoặc Biên tập viên 

    }

}