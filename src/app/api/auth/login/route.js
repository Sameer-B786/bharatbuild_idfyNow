import { NextResponse } from 'next/server';
import { CognitoIdentityProviderClient, InitiateAuthCommand } from '@aws-sdk/client-cognito-identity-provider';
import crypto from 'crypto';
import { createSession } from '@/lib/session';
import { decodeJwt } from 'jose';

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
    const { email, password } = await request.json();

    if (!email || !password) {
      return NextResponse.json({ error: 'Email and password are required' }, { status: 400 });
    }

    const client = new CognitoIdentityProviderClient({ region: REGION });
    const secretHash = calculateSecretHash(email);

    const command = new InitiateAuthCommand({
      AuthFlow: 'USER_PASSWORD_AUTH',
      ClientId: CLIENT_ID,
      AuthParameters: {
        USERNAME: email,
        PASSWORD: password,
        SECRET_HASH: secretHash,
      },
    });

    const response = await client.send(command);

    if (response.AuthenticationResult) {
      // Decode ID token to get the user's name
      const idToken = response.AuthenticationResult.IdToken;
      const decodedIdToken = decodeJwt(idToken);
      const name = decodedIdToken.name || email.split('@')[0]; // fallback to email prefix if name is missing

      // Create session with tokens and user info
      await createSession({
        email,
        name,
        accessToken: response.AuthenticationResult.AccessToken,
        idToken,
      });

      return NextResponse.json({ success: true });
    }

    // Handle challenges like NEW_PASSWORD_REQUIRED if needed
    return NextResponse.json({ error: 'Authentication challenge required' }, { status: 400 });
  } catch (error) {
    console.error('Login error:', error);
    
    // Customize error messages based on Cognito exceptions
    let message = 'An error occurred during login: ' + error.message;
    if (error.name === 'NotAuthorizedException') {
      message = 'Incorrect email or password';
    } else if (error.name === 'UserNotFoundException') {
      message = 'User does not exist';
    } else if (error.name === 'UserNotConfirmedException') {
      message = 'Please confirm your email address before logging in';
    }

    return NextResponse.json({ error: message }, { status: 401 });
  }
}
