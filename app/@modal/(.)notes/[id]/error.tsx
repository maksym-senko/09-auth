'use client';

import { useEffect } from 'react';
import Link from 'next/link';
import styles from './error.module.css';

interface ErrorProps {
  error: Error & { digest?: string };
  reset: () => void;
}

export default function NoteDetailError({ error, reset }: ErrorProps) {
  useEffect(() => {
    console.error('Note detail error:', error);
  }, [error]);

  return (
    <div className={styles.container}>
      <div className={styles.content}>
        <h1 className={styles.title}>Something went wrong!</h1>
        <p className={styles.message}>
          Failed to load the note details. Please try again.
        </p>
        <div className={styles.actions}>
          <button onClick={reset} className={styles.retryButton}>
            Try again
          </button>
          <Link href="/notes" className={styles.backButton}>
            Back to notes
          </Link>
        </div>
      </div>
    </div>
  );
}