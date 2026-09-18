const { S3Client, ListObjectsV2Command, GetObjectCommand } = require('@aws-sdk/client-s3');

const s3Client = new S3Client({ region: 'ap-south-1' });



exports.handler = async (event) => {
    try {
        const bucketName = process.env.BUCKET_NAME;
        if (!bucketName) {
            throw new Error('BUCKET_NAME environment variable is not defined');
        }

        // List all objects in the "sections/" directory of the bucket
        const listParams = {
            Bucket: bucketName,
            Prefix: 'sections/'
        };
        const listResponse = await s3Client.send(new ListObjectsV2Command(listParams));

        const sections = [];

        // If there are files, fetch each one's content
        if (listResponse.Contents) {
            for (const item of listResponse.Contents) {
                // Only process .json files
                if (item.Key.endsWith('.json')) {
                    const getParams = {
                        Bucket: bucketName,
                        Key: item.Key
                    };
                    const getResponse = await s3Client.send(new GetObjectCommand(getParams));
                    const fileContent = await getResponse.Body.transformToString();
                    sections.push(JSON.parse(fileContent));
                }
            }
        }

        return {
            statusCode: 200,
            headers: {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*' // Crucial for frontend API calls
            },
            body: JSON.stringify({
                message: 'Sections fetched successfully',
                data: sections
            })
        };
        
    } catch (error) {
        console.error('Error fetching sections:', error);
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
