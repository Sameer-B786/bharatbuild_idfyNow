import { NextResponse } from 'next/server';
import { CognitoIdentityProviderClient, ConfirmSignUpCommand } from '@aws-sdk/client-cognito-identity-provider';
import crypto from 'crypto';

const CLIENT_ID = '2hmfg0env9k3v9ue94b9fsbjmc';
const CLIENT_SECRET = '15fav35q8tnflbeckaovkst8j1d9gi5lhugkerr5j2v7lpog1im9';
const REGION = 'ap-south-1';

function calculateSecretHash(username) {
  return crypto
    .createHmac('SHA256', CLIENT_SECRET)
    .update(username + CLIENT_ID)
    .digest('base64');
}

export async function POST(request) {
  try {
    const { email, code } = await request.json();

    if (!email || !code) {
      return NextResponse.json({ error: 'Email and verification code are required' }, { status: 400 });
    }

    const client = new CognitoIdentityProviderClient({ region: REGION });
    const secretHash = calculateSecretHash(email);

    const command = new ConfirmSignUpCommand({
      ClientId: CLIENT_ID,
      Username: email,
      ConfirmationCode: code,
      SecretHash: secretHash,
    });

    await client.send(command);

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Verification error:', error);
    
    let message = 'An error occurred during verification';
    if (error.name === 'CodeMismatchException') {
      message = 'Invalid verification code';
    } else if (error.name === 'ExpiredCodeException') {
      message = 'Verification code has expired';
    } else if (error.name === 'NotAuthorizedException') {
      message = 'User is already confirmed or invalid';
    }

    return NextResponse.json({ error: message }, { status: 400 });
  }
}
