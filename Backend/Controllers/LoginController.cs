using Microsoft.AspNetCore.Mvc;

[ApiController]
[Route("api/[controller]")]
public class LoginController : ControllerBase
{
    [HttpGet]
    public IActionResult GetProducts()
    {
        var products = new List<string> { "Product1", "Product2", "Product3" };
        return Ok(products);
    }
}
