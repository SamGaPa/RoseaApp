using System.Diagnostics;
using System.Security.Claims;
using Rosea.Services;
using Rosea.Middleware;
using Serilog;
using Serilog.Formatting.Json;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.IdentityModel.Tokens;
using Microsoft.AspNetCore.Builder;
using Microsoft.Extensions.DependencyInjection;
using System;

var builder = WebApplication.CreateBuilder(args);

// Configure Serilog (JSON output)
var environment = builder.Environment.EnvironmentName;
Log.Logger = new LoggerConfiguration()
    .Enrich.FromLogContext()
    .Enrich.WithProperty("service", "Rosea")
    .Enrich.WithProperty("env", environment)
    .Enrich.WithMachineName()
    .WriteTo.Console(new JsonFormatter(renderMessage: true))
    .WriteTo.File(new JsonFormatter(renderMessage: true), "Logs/rosea-.json", rollingInterval: RollingInterval.Day, retainedFileCountLimit: 14)
    .CreateLogger();

builder.Host.UseSerilog();

// ================= SERVICIOS =================

// HTTP Client para API
builder.Services.AddHttpClient<ProductoService>();

// MVC
builder.Services.AddControllersWithViews();

// HttpContext para Layout y Controllers
builder.Services.AddHttpContextAccessor();

// SESIONES
builder.Services.AddDistributedMemoryCache();
builder.Services.AddSession(options =>
{
    options.Cookie.Name = ".Rosea.Session";
    options.Cookie.HttpOnly = true;
    options.Cookie.IsEssential = true;
    options.IdleTimeout = TimeSpan.FromHours(1);
});

builder.Services.AddAuthentication("Bearer")
    .AddJwtBearer("Bearer", options =>
    {
        options.TokenValidationParameters = new TokenValidationParameters
        {
            ValidateIssuer = false,
            ValidateAudience = false,
            ValidateLifetime = true,
            ValidateIssuerSigningKey = true,
            IssuerSigningKey = new SymmetricSecurityKey(
                System.Text.Encoding.UTF8.GetBytes("SUPER_SECRETO_ROSEA_2026_2250_NO_SE_LO_DICES_A_NADIE")
            )
        };

        // 🔥 AQUÍ está la magia
        options.Events = new JwtBearerEvents
        {
            OnMessageReceived = context =>
            {
                var token = context.Request.Cookies["jwt"];
                if (!string.IsNullOrEmpty(token))
                {
                    context.Token = token;
                }
                return Task.CompletedTask;
            }
        };
    });

builder.Services.AddAuthorization();

// (Opcional futuro) Autenticación con cookies
//builder.Services.AddAuthentication("Cookies")
//    .AddCookie("Cookies", options =>
//    {
//        options.LoginPath = "/Account/Login";
//        options.AccessDeniedPath = "/Account/AccessDenied";
//    });

var app = builder.Build();


// ================= PIPELINE =================

if (!app.Environment.IsDevelopment())
{
    app.UseExceptionHandler("/Error/404");
    app.UseHsts();
}

app.UseStatusCodePagesWithReExecute("/Error/404");

app.UseHttpsRedirection();
app.UseStaticFiles();

app.UseRouting();

// Add exception logging middleware first
app.UseMiddleware<ExceptionLoggingMiddleware>();

// Request logging middleware should run early to capture timings
app.UseMiddleware<RequestLoggingMiddleware>();

// ⚠️ ORDEN IMPORTANTE
app.UseSession();          // 1️⃣ Sesiones
app.UseAuthentication();   // 2️⃣ Auth
app.UseAuthorization();    // 3️⃣ Roles

app.MapControllerRoute(
    name: "default",
    pattern: "{controller=Store}/{action=Index}/{id?}");

app.Run();


