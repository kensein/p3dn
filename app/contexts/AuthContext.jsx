'use client';

import { createContext, useContext, useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

const AuthContext = createContext({});

const BASE_PATH = (process.env.NEXT_PUBLIC_BASE_PATH || '').replace(/\/$/, '');
const COOKIE_PATH = BASE_PATH || '/';

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  // Load user dari localStorage saat mount (client-only)
  useEffect(() => {
    const loadUser = () => {
      try {
        const savedUser = localStorage.getItem('user');
        const token = localStorage.getItem('token');

        if (savedUser && token) {
          setUser(JSON.parse(savedUser));
        }
      } catch (error) {
        console.error('Error loading user:', error);
        localStorage.removeItem('user');
        localStorage.removeItem('token');
      } finally {
        setLoading(false);
      }
    };

    loadUser();
  }, []);

  // Login function
  const login = async (email, password) => {
    try {
      if (typeof window === 'undefined') {
        throw new Error('Login hanya bisa dilakukan di client side');
      }

      // Call backend API
      const apiUrl =
        process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api';
      const response = await fetch(`${apiUrl}/auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(data.message || 'Login gagal');
      }

      const { token, user: userData } = data;

      // Simpan ke localStorage
      localStorage.setItem('user', JSON.stringify(userData));
      localStorage.setItem('token', token);

      // Simpan ke cookie untuk middleware (path mengikuti sub-path /p3dn)
      document.cookie = `token=${token}; path=${COOKIE_PATH}; max-age=86400; SameSite=Lax`;
      document.cookie = `role=${userData.role}; path=${COOKIE_PATH}; max-age=86400; SameSite=Lax`;

      setUser(userData);

      // Redirect berdasarkan role
      if (userData.role === 'admin') {
        router.push('/admin');
      } else {
        router.push('/home');
      }

      return { success: true };
    } catch (error) {
      return { success: false, error: error.message };
    }
  };

  // Register function
  const register = async (formData) => {
    try {
      // Call backend API
      const apiUrl =
        process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api';
      const response = await fetch(`${apiUrl}/auth/register`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(data.message || 'Registrasi gagal');
      }

      return { success: true, message: 'Registrasi berhasil! Silakan login.' };
    } catch (error) {
      return { success: false, error: error.message };
    }
  };

  // Logout function
  const logout = () => {
    if (typeof window === 'undefined') return;

    localStorage.removeItem('user');
    localStorage.removeItem('token');

    // Hapus cookies
    document.cookie = `token=; path=${COOKIE_PATH}; max-age=0; SameSite=Lax`;
    document.cookie = `role=; path=${COOKIE_PATH}; max-age=0; SameSite=Lax`;

    setUser(null);
    router.push('/login');
  };

  // Check if user has required role
  const hasRole = (requiredRole) => {
    if (!user) return false;
    if (Array.isArray(requiredRole)) {
      return requiredRole.includes(user.role);
    }
    return user.role === requiredRole;
  };

  const value = {
    user,
    loading,
    login,
    register,
    logout,
    hasRole,
    isAuthenticated: !!user,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth harus digunakan dalam AuthProvider');
  }
  return context;
};
