using Microsoft.EntityFrameworkCore;
using CMS.Data;
using Microsoft.AspNetCore.Authentication.Cookies;
using Microsoft.OpenApi;

var builder = WebApplication.CreateBuilder(args);

// ======================================================
// 1. KHU V?C ÐÃNG K? D?CH V? - SERVICES CONTAINER
// ======================================================

// V?a nh?n di?n Controller API, v?a gi? View MVC c?
builder.Services.AddControllersWithViews();

// Swagger
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen(c =>
{
    c.SwaggerDoc("v1", new OpenApiInfo
    {
        Title = "ThaiCMS Web API",
        Version = "v1"
    });
});

// Ðãng k? DbContext
builder.Services.AddDbContext<ApplicationDbContext>(options =>
    options.UseSqlServer(builder.Configuration.GetConnectionString("DefaultConnection")));

// Khai báo xác th?c Cookie
builder.Services.AddAuthentication(CookieAuthenticationDefaults.AuthenticationScheme)
    .AddCookie(options =>
    {
        options.LoginPath = "/Account/Login";
        options.AccessDeniedPath = "/Account/AccessDenied";
    });

// Khai báo chính sách CORS
builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowAll", policy =>
    {
        policy.AllowAnyOrigin()
              .AllowAnyMethod()
              .AllowAnyHeader();
    });
});

var app = builder.Build();

// ======================================================
// 2. KHU V?C C?U H?NH MIDDLEWARE - REQUEST PIPELINE
// ======================================================

if (!app.Environment.IsDevelopment())
{
    app.UseExceptionHandler("/Home/Error");
    app.UseHsts();
}

// Swagger nên ð?t ngoài if ð? ch?y ðý?c c? Development và Production
app.UseSwagger();
app.UseSwaggerUI(c =>
{
    c.SwaggerEndpoint("/swagger/v1/swagger.json", "ThaiCMS Web API v1");
    c.RoutePrefix = "swagger";
});

app.UseHttpsRedirection();
app.UseStaticFiles();

app.UseRouting();

// CORS ph?i n?m sau UseRouting và trý?c Authentication / Authorization
app.UseCors("AllowAll");

app.UseAuthentication();
app.UseAuthorization();

// ======================================================
// 3. KHU V?C Ð?NH TUY?N PHÂN LU?NG - ROUTING MAP
// ======================================================

// Phân lu?ng A: API Controller d?ng /api/[controller]
app.MapControllers();

// Phân lu?ng B: MVC Controller c?
app.MapControllerRoute(
    name: "default",
    pattern: "{controller=Home}/{action=Index}/{id?}");

app.Run();