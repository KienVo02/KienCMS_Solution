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

        public int Id { get; set; }

        public string Username { get; set; }

        public string PasswordHash { get; set; }

        public string FullName { get; set; }

        public string Role { get; set; } // Quản trị viên hoặc Biên tập viên 

    }

}