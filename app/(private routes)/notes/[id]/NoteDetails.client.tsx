'use client';

import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useMutation, useQueryClient, useQuery } from '@tanstack/react-query';
import { deleteNote, fetchNoteById } from '@/lib/api/clientApi';
import styles from './page.module.css';

export default function NoteDetailsClient({ id }: { id: string }) {
  const router = useRouter();
  const queryClient = useQueryClient();

  const { data: note, isLoading, isError } = useQuery({
    queryKey: ['note', id],
    queryFn: () => fetchNoteById(id),
    staleTime: 1000 * 60 * 5, 
  });

  const deleteMutation = useMutation({
    mutationFn: () => deleteNote(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['notes'] });
      router.push('/notes');
    },
  });

  const getTagColor = (tag: string) => {
    const tagColors: Record<string, string> = {
      Todo: styles.tagTodo,
      Work: styles.tagWork,
      Personal: styles.tagPersonal,
      Meeting: styles.tagMeeting,
      Shopping: styles.tagShopping,
      Health: styles.tagHealth,
      Education: styles.tagEducation,
      Ideas: styles.tagIdeas,
    };
    return tagColors[tag] || styles.tagDefault;
  };

  const handleDelete = () => {
    if (confirm('Are you sure you want to delete this note?')) {
      deleteMutation.mutate();
    }
  };

  if (isLoading) {
    return <div className={styles.loading}>Loading note details...</div>;
  }

  if (isError || !note) {
    return <div className={styles.error}>Error: Could not find the note.</div>;
  }

  return (
    <main className={styles.main}>
      <div className={styles.container}>
        <div className={styles.header}>
          <Link href="/notes" className={styles.backButton}>
            ← Back to notes
          </Link>
          <button 
            onClick={handleDelete} 
            className={styles.deleteButton}
            disabled={deleteMutation.isPending} 
          >
            {deleteMutation.isPending ? 'Deleting...' : 'Delete Note'}
          </button>
        </div>
        
        <article className={styles.note}>
          <div className={styles.noteHeader}>
            <h1 className={styles.title}>{note.title}</h1>
            <span className={`${styles.tag} ${getTagColor(note.tag)}`}>
              {note.tag}
            </span>
          </div>
          
          <div className={styles.metadata}>
            <span>Created: {new Date(note.createdAt).toLocaleDateString()}</span>
            <span>Updated: {new Date(note.updatedAt).toLocaleDateString()}</span>
          </div>
          
          <div className={styles.content}>
            <p>{note.content}</p>
          </div>
        </article>
      </div>
    </main>
  );
}