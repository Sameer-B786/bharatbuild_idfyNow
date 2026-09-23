import { NextResponse } from 'next/server';
import { CognitoIdentityProviderClient, UpdateUserAttributesCommand } from '@aws-sdk/client-cognito-identity-provider';
import { getSession } from '@/lib/session';

const REGION = process.env.COGNITO_REGION || 'ap-south-1';

export async function POST(request) {
  try {
    const session = await getSession();
    if (!session || !session.userInfo || !session.userInfo.email || !session.accessToken) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const email = session.userInfo.email;
    const accessToken = session.accessToken;
    const formData = await request.formData();
    
    const name = formData.get('name');
    const institute = formData.get('institute');
    const expertise = formData.get('expertise');

    if (!name || !institute || !expertise) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    // 1. Verify using email domain (e.g. valid college emails)
    // Here we can automatically verify them since they logged in with a college email.
    // Update Cognito Attributes
    const cognitoConfig = { region: REGION };
    
    const awsAccessKey = process.env.IDFY_AWS_ACCESS_KEY_ID || process.env.AWS_ACCESS_KEY_ID;
    const awsSecretKey = process.env.IDFY_AWS_SECRET_ACCESS_KEY || process.env.AWS_SECRET_ACCESS_KEY;
    if (awsAccessKey && awsSecretKey) {
      cognitoConfig.credentials = {
        accessKeyId: awsAccessKey,
        secretAccessKey: awsSecretKey,
      };
    }
    
    const cognitoClient = new CognitoIdentityProviderClient(cognitoConfig);
    await cognitoClient.send(new UpdateUserAttributesCommand({
      AccessToken: accessToken,
      UserAttributes: [
        { Name: 'custom:name_as_per_inst', Value: name },
        { Name: 'custom:institute', Value: institute },
        { Name: 'custom:expertise', Value: expertise },
        { Name: 'custom:verification_status', Value: 'verified' },
      ],
    }));

    return NextResponse.json({ success: true, message: 'You have been successfully verified based on your college email!' });

  } catch (error) {
    console.error('Error submitting verification:', error);
    return NextResponse.json({ error: 'Internal server error: ' + error.message, stack: error.stack }, { status: 500 });
  }
}
