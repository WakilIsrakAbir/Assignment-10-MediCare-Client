import { createAuthClient } from 'better-auth/react';

const LIVE_AUTH_URL = 'https://assignment-10-medi-care-server.vercel.app/api/better-auth';

const getAuthURL = () => {
  // When running in the browser, check current domain
  if (typeof window !== 'undefined') {
    const hostname = window.location.hostname;
    const isLocal = hostname === 'localhost' || hostname === '127.0.0.1' || hostname.startsWith('192.168.');
    if (!isLocal) {
      return LIVE_AUTH_URL;
    }
  }

  // If explicit environment variable is set and doesn't point to localhost in production
  if (process.env.NEXT_PUBLIC_BETTER_AUTH_URL) {
    if (process.env.NODE_ENV === 'production' && process.env.NEXT_PUBLIC_BETTER_AUTH_URL.includes('localhost')) {
      return LIVE_AUTH_URL;
    }
    return process.env.NEXT_PUBLIC_BETTER_AUTH_URL;
  }

  // In production builds, default to live auth server
  if (process.env.NODE_ENV === 'production') {
    return LIVE_AUTH_URL;
  }

  return 'http://localhost:5000/api/better-auth';
};

const baseURL = getAuthURL();

export const authClient = createAuthClient({
  baseURL,
});

export const {
  signIn,
  signUp,
  signOut,
  useSession,
} = authClient;
