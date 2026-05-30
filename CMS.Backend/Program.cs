using Microsoft.EntityFrameworkCore;

using CMS.Data;
using Microsoft.AspNetCore.Authentication.Cookies;
var builder = WebApplication.CreateBuilder(args);

// Add services to the container.
builder.Services.AddControllersWithViews();
// Ðãng k? DbContext vào h? th?ng 

builder.Services.AddDbContext<ApplicationDbContext>(options =>

options.UseSqlServer(builder.Configuration.GetConnectionString("DefaultConnection")));
// 1. Khai báo d?ch v? xác th?c Cookie 

builder.Services.AddAuthentication(CookieAuthenticationDefaults.AuthenticationScheme)

    .AddCookie(options =>

    {

        options.LoginPath = "/Account/Login"; // Ðý?ng d?n n?u chýa ðãng nh?p 

        options.AccessDeniedPath = "/Account/AccessDenied"; // Ðý?ng d?n n?u vào trang không ðý?c phép 

    });
// 1. Khai báo chính sách CORS 

builder.Services.AddCors(options => {

    options.AddPolicy("AllowAll", policy => {

        // Cho phép m?i ngu?n (Origin), m?i phýõng th?c (GET, POST...), m?i tiêu ð? (Header) 

        policy.AllowAnyOrigin()

              .AllowAnyMethod()

              .AllowAnyHeader();

    });

});
var app = builder.Build();

// Configure the HTTP request pipeline.
if (!app.Environment.IsDevelopment())
{
    app.UseExceptionHandler("/Home/Error");
    // The default HSTS value is 30 days. You may want to change this for production scenarios, see https://aka.ms/aspnetcore-hsts.
    app.UseHsts();
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseHttpsRedirection();
app.UseStaticFiles();

app.UseRouting();
// 2. Kích ho?t chính sách CORS ð? khai báo ? trên 

app.UseCors("AllowAll");
app.UseAuthentication(); // BÝ?C A: Xác nh?n "Anh là ai?" (Ki?m tra th? bài) 
app.UseAuthorization();

app.MapControllerRoute(
    name: "default",
    pattern: "{controller=Home}/{action=Index}/{id?}");

app.Run();
