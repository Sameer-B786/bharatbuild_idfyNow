"use client";

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

export default function Login() {
  const [email, setEmail] = useState('prof.sharma@college.edu');
  const [password, setPassword] = useState('password123');
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const handleLogin = (e) => {
    e.preventDefault();
    setIsLoading(true);
    // Mock login delay
    setTimeout(() => {
      setIsLoading(false);
      router.push('/dashboard');
    }, 1000);
  };

  return (
    <form className="space-y-6" onSubmit={handleLogin}>
      <div>
        <Label htmlFor="email">College Email Address</Label>
        <div className="mt-2">
          <Input 
            id="email" 
            name="email" 
            type="email" 
            autoComplete="email" 
            required 
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="prof.sharma@college.edu"
          />
        </div>
      </div>

      <div>
        <div className="flex items-center justify-between">
          <Label htmlFor="password">Password</Label>
          <div className="text-sm">
            <a href="#" className="font-medium text-orange-600 hover:text-orange-500">
              Forgot your password?
            </a>
          </div>
        </div>
        <div className="mt-2">
          <Input 
            id="password" 
            name="password" 
            type="password" 
            autoComplete="current-password" 
            required 
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>
      </div>

      <div>
        <Button type="submit" className="w-full bg-orange-600 hover:bg-orange-700 text-white rounded-xl py-5" disabled={isLoading}>
          {isLoading ? "Signing in..." : "Sign in"}
        </Button>
      </div>
    </form>
  );
}
