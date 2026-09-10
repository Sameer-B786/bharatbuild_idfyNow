"use client";

import { Authenticator } from '@aws-amplify/ui-react';
import '@aws-amplify/ui-react/styles.css';
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function Login() {
  const router = useRouter();

  return (
    <div className="w-full flex justify-center py-8">
      <Authenticator>
        {({ user }) => {
          if (user) {
            router.push('/dashboard');
          }
          return (
            <div className="text-center">
              <h2 className="text-xl font-bold mt-4">Logging in...</h2>
              <p className="text-gray-500">Redirecting to your dashboard.</p>
            </div>
          );
        }}
      </Authenticator>
    </div>
  );
}
