import React, { createContext, useContext, useState, useEffect } from 'react';
import axiosInstance from '../api/axiosInstance';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);

  const updateUser = (partial) => {
  setUser((prev) => {
    const next = { ...(prev || {}), ...partial };
    localStorage.setItem('user', JSON.stringify(next));
    return next;
  });
};

  useEffect(() => {
    const stored = localStorage.getItem('user');
    if (stored) {
      try {
        setUser(JSON.parse(stored));
      } catch {
        localStorage.removeItem('user');
      }
    }
  }, []);

  // -----------------------------
  //  회원가입 기능 (DB 저장)
  // -----------------------------
  const signup = async (username, password, email, keywords) => {
    try {
      const res = await axiosInstance.post('/api/v1/auth/signup', {
        user_id: username,
        password: password,
        email: email,
        keywords: keywords, 
      });

      // 성공 케이스
      if (res.data && !res.data.error) {
        return true;
      }

      // 실패 메시지
      console.warn("Signup failed:", res.data.error);
      return false;

    } catch (err) {
      console.error("Signup error:", err);
      return false;
    }
  };

  // -----------------------------
  //  로그인 기능
  // -----------------------------
  const login = async (username, password) => {
    try {
      const res = await axiosInstance.post('/api/v1/auth/login', {
        user_id: username,
        password: password,
      });

      if (res.data && !res.data.error) {
        const userData = { user_id: username };
        setUser(userData);
        localStorage.setItem('user', JSON.stringify(userData));
        return true;
      }

      return false;
    } catch (err) {
      console.error("Login error:", err);
      return false;
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('user');
  };

  return (
    <AuthContext.Provider value={{ user, signup, login, logout, updateUser }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
