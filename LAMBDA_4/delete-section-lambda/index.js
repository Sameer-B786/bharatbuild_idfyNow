const { S3Client, DeleteObjectCommand } = require('@aws-sdk/client-s3');

const s3Client = new S3Client({ region: 'ap-south-1' });

exports.handler = async (event) => {
    try {
        const body = typeof event.body === 'string' ? JSON.parse(event.body) : event.body;
        // In a true DELETE request, you might pass sectionId in queryStringParameters or pathParameters
        // But for simplicity with API gateway setups, we'll check body and query string
        const sectionId = body?.sectionId || event.queryStringParameters?.sectionId;

        if (!sectionId) {
            return {
                statusCode: 400,
                headers: {
                    'Content-Type': 'application/json',
                    'Access-Control-Allow-Origin': '*'
                },
                body: JSON.stringify({ message: 'sectionId is required' })
            };
        }

        const bucketName = process.env.BUCKET_NAME;
        if (!bucketName) {
            throw new Error('BUCKET_NAME environment variable is not defined');
        }

        const objectKey = `sections/${sectionId}.json`;
        
        const deleteParams = {
            Bucket: bucketName,
            Key: objectKey
        };

        await s3Client.send(new DeleteObjectCommand(deleteParams));

        return {
            statusCode: 200,
            headers: {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*'
            },
            body: JSON.stringify({
                message: 'Section deleted successfully',
                sectionId: sectionId
            })
        };
        
    } catch (error) {
        console.error('Error deleting section:', error);
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
