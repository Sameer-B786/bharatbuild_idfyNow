const { S3Client, PutObjectCommand } = require('@aws-sdk/client-s3');
const { randomUUID } = require('crypto');

const s3Client = new S3Client({ region: 'ap-south-1' });

exports.handler = async (event) => {
    try {
        const body = typeof event.body === 'string' ? JSON.parse(event.body) : event.body;
        const { sectionId, date, attendanceData } = body || {};

        if (!sectionId || !date || !attendanceData) {
            return {
                statusCode: 400,
                headers: {
                    'Content-Type': 'application/json',
                    'Access-Control-Allow-Origin': '*'
                },
                body: JSON.stringify({ message: 'sectionId, date, and attendanceData are required' })
            };
        }

        const bucketName = process.env.BUCKET_NAME;
        if (!bucketName) {
            throw new Error('BUCKET_NAME environment variable is not defined');
        }

        // Format: attendance/{sectionId}/{date-uuid}.json
        const recordId = randomUUID();
        const objectKey = `attendance/${sectionId}/${date}_${recordId}.json`;
        
        const record = {
            id: recordId,
            sectionId,
            date,
            attendanceData,
            timestamp: new Date().toISOString()
        };

        const putParams = {
            Bucket: bucketName,
            Key: objectKey,
            Body: JSON.stringify(record),
            ContentType: 'application/json'
        };

        await s3Client.send(new PutObjectCommand(putParams));

        return {
            statusCode: 201,
            headers: {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*'
            },
            body: JSON.stringify({
                message: 'Attendance saved successfully',
                data: record
            })
        };
        
    } catch (error) {
        console.error('Error saving attendance:', error);
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
