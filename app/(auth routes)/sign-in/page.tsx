'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import css from './page.module.css';
import { login } from '@/lib/api/clientApi';
import { useAuthStore } from '@/lib/store/authStore';

interface FormData {
  email: string;
  password: string;
}

export default function SignIn() {
  const router = useRouter();
  const { setUser } = useAuthStore();
  const [formData, setFormData] = useState<FormData>({
    email: '',
    password: '',
  });
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.currentTarget;
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      const user = await login({
        email: formData.email,
        password: formData.password,
      });

      setUser(user);
      router.push('/profile');
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Login failed';
      setError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <main className={css.mainContent}>
      <form className={css.form} onSubmit={handleSubmit}>
        <h1 className={css.formTitle}>Sign in</h1>

        <div className={css.formGroup}>
          <label htmlFor="email">Email</label>
          <input
            id="email"
            type="email"
            name="email"
            className={css.input}
            value={formData.email}
            onChange={handleChange}
            required
          />
        </div>

        <div className={css.formGroup}>
          <label htmlFor="password">Password</label>
          <input
            id="password"
            type="password"
            name="password"
            className={css.input}
            value={formData.password}
            onChange={handleChange}
            required
          />
        </div>

        <div className={css.actions}>
          <button type="submit" className={css.submitButton} disabled={isLoading}>
            {isLoading ? 'Logging in...' : 'Log in'}
          </button>
        </div>

        {error && <p className={css.error}>{error}</p>}
      </form>
    </main>
  );
}
