"use client";

import { Authenticator, ThemeProvider, View, Image, Text, useTheme } from '@aws-amplify/ui-react';
import '@aws-amplify/ui-react/styles.css';
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

const components = {
  Header() {
    return (
      <View textAlign="center" padding="2rem 0 1rem 0">
        <h2 className="text-3xl font-bold tracking-tight text-gray-900">IDfyNow</h2>
        <p className="text-gray-500 mt-2">Sign in to your college portal</p>
      </View>
    );
  },
  Footer() {
    return (
      <View textAlign="center" padding="1rem">
        <p className="text-sm text-gray-400">© 2026 IDfyNow. All rights reserved.</p>
      </View>
    );
  }
};

export default function Login() {
  const router = useRouter();

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="w-full max-w-md space-y-8">
        <Authenticator 
          components={components}
          hideSignUp={true}
        >
          {({ user }) => {
            if (user) {
              router.push('/dashboard');
            }
            return (
              <div className="text-center p-8">
                <h2 className="text-xl font-bold mt-4">Logging in...</h2>
                <p className="text-gray-500">Redirecting to your dashboard.</p>
              </div>
            );
          }}
        </Authenticator>
      </div>
    </div>
  );
}
