'use client';

import { useEffect, useState } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { useAuthStore } from '@/lib/store/authStore';
import { checkSession, getMe } from '@/lib/api/clientApi';

const PRIVATE_ROUTES = ['/profile', '/notes'];
const PUBLIC_AUTH_ROUTES = ['/sign-in', '/sign-up'];

interface AuthProviderProps {
  children: React.ReactNode;
}

export default function AuthProvider({ children }: AuthProviderProps) {
  const [isLoading, setIsLoading] = useState(true);
  const pathname = usePathname();
  const router = useRouter();
  const { setUser, isAuthenticated, clearAuth } = useAuthStore();

  useEffect(() => {
    const verifySession = async () => {
      try {
        const session = await checkSession();
        
        if (session) {
          const userData = await getMe();
          setUser(userData);
        } else {
          clearAuth();
        }
      } catch (error) {
        console.error('Session verification failed:', error);
        clearAuth();
      } finally {
        setIsLoading(false);
      }
    };

    verifySession();
  }, [setUser, clearAuth]);

  useEffect(() => {
    if (isLoading) return;

    const isPrivateRoute = PRIVATE_ROUTES.some(route => pathname.startsWith(route));
    const isAuthRoute = PUBLIC_AUTH_ROUTES.some(route => pathname.startsWith(route));

    if (isPrivateRoute && !isAuthenticated) {
      router.push('/sign-in');
    }

    if (isAuthRoute && isAuthenticated) {
      router.push('/profile');
    }
  }, [isLoading, isAuthenticated, pathname, router]);

  if (isLoading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '100vh' }}>
        <p>Loading...</p>
      </div>
    );
  }

  return <>{children}</>;
}