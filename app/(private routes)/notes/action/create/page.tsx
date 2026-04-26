import type { Metadata } from 'next';
import { redirect } from 'next/navigation';
import { createNote } from '@/lib/api/clientApi';
import { NoteTag } from '@/types/note';
import NoteForm from '@/components/NoteForm/NoteForm';
import styles from './CreateNote.module.css';

export const metadata: Metadata = {
  title: 'Створення нотатки | NoteHub',
  description: 'Створіть нову нотатку. Ваші зміни автоматично зберігаються як чернетка.',
  openGraph: {
    title: 'Створення нової нотатки | NoteHub',
    url: 'https://notehub-goit.vercel.app/notes/action/create',
    images: ['https://ac.goit.global/fullstack/react/notehub-og-meta.jpg'],
  },
};

export default function CreateNotePage() {
  async function createNoteAction(formData: FormData) {
    'use server';
    
    const title = formData.get('title') as string;
    const content = formData.get('content') as string;
    const tag = formData.get('tag') as NoteTag;
    
    if (!title || !content || !tag) {
      return { error: 'Усі поля обов’язкові' };
    }
    
    try {
      await createNote({ title, content, tag });
    } catch (error) {
      return { error: 'Помилка при створенні нотатки' };
    }

    redirect('/notes?created=1');
  }

  return (
    <main className={styles.main}>
      <div className={styles.container}>
        <h1 className={styles.title}>Create note</h1>
        <NoteForm createNoteAction={createNoteAction} />
      </div>
    </main>
  );
}