const { S3Client } = require("@aws-sdk/client-s3");

// ==========================================
// CONFIGURATION & PLACEHOLDERS
// ==========================================
// Tip: Use Environment Variables in Lambda instead of hardcoding credentials for production.
const AWS_REGION = process.env.AWS_REGION || "<YOUR_AWS_REGION_E_G_us-east-1>";
const AWS_ACCESS_KEY_ID = process.env.AWS_ACCESS_KEY_ID || "<YOUR_AWS_ACCESS_KEY_ID>";
const AWS_SECRET_ACCESS_KEY = process.env.AWS_SECRET_ACCESS_KEY || "<YOUR_AWS_SECRET_ACCESS_KEY>";

const THIRD_PARTY_API_KEY = process.env.THIRD_PARTY_API_KEY || "<YOUR_THIRD_PARTY_API_KEY>";

// Initialize AWS S3 Client (AWS SDK v3)
const s3Client = new S3Client({
    region: AWS_REGION,
    credentials: {
        accessKeyId: AWS_ACCESS_KEY_ID,
        secretAccessKey: AWS_SECRET_ACCESS_KEY,
    }
});

exports.handler = async (event) => {
    console.log("Incoming event:", JSON.stringify(event, null, 2));

    try {
        // TODO: Add your custom API logic here
        // Example: Parsing an API Gateway request body
        const body = event.body ? JSON.parse(event.body) : {};

        return {
            statusCode: 200,
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                message: "API Lambda executed successfully",
                dataReceived: body
            })
        };
    } catch (error) {
        console.error("Error executing Lambda:", error);
        return {
            statusCode: 500,
            body: JSON.stringify({ error: error.message })
        };
    }
};
