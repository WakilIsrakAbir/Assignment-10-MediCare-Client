import { createAuthClient } from 'better-auth/react';

const baseURL = process.env.NEXT_PUBLIC_BETTER_AUTH_URL || 'http://localhost:5000/api/better-auth';

export const authClient = createAuthClient({
  baseURL,
});

export const {
  signIn,
  signUp,
  signOut,
  useSession,
} = authClient;
