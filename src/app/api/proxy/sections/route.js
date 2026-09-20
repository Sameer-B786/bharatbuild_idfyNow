import { NextResponse } from 'next/server';
import { getSession } from '@/lib/session';

export async function GET(request) {
  try {
    const session = await getSession();
    if (!session?.userInfo?.email) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'https://86m9zhdtc8.execute-api.ap-south-1.amazonaws.com/production/api/sections';
    const targetUrl = new URL(apiUrl);
    searchParams.forEach((value, key) => targetUrl.searchParams.append(key, value));

    const response = await fetch(targetUrl, {
      method: 'GET',
      headers: {
        'x-user-email': session.userInfo.email,
        'Content-Type': 'application/json',
      },
      cache: 'no-store'
    });

    const data = await response.json();
    return NextResponse.json(data, { status: response.status });
  } catch (error) {
    return NextResponse.json({ message: 'Internal server error', error: error.message }, { status: 500 });
  }
}

export async function POST(request) {
  try {
    const session = await getSession();
    if (!session?.userInfo?.email) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'https://86m9zhdtc8.execute-api.ap-south-1.amazonaws.com/production/api/sections';

    const response = await fetch(apiUrl, {
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

export async function DELETE(request) {
  try {
    const session = await getSession();
    if (!session?.userInfo?.email) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'https://86m9zhdtc8.execute-api.ap-south-1.amazonaws.com/production/api/sections';

    const response = await fetch(apiUrl, {
      method: 'DELETE',
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
