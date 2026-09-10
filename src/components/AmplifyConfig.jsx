"use client";

import { Amplify } from 'aws-amplify';

Amplify.configure({
  Auth: {
    Cognito: {
      userPoolId: 'ap-south-1_7Aiaq8KMC',
      userPoolClientId: '5o31rd0v9don2pvd25bcgc7f3t',
    }
  }
});

export default function AmplifyConfig({ children }) {
  return <>{children}</>;
}
