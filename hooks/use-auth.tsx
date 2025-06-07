"use client";

import { useState, useEffect, useContext, createContext } from "react";
import { useRouter } from "next/navigation";
import { authAPI } from "@/lib/api";
import { toast } from "sonner";

interface User {
  id: string;
  name: string;
  email: string;
  role: 'admin' | 'writer' | 'user';
  avatar?: string;
  token?: string;
}

interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => Promise<void>;
  register: (name: string, email: string, password: string) => Promise<void>;
  logout: () => void;
  loading: boolean;
  error: string | null;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  login: async () => {},
  register: async () => {},
  logout: () => {},
  loading: false,
  error: null
});

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    const checkUserLoggedIn = async () => {
      try {
        const storedUser = localStorage.getItem('user');
        
        if (storedUser) {
          const userData = JSON.parse(storedUser);
          setUser(userData);
          
          // Verify token is still valid
          try {
            await authAPI.getMe();
          } catch (error) {
            // Token is invalid, clear user data
            localStorage.removeItem('user');
            setUser(null);
          }
        }
      } catch (error) {
        console.error('Authentication error:', error);
        localStorage.removeItem('user');
        setUser(null);
      } finally {
        setLoading(false);
      }
    };

    checkUserLoggedIn();
  }, []);

  const login = async (email: string, password: string) => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await authAPI.login(email, password);
      const { user: userData, token } = response.data;
      
      const userWithToken = {
        ...userData,
        token
      };
      
      localStorage.setItem('user', JSON.stringify(userWithToken));
      setUser(userWithToken);
      
      toast.success('Login successful!');
      
      // Redirect based on role
      if (userData.role === 'admin') {
        router.push('/admin/dashboard');
      } else if (userData.role === 'writer') {
        router.push('/writer/dashboard');
      } else {
        router.push('/');
      }
    } catch (error: any) {
      const errorMessage = error.response?.data?.message || 'Login failed';
      setError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const register = async (name: string, email: string, password: string) => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await authAPI.register(name, email, password);
      const { user: userData, token } = response.data;
      
      const userWithToken = {
        ...userData,
        token
      };
      
      localStorage.setItem('user', JSON.stringify(userWithToken));
      setUser(userWithToken);
      
      toast.success('Registration successful!');
      router.push('/');
    } catch (error: any) {
      const errorMessage = error.response?.data?.message || 'Registration failed';
      setError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    localStorage.removeItem('user');
    setUser(null);
    toast.success('Logged out successfully');
    router.push('/');
  };

  const contextValue = {
    user,
    login,
    register,
    logout,
    loading,
    error
  };

  return (
    <AuthContext.Provider value={contextValue}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);