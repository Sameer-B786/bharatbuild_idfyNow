"use client";

import { signIn } from "next-auth/react";
import { Button } from '@/components/ui/button';

export default function Login() {
  const handleLogin = (e) => {
    e.preventDefault();
    signIn("cognito", { callbackUrl: "/dashboard" });
  };

  return (
    <div className="space-y-6 flex flex-col justify-center text-center">
      <div>
        <h2 className="text-2xl font-bold">Welcome Back</h2>
        <p className="text-gray-500 mt-2">Sign in using your college portal via AWS Cognito.</p>
      </div>
      <div>
        <Button onClick={handleLogin} className="w-full bg-orange-600 hover:bg-orange-700 text-white rounded-xl py-5">
          Sign in with Cognito
        </Button>
      </div>
    </div>
  );
}
