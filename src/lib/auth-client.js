import { createAuthClient } from 'better-auth/react';

const getAuthURL = () => {
  if (process.env.NEXT_PUBLIC_BETTER_AUTH_URL) {
    return process.env.NEXT_PUBLIC_BETTER_AUTH_URL;
  }
  if (typeof window !== 'undefined' && window.location.hostname.includes('vercel.app')) {
    return 'https://assignment-10-medi-care-server.vercel.app/api/better-auth';
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
