import { Metadata } from 'next';
import Link from 'next/link';
import Image from 'next/image';
import css from './page.module.css';
import { getMe } from '@/lib/api/serverApi';
import { User } from '@/types/user';

export const metadata: Metadata = {
  title: 'Profile | NoteHub',
  description: 'View and manage your profile details',
};

export default async function ProfilePage() {
  let user: User | null = null;

  try {
    user = await getMe();
  } catch (error) {
    console.error('Failed to fetch user:', error);
  }

  if (!user) {
    return (
      <main className={css.mainContent}>
        <p>User not found or not authorized</p>
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
            priority
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