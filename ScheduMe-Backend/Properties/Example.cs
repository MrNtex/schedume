using Microsoft.AspNetCore.Mvc;

[Route("api/[controller]")]
[ApiController]
public class ExampleController : ControllerBase
{
    [HttpGet]
    public IActionResult Get()
    {
        return Ok(new { message = "Hello from .NET API" });
    }
}
