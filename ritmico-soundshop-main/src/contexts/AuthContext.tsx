import React, { createContext, useContext, useState, useEffect } from 'react';
import { User } from '@/types';

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<boolean>;
  register: (email: string, password: string, name: string) => Promise<boolean>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    // Cargar usuario de localStorage al montar
    const savedUser = localStorage.getItem('musiteca_user');
    if (savedUser) {
      setUser(JSON.parse(savedUser));
    }
  }, []);

  const login = async (email: string, password: string): Promise<boolean> => {
    // Simulación de login
    const savedUsers = localStorage.getItem('musiteca_users');
    const users = savedUsers ? JSON.parse(savedUsers) : [];
    
    const foundUser = users.find((u: any) => u.email === email && u.password === password);
    
    if (foundUser) {
      const userData: User = {
        email: foundUser.email,
        name: foundUser.name,
      };
      setUser(userData);
      localStorage.setItem('musiteca_user', JSON.stringify(userData));
      return true;
    }
    
    return false;
  };

  const register = async (email: string, password: string, name: string): Promise<boolean> => {
    // Simulación de registro
    const savedUsers = localStorage.getItem('musiteca_users');
    const users = savedUsers ? JSON.parse(savedUsers) : [];
    
    // Verificar si el usuario ya existe
    if (users.some((u: any) => u.email === email)) {
      return false;
    }
    
    // Registrar nuevo usuario
    users.push({ email, password, name });
    localStorage.setItem('musiteca_users', JSON.stringify(users));
    
    // Auto-login después del registro
    const userData: User = { email, name };
    setUser(userData);
    localStorage.setItem('musiteca_user', JSON.stringify(userData));
    return true;
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('musiteca_user');
  };

  return (
    <AuthContext.Provider value={{ user, isAuthenticated: !!user, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth debe usarse dentro de AuthProvider');
  }
  return context;
};
