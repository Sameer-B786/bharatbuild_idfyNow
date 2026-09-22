import { NextResponse } from 'next/server';
import { CognitoIdentityProviderClient, AdminUpdateUserAttributesCommand } from '@aws-sdk/client-cognito-identity-provider';
import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3';
import { getSession } from '@/lib/session';
import crypto from 'crypto';

const USER_POOL_ID = process.env.COGNITO_USER_POOL_ID;
const REGION = process.env.COGNITO_REGION || 'ap-south-1';
const BUCKET_NAME = process.env.S3_PROOFS_BUCKET || process.env.NEXT_PUBLIC_S3_BUCKET || 'bharatbuild-faculty-proofs';

export async function POST(request) {
  try {
    const session = await getSession();
    if (!session || !session.userInfo || !session.userInfo.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const email = session.userInfo.email;
    const formData = await request.formData();
    
    const name = formData.get('name');
    const institute = formData.get('institute');
    const expertise = formData.get('expertise');
    const proofFile = formData.get('proofFile');

    if (!name || !institute || !expertise || !proofFile) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    // 1. Upload file to S3
    const s3Client = new S3Client({ region: REGION });
    const fileBuffer = await proofFile.arrayBuffer();
    const fileExtension = proofFile.name.split('.').pop();
    const uniqueFileName = `${crypto.randomUUID()}.${fileExtension}`;
    const s3Key = `faculty-proofs/${email.replace(/[@.]/g, '_')}/${uniqueFileName}`;

    await s3Client.send(new PutObjectCommand({
      Bucket: BUCKET_NAME,
      Key: s3Key,
      Body: Buffer.from(fileBuffer),
      ContentType: proofFile.type,
    }));

    const fileUrl = `https://${BUCKET_NAME}.s3.${REGION}.amazonaws.com/${s3Key}`;

    // 2. Update Cognito Attributes
    if (USER_POOL_ID) {
      const cognitoClient = new CognitoIdentityProviderClient({ region: REGION });
      await cognitoClient.send(new AdminUpdateUserAttributesCommand({
        UserPoolId: USER_POOL_ID,
        Username: email,
        UserAttributes: [
          { Name: 'custom:name_as_per_inst', Value: name },
          { Name: 'custom:institute', Value: institute },
          { Name: 'custom:expertise', Value: expertise },
          { Name: 'custom:faculty_proof_url', Value: fileUrl },
          { Name: 'custom:verification_status', Value: 'pending' },
        ],
      }));
    } else {
      console.warn("COGNITO_USER_POOL_ID not set. Skipping Cognito update.");
    }

    return NextResponse.json({ success: true, message: 'Verification details submitted successfully.' });

  } catch (error) {
    console.error('Error submitting verification:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
