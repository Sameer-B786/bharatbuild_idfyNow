"use client";

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function SignUp() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const router = useRouter();

  const handleSignUp = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');
    
    // Simulate signup request
    try {
      await new Promise(resolve => setTimeout(resolve, 1000));
      router.push('/login');
    } catch (err) {
      setError('An error occurred during sign up');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="w-full max-w-md space-y-8 bg-white p-8 rounded-2xl shadow-sm border border-gray-100">
        <div className="text-center">
          <h2 className="text-3xl font-bold tracking-tight text-gray-900">IDfyNow</h2>
          <p className="text-gray-500 mt-2">Create a new account</p>
        </div>
        
        <form className="space-y-6" onSubmit={handleSignUp}>
          {error && <div className="p-3 bg-red-50 text-red-600 text-sm rounded-lg text-center">{error}</div>}
          
          <div>
            <Label htmlFor="email">Email Address</Label>
            <div className="mt-2">
              <Input 
                id="email" 
                name="email" 
                type="email" 
                autoComplete="email" 
                required 
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
              />
            </div>
          </div>

          <div>
            <Label htmlFor="password">Password</Label>
            <div className="mt-2">
              <Input 
                id="password" 
                name="password" 
                type="password" 
                autoComplete="new-password" 
                required 
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
              />
            </div>
          </div>

          <Button type="submit" className="w-full bg-orange-600 hover:bg-orange-700 text-white rounded-xl py-5" disabled={isLoading}>
            {isLoading ? "Signing up..." : "Sign up"}
          </Button>

          <div className="text-center text-sm text-gray-500 mt-4">
            Already have an account?{' '}
            <Link href="/login" className="font-medium text-orange-600 hover:text-orange-500">
              Sign in
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
}
