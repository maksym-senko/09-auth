import type { Metadata } from 'next';
import Link from 'next/link';
import css from './NotFound.module.css';

const BASE_URL = 'https://notehub-goit.vercel.app';

export const metadata: Metadata = {
  title: 'Page not found | NoteHub',
  description: 'The requested page does not exist. Find your notes or create a new one.',
  metadataBase: new URL(BASE_URL),
  openGraph: {
    title: 'Page not found | NoteHub',
    description: 'The requested page does not exist. Find your notes or create a new one.',
    url: `${BASE_URL}/not-found`,
    images: ['https://ac.goit.global/fullstack/react/notehub-og-meta.jpg'],
  },
};

export default function NotFound() {
  return (
    <div className={css.container}>
      <h1 className={css.title}>404</h1>
      <p className={css.message}>Oops! The page you are looking for doesn`t exist.</p>
      <Link href="/notes/filter/all" className={css.link}>
        Back to Notes
      </Link>
    </div>
  );
}