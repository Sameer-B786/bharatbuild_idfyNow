import { NextResponse } from 'next/server';
import { createSession } from '@/lib/auth';

export async function POST(request) {
  try {
    const body = await request.json();
    const { email, password } = body;

    // TODO: Replace with real database check
    if (email === 'prof.sharma@college.edu' && password === 'password123') {
      await createSession('user_123');
      return NextResponse.json({ success: true });
    }

    return NextResponse.json(
      { error: 'Invalid email or password' },
      { status: 401 }
    );
  } catch (error) {
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
