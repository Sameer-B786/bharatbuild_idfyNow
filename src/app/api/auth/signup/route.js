import { NextResponse } from 'next/server';
import { CognitoIdentityProviderClient, SignUpCommand } from '@aws-sdk/client-cognito-identity-provider';
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
    const { email, password } = await request.json();

    if (!email || !password) {
      return NextResponse.json({ error: 'Email and password are required' }, { status: 400 });
    }

    const client = new CognitoIdentityProviderClient({ region: REGION });
    const secretHash = calculateSecretHash(email);

    const command = new SignUpCommand({
      ClientId: CLIENT_ID,
      Username: email,
      Password: password,
      SecretHash: secretHash,
      UserAttributes: [
        {
          Name: 'email',
          Value: email,
        },
      ],
    });

    const response = await client.send(command);

    return NextResponse.json({ 
      success: true, 
      userConfirmed: response.UserConfirmed 
    });

  } catch (error) {
    console.error('Signup error:', error);
    
    let message = 'An error occurred during sign up';
    if (error.name === 'UsernameExistsException') {
      message = 'An account with this email already exists';
    } else if (error.name === 'InvalidPasswordException') {
      message = 'Password does not meet requirements';
    } else if (error.name === 'InvalidParameterException') {
      message = error.message;
    }

    return NextResponse.json({ error: message }, { status: 400 });
  }
}
