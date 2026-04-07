import { OAuth2Client } from "google-auth-library";
import googleApiConnection from "../Config/google_api_connection";

const client = new OAuth2Client(googleApiConnection.clientId);

export async function verifyGoogleToken(token: string) {
    try {
        const ticket = await client.verifyIdToken({
            idToken: token,
            audience: googleApiConnection.clientId, 
        });
        const payload = ticket.getPayload();
        return payload;
    } catch (error) {
        console.error("Error verifying Google token:", error);
        return null;
    }
}