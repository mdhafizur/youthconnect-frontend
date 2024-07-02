'use client';

import {
  createContext,
  useContext,
  useState,
  ReactNode,
  useEffect,
  Dispatch,
  SetStateAction,
} from 'react';
import {
  register as registerService,
  login as loginService,
  logout as logoutService,
  getUser,
} from '../services/auth.service';
import { User } from '../models/user.model';
import { Subscription } from 'rxjs';
import { useRouter } from 'next/navigation';
import LoadingComponent from '../components/LoadingComponent';
import { toast } from 'react-hot-toast';

interface AuthContextType {
  loading: boolean;
  isAuthenticated: boolean;
  user: User | null;
  setUser: Dispatch<SetStateAction<User | null>>;
  register: (email: string, password: string) => Promise<void>;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const checkAuthStatus = async () => {
      const storedUser = localStorage.getItem('user');
      if (storedUser) {
        try {
          const userData = await getUser().toPromise();
          if (userData) {
            setUser(userData);
            setIsAuthenticated(true);
            localStorage.setItem('user', JSON.stringify(userData));
          } else {
            setUser(null);
            setIsAuthenticated(false);
            localStorage.removeItem('user');
          }
        } catch (error) {
          console.error('Failed to fetch user data:', error);
          setUser(null);
          setIsAuthenticated(false);
          localStorage.removeItem('user');
        }
      }
      setLoading(false);
    };

    checkAuthStatus();
  }, []);

  const register = async (email: string, password: string) => {
    try {
      const subscription: Subscription = registerService(
        email,
        password
      ).subscribe({
        next: (userData: User) => {
          if (userData) {
            setUser(userData);
            setIsAuthenticated(true);
            localStorage.setItem('user', JSON.stringify(userData));
          } else {
            setUser(null);
            setIsAuthenticated(false);
            localStorage.removeItem('user');
          }
        },
        error: (error) => {
          console.error('Registration failed:', error);
          setIsAuthenticated(false);
          setUser(null);
          localStorage.removeItem('user');
        },
        complete: () => {
          subscription.unsubscribe();
        },
      });
    } catch (error) {
      console.error('Registration failed:', error);
      setIsAuthenticated(false);
      setUser(null);
      localStorage.removeItem('user');
    }
  };

  const login = async (email: string, password: string) => {
    try {
      await loginService(email, password).toPromise();
      const userData = await getUser().toPromise();
      if (userData) {
        setUser(userData);
        setIsAuthenticated(true);
        localStorage.setItem('user', JSON.stringify(userData));
        router.push('/dashboard');
        toast.success(`Welcome ${userData.email}!`);
      } else {
        setUser(null);
        setIsAuthenticated(false);
        localStorage.removeItem('user');
        router.push('/login');
      }
    } catch (error) {
      console.error('Login failed:', error);
      toast.error(error.response.data.message);
      setIsAuthenticated(false);
      setUser(null);
      localStorage.removeItem('user');
    }
  };

  const logout = () => {
    setIsAuthenticated(false);
    toast.success(`See you soon ${user?.email}!`);
    setUser(null);
    localStorage.removeItem('user');
    logoutService().subscribe();
    router.push('/login');
  };

  if (loading) {
    return (
      <div className='fixed top-0 left-0 w-full h-full flex items-center justify-center'>
        <LoadingComponent />
      </div>
    );
  }

  return (
    <AuthContext.Provider
      value={{
        isAuthenticated,
        user,
        setUser,
        register,
        login,
        logout,
        loading,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
