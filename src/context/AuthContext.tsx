import React, { createContext, useState, useContext, useEffect } from 'react';
import { User, UserRole, AuthContextType } from '../types';
import { entrepreneurs, investors } from '../data/users';
import toast from 'react-hot-toast';

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const USER_STORAGE_KEY = 'business_nexus_user';
const RESET_TOKEN_KEY = 'business_nexus_reset_token';

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const storedUser = localStorage.getItem(USER_STORAGE_KEY);
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
    setIsLoading(false);
  }, []);

  const login = async (email: string, password: string, role: UserRole): Promise<void> => {
    setIsLoading(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 1000));

      // Search the correct array based on role
      const sourceArray = role === 'entrepreneur' ? entrepreneurs : investors;
      const foundUser = sourceArray.find(u => u.email === email);

      if (foundUser) {
        setUser(foundUser);
        localStorage.setItem(USER_STORAGE_KEY, JSON.stringify(foundUser));
        toast.success('Successfully logged in!');
      } else {
        throw new Error('Invalid credentials or user not found');
      }
    } catch (error) {
      toast.error((error as Error).message);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const register = async (name: string, email: string, password: string, role: UserRole): Promise<void> => {
    setIsLoading(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 1000));

      const allUsers = [...entrepreneurs, ...investors];
      if (allUsers.some(u => u.email === email)) {
        throw new Error('Email already in use');
      }

      // Build a role-complete object so it passes TypeScript and login works
      if (role === 'entrepreneur') {
        const newEntrepreneur = {
          id: `e${entrepreneurs.length + 1}`,
          name,
          email,
          role: 'entrepreneur' as const,
          avatarUrl: `https://ui-avatars.com/api/?name=${encodeURIComponent(name)}&background=random`,
          bio: '',
          isOnline: true,
          createdAt: new Date().toISOString(),
          // Entrepreneur-specific defaults
          startupName: '',
          pitchSummary: '',
          fundingNeeded: '',
          industry: '',
          location: '',
          foundedYear: new Date().getFullYear(),
          teamSize: 1,
        };
        entrepreneurs.push(newEntrepreneur);
        setUser(newEntrepreneur);
        localStorage.setItem(USER_STORAGE_KEY, JSON.stringify(newEntrepreneur));

      } else {
        const newInvestor = {
          id: `i${investors.length + 1}`,
          name,
          email,
          role: 'investor' as const,
          avatarUrl: `https://ui-avatars.com/api/?name=${encodeURIComponent(name)}&background=random`,
          bio: '',
          isOnline: true,
          createdAt: new Date().toISOString(),
          // Investor-specific defaults
          investmentInterests: [],
          investmentStage: [],
          portfolioCompanies: [],
          totalInvestments: 0,
          minimumInvestment: '',
          maximumInvestment: '',
        };
        investors.push(newInvestor);
        setUser(newInvestor);
        localStorage.setItem(USER_STORAGE_KEY, JSON.stringify(newInvestor));
      }

      toast.success('Account created successfully!');
    } catch (error) {
      toast.error((error as Error).message);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const forgotPassword = async (email: string): Promise<void> => {
    try {
      await new Promise(resolve => setTimeout(resolve, 1000));
      const allUsers = [...entrepreneurs, ...investors];
      const found = allUsers.find(u => u.email === email);
      if (!found) throw new Error('No account found with this email');
      const resetToken = Math.random().toString(36).substring(2, 15);
      localStorage.setItem(RESET_TOKEN_KEY, resetToken);
      toast.success('Password reset instructions sent to your email');
    } catch (error) {
      toast.error((error as Error).message);
      throw error;
    }
  };

  const resetPassword = async (token: string, newPassword: string): Promise<void> => {
    try {
      await new Promise(resolve => setTimeout(resolve, 1000));
      const storedToken = localStorage.getItem(RESET_TOKEN_KEY);
      if (token !== storedToken) throw new Error('Invalid or expired reset token');
      localStorage.removeItem(RESET_TOKEN_KEY);
      toast.success('Password reset successfully');
    } catch (error) {
      toast.error((error as Error).message);
      throw error;
    }
  };

  const logout = (): void => {
    setUser(null);
    localStorage.removeItem(USER_STORAGE_KEY);
    toast.success('Logged out successfully');
  };

  const updateProfile = async (userId: string, updates: Partial<User>): Promise<void> => {
    try {
      await new Promise(resolve => setTimeout(resolve, 1000));

      // Update in the correct source array
      const eIdx = entrepreneurs.findIndex(u => u.id === userId);
      if (eIdx !== -1) {
        entrepreneurs[eIdx] = { ...entrepreneurs[eIdx], ...updates } as typeof entrepreneurs[0];
      }
      const iIdx = investors.findIndex(u => u.id === userId);
      if (iIdx !== -1) {
        investors[iIdx] = { ...investors[iIdx], ...updates } as typeof investors[0];
      }

      if (eIdx === -1 && iIdx === -1) throw new Error('User not found');

      if (user?.id === userId) {
        const updated = { ...user, ...updates };
        setUser(updated);
        localStorage.setItem(USER_STORAGE_KEY, JSON.stringify(updated));
      }

      toast.success('Profile updated successfully');
    } catch (error) {
      toast.error((error as Error).message);
      throw error;
    }
  };

  const value = {
    user,
    login,
    register,
    logout,
    forgotPassword,
    resetPassword,
    updateProfile,
    isAuthenticated: !!user,
    isLoading
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};