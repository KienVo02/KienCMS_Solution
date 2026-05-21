using CMS.Data;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.Linq;

namespace CMS.Backend.Controllers
{
    public class PostController : Controller
    {
        private readonly ApplicationDbContext _context;

        // Constructor Injection
        public PostController(ApplicationDbContext context)
        {
            _context = context;
        }

        // Danh sách bài viết
        public IActionResult Index()
        {
            var posts = _context.Posts
                                .Include(p => p.Category)
                                .OrderByDescending(p => p.CreatedDate)
                                .ToList();

            return View(posts);
        }

        public IActionResult Details(int id)

        {

            // 1. Truy vấn bài viết theo ID 

            // Sử dụng .Include(p => p.Category) để lấy kèm thông tin Danh mục (Join bảng) 

            var post = _context.Posts

                .Include(p => p.Category)

                .FirstOrDefault(p => p.Id == id);



            // 2. Kiểm tra nếu không tìm thấy bài viết (tránh lỗi màn hình trắng) 

            if (post == null)

            {

                return NotFound(); // Trả về trang lỗi 404 

            }



            // 3. Truyền dữ liệu sang View 

            return View(post);

        }
    }
}