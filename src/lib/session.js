import { cookies } from 'next/headers';
import { decodeJwt } from 'jose';

export async function createSession({ idToken }) {
  const cookieStore = await cookies();
  const decoded = decodeJwt(idToken);
  
  cookieStore.set('idToken', idToken, {
    expires: new Date(decoded.exp * 1000),
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    path: '/',
  });
}

export async function getSession() {
  const cookieStore = await cookies();
  const idToken = cookieStore.get('idToken')?.value;
  if (!idToken) return null;
  
  try {
    const decoded = decodeJwt(idToken);
    // Check if token is expired
    if (decoded.exp * 1000 < Date.now()) {
      return null;
    }
    
    return {
      userInfo: {
        email: decoded.email,
        name: decoded.name || decoded.email?.split('@')[0],
      }
    };
  } catch (error) {
    return null;
  }
}

export async function clearSession() {
  const cookieStore = await cookies();
  cookieStore.set('idToken', '', {
    expires: new Date(0),
    httpOnly: true,
    path: '/',
  });
}
