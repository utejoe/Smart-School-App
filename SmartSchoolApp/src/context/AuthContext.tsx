import React, { createContext, useState, useEffect, ReactNode } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

type Teacher = {
  id: number;
  username: string;
  firstName: string;
  lastName: string;
  email: string;
  subjects?: any[];
  schoolClasses?: any[];
  photoUrl?: string; // 👈 add this
};

type AuthContextType = {
  teacher: Teacher | null;
  token: string | null;
  loading: boolean;
  login: (teacher: Teacher, token: string) => Promise<void>;
  logout: () => Promise<void>;
};

export const AuthContext = createContext<AuthContextType>({
  teacher: null,
  token: null,
  loading: true,
  login: async () => {},
  logout: async () => {},
});

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [teacher, setTeacher] = useState<Teacher | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadAuth = async () => {
      try {
        const savedToken = await AsyncStorage.getItem('token');
        const savedTeacher = await AsyncStorage.getItem('teacher');
        if (savedToken && savedTeacher) {
          setToken(savedToken);
          setTeacher(JSON.parse(savedTeacher));
        }
      } catch (err) {
        console.error('Error loading auth data', err);
      } finally {
        setLoading(false);
      }
    };
    loadAuth();
  }, []);

  const login = async (teacherData: Teacher, jwt: string) => {
    setTeacher(teacherData);
    setToken(jwt);
    await AsyncStorage.setItem('token', jwt);
    await AsyncStorage.setItem('teacher', JSON.stringify(teacherData));
  };

  const logout = async () => {
    setTeacher(null);
    setToken(null);
    await AsyncStorage.removeItem('token');
    await AsyncStorage.removeItem('teacher');
  };

  return (
    <AuthContext.Provider value={{ teacher, token, loading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
