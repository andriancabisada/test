using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Options;
using Microsoft.IdentityModel.Tokens;
using Org.BouncyCastle.Crypto.Generators;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Security.Cryptography;
using System.Text;
using Test.Context;
using Test.Models;

namespace Test.Controllers
{
    [Route("[controller]")]
    [ApiController]
    public class UserController : ControllerBase
    {
        readonly DatabaseContext _dbContext = new();

        public UserController(DatabaseContext dbContext) 
        {
            _dbContext = dbContext;
        }
        // Login Endpoint
        [HttpPost("/login")]
        public IActionResult Login(User user, IOptions<JwtConfig> jwtConfig)
        {
            // Perform authentication and authorization logic
            var _user = _dbContext.Users.FirstOrDefault(u => u.Email == user.Email);
            var key = Encoding.ASCII.GetBytes(jwtConfig.Value.Key);

            if (_user == null || !VerifyPassword(user.Password, _user.Password))
            {
                return Unauthorized(new { msg = "Invalid email or password" });
            }

            // Create the access token
            var tokenHandler = new JwtSecurityTokenHandler();
            
            var tokenDescriptor = new SecurityTokenDescriptor
            {
                Subject = new ClaimsIdentity(new[]
                {
                    new Claim(ClaimTypes.NameIdentifier, user.Id.ToString())
                }),
                Expires = DateTime.UtcNow.AddHours(1), // Set token expiration time
                SigningCredentials = new SigningCredentials(new SymmetricSecurityKey(key), SecurityAlgorithms.HmacSha256Signature)
            };
            var token = tokenHandler.CreateToken(tokenDescriptor);
            var accessToken = "Bearer " + tokenHandler.WriteToken(token);

            HttpContext.Session.SetString("Email", _user.Email);
            HttpContext.Session.SetString("UserName", _user.UserName);
            HttpContext.Session.SetString("access_token", accessToken);

            var username = HttpContext.Session.GetString("UserName");

            return Ok(new { access_token = accessToken, username = username });
        }
        private bool VerifyPassword(string password, string hashedPassword)
        {
            using var sha256 = SHA256.Create();
            var hashedInput = Convert.ToBase64String(sha256.ComputeHash(Encoding.UTF8.GetBytes(password)));
            return string.Equals(hashedInput, hashedPassword);
        }

        private byte[] GenerateRandomKey(int keySizeInBits)
        {
            using var rng = new RNGCryptoServiceProvider();
            var key = new byte[keySizeInBits / 8];
            rng.GetBytes(key);
            return key;
        }
        // Logout Endpoint
        [HttpPost("/logout")]
        public IActionResult Logout()
        {
            // TODO: Implement your logout logic here
            // Example: Invalidate the JWT token, clear session data, etc.
            HttpContext.Session.Clear();
            return Ok();
        }

        // Register Endpoint
        [HttpPost("/register")]
        public  IActionResult Register(User user)
        {
            // TODO: Implement your user registration logic here
            // Example: Create a new user account, store user data in the database, etc.
            if (string.IsNullOrEmpty(user.Email) || string.IsNullOrEmpty(user.Password))
            {
                return BadRequest(new { error = "Missing username or password" });
            }

            // Check if the username already exists in the database
            var existingEmail =  _dbContext.Users.FirstOrDefault(u => u.Email == user.Email);
            if (existingEmail != null)
            {
                return BadRequest(new { error = "Email already exists" });
            }



            // Create a new user object and hash the password using a suitable hashing algorithm (e.g., bcrypt)
            using var sha256 = SHA256.Create();
            var hashedPassword = Convert.ToBase64String(sha256.ComputeHash(Encoding.UTF8.GetBytes(user.Password)));
            user.Password = hashedPassword;

            _dbContext.Users.Add(user);
            _dbContext.SaveChanges();

            return Created("", new { message = "User registered successfully" });
            
        }

        

    }
}
