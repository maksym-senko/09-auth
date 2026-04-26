'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import css from './page.module.css';
import { useAuthStore } from '@/lib/store/authStore';
import { getMe } from '@/lib/api/clientApi';

export default function ProfilePage() {
  const { user, setUser } = useAuthStore();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const userData = await getMe();
        setUser(userData);
      } catch (error) {
        console.error('Failed to fetch user data:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchUserData();
  }, [setUser]);

  if (isLoading) {
    return (
      <main className={css.mainContent}>
        <p>Loading...</p>
      </main>
    );
  }

  if (!user) {
    return (
      <main className={css.mainContent}>
        <p>User not found</p>
      </main>
    );
  }

  return (
    <main className={css.mainContent}>
      <div className={css.profileCard}>
        <div className={css.header}>
          <h1 className={css.formTitle}>Profile Page</h1>
          <Link href="/profile/edit" className={css.editProfileButton}>
            Edit Profile
          </Link>
        </div>
        <div className={css.avatarWrapper}>
          <Image
            src={user.avatar || 'https://ac.goit.global/fullstack/react/notehub-default-avatar.jpg'}
            alt="User Avatar"
            width={120}
            height={120}
            className={css.avatar}
          />
        </div>
        <div className={css.profileInfo}>
          <p>
            Username: <strong>{user.username || 'Not set'}</strong>
          </p>
          <p>
            Email: <strong>{user.email}</strong>
          </p>
        </div>
      </div>
    </main>
  );
}
