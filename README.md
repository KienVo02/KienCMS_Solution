# KienCMS.SnackFood - Website Bán Đồ Ăn Vặt Online

KienCMS.SnackFood là đồ án website bán đồ ăn vặt online, xây dựng theo mô hình Backend ASP.NET Core + Frontend ReactJS. Hệ thống có phần quản trị dữ liệu bằng ASP.NET Core MVC, Web API cho React gọi dữ liệu, và giao diện người dùng để xem sản phẩm, đọc tin tức, thêm giỏ hàng, đăng nhập/đăng ký khách hàng và đặt hàng.

Thông tin đồ án:

| Nội dung | Thông tin |
| --- | --- |
| Sinh viên | Vo Trung Kien |
| MSSV | 2123110044 |
| Đề tài | Website Bán Đồ Ăn Vặt Online |
| Tên sản phẩm | KienCMS.SnackFood |
| Backend | ASP.NET Core 8, Entity Framework Core, SQL Server LocalDB |
| Frontend | ReactJS, React Router DOM, Axios |
| Cơ sở dữ liệu mặc định | `ThaiCMS_DB` |

## 1. Tổng quan chức năng

### Backend ASP.NET Core

Backend nằm trong thư mục `CMS.Backend`, dùng để quản trị dữ liệu và cung cấp API cho frontend.

Các nhóm chức năng chính:

- Quản trị danh mục sản phẩm đồ ăn vặt.
- Quản trị sản phẩm: tên, mô tả, giá, tồn kho, hình ảnh, danh mục.
- Quản trị bài viết CMS/tin tức.
- Quản trị khách hàng, đơn hàng và chi tiết đơn hàng.
- Đăng ký, đăng nhập khách hàng qua API.
- API đọc sản phẩm, danh mục, bài viết và tạo đơn hàng.
- Swagger để kiểm tra nhanh API.
- Lưu ảnh sản phẩm trong `CMS.Backend/wwwroot/img/products`.

### Frontend ReactJS

Frontend nằm trong thư mục `cms.frontend`, là giao diện khách hàng của website SnackFood.

Các màn hình chính:

- Trang chủ: banner SnackFood, danh mục từ API, sản phẩm nổi bật, tin tức mới nhất.
- HeroBanner dạng slider tự động, có nút lùi/tới và chấm điều hướng, lấy nội dung từ Product, Post và CategoryProduct.
- Cửa hàng: lọc sản phẩm theo danh mục, khoảng giá và từ khóa.
- Phân trang cho các lưới ProductGrid/PostGrid khi danh sách có nhiều dữ liệu.
- Chi tiết sản phẩm: ảnh, giá, mô tả, tồn kho, chọn số lượng, thêm giỏ hàng.
- Tin tức: danh sách bài viết và trang chi tiết bài viết.
- Giỏ hàng: tăng/giảm số lượng, xóa sản phẩm, tính tổng tiền.
- Thanh toán: kiểm tra đăng nhập, gửi đơn hàng về API `Orders`.
- Đăng nhập/đăng ký khách hàng.

## 2. Cấu trúc thư mục

```text
KienCMS_Solution/
├── CMS.Backend/              # ASP.NET Core MVC + Web API
│   ├── Controllers/          # MVC Controller và API Controller
│   ├── Views/                # Giao diện quản trị MVC
│   ├── wwwroot/img/          # Hình ảnh bài viết và sản phẩm
│   ├── Program.cs            # Cấu hình service, CORS, Swagger, routing
│   └── appsettings.json      # Chuỗi kết nối SQL Server
│
├── CMS.Data/                 # Entity, DbContext, Migration
│   ├── Entities/             # Product, CategoryProduct, Customer, Order...
│   ├── Migrations/           # Migration tạo database
│   └── ApplicationDbContext.cs
│
├── cms.frontend/             # ReactJS frontend
│   ├── public/               # File tĩnh, ảnh banner
│   ├── src/api/              # Cấu hình Axios
│   ├── src/components/       # Header, Footer, ProductCard, PostCard
│   ├── src/pages/            # Home, Shop, Product Detail, Blog, Cart...
│   ├── src/services/         # Service gọi API
│   └── package.json
│
├── KienCMS_Solution.sln      # File solution mở bằng Visual Studio
└── README.md
```

## 3. Yêu cầu cài đặt

Trước khi chạy dự án, máy cần có:

- Visual Studio 2022.
- .NET 8 SDK.
- SQL Server LocalDB hoặc SQL Server Express.
- Node.js và npm.
- Git.

Khuyến nghị:

- Chạy Backend bằng profile `https` để frontend gọi API mặc định tại `https://localhost:7204/api`.
- Chạy Backend trước, sau đó mới chạy Frontend.

## 4. Cấu hình cơ sở dữ liệu

Chuỗi kết nối mặc định nằm trong file `CMS.Backend/appsettings.json`:

```json
"ConnectionStrings": {
  "DefaultConnection": "Server=(localdb)\\MSSQLLocalDB;Database=ThaiCMS_DB;Trusted_Connection=True;MultipleActiveResultSets=true;TrustServerCertificate=True"
}
```

Nếu dùng SQL Server khác, sửa lại `DefaultConnection` cho đúng máy của bạn.

### Tạo database bằng Migration

Cách 1: Dùng Visual Studio Package Manager Console:

```powershell
Update-Database
```

Lưu ý trong Visual Studio:

- Startup Project: `CMS.Backend`.
- Default Project trong Package Manager Console: `CMS.Data`.

Cách 2: Dùng terminal tại thư mục gốc repository:

```powershell
dotnet ef database update --project CMS.Data --startup-project CMS.Backend
```

Sau khi chạy thành công, database `ThaiCMS_DB` sẽ được tạo theo các migration trong `CMS.Data/Migrations`.

## 5. Chạy Backend bằng Visual Studio F5

1. Mở file solution:

```text
KienCMS_Solution.sln
```

2. Trong Visual Studio, chọn project khởi động là:

```text
CMS.Backend
```

3. Chọn profile chạy:

```text
https
```

4. Nhấn `F5` hoặc nút Run.

5. Backend sẽ chạy mặc định ở:

```text
https://localhost:7204
http://localhost:5249
```

6. Kiểm tra Swagger:

```text
https://localhost:7204/swagger
```

Các API frontend đang dùng:

| API | Chức năng |
| --- | --- |
| `GET /api/Products` | Lấy danh sách sản phẩm |
| `GET /api/Products/{id}` | Lấy chi tiết sản phẩm |
| `GET /api/Products/category/{categoryProductId}` | Lọc sản phẩm theo danh mục |
| `GET /api/CategoriesProducts` | Lấy danh mục sản phẩm |
| `GET /api/Posts` | Lấy danh sách bài viết |
| `GET /api/Posts/{id}` | Lấy chi tiết bài viết |
| `POST /api/Auth/CustomerRegister` | Đăng ký khách hàng |
| `POST /api/Auth/CustomerLogin` | Đăng nhập khách hàng |
| `POST /api/Orders` | Tạo đơn hàng |
| `GET /api/Orders/customer/{customerId}` | Lấy lịch sử đơn hàng theo khách hàng |

## 6. Chạy Frontend bằng npm start

Mở terminal tại thư mục gốc repository, sau đó vào thư mục frontend:

```powershell
cd cms.frontend
```

Cài thư viện lần đầu:

```powershell
npm install
```

Chạy frontend:

```powershell
npm start
```

React sẽ mở ở:

```text
http://localhost:3000
```

Nếu port `3000` đang bận, React sẽ hỏi chạy ở port khác. Bạn có thể bấm `Y`.

## 7. Cấu hình URL API cho Frontend

Mặc định frontend gọi API tại:

```text
https://localhost:7204/api
```

Cấu hình nằm trong:

```text
cms.frontend/src/api/axiosClient.js
```

Nếu backend của bạn chạy port khác, có thể tạo file `.env` trong thư mục `cms.frontend`:

```env
REACT_APP_API_URL=https://localhost:7204/api
```

Sau khi sửa `.env`, tắt frontend và chạy lại:

```powershell
npm start
```

## 8. Quy trình chạy đầy đủ

Thứ tự nên chạy:

1. Mở Visual Studio.
2. Mở `KienCMS_Solution.sln`.
3. Kiểm tra chuỗi kết nối trong `CMS.Backend/appsettings.json`.
4. Chạy migration nếu database chưa có.
5. Chạy Backend bằng `F5`.
6. Mở terminal:

```powershell
cd cms.frontend
npm install
npm start
```

7. Truy cập frontend:

```text
http://localhost:3000
```

8. Truy cập Swagger để kiểm tra API:

```text
https://localhost:7204/swagger
```

## 9. Luồng sử dụng website

### Khách hàng

1. Vào trang chủ để xem banner, danh mục, sản phẩm nổi bật và tin tức.
2. Vào trang Cửa hàng để lọc sản phẩm theo danh mục, giá hoặc từ khóa.
3. Bấm xem chi tiết sản phẩm.
4. Chọn số lượng và thêm vào giỏ hàng.
5. Vào giỏ hàng để kiểm tra tổng tiền.
6. Đăng ký hoặc đăng nhập tài khoản khách hàng.
7. Vào thanh toán và xác nhận đặt hàng.

### Quản trị

1. Chạy Backend bằng Visual Studio.
2. Dùng các màn hình MVC trong `CMS.Backend/Views` để quản lý dữ liệu.
3. Quản lý danh mục, sản phẩm, bài viết, khách hàng, đơn hàng.
4. Hình ảnh sản phẩm được lưu trong `CMS.Backend/wwwroot/img/products`.

## 10. Một số lỗi thường gặp

### Frontend không tải được sản phẩm

Kiểm tra:

- Backend đã chạy chưa.
- Backend đang chạy đúng port `https://localhost:7204` chưa.
- Truy cập được `https://localhost:7204/swagger` chưa.
- Trình duyệt đã chấp nhận chứng chỉ HTTPS local chưa.

### Lỗi database

Kiểm tra:

- SQL Server LocalDB đã cài chưa.
- Chuỗi kết nối trong `appsettings.json` đúng chưa.
- Đã chạy `Update-Database` chưa.

### Port 3000 bị bận

Khi chạy `npm start`, React có thể hỏi:

```text
Would you like to run the app on another port instead?
```

Bấm `Y` để chạy ở port khác.

### Không đặt hàng được

Kiểm tra:

- Đã đăng nhập khách hàng chưa.
- Giỏ hàng có sản phẩm chưa.
- Số lượng mua có vượt tồn kho không.
- API `POST /api/Orders` hoạt động trong Swagger chưa.

## 11. Build Frontend

Khi cần build bản production:

```powershell
cd cms.frontend
npm run build
```

Thư mục kết quả:

```text
cms.frontend/build
```

## 12. Ghi chú phát triển

- Backend bật CORS `AllowAll` trong `Program.cs` để React gọi API khi chạy local.
- Frontend dùng React Router DOM để điều hướng các trang: `/`, `/shop`, `/product/:id`, `/blog`, `/cart`, `/checkout`, `/login`, `/register`.
- Giỏ hàng được lưu tạm bằng `localStorage`.
- Khi đặt hàng, frontend gửi `customerId`, ghi chú và danh sách sản phẩm đến API `Orders`.
- API tạo đơn hàng có kiểm tra tồn kho và trừ số lượng sản phẩm sau khi đặt hàng thành công.

## 13. Tác giả

```text
Vo Trung Kien
MSSV: 2123110044
Đề tài: Website Bán Đồ Ăn Vặt Online
Sản phẩm: KienCMS.SnackFood
```
