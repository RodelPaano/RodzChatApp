import dotenv from "dotenv";
dotenv.config();

const googleApiConnection = {
    clientId: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    redirectUri: process.env.GOOGLE_REDIRECT_URI,
};

export default googleApiConnection;