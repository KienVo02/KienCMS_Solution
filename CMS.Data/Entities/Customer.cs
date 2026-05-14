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
    // Khách hàng 
    public class Customer

    {
        [Key]
        public int Id { get; set; } // Khóa chính, tự động tăng

        [Required]
        public string FullName { get; set; } // Họ và tên đầy đủ của khách hàng

        [Required]

        [EmailAddress]

        public string Email { get; set; } // Địa chỉ email của khách hàng, phải là duy nhất

        public string? Phone { get; set; }// Số điện thoại của khách hàng, có thể để trống

        public string? Address { get; set; } // Địa chỉ của khách hàng, có thể để trống

        [Required]

        public string Password { get; set; } // Lưu mật khẩu thô theo yêu cầu tối giản 

        public virtual ICollection<Order>? Orders { get; set; } // Một khách hàng có thể có nhiều đơn hàng

    }

}