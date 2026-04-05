import { createContext, useCallback, useEffect, useMemo, useState } from 'react';
import { getCurrentUserRequest, loginRequest, signupRequest } from '../services/authService.js';

const TOKEN_STORAGE_KEY = 'access_token';

export const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [token, setToken] = useState(() => localStorage.getItem(TOKEN_STORAGE_KEY));
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(Boolean(localStorage.getItem(TOKEN_STORAGE_KEY)));
  const [error, setError] = useState('');

  const clearAuth = useCallback(() => {
    localStorage.removeItem(TOKEN_STORAGE_KEY);
    setToken(null);
    setUser(null);
  }, []);

  const refreshCurrentUser = useCallback(async (activeToken) => {
    if (!activeToken) {
      setUser(null);
      setLoading(false);
      return null;
    }

    setLoading(true);
    setError('');

    try {
      const currentUser = await getCurrentUserRequest(activeToken);
      setUser(currentUser);
      return currentUser;
    } catch (err) {
      clearAuth();
      setError(err.message || 'Failed to fetch current user.');
      return null;
    } finally {
      setLoading(false);
    }
  }, [clearAuth]);

  useEffect(() => {
    if (token) {
      refreshCurrentUser(token);
    } else {
      setLoading(false);
    }
  }, [token, refreshCurrentUser]);

  const signup = useCallback(async ({ name, email, password }) => {
    setError('');
    setLoading(true);
    try {
      await signupRequest({ name, email, password });
      const loginData = await loginRequest({ email, password });
      localStorage.setItem(TOKEN_STORAGE_KEY, loginData.access_token);
      setToken(loginData.access_token);
      const currentUser = await getCurrentUserRequest(loginData.access_token);
      setUser(currentUser);
      return currentUser;
    } catch (err) {
      setError(err.message || 'Signup failed.');
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const login = useCallback(async ({ email, password }) => {
    setError('');
    setLoading(true);
    try {
      const loginData = await loginRequest({ email, password });
      localStorage.setItem(TOKEN_STORAGE_KEY, loginData.access_token);
      setToken(loginData.access_token);
      const currentUser = await getCurrentUserRequest(loginData.access_token);
      setUser(currentUser);
      return currentUser;
    } catch (err) {
      setError(err.message || 'Login failed.');
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const logout = useCallback(() => {
    clearAuth();
    setError('');
  }, [clearAuth]);

  const value = useMemo(() => ({
    user,
    token,
    loading,
    error,
    isAuthenticated: Boolean(token && user),
    signup,
    login,
    logout,
    refreshCurrentUser: () => refreshCurrentUser(token)
  }), [user, token, loading, error, signup, login, logout, refreshCurrentUser]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
