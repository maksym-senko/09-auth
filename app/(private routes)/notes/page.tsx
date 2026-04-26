'use client';

import { useState, useEffect, ChangeEvent } from 'react';
import Link from 'next/link';
import { useQuery } from '@tanstack/react-query';
import { fetchNotes } from '@/lib/api/clientApi';
import { NOTE_TAGS, NoteTag, Note } from '@/types/note';
import { ClearDraftOnSuccess } from '@/components/ClearDraftOnSuccess/ClearDraftOnSuccess';
import NotesList from '@/components/NoteList/NoteList';
import styles from './page.module.css';

interface PageNotesData {
  notes: Note[];
  totalPages: number;
}

export default function NotesPage() {
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedTag, setSelectedTag] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');

  const handleSearchChange = (e: ChangeEvent<HTMLInputElement>): void => {
    setSearchQuery(e.target.value);
  };

  useEffect(() => {
    const timeout = setTimeout(() => {
      setDebouncedSearch(searchQuery);
      setCurrentPage(1);
    }, 500);
    
    return () => clearTimeout(timeout);
  }, [searchQuery]);

  const { data, isLoading, error } = useQuery<PageNotesData>({
    queryKey: ['notes', currentPage, selectedTag, debouncedSearch],
    queryFn: async () => {
      const res = await fetchNotes({
        page: currentPage,
        perPage: 12,
        tag: selectedTag === 'all' ? undefined : (selectedTag as NoteTag),
        search: debouncedSearch || undefined,
      });

      // 2. КЛЮЧОВЕ ВИПРАВЛЕННЯ: Подвійне приведення типів
      // Це каже TS: "Я впевнений, що тут будуть notes та totalPages"
      return res as unknown as PageNotesData;
    },
  });

  const handleTagFilter = (tag: string) => {
    setSelectedTag(tag);
    setCurrentPage(1);
  };

  if (isLoading) return <main className={styles.main}><div className={styles.spinner}></div></main>;
  if (error) return <main className={styles.main}><div>Error loading notes.</div></main>;

  const notes = data?.notes || [];
  const totalPages = data?.totalPages || 1;

  return (
    <main className={styles.main}>
      <ClearDraftOnSuccess />
      <div className={styles.container}>
        <div className={styles.header}>
          <h1 className={styles.title}>My Notes</h1>
          <Link href="/notes/action/create" className={styles.createButton}>
            Create note +
          </Link>
        </div>

        <div className={styles.searchSection}>
          <input
            type="text"
            placeholder="Search notes..."
            value={searchQuery}
            onChange={handleSearchChange}
            className={styles.searchInput}
          />
        </div>

        <div className={styles.tagsSection}>
          <button
            onClick={() => handleTagFilter('all')}
            className={`${styles.tagFilter} ${selectedTag === 'all' ? styles.activeTag : ''}`}
          >
            All
          </button>
          {NOTE_TAGS.map((tag) => (
            <button
              key={tag}
              onClick={() => handleTagFilter(tag)}
              className={`${styles.tagFilter} ${selectedTag === tag ? styles.activeTag : ''}`}
            >
              {tag}
            </button>
          ))}
        </div>

        {notes.length === 0 ? (
          <div className={styles.empty}>No notes found.</div>
        ) : (
          <>
            <NotesList notes={notes} />
            {totalPages > 1 && (
              <div className={styles.pagination}>
                <button onClick={() => setCurrentPage(p => Math.max(1, p - 1))} disabled={currentPage === 1}>Prev</button>
                <span>{currentPage} / {totalPages}</span>
                <button onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))} disabled={currentPage === totalPages}>Next</button>
              </div>
            )}
          </>
        )}
      </div>
    </main>
  );
}