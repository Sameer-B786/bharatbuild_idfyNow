const { S3Client, ListObjectsV2Command, GetObjectCommand } = require('@aws-sdk/client-s3');

const s3Client = new S3Client({ region: 'ap-south-1' });



exports.handler = async (event) => {
    try {
        const bucketName = process.env.BUCKET_NAME;
        if (!bucketName) {
            throw new Error('BUCKET_NAME environment variable is not defined');
        }

        // Check if the user is requesting a specific section for integration (e.g. ERP, PowerBI)
        const queryParams = event.queryStringParameters || {};
        if (queryParams.sectionId) {
            const getResponse = await s3Client.send(new GetObjectCommand({
                Bucket: bucketName,
                Key: `sections/${queryParams.sectionId}.json`
            }));
            const sectionData = JSON.parse(await getResponse.Body.transformToString());
            
            // If they want CSV (for Google Sheets / ERP import)
            if (queryParams.format === 'csv') {
                let csvString = '';
                if (sectionData.students && sectionData.students.length > 0) {
                    const allKeys = new Set();
                    sectionData.students.forEach(s => Object.keys(s).forEach(k => allKeys.add(k)));
                    const headers = Array.from(allKeys);
                    csvString += headers.join(',') + '\n';
                    sectionData.students.forEach(s => {
                        const row = headers.map(h => s[h] || '');
                        csvString += row.join(',') + '\n';
                    });
                }
                return {
                    statusCode: 200,
                    headers: { 'Content-Type': 'text/csv', 'Access-Control-Allow-Origin': '*' },
                    body: csvString
                };
            }
            
            // Default return single section as JSON
            return {
                statusCode: 200,
                headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' },
                body: JSON.stringify(sectionData)
            };
        }

        // Default behavior: List all sections for the dashboard
        const listParams = {
            Bucket: bucketName,
            Prefix: 'sections/'
        };
        const listResponse = await s3Client.send(new ListObjectsV2Command(listParams));

        const sections = [];

        // If there are files, fetch each one's content
        if (listResponse.Contents) {
            for (const item of listResponse.Contents) {
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
                'Access-Control-Allow-Origin': '*'
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
