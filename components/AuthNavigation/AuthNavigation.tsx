'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import css from './AuthNavigation.module.css';
import { useAuthStore } from '@/lib/store/authStore';
import { logout } from '@/lib/api/clientApi';

const AuthNavigation = () => {
  const router = useRouter();
  const { user, isAuthenticated, clearAuth } = useAuthStore();

  const handleLogout = async () => {
    try {
      await logout();
      clearAuth();
      router.push('/sign-in');
    } catch (error) {
      console.error('Logout failed:', error);
      clearAuth();
      router.push('/sign-in');
    }
  };

  if (isAuthenticated && user) {
    return (
      <>
        <li className={css.navigationItem}>
          <Link href="/profile" prefetch={false} className={css.navigationLink}>
            Profile
          </Link>
        </li>
        <li className={css.navigationItem}>
          <p className={css.userEmail}>{user.email}</p>
          <button 
            className={css.logoutButton}
            onClick={handleLogout}
            type="button"
          >
            Logout
          </button>
        </li>
      </>
    );
  }

  return (
    <>
      <li className={css.navigationItem}>
        <Link href="/sign-in" prefetch={false} className={css.navigationLink}>
          Login
        </Link>
      </li>
      <li className={css.navigationItem}>
        <Link href="/sign-up" prefetch={false} className={css.navigationLink}>
          Sign up
        </Link>
      </li>
    </>
  );
};

export default AuthNavigation;
