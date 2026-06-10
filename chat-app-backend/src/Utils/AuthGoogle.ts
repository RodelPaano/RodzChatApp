import { OAuth2Client } from "google-auth-library";
import googleApiConnection from "../Config/google_api_connection";

const client = new OAuth2Client(googleApiConnection.clientId);

export async function verifyGoogleToken(token: string) : Promise<any | null> {
    try {
        const ticket = await client.verifyIdToken({
            idToken: token,
            audience: googleApiConnection.clientId,
        });
        const payload = ticket.getPayload();
        if(!payload) {
            return null;
        }
        return payload || null;

    } catch (error) {
        console.error("Error verifying Google token:", error);
        throw new Error("Failed to verify Google token");
    }
}