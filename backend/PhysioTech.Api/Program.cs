using System.Text;
using System.Text.Json.Serialization;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Routing;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using Microsoft.OpenApi.Models;
using PhysioTech.Api.Data;
using PhysioTech.Api.Middleware;
using PhysioTech.Api.Models;
using PhysioTech.Api.Services;

var builder = WebApplication.CreateBuilder(args);

builder.Services
    .AddControllers()
    .AddJsonOptions(o =>
        o.JsonSerializerOptions.Converters.Add(new JsonStringEnumConverter()));

builder.Services.AddEndpointsApiExplorer();

builder.Services.AddSwaggerGen(c =>
{
    c.SwaggerDoc("v1", new OpenApiInfo
    {
        Title = "PhysioTech.Api",
        Version = "v1"
    });

    c.AddSecurityDefinition("Bearer", new OpenApiSecurityScheme
    {
        Name = "Authorization",
        Type = SecuritySchemeType.Http,
        Scheme = "bearer",
        BearerFormat = "JWT",
        In = ParameterLocation.Header,
        Description = "Wklej: Bearer {token}"
    });

    c.AddSecurityRequirement(new OpenApiSecurityRequirement
    {
        {
            new OpenApiSecurityScheme
            {
                Reference = new OpenApiReference
                {
                    Id = "Bearer",
                    Type = ReferenceType.SecurityScheme
                }
            },
            Array.Empty<string>()
        }
    });
});

builder.Services.AddDbContext<AppDbContext>(opt =>
    opt.UseSqlite(builder.Configuration.GetConnectionString("Default")));

builder.Services
    .AddIdentityCore<UserApp>(opt =>
    {
        opt.Password.RequireNonAlphanumeric = false;
        opt.Password.RequireUppercase = false;
        opt.Password.RequireLowercase = false;
        opt.Password.RequireDigit = true;
        opt.Password.RequiredLength = 8;
    })
    .AddRoles<IdentityRole>()
    .AddEntityFrameworkStores<AppDbContext>()
    .AddSignInManager<SignInManager<UserApp>>();

var jwt = builder.Configuration.GetSection("Jwt");
var jwtKey = jwt["Key"] ?? throw new InvalidOperationException("Brak Jwt:Key w konfiguracji.");
var key = Encoding.UTF8.GetBytes(jwtKey);

builder.Services.AddAuthentication(o =>
{
    o.DefaultAuthenticateScheme = JwtBearerDefaults.AuthenticationScheme;
    o.DefaultChallengeScheme = JwtBearerDefaults.AuthenticationScheme;
})
.AddJwtBearer(opt =>
{
    opt.TokenValidationParameters = new TokenValidationParameters
    {
        ValidateIssuer = true,
        ValidateAudience = true,
        ValidateLifetime = true,
        ValidateIssuerSigningKey = true,
        ValidIssuer = jwt["Issuer"],
        ValidAudience = jwt["Audience"],
        IssuerSigningKey = new SymmetricSecurityKey(key),
        ClockSkew = TimeSpan.FromMinutes(1)
    };
});

builder.Services.AddAuthorization();

builder.Services.AddCors(opt =>
{
    opt.AddPolicy("frontend", p =>
        p.WithOrigins(
            "http://localhost:5173",
            "http://localhost:5174",
            "http://127.0.0.1:5173",
            "http://127.0.0.1:5174"
        )
        .AllowAnyHeader()
        .AllowAnyMethod());
});

builder.Services.Configure<RouteOptions>(o => o.LowercaseUrls = true);

builder.Services.AddScoped<ICurrentUserService, CurrentUserService>();

var app = builder.Build();

app.UseMiddleware<ExceptionMiddleware>();

if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

if (!app.Environment.IsEnvironment("Testing"))
{
    app.UseHttpsRedirection();
}

app.UseCors("frontend");

app.UseAuthentication();
app.UseAuthorization();

app.MapControllers();

if (app.Environment.IsDevelopment())
{
    app.MapGet("/routes", (IEnumerable<EndpointDataSource> sources) =>
    {
        var routes = sources
            .SelectMany(s => s.Endpoints)
            .OfType<RouteEndpoint>()
            .Select(e => e.RoutePattern.RawText)
            .Where(x => !string.IsNullOrWhiteSpace(x))
            .Distinct()
            .OrderBy(x => x);

        return Results.Ok(routes);
    });
}

if (!app.Environment.IsEnvironment("Testing"))
{
    await SeedIdentityAsync(app);
}

app.Run();

static async Task SeedIdentityAsync(WebApplication app)
{
    using var scope = app.Services.CreateScope();

    var db = scope.ServiceProvider.GetRequiredService<AppDbContext>();
    await db.Database.MigrateAsync();

    var roleManager = scope.ServiceProvider.GetRequiredService<RoleManager<IdentityRole>>();
    var userManager = scope.ServiceProvider.GetRequiredService<UserManager<UserApp>>();

    string[] roles = { "USER", "ADMIN" };

    foreach (var r in roles)
    {
        if (!await roleManager.RoleExistsAsync(r))
        {
            var createdRole = await roleManager.CreateAsync(new IdentityRole(r));
            if (!createdRole.Succeeded)
            {
                var msg = string.Join("; ", createdRole.Errors.Select(e => e.Description));
                throw new Exception($"Nie udało się utworzyć roli {r}: {msg}");
            }
        }
    }

    var adminEmail = "admin@physiotech.com";
    var admin = await userManager.FindByEmailAsync(adminEmail);

    if (admin == null)
    {
        admin = new UserApp
        {
            UserName = adminEmail,
            Email = adminEmail
        };

        var created = await userManager.CreateAsync(admin, "Admin123!");
        if (!created.Succeeded)
        {
            var msg = string.Join("; ", created.Errors.Select(e => e.Description));
            throw new Exception($"Nie udało się utworzyć admina: {msg}");
        }

        var addRole = await userManager.AddToRoleAsync(admin, "ADMIN");
        if (!addRole.Succeeded)
        {
            var msg = string.Join("; ", addRole.Errors.Select(e => e.Description));
            throw new Exception($"Nie udało się przypisać roli ADMIN: {msg}");
        }
    }
}

public partial class Program { }