using Microsoft.AspNetCore.Mvc;

[Route("api/[controller]")]
[ApiController]
public class FetchUserData : ControllerBase
{
    private readonly FirestoreService _firestoreService;

    public FetchUserData(FirestoreService firestoreService)
    {
        _firestoreService = firestoreService;
    }

    [HttpGet]
    public async Task<IActionResult> Get()
    {
        // ... (Get user ID token from request)
        string idToken = Request.Headers["Authorization"].ToString();

        // Fetch user data from Firestore
        DocumentSnapshot userSnapshot = await _firestoreService.GetUserData(userId);

        // Check if the user exists
        if (userSnapshot.Exists)
        {
            // Extract user data from the snapshot
            Dictionary<string, object> userData = userSnapshot.ToDictionary();

            // Return the user data as a JSON response
            return Ok(userData);
        }
        else
        {
            return NotFound(); // User not found
        }
    }
}
