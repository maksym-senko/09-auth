'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import css from './page.module.css';
import { useAuthStore } from '@/lib/store/authStore';
import { getMe, updateMe } from '@/lib/api/clientApi';

interface FormData {
  username: string;
}

export default function EditProfilePage() {
  const router = useRouter();
  const { user, setUser } = useAuthStore();
  const [formData, setFormData] = useState<FormData>({ username: '' });
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const userData = await getMe();
        setUser(userData);
        setFormData({ username: userData.username || '' });
      } catch (err) {
        console.error('Failed to fetch user data:', err);
        setError('Failed to load profile');
      } finally {
        setIsLoading(false);
      }
    };

    fetchUserData();
  }, [setUser]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { value } = e.currentTarget;
    setFormData(prev => ({
      ...prev,
      username: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError('');
    setIsSaving(true);

    try {
      const updatedUser = await updateMe({
        username: formData.username,
      });
      setUser(updatedUser);
      router.push('/profile');
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to update profile';
      setError(errorMessage);
    } finally {
      setIsSaving(false);
    }
  };

  const handleCancel = () => {
    router.back();
  };

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
        <h1 className={css.formTitle}>Edit Profile</h1>

        <Image
          src={user.avatar || 'https://ac.goit.global/fullstack/react/notehub-default-avatar.jpg'}
          alt="User Avatar"
          width={120}
          height={120}
          className={css.avatar}
        />

        <form className={css.profileInfo} onSubmit={handleSubmit}>
          <div className={css.usernameWrapper}>
            <label htmlFor="username">Username:</label>
            <input
              id="username"
              type="text"
              className={css.input}
              value={formData.username}
              onChange={handleChange}
            />
          </div>

          <p>Email: {user.email}</p>

          <div className={css.actions}>
            <button type="submit" className={css.saveButton} disabled={isSaving}>
              {isSaving ? 'Saving...' : 'Save'}
            </button>
            <button
              type="button"
              className={css.cancelButton}
              onClick={handleCancel}
              disabled={isSaving}
            >
              Cancel
            </button>
          </div>

          {error && <p style={{ color: 'red', marginTop: '1rem' }}>{error}</p>}
        </form>
      </div>
    </main>
  );
}
