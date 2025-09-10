// src/context/AuthContext.tsx
import React, { createContext, useState, ReactNode, useContext } from 'react';

type UserRole = 'teacher' | 'director' | 'admin' | 'owner';

interface User {
  id: number;
  firstName: string;
  lastName: string;
  role: UserRole;
}

interface AuthContextType {
  user?: User;
  login: (user: User) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType>({
  login: () => {},
  logout: () => {},
});

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  // Dummy logged-in user for testing
  const [user, setUser] = useState<User | undefined>({
    id: 1,
    firstName: 'John',
    lastName: 'Doe',
    role: 'owner', // Change to 'admin', 'director', 'teacher' to test
  });

  const login = (user: User) => setUser(user);
  const logout = () => setUser(undefined);

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);

export default AuthContext;
