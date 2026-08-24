'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import API from '../services/api';
import { authClient, signIn as betterSignIn, signUp as betterSignUp, signOut as betterSignOut } from '../lib/auth-client';
import toast from 'react-hot-toast';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [token, setToken] = useState(null);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(false);
  const [authReady, setAuthReady] = useState(false);

  // Initialize session from localStorage & sync with backend on client mount
  useEffect(() => {
    const initAndSyncSession = async () => {
      try {
        const storedToken = localStorage.getItem('medicare_token');
        const storedUser = localStorage.getItem('medicare_user');

        if (storedToken && storedUser) {
          try {
            const parsed = JSON.parse(storedUser);
            setUser(parsed);
            setToken(storedToken);
          } catch (e) {}

          try {
            const res = await API.get('/auth/me');
            if (res.data.success && res.data.user) {
              setUser(res.data.user);
              localStorage.setItem('medicare_user', JSON.stringify(res.data.user));
            }
          } catch (error) {
            if (error.response?.status === 401) {
              localStorage.removeItem('medicare_token');
              localStorage.removeItem('medicare_user');
              setUser(null);
              setToken(null);
            }
          }
        }
      } finally {
        setAuthReady(true);
      }
    };

    initAndSyncSession();
  }, []);

  // Register with Better Auth
  const registerUser = async (formData) => {
    try {
      setLoading(true);
      const res = await API.post('/auth/register', formData);
      if (res.data.success) {
        setUser(res.data.user);
        setToken(res.data.token);
        localStorage.setItem('medicare_token', res.data.token);
        localStorage.setItem('medicare_user', JSON.stringify(res.data.user));
        toast.success(res.data.message || 'Account registered successfully!');
        return { success: true };
      }
    } catch (error) {
      const msg = error.response?.data?.message || 'Registration failed. Please check inputs.';
      toast.error(msg);
      return { success: false, message: msg };
    } finally {
      setLoading(false);
    }
  };

  // Login with Better Auth
  const loginUser = async (email, password) => {
    try {
      setLoading(true);
      const res = await API.post('/auth/login', { email, password });
      if (res.data.success) {
        setUser(res.data.user);
        setToken(res.data.token);
        localStorage.setItem('medicare_token', res.data.token);
        localStorage.setItem('medicare_user', JSON.stringify(res.data.user));
        toast.success(res.data.message || 'Welcome back to MediCare Connect!');
        return { success: true };
      }
    } catch (error) {
      const msg = error.response?.data?.message || 'Invalid email or password.';
      toast.error(msg);
      return { success: false, message: msg };
    } finally {
      setLoading(false);
    }
  };

  // Google OAuth Login via Better Auth / Google Cloud
  const loginWithGoogle = async () => {
    try {
      setLoading(true);
      if (authClient && authClient.signIn && authClient.signIn.social) {
        await authClient.signIn.social({
          provider: 'google',
          callbackURL: typeof window !== 'undefined' ? `${window.location.origin}/dashboard` : '/dashboard',
        });
        return { success: true };
      } else {
        toast.error('Google OAuth client configuration in progress.');
        return { success: false };
      }
    } catch (error) {
      console.error('Google OAuth Sign In Error:', error);
      const msg = error.message || 'Google sign-in could not be initiated.';
      toast.error(msg);
      return { success: false, message: msg };
    } finally {
      setLoading(false);
    }
  };

  // Logout
  const logoutUser = async () => {
    try {
      await API.post('/auth/logout');
      try {
        await betterSignOut();
      } catch (e) {
        // ignore if better auth session was not set
      }
      setUser(null);
      setToken(null);
      localStorage.removeItem('medicare_token');
      localStorage.removeItem('medicare_user');
      toast.success('Logged out successfully');
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        setUser,
        token,
        loading,
        authReady,
        registerUser,
        loginUser,
        loginWithGoogle,
        logoutUser,
        isAuthenticated: !!user,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
