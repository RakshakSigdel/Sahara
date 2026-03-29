import { createContext, useContext, useState, useEffect, useCallback } from 'react';

const AuthContext = createContext(null);

/* Demo user for mock */
const MOCK_USER = {
  id: 'usr_001',
  name: 'Sarah Johnson',
  email: 'sarah@example.com',
  avatar: null,
  plan: 'free',
  createdAt: '2025-03-15',
};

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  /* Check persisted session on mount */
  useEffect(() => {
    const stored = localStorage.getItem('echomind_user');
    if (stored) {
      try { setUser(JSON.parse(stored)); } catch { /* ignore */ }
    }
    setLoading(false);
  }, []);

  const login = useCallback(async (email, _password) => {
    setLoading(true);
    // Simulate API delay
    await new Promise((r) => setTimeout(r, 800));
    const u = { ...MOCK_USER, email };
    setUser(u);
    localStorage.setItem('echomind_user', JSON.stringify(u));
    setLoading(false);
    return u;
  }, []);

  const signup = useCallback(async (name, email, _password) => {
    setLoading(true);
    await new Promise((r) => setTimeout(r, 800));
    const u = { ...MOCK_USER, name, email, createdAt: new Date().toISOString() };
    setUser(u);
    localStorage.setItem('echomind_user', JSON.stringify(u));
    setLoading(false);
    return u;
  }, []);

  const logout = useCallback(() => {
    setUser(null);
    localStorage.removeItem('echomind_user');
  }, []);

  const updateProfile = useCallback((data) => {
    setUser((prev) => {
      const updated = { ...prev, ...data };
      localStorage.setItem('echomind_user', JSON.stringify(updated));
      return updated;
    });
  }, []);

  return (
    <AuthContext.Provider value={{ user, loading, isAuthenticated: !!user, login, signup, logout, updateProfile }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}
