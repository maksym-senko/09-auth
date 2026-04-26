import type { Metadata } from 'next';
import { redirect } from 'next/navigation';
import { createNote } from '@/lib/api/clientApi';
import { NoteTag } from '@/types/note';
import NoteForm from '@/components/NoteForm/NoteForm';
import styles from './CreateNote.module.css';

export const metadata: Metadata = {
  title: 'Створення нотатки | NoteHub',
  description:
    'Створіть нову нотатку з заголовком, тегом та вмістом. Ваші зміни автоматично зберігаються як чернетка.',
  openGraph: {
    title: 'Створення нової нотатки | NoteHub',
    description: 'Додайте нову нотатку до вашої колекції',
    url: 'https://your-vercel-app.vercel.app/notes/action/create',
    images: ['https://ac.goit.global/fullstack/react/notehub-og-meta.jpg'],
  },
};

async function createNoteAction(formData: FormData) {
  'use server';
  
  const title = formData.get('title') as string;
  const content = formData.get('content') as string;
  const tag = formData.get('tag') as NoteTag;
  
  if (!title || !content || !tag) {
    throw new Error('All fields are required');
  }
  
  try {
    const result = await createNote({ title, content, tag });
    console.log('Note created successfully:', result);
    redirect('/notes?created=1');
  } catch (error) {
    console.error('Failed to create note:', error);
    return { error: 'Failed to create note. Please try again.' };
  }
}

export default function CreateNotePage() {
  return (
    <main className={styles.main}>
      <div className={styles.container}>
        <h1 className={styles.title}>Create note</h1>
        <NoteForm createNoteAction={createNoteAction} />
      </div>
    </main>
  );
}