import { useState } from 'react';
import api from '../utils/axios';

export const useAuth = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const login = async (username, password) => {
    try {
      setLoading(true);
      setError(null);
      const response = await api.post('/auth/login', { username, password });
      localStorage.setItem('adminToken', response.data.token);
      return true;
    } catch (err) {
      setError(err.response?.data?.message || 'Giriş başarısız');
      return false;
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    localStorage.removeItem('adminToken');
  };

  const isAuthenticated = () => {
    return !!localStorage.getItem('adminToken');
  };

  return {
    login,
    logout,
    isAuthenticated,
    loading,
    error
  };
}; 