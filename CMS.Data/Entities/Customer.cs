using System.ComponentModel.DataAnnotations;

using System.ComponentModel.DataAnnotations.Schema;

namespace CMS.Data.Entities
{
    // Khách hàng
    public class Customer
    {
        [Key]
        public int Id { get; set; }

        // ================= FULL NAME =================

        [Required(ErrorMessage = "Họ tên không được để trống")]
        public string FullName { get; set; }

        // ================= EMAIL =================

        [Required(ErrorMessage = "Email không được để trống")]

        [EmailAddress(ErrorMessage = "Email không đúng định dạng")]
        public string Email { get; set; }

        // ================= PHONE =================

        [Required(ErrorMessage = "Số điện thoại không được để trống")]
        public string? Phone { get; set; }

        // ================= ADDRESS =================

        [Required(ErrorMessage = "Địa chỉ không được để trống")]
        public string? Address { get; set; }

        // ================= PASSWORD =================

        [Required(ErrorMessage = "Mật khẩu không được để trống")]
        [Column("Password")]
        public string PasswordHash { get; set; } = string.Empty;

        // ================= RELATIONSHIP =================

        public virtual ICollection<Order>? Orders { get; set; }
    }
}
