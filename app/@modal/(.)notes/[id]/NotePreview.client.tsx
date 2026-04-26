'use client';

import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { fetchNoteById } from '@/lib/api/clientApi';
import { Note } from '@/types/note';
import styles from './NotePreview.module.css';

interface NotePreviewProps {
  params: Promise<{ id: string }>;
}

export default function NotePreviewClient({ params }: NotePreviewProps) {
  const router = useRouter();
  const [note, setNote] = useState<Note | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadNote = async () => {
      try {
        const resolvedParams = await params;
        const data = await fetchNoteById(resolvedParams.id);
        setNote(data);
      } catch (err) {
        setError('Failed to load note');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    loadNote();
  }, [params]);

  const handleClose = () => {
    router.back();
  };

  const handleOverlayClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target === e.currentTarget) {
      handleClose();
    }
  };

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

  if (loading) {
    return (
      <div className={styles.overlay} onClick={handleOverlayClick}>
        <div className={styles.modal}>
          <div className={styles.loading}>Loading...</div>
        </div>
      </div>
    );
  }

  if (error || !note) {
    return (
      <div className={styles.overlay} onClick={handleOverlayClick}>
        <div className={styles.modal}>
          <div className={styles.error}>{error || 'Note not found'}</div>
          <button onClick={handleClose} className={styles.closeButton}>
            Close
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.overlay} onClick={handleOverlayClick}>
      <div className={styles.modal}>
        <button onClick={handleClose} className={styles.closeButton}>
          ×
        </button>
        
        <div className={styles.content}>
          <div className={styles.header}>
            <h2 className={styles.title}>{note.title}</h2>
            <span className={`${styles.tag} ${getTagColor(note.tag)}`}>
              {note.tag}
            </span>
          </div>
          
          <div className={styles.metadata}>
            <span>Created: {new Date(note.createdAt).toLocaleDateString()}</span>
            <span>Updated: {new Date(note.updatedAt).toLocaleDateString()}</span>
          </div>
          
          <div className={styles.body}>
            <p>{note.content}</p>
          </div>
        </div>
      </div>
    </div>
  );
}