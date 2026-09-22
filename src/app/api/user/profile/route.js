import { NextResponse } from 'next/server';
import { CognitoIdentityProviderClient, AdminUpdateUserAttributesCommand } from '@aws-sdk/client-cognito-identity-provider';
import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3';
import { getSession } from '@/lib/session';
import crypto from 'crypto';

const USER_POOL_ID = process.env.COGNITO_USER_POOL_ID;
const REGION = process.env.COGNITO_REGION || 'ap-south-1';
const BUCKET_NAME = process.env.S3_PROOFS_BUCKET || process.env.NEXT_PUBLIC_S3_BUCKET || 'verifybuck';

export async function PUT(request) {
  try {
    const session = await getSession();
    if (!session || !session.userInfo || !session.userInfo.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const email = session.userInfo.email;
    const formData = await request.formData();
    
    const name = formData.get('name');
    const nameAsPerInst = formData.get('nameAsPerInst');
    const institute = formData.get('institute');
    const expertise = formData.get('expertise');
    const profilePic = formData.get('profilePic'); // Optional file

    let profilePicUrl = null;

    // 1. Upload profile picture to S3 if provided
    if (profilePic && profilePic instanceof Blob) {
      const s3Client = new S3Client({ region: REGION });
      const fileBuffer = await profilePic.arrayBuffer();
      // Use original extension or default to jpg
      const fileExtension = profilePic.name?.split('.').pop() || 'jpg';
      const uniqueFileName = `${crypto.randomUUID()}.${fileExtension}`;
      const s3Key = `profile-pics/${email.replace(/[@.]/g, '_')}/${uniqueFileName}`;

      await s3Client.send(new PutObjectCommand({
        Bucket: BUCKET_NAME,
        Key: s3Key,
        Body: Buffer.from(fileBuffer),
        ContentType: profilePic.type || 'image/jpeg',
      }));

      profilePicUrl = `https://${BUCKET_NAME}.s3.${REGION}.amazonaws.com/${s3Key}`;
    }

    // 2. Update Cognito Attributes
    if (USER_POOL_ID) {
      const attributes = [];
      
      if (name) attributes.push({ Name: 'name', Value: name });
      if (nameAsPerInst) attributes.push({ Name: 'custom:name_as_per_inst', Value: nameAsPerInst });
      if (institute) attributes.push({ Name: 'custom:institute', Value: institute });
      if (expertise) attributes.push({ Name: 'custom:expertise', Value: expertise });
      if (profilePicUrl) attributes.push({ Name: 'picture', Value: profilePicUrl });

      if (attributes.length > 0) {
        const cognitoClient = new CognitoIdentityProviderClient({ region: REGION });
        await cognitoClient.send(new AdminUpdateUserAttributesCommand({
          UserPoolId: USER_POOL_ID,
          Username: email,
          UserAttributes: attributes,
        }));
      }
    } else {
      console.warn("COGNITO_USER_POOL_ID not set. Skipping Cognito update.");
    }

    return NextResponse.json({ 
      success: true, 
      message: 'Profile updated successfully',
      profilePicUrl 
    });

  } catch (error) {
    console.error('Error updating profile:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
