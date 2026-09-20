const { S3Client, PutObjectCommand } = require('@aws-sdk/client-s3');
const { v4: uuidv4 } = require('uuid');

const s3Client = new S3Client({ region: 'ap-south-1' });

exports.handler = async (event) => {
    try {
        // Parse the incoming request body
        const body = typeof event.body === 'string' ? JSON.parse(event.body) : event.body;
        
        // You can customize these fields based on your actual form data
        const { sectionName, description, ...otherData } = body || {};
        
        // Validate required fields
        if (!sectionName) {
            return {
                statusCode: 400,
                headers: {
                    'Content-Type': 'application/json',
                    'Access-Control-Allow-Origin': '*' // Allow CORS for frontend
                },
                body: JSON.stringify({ message: 'sectionName is required' })
            };
        }
        
        const sectionId = uuidv4();
        const timestamp = new Date().toISOString();
        
        // Prepare the section data
        const sectionData = {
            id: sectionId,
            sectionName,
            description: description || '',
            createdAt: timestamp,
            ...otherData
        };
        
        // Ensure BUCKET_NAME is set in the Lambda environment variables
        const bucketName = process.env.BUCKET_NAME; 
        if (!bucketName) {
            throw new Error('BUCKET_NAME environment variable is not defined');
        }

        const userEmail = (body && body.userEmail) ||
                         (event.headers && (event.headers['x-user-email'] || event.headers['X-User-Email'])) || 
                         (event.queryStringParameters && event.queryStringParameters.userEmail) ||
                         'anonymous';

        const objectKey = `sections/${userEmail}/${sectionId}.json`;
        
        // Save to S3
        const putParams = {
            Bucket: bucketName,
            Key: objectKey,
            Body: JSON.stringify(sectionData),
            ContentType: 'application/json'
        };
        
        await s3Client.send(new PutObjectCommand(putParams));
        
        // Return success response to the frontend client
        // This data will be used to dynamically update the manage sections page
        return {
            statusCode: 201,
            headers: {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*' // Essential for frontend API calls
            },
            body: JSON.stringify({
                message: 'Section created successfully',
                data: sectionData 
            })
        };
        
    } catch (error) {
        console.error('Error creating section:', error);
        return {
            statusCode: 500,
            headers: {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*'
            },
            body: JSON.stringify({ message: 'Internal server error', error: error.message })
        };
    }
};
