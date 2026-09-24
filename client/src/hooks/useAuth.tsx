import React, { createContext, useContext, useState, useEffect, useCallback, useMemo, ReactNode } from 'react';
import { apiClient, setAuthToken } from '../services/api';

export interface UserSession {
  userId: string;
  name: string;
  email: string;
  token: string;
  avatarUrl?: string;
  referralCode?: string;
}

interface AuthContextType {
  user: UserSession | null;
  isLoading: boolean;
  loginAs: (email: string) => Promise<void>;
  logout: () => void;
  quickSwitch: (accountType: 'rohan' | 'priya' | 'guest') => Promise<void>;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  isLoading: true,
  loginAs: async () => {},
  logout: () => {},
  quickSwitch: async () => {},
});

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<UserSession | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  const logout = useCallback(() => {
    setAuthToken(null);
    setUser(null);
    setIsLoading(false);
  }, []);

  const loginAs = useCallback(async (email: string) => {
    setIsLoading(true);
    try {
      const res = await apiClient.post('/auth/login', {
        email,
        password: 'feedants123',
      });

      const { user: userData, token } = res.data.data;
      const session: UserSession = {
        userId: userData._id,
        name: userData.name,
        email: userData.email,
        avatarUrl: userData.avatarUrl,
        referralCode: userData.referralCode,
        token,
      };

      setAuthToken(token);
      setUser(session);
    } catch (err) {
      console.warn('Login failed, proceeding as guest:', err);
      logout();
    } finally {
      setIsLoading(false);
    }
  }, [logout]);

  const quickSwitch = useCallback(async (accountType: 'rohan' | 'priya' | 'guest') => {
    if (accountType === 'guest') {
      logout();
    } else if (accountType === 'rohan') {
      await loginAs('rohan@example.com');
    } else if (accountType === 'priya') {
      await loginAs('priya@example.com');
    }
  }, [loginAs, logout]);

  // Default to Rohan Sharma (matches Objective_Page.png where user is already registered)
  useEffect(() => {
    quickSwitch('rohan');
  }, [quickSwitch]);

  const contextValue = useMemo<AuthContextType>(
    () => ({
      user,
      isLoading,
      loginAs,
      logout,
      quickSwitch,
    }),
    [user, isLoading, loginAs, logout, quickSwitch]
  );

  return (
    <AuthContext.Provider value={contextValue}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
