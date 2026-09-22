const { TextractClient, DetectDocumentTextCommand, StartDocumentTextDetectionCommand, GetDocumentTextDetectionCommand } = require("@aws-sdk/client-textract");

const textract = new TextractClient({});

async function waitForTextractJob(jobId) {
    let status = "IN_PROGRESS";
    let response;
    // Poll every 1 second, max 30 times (30 seconds)
    for (let i = 0; i < 30; i++) {
        response = await textract.send(new GetDocumentTextDetectionCommand({ JobId: jobId }));
        status = response.JobStatus;
        if (status === "SUCCEEDED" || status === "FAILED") {
            break;
        }
        await new Promise(r => setTimeout(r, 1000));
    }
    
    if (status !== "SUCCEEDED") {
        throw new Error("Textract job failed or timed out");
    }
    
    return response.Blocks || [];
}

exports.handler = async (event) => {
    try {
        const body = typeof event.body === 'string' ? JSON.parse(event.body) : event;
        const { bucketName, objectKey, name, institute } = body;

        if (!bucketName || !objectKey || !name || !institute) {
            return {
                statusCode: 400,
                body: JSON.stringify({ error: "Missing required parameters" })
            };
        }

        const isPdf = objectKey.toLowerCase().endsWith('.pdf');
        let blocks = [];

        if (isPdf) {
            // Async API for PDFs
            const startRes = await textract.send(new StartDocumentTextDetectionCommand({
                DocumentLocation: {
                    S3Object: {
                        Bucket: bucketName,
                        Name: objectKey
                    }
                }
            }));
            
            blocks = await waitForTextractJob(startRes.JobId);
        } else {
            // Sync API for Images (JPG/PNG)
            const res = await textract.send(new DetectDocumentTextCommand({
                Document: {
                    S3Object: {
                        Bucket: bucketName,
                        Name: objectKey
                    }
                }
            }));
            blocks = res.Blocks || [];
        }

        // Extract all text lines
        const extractedText = blocks
            .filter(b => b.BlockType === 'LINE')
            .map(b => b.Text.toLowerCase())
            .join(' ');

        // Fuzzy match: check if name and institute substrings exist
        const nameLower = name.toLowerCase();
        const instituteLower = institute.toLowerCase();

        // Split name into parts to check if at least first/last name matches
        const nameParts = nameLower.split(' ').filter(p => p.length > 2);
        let nameMatched = nameParts.some(part => extractedText.includes(part));
        
        // Check if a significant part of the institute name matches (e.g., ignoring common words like "college", "institute")
        const instParts = instituteLower.replace(/(college|institute|university|of|technology|engineering)/g, '').trim().split(' ').filter(p => p.length > 3);
        let instMatched = instParts.length > 0 
            ? instParts.some(part => extractedText.includes(part))
            : extractedText.includes(instituteLower);

        // Fallback: If parts didn't match, try full string
        if (!nameMatched) nameMatched = extractedText.includes(nameLower);
        if (!instMatched) instMatched = extractedText.includes(instituteLower);

        const isVerified = nameMatched && instMatched;

        return {
            statusCode: 200,
            headers: {
                "Content-Type": "application/json",
                "Access-Control-Allow-Origin": "*"
            },
            body: JSON.stringify({
                matchFound: isVerified,
                extractedTextSample: extractedText.substring(0, 200), // debug info
                details: { nameMatched, instMatched }
            })
        };

    } catch (error) {
        console.error("OCR Error:", error);
        return {
            statusCode: 500,
            headers: { "Access-Control-Allow-Origin": "*" },
            body: JSON.stringify({ error: error.message })
        };
    }
};
