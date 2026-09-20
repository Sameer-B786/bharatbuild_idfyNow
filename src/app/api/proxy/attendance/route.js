import { NextResponse } from 'next/server';
import { getSession } from '@/lib/session';

export async function POST(request) {
  try {
    const session = await getSession();
    if (!session?.userInfo?.email) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const apiUrl = 'https://86m9zhdtc8.execute-api.ap-south-1.amazonaws.com/production/api/attendance'; // Fallback

    const baseApiUrl = process.env.NEXT_PUBLIC_API_URL ? process.env.NEXT_PUBLIC_API_URL.replace('/sections', '') : 'https://86m9zhdtc8.execute-api.ap-south-1.amazonaws.com/production/api';
    const targetUrl = `${baseApiUrl}/attendance`;

    const response = await fetch(targetUrl, {
      method: 'POST',
      headers: {
        'x-user-email': session.userInfo.email,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(body),
    });

    const data = await response.json();
    return NextResponse.json(data, { status: response.status });
  } catch (error) {
    return NextResponse.json({ message: 'Internal server error', error: error.message }, { status: 500 });
  }
}
