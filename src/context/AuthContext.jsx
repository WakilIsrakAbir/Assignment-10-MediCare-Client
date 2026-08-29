'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import API from '../services/api';
import { authClient, signIn as betterSignIn, signUp as betterSignUp, signOut as betterSignOut } from '../lib/auth-client';
import { signInWithPopup } from 'firebase/auth';
import { auth, googleProvider } from '../lib/firebase';
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

  // Register with Better Auth / API
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

  // Login with Better Auth / API
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

  // Google OAuth Login via Firebase Authentication & Backend Sync
  const loginWithGoogle = async () => {
    try {
      setLoading(true);
      // 1. Popup with Firebase Google Auth
      const result = await signInWithPopup(auth, googleProvider);
      const firebaseUser = result.user;

      // 2. Send Google profile to backend to create/fetch user and get JWT
      const res = await API.post('/auth/google', {
        name: firebaseUser.displayName || 'Google User',
        email: firebaseUser.email,
        photo: firebaseUser.photoURL || '',
      });

      if (res.data.success) {
        setUser(res.data.user);
        setToken(res.data.token);
        localStorage.setItem('medicare_token', res.data.token);
        localStorage.setItem('medicare_user', JSON.stringify(res.data.user));
        toast.success(res.data.message || `Welcome, ${res.data.user.name}!`);
        return { success: true, user: res.data.user };
      } else {
        toast.error(res.data.message || 'Google sign-in failed on server.');
        return { success: false, message: res.data.message };
      }
    } catch (error) {
      console.error('Google Sign In Error:', error);
      if (error.code === 'auth/popup-closed-by-user') {
        toast.error('Google sign-in popup was closed before completing.');
      } else if (error.code === 'auth/unauthorized-domain') {
        toast.error('This domain is not authorized in Firebase Console.');
      } else {
        const msg = error.response?.data?.message || error.message || 'Google sign-in failed.';
        toast.error(msg);
      }
      return { success: false, message: error.message };
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
