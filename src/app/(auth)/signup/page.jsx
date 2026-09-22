"use client";

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { CheckCircle2, XCircle } from 'lucide-react';

export default function SignUp() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const router = useRouter();

  const handleSignUp = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');
    
    try {
      // 1. Sign up the user
      const signupRes = await fetch('/api/auth/signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, password }),
      });
      
      const signupData = await signupRes.json();
      
      if (!signupRes.ok) {
        throw new Error(signupData.error || 'Sign up failed');
      }

      if (signupData.userConfirmed) {
        // Automatically try to log them in to redirect to dashboard
        const loginRes = await fetch('/api/auth/login', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email, password }),
        });

        if (loginRes.ok) {
          router.push('/dashboard');
          router.refresh();
        } else {
          router.push('/login?message=signup_success_please_login');
        }
      } else {
        // User needs to confirm email via OTP
        router.push(`/verify?email=${encodeURIComponent(email)}&username=${encodeURIComponent(signupData.username)}`);
      }
      
    } catch (err) {
      setError(err.message || 'An error occurred during sign up');
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
        
        <form autoComplete="off" className="space-y-6" onSubmit={handleSignUp}>
          {error && <div className="p-3 bg-red-50 text-red-600 text-sm rounded-lg text-center">{error}</div>}
          
          <div>
            <Label htmlFor="name">Full Name</Label>
            <div className="mt-2">
              <Input 
                id="name" 
                name="name" 
                type="text" 
                autoComplete="name" 
                required 
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </div>
          </div>

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
              />
            </div>
            <p className="text-xs text-gray-500 mt-2">Only .com and .in domains are supported.</p>
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
              />
            </div>
            
            {password && (
              <div className="mt-3 space-y-1.5 p-3 bg-gray-50 rounded-lg border border-gray-100">
                <p className="text-xs font-semibold text-gray-700 mb-2">Password must contain:</p>
                {[
                  { label: "At least 8 characters", met: password.length >= 8 },
                  { label: "One uppercase letter", met: /[A-Z]/.test(password) },
                  { label: "One lowercase letter", met: /[a-z]/.test(password) },
                  { label: "One number", met: /[0-9]/.test(password) },
                  { label: "One special character", met: /[^A-Za-z0-9]/.test(password) },
                ].map((c, i) => (
                  <div key={i} className="flex items-center text-xs">
                    {c.met ? (
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 mr-2 shrink-0" />
                    ) : (
                      <XCircle className="w-3.5 h-3.5 text-gray-300 mr-2 shrink-0" />
                    )}
                    <span className={c.met ? "text-emerald-700" : "text-gray-500"}>{c.label}</span>
                  </div>
                ))}
              </div>
            )}
          </div>

          <Button 
            type="submit" 
            className="w-full bg-orange-600 hover:bg-orange-700 text-white rounded-xl py-5" 
            disabled={
              isLoading || 
              (password.length > 0 && !(
                password.length >= 8 && 
                /[A-Z]/.test(password) && 
                /[a-z]/.test(password) && 
                /[0-9]/.test(password) && 
                /[^A-Za-z0-9]/.test(password)
              ))
            }
          >
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
