import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { fetchNoteById } from '@/lib/api/serverApi';
import NoteDetailsClient from './NoteDetails.client';

const BASE_URL = 'https://notehub-goit.vercel.app';

interface PageProps {
  params: Promise<{ id: string }>;
}

export async function generateMetadata(props: PageProps): Promise<Metadata> {
  const params = await props.params;
  try {
    const note = await fetchNoteById(params.id);
    
    return {
      title: `${note.title} | NoteHub`,
      description: note.content.substring(0, 160),
      metadataBase: new URL(BASE_URL),
      openGraph: {
        title: note.title,
        description: note.content.substring(0, 160),
        url: `${BASE_URL}/notes/${params.id}`,
        images: ['https://ac.goit.global/fullstack/react/notehub-og-meta.jpg'],
      },
    };
  } catch {
    return {
      title: 'Note not found | NoteHub',
      description: 'The requested note does not exist or was deleted.',
      metadataBase: new URL(BASE_URL),
      openGraph: {
        title: 'Note not found | NoteHub',
        description: 'The requested note does not exist or was deleted.',
        url: `${BASE_URL}/notes/${params.id}`,
        images: ['https://ac.goit.global/fullstack/react/notehub-og-meta.jpg'],
      },
    };
  }
}

export default async function NoteDetailPage(props: PageProps) {
  const params = await props.params;
  
  let note;
  try {
    note = await fetchNoteById(params.id);
  } catch {
    notFound();
  }
  
  return <NoteDetailsClient note={note} />;
}