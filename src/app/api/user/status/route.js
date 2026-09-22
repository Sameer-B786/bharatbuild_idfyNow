import { NextResponse } from 'next/server';
import { CognitoIdentityProviderClient, AdminGetUserCommand } from '@aws-sdk/client-cognito-identity-provider';
import { getSession } from '@/lib/session';

const CLIENT_ID = process.env.COGNITO_CLIENT_ID;
const USER_POOL_ID = process.env.COGNITO_USER_POOL_ID;
const REGION = process.env.COGNITO_REGION || 'ap-south-1';

export async function GET() {
  try {
    const session = await getSession();
    if (!session || !session.userInfo || !session.userInfo.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    if (!USER_POOL_ID) {
      console.warn("COGNITO_USER_POOL_ID is not set. Returning default verified status.");
      return NextResponse.json({ isVerified: true, status: 'verified' });
    }

    const client = new CognitoIdentityProviderClient({ region: REGION });

    const command = new AdminGetUserCommand({
      UserPoolId: USER_POOL_ID,
      Username: session.userInfo.email,
    });

    const response = await client.send(command);

    const attributes = response.UserAttributes || [];
    const statusAttr = attributes.find(attr => attr.Name === 'custom:verification_status');
    const status = statusAttr ? statusAttr.Value : 'unverified';

    return NextResponse.json({ 
      isVerified: status === 'verified' || status === 'pending',
      status: status
    });

  } catch (error) {
    console.error('Error fetching user status:', error);
    // If user not found or error, default to unverified so they get prompted
    return NextResponse.json({ isVerified: false, status: 'error' }, { status: 500 });
  }
}
