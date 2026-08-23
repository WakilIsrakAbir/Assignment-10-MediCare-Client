'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import API from '../services/api';
import { auth, googleProvider } from '../lib/firebase';
import { signInWithPopup, signOut as firebaseSignOut } from 'firebase/auth';
import toast from 'react-hot-toast';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [loading, setLoading] = useState(true);

  // Load user on mount
  useEffect(() => {
    const initAuth = async () => {
      const storedToken = localStorage.getItem('medicare_token');
      const storedUser = localStorage.getItem('medicare_user');

      if (storedToken && storedUser) {
        setToken(storedToken);
        setUser(JSON.parse(storedUser));
        try {
          const res = await API.get('/auth/me');
          if (res.data.success) {
            setUser(res.data.user);
            localStorage.setItem('medicare_user', JSON.stringify(res.data.user));
          }
        } catch (error) {
          console.error('Session validation error:', error.message);
        }
      }
      setLoading(false);
    };

    initAuth();
  }, []);

  // Register
  const registerUser = async (formData) => {
    try {
      setLoading(true);
      const res = await API.post('/auth/register', formData);
      if (res.data.success) {
        setUser(res.data.user);
        setToken(res.data.token);
        localStorage.setItem('medicare_token', res.data.token);
        localStorage.setItem('medicare_user', JSON.stringify(res.data.user));
        toast.success(res.data.message || 'Registration successful!');
        return { success: true };
      }
    } catch (error) {
      const msg = error.response?.data?.message || 'Registration failed. Please try again.';
      toast.error(msg);
      return { success: false, message: msg };
    } finally {
      setLoading(false);
    }
  };

  // Login
  const loginUser = async (email, password) => {
    try {
      setLoading(true);
      const res = await API.post('/auth/login', { email, password });
      if (res.data.success) {
        setUser(res.data.user);
        setToken(res.data.token);
        localStorage.setItem('medicare_token', res.data.token);
        localStorage.setItem('medicare_user', JSON.stringify(res.data.user));
        toast.success(res.data.message || 'Welcome back!');
        return { success: true };
      }
    } catch (error) {
      const msg = error.response?.data?.message || 'Invalid credentials.';
      toast.error(msg);
      return { success: false, message: msg };
    } finally {
      setLoading(false);
    }
  };

  // Google Login
  const loginWithGoogle = async () => {
    try {
      setLoading(true);
      const result = await signInWithPopup(auth, googleProvider);
      const firebaseUser = result.user;

      const res = await API.post('/auth/google', {
        name: firebaseUser.displayName,
        email: firebaseUser.email,
        Photo: firebaseUser.photoURL,
      });

      if (res.data.success) {
        setUser(res.data.user);
        setToken(res.data.token);
        localStorage.setItem('medicare_token', res.data.token);
        localStorage.setItem('medicare_user', JSON.stringify(res.data.user));
        toast.success('Signed in with Google successfully!');
        return { success: true };
      }
    } catch (error) {
      console.error('Google Sign In Error:', error);
      const msg = error.response?.data?.message || error.message || 'Google sign-in failed.';
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
        await firebaseSignOut(auth);
      } catch (e) {
        // ignore firebase signout if not signed with firebase
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
        token,
        loading,
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
