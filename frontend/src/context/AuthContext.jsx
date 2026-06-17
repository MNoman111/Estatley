import { createContext, useContext, useEffect, useState } from 'react';
import client from '../api/client.js';

const AuthContext = createContext(null);
export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('zc_token');
    if (!token) return setLoading(false);
    client
      .get('/auth/me')
      .then((res) => setUser(res.data.user))
      .catch(() => localStorage.removeItem('zc_token'))
      .finally(() => setLoading(false));
  }, []);

  const persist = (token, user) => {
    localStorage.setItem('zc_token', token);
    setUser(user);
  };

  const login = async (email, password) => {
    const { data } = await client.post('/auth/login', { email, password });
    persist(data.token, data.user);
    return data.user;
  };

  const register = async (payload) => {
    const { data } = await client.post('/auth/register', payload);
    persist(data.token, data.user);
    return data.user;
  };

  const logout = () => {
    localStorage.removeItem('zc_token');
    setUser(null);
  };

  const toggleFavorite = async (propertyId) => {
    const { data } = await client.post(`/users/me/favorites/${propertyId}`);
    setUser((u) => (u ? { ...u, favorites: data.favorites } : u));
    return data.favorited;
  };

  const refreshUser = async () => {
    const { data } = await client.get('/auth/me');
    setUser(data.user);
  };

  return (
    <AuthContext.Provider
      value={{ user, loading, login, register, logout, toggleFavorite, refreshUser, setUser }}
    >
      {children}
    </AuthContext.Provider>
  );
};
