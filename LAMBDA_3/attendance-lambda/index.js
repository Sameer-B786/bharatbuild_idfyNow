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

        const userEmail = body?.userEmail || 
                         (event.headers && (event.headers['x-user-email'] || event.headers['X-User-Email'])) || 
                         (event.queryStringParameters && event.queryStringParameters.userEmail) ||
                         'anonymous';

        const bucketName = process.env.BUCKET_NAME;
        if (!bucketName) throw new Error('BUCKET_NAME environment variable is not defined');

        // 1. Save the standalone attendance record
        const recordId = randomUUID();
        const objectKey = `attendance/${userEmail}/${sectionId}/${date}_${recordId}.json`;
        
        const record = {
            id: recordId,
            sectionId,
            date,
            attendanceData,
            timestamp: new Date().toISOString()
        };

        await s3Client.send(new PutObjectCommand({
            Bucket: bucketName,
            Key: objectKey,
            Body: JSON.stringify(record),
            ContentType: 'application/json'
        }));

        // 2. ALSO update the main section JSON file so it has the new column dynamically
        try {
            const { GetObjectCommand } = require('@aws-sdk/client-s3');
            const sectionRes = await s3Client.send(new GetObjectCommand({
                Bucket: bucketName,
                Key: `sections/${userEmail}/${sectionId}.json`
            }));
            const sectionContent = await sectionRes.Body.transformToString();
            const sectionData = JSON.parse(sectionContent);
            
            if (sectionData.students && Array.isArray(sectionData.students)) {
                // Update each student with the new date column (P or A)
                sectionData.students = sectionData.students.map(student => {
                    const attRecord = attendanceData.find(a => String(a.id) === String(student.id));
                    if (attRecord) {
                        student[date] = attRecord.present ? 'P' : 'A';
                    }
                    return student;
                });

                // Save it back to S3
                await s3Client.send(new PutObjectCommand({
                    Bucket: bucketName,
                    Key: `sections/${userEmail}/${sectionId}.json`,
                    Body: JSON.stringify(sectionData),
                    ContentType: 'application/json'
                }));
            }
        } catch (updateErr) {
            console.error("Non-fatal: Failed to update main section file", updateErr);
        }

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
