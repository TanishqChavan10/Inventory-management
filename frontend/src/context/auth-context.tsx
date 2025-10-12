'use client';

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useMutation, useQuery, useLazyQuery } from '@apollo/client';
import { useRouter } from 'next/navigation';
import { LOGIN_USER, REGISTER_USER, GET_CURRENT_USER } from '@/app/graphql/auth';
import { getAuthToken, setAuthToken, removeAuthToken } from '@/lib/auth-utils';

// Define types
interface User {
  id: string;
  username: string;
  email: string;
  fullName?: string;
  role: string;
  isActive: boolean;
}

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  loading: boolean;
  error: Error | null;
  login: (username: string, password: string) => Promise<void>;
  register: (userData: RegisterData) => Promise<void>;
  logout: () => void;
}

interface RegisterData {
  username: string;
  email: string;
  password: string;
  fullName?: string;
}

interface AuthProviderProps {
  children: ReactNode;
}

// Create context
const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Auth provider component
export function AuthProvider({ children }: AuthProviderProps) {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<Error | null>(null);

  // Setup GraphQL operations
  const [loginMutation] = useMutation(LOGIN_USER);
  const [registerMutation] = useMutation(REGISTER_USER);
  const [getCurrentUser, { loading: fetchingUser }] = useLazyQuery(GET_CURRENT_USER, {
    fetchPolicy: 'network-only',
    onCompleted: (data) => {
      if (data?.me) {
        setUser(data.me);
      }
    },
    onError: (error) => {
      console.error('Error fetching user:', error);
      setError(error);
      if (error.message.includes('Unauthorized')) {
        logout();
      }
    },
  });

  // Check if user is logged in on initial load
  useEffect(() => {
    const checkAuth = async () => {
      try {
        const token = getAuthToken();
        if (token) {
          await getCurrentUser();
        }
      } catch (err) {
        console.error('Auth check error:', err);
      } finally {
        setLoading(false);
      }
    };

    checkAuth();
  }, [getCurrentUser]);

  // Login function
  const login = async (username: string, password: string) => {
    setLoading(true);
    setError(null);
    try {
      const { data } = await loginMutation({
        variables: {
          loginInput: { username, password },
        },
      });

      if (data?.login) {
        setAuthToken(data.login.accessToken);
        setUser(data.login.user);
        router.push('/dashboard');
      }
    } catch (err) {
      setError(err as Error);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Register function
  const register = async (userData: RegisterData) => {
    setLoading(true);
    setError(null);
    try {
      const { data } = await registerMutation({
        variables: {
          registerInput: userData,
        },
      });

      if (data?.register) {
        setAuthToken(data.register.accessToken);
        setUser(data.register.user);
        router.push('/dashboard');
      }
    } catch (err) {
      setError(err as Error);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Logout function
  const logout = () => {
    removeAuthToken();
    setUser(null);
    router.push('/login');
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        loading: loading || fetchingUser,
        error,
        login,
        register,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

// Hook for using auth context
export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
