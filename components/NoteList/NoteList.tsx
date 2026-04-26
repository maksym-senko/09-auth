'use client';

import Link from 'next/link';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { Note } from '@/types/note';
import { deleteNote } from '@/lib/api/clientApi';
import styles from './NoteList.module.css';

interface NotesListProps {
  notes: Note[];
}

export default function NotesList({ notes }: NotesListProps) {
  const queryClient = useQueryClient();

  const { mutate: handleDelete } = useMutation({
    mutationFn: (id: string) => deleteNote(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['notes'] });
    },
    onError: (error) => {
      console.error('Помилка при видаленні:', error);
      alert('Не вдалося видалити нотатку');
    }
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

  return (
    <div className={styles.grid}>
      {notes.map((note) => (
        <div key={note.id} className={styles.cardWrapper}>
          <Link href={`/notes/${note.id}`} className={styles.card}>
            <div className={styles.cardContent}>
              <div className={styles.cardHeader}>
                <h3 className={styles.cardTitle}>{note.title}</h3>
                <span className={`${styles.tag} ${getTagColor(note.tag)}`}>
                  {note.tag}
                </span>
              </div>
              <p className={styles.cardPreview}>
                {note.content.substring(0, 100)}
                {note.content.length > 100 ? '...' : ''}
              </p>
              <div className={styles.cardFooter}>
                <span className={styles.date}>
                  {new Date(note.createdAt).toLocaleDateString()}
                </span>
              </div>
            </div>
          </Link>
          
          <button
            className={styles.deleteButton}
            onClick={(e) => {
              e.preventDefault(); 
              e.stopPropagation(); 
              if (confirm('Ви впевнені, що хочете видалити цю нотатку?')) {
                handleDelete(note.id);
              }
            }}
            aria-label="Delete note"
          >
            🗑️
          </button>
        </div>
      ))}
    </div>
  );
}