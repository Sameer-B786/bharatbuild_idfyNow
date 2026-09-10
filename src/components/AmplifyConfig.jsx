"use client";

import { Amplify } from 'aws-amplify';

Amplify.configure({
  Auth: {
    Cognito: {
      userPoolId: 'ap-south-1_7Aiaq8KMC',
      userPoolClientId: '454jebfauqci5fpu1d60pfl2gb',
    }
  }
});

export default function AmplifyConfig({ children }) {
  return <>{children}</>;
}
