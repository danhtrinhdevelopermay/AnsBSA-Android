import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import auth, { FirebaseAuthTypes } from '@react-native-firebase/auth';
import { Alert } from 'react-native';

interface AuthContextType {
  user: FirebaseAuthTypes.User | null;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (email: string, password: string) => Promise<void>;
  signOut: () => Promise<void>;
  credits: number;
  updateCredits: (amount: number) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
  children: ReactNode;
}

export function AuthProvider({ children }: AuthProviderProps) {
  const [user, setUser] = useState<FirebaseAuthTypes.User | null>(null);
  const [loading, setLoading] = useState(true);
  const [credits, setCredits] = useState(1000); // Default credits for new users

  useEffect(() => {
    const unsubscribe = auth().onAuthStateChanged((user) => {
      setUser(user);
      setLoading(false);
      
      // Load user credits when authenticated
      if (user) {
        loadUserCredits(user.uid);
      }
    });

    return unsubscribe;
  }, []);

  const loadUserCredits = async (userId: string) => {
    try {
      // This would typically fetch from your backend API
      // For now, we'll use localStorage equivalent or default value
      setCredits(1000);
    } catch (error) {
      console.error('Error loading user credits:', error);
    }
  };

  const signIn = async (email: string, password: string) => {
    try {
      setLoading(true);
      await auth().signInWithEmailAndPassword(email, password);
    } catch (error: any) {
      console.error('Sign in error:', error);
      Alert.alert(
        'Lỗi đăng nhập',
        getErrorMessage(error.code),
        [{ text: 'OK' }]
      );
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const signUp = async (email: string, password: string) => {
    try {
      setLoading(true);
      const result = await auth().createUserWithEmailAndPassword(email, password);
      
      // Initialize user credits
      if (result.user) {
        setCredits(1000);
        // You would typically save this to your backend
      }
    } catch (error: any) {
      console.error('Sign up error:', error);
      Alert.alert(
        'Lỗi đăng ký',
        getErrorMessage(error.code),
        [{ text: 'OK' }]
      );
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const signOut = async () => {
    try {
      setLoading(true);
      await auth().signOut();
      setCredits(0);
    } catch (error) {
      console.error('Sign out error:', error);
    } finally {
      setLoading(false);
    }
  };

  const updateCredits = (amount: number) => {
    setCredits(prev => Math.max(0, prev + amount));
  };

  const getErrorMessage = (errorCode: string): string => {
    switch (errorCode) {
      case 'auth/user-not-found':
        return 'Không tìm thấy tài khoản với email này.';
      case 'auth/wrong-password':
        return 'Mật khẩu không chính xác.';
      case 'auth/email-already-in-use':
        return 'Email này đã được sử dụng.';
      case 'auth/weak-password':
        return 'Mật khẩu quá yếu. Vui lòng chọn mật khẩu mạnh hơn.';
      case 'auth/invalid-email':
        return 'Email không hợp lệ.';
      case 'auth/network-request-failed':
        return 'Lỗi kết nối mạng. Vui lòng thử lại.';
      default:
        return 'Đã xảy ra lỗi. Vui lòng thử lại.';
    }
  };

  const value: AuthContextType = {
    user,
    loading,
    signIn,
    signUp,
    signOut,
    credits,
    updateCredits,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth(): AuthContextType {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}