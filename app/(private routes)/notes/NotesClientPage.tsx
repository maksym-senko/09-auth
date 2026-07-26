'use client';

import { useState, useEffect, ChangeEvent } from 'react';
import Link from 'next/link';
import { useQuery } from '@tanstack/react-query';
import { fetchNotes } from '@/lib/api/clientApi';
import { NOTE_TAGS, NoteTag, Note, NotesResponse } from '@/types/note';
import { ClearDraftOnSuccess } from '@/components/ClearDraftOnSuccess/ClearDraftOnSuccess';
import NotesList from '@/components/NoteList/NoteList';
import styles from './page.module.css';

interface NotesClientPageProps {
  initialNotes: Note[];
  initialPages: number;
  initialTotal: number;
  initialPage: number;
  initialSearch: string;
  initialTag: string;
}

export default function NotesClientPage({
  initialNotes,
  initialPages,
  initialTotal,
  initialPage,
  initialSearch,
  initialTag,
}: NotesClientPageProps) {
  const [currentPage, setCurrentPage] = useState(initialPage);
  const [selectedTag, setSelectedTag] = useState<string>(initialTag || 'all');
  const [searchQuery, setSearchQuery] = useState(initialSearch);
  const [debouncedSearch, setDebouncedSearch] = useState(initialSearch);

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

  const isInitialState =
    currentPage === 1 && selectedTag === 'all' && !debouncedSearch;

  const { data, isLoading, error } = useQuery<NotesResponse>({
    queryKey: ['notes', currentPage, selectedTag, debouncedSearch],
    queryFn: async () => {
      return await fetchNotes({
        page: currentPage,
        perPage: 12,
        tag: selectedTag === 'all' ? undefined : (selectedTag as NoteTag),
        search: debouncedSearch || undefined,
      });
    },
    initialData: isInitialState
      ? { notes: initialNotes, pages: initialPages, total: initialTotal }
      : undefined,
  });

  const handleTagFilter = (tag: string) => {
    setSelectedTag(tag);
    setCurrentPage(1);
  };

  if (isLoading)
    return (
      <main className={styles.main}>
        <div className={styles.spinner}></div>
      </main>
    );

  if (error)
    return (
      <main className={styles.main}>
        <div>Error loading notes.</div>
      </main>
    );

  const notes = data?.notes || [];
  const pages = data?.pages || 1;

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
            className={`${styles.tagFilter} ${
              selectedTag === 'all' ? styles.activeTag : ''
            }`}
          >
            All
          </button>
          {NOTE_TAGS.map((tag) => (
            <button
              key={tag}
              onClick={() => handleTagFilter(tag)}
              className={`${styles.tagFilter} ${
                selectedTag === tag ? styles.activeTag : ''
              }`}
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
            {pages > 1 && (
              <div className={styles.pagination}>
                <button
                  onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                  disabled={currentPage === 1}
                >
                  Prev
                </button>
                <span>
                  {currentPage} / {pages}
                </span>
                <button
                  onClick={() =>
                    setCurrentPage((p) => Math.min(pages, p + 1))
                  }
                  disabled={currentPage === pages}
                >
                  Next
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </main>
  );
}