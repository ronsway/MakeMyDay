import { createContext, useContext, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import {
  getToken,
  setToken as saveToken,
  setRefreshToken as saveRefreshToken,
  clearTokens,
  fetchAPI,
} from '../lib/utils';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  // Load user on mount if token exists
  useEffect(() => {
    const token = getToken();
    if (token) {
      loadUser();
    } else {
      // Load from localStorage even without token (for demo/dev mode)
      const savedProfile = localStorage.getItem('user_profile');
      if (savedProfile) {
        try {
          setUser(JSON.parse(savedProfile));
        } catch (error) {
          console.error('Failed to parse saved profile:', error);
        }
      }
      setLoading(false);
    }
  }, []);

  async function loadUser() {
    try {
      const response = await fetchAPI('/auth/me');
      if (response.ok) {
        const data = await response.json();
        
        // Merge with localStorage profile data (avatar, photoUrl, etc.)
        const savedProfile = localStorage.getItem('user_profile');
        if (savedProfile) {
          try {
            const localData = JSON.parse(savedProfile);
            setUser({ ...data, ...localData });
          } catch (error) {
            setUser(data);
          }
        } else {
          setUser(data);
        }
      } else {
        clearTokens();
      }
    } catch (error) {
      console.error('Failed to load user:', error);
      clearTokens();
    } finally {
      setLoading(false);
    }
  }

  async function login(email, password) {
    try {
      const response = await fetch('http://localhost:3001/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (response.ok) {
        saveToken(data.tokens.accessToken);
        saveRefreshToken(data.tokens.refreshToken);
        setUser(data.user);
        toast.success('התחברת בהצלחה! 🎉');
        navigate('/');
        return { success: true };
      } else {
        toast.error(data.error || 'שגיאה בהתחברות');
        return { success: false, error: data.error };
      }
    } catch (error) {
      console.error('Login error:', error);
      toast.error('שגיאת רשת. אנא נסה שוב.');
      return { success: false, error: error.message };
    }
  }

  async function register(userData) {
    try {
      const response = await fetch('http://localhost:3001/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(userData),
      });

      const data = await response.json();

      if (response.ok) {
        saveToken(data.tokens.accessToken);
        saveRefreshToken(data.tokens.refreshToken);
        setUser(data.user);
        toast.success('נרשמת בהצלחה! 🎉');
        navigate('/');
        return { success: true };
      } else {
        toast.error(data.error || 'שגיאה בהרשמה');
        return { success: false, error: data.error };
      }
    } catch (error) {
      console.error('Register error:', error);
      toast.error('שגיאת רשת. אנא נסה שוב.');
      return { success: false, error: error.message };
    }
  }

  async function logout() {
    try {
      const token = getToken();
      if (token) {
        await fetch('http://localhost:3001/api/auth/logout', {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${token}`,
          },
        });
      }
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      clearTokens();
      setUser(null);
      toast.success('התנתקת בהצלחה');
      navigate('/login');
    }
  }

  async function updateProfile(profileData) {
    try {
      // Update user state immediately for better UX
      setUser(prev => ({
        ...prev,
        ...profileData
      }));

      // Try to update on server if authenticated
      const token = getToken();
      if (token) {
        const response = await fetchAPI('/auth/profile', {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(profileData),
        });

        if (response.ok) {
          const updatedUser = await response.json();
          setUser(updatedUser);
        }
      }

      // Always save to localStorage as backup
      const currentUser = JSON.parse(localStorage.getItem('user_profile') || '{}');
      localStorage.setItem('user_profile', JSON.stringify({
        ...currentUser,
        ...profileData
      }));

      return { success: true };
    } catch (error) {
      console.error('Update profile error:', error);
      // Even if server update fails, keep local changes
      return { success: true };
    }
  }

  const value = {
    user,
    loading,
    login,
    register,
    logout,
    updateProfile,
    isAuthenticated: !!user,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
}
