using Google.Cloud.Firestore;
using FirebaseAdmin;
using Google.Apis.Auth.OAuth2;
using System.Threading.Tasks;

public class FirestoreService
{
    private readonly FirestoreDb _firestoreDb;

    public FirestoreService(string projectId, string idToken)
    {
        // Initialize Firebase Admin SDK
        FirebaseApp.Create(new AppOptions()
        {
            Credential = GoogleCredential.FromJson(idToken)
        });

        // Connect to Firestore
        _firestoreDb = FirestoreDb.Create(projectId);
    }

    public async Task<DocumentSnapshot> GetUserData(string userId)
    {
        // Access Firestore using the authenticated connection
        DocumentReference docRef = _firestoreDb.Collection("users").Document(userId);
        return await docRef.GetSnapshotAsync();
    }

    // ... other methods for interacting with Firestore
}
