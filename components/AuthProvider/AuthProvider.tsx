'use client';

import { useEffect, useState } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { useAuthStore } from '@/lib/store/authStore';
import { checkSession } from '@/lib/api/clientApi';

const PRIVATE_ROUTES = ['/profile', '/notes'];
const PUBLIC_AUTH_ROUTES = ['/sign-in', '/sign-up'];

interface AuthProviderProps {
  children: React.ReactNode;
}

export default function AuthProvider({ children }: AuthProviderProps) {
  const [isLoading, setIsLoading] = useState(true);
  const pathname = usePathname();
  const router = useRouter();
  const { setUser, user, isAuthenticated, clearAuth } = useAuthStore();

  useEffect(() => {
    const verifySession = async () => {
      try {
        const session = await checkSession();
        
        if (session) {
          setUser(session);
        } else {
          clearAuth();
        }
      } catch (error) {
        console.error('Session check failed:', error);
        clearAuth();
      } finally {
        setIsLoading(false);
      }
    };

    verifySession();
  }, [setUser, clearAuth]);

  // Redirect logic after session is verified
  useEffect(() => {
    if (isLoading) return;

    const isPrivateRoute = PRIVATE_ROUTES.some(route => pathname.startsWith(route));
    const isAuthRoute = PUBLIC_AUTH_ROUTES.some(route => pathname.startsWith(route));

    // If user is trying to access private route but is not authenticated
    if (isPrivateRoute && !isAuthenticated) {
      router.push('/sign-in');
      return;
    }

    // If user is authenticated and trying to access auth routes, redirect to profile
    if (isAuthRoute && isAuthenticated) {
      router.push('/profile');
      return;
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
