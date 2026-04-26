'use client';

import { useRouter } from 'next/navigation';
import { useQuery } from '@tanstack/react-query';
import { fetchNoteById } from '@/lib/api/clientApi';
import { Modal } from '@/components/Modal/Modal';
import styles from './NotePreview.module.css';

interface NotePreviewClientProps {
  id: string;
}

export default function NotePreviewClient({ id }: NotePreviewClientProps) {
  const router = useRouter();

  const { data: note, isLoading, isError } = useQuery({
    queryKey: ['note', id],
    queryFn: () => fetchNoteById(id),
    staleTime: 1000 * 60 * 5,
  });

  const handleClose = () => {
    router.back();
  };

  return (
    <Modal onClose={handleClose}>
      {isLoading && <p className={styles.status}>Loading...</p>}
      
      {isError && (
        <div className={styles.errorWrapper}>
          <p>Could not load note data.</p>
          <button onClick={handleClose} className={styles.closeBtn}>Close</button>
        </div>
      )}

      {note && (
        <article className={styles.content}>
          <h2 className={styles.title}>{note.title}</h2>
          <div className={styles.tagBadge}>{note.tag}</div>
          <p className={styles.text}>{note.content}</p>
          <div className={styles.date}>
            Created: {new Date(note.createdAt).toLocaleDateString()}
          </div>
        </article>
      )}
    </Modal>
  );
}