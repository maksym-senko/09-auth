'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useQuery } from '@tanstack/react-query';
import { fetchNotes } from '@/lib/api/clientApi';
import { NOTE_TAGS, NoteTag } from '@/types/note';
import { ClearDraftOnSuccess } from '@/components/ClearDraftOnSuccess/ClearDraftOnSuccess';
import NotesList from '@/components/NoteList/NoteList';
import styles from './page.module.css';

export default function NotesPage() {
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedTag, setSelectedTag] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearchQuery(value);
    
    const timeout = setTimeout(() => {
      setDebouncedSearch(value);
      setCurrentPage(1);
    }, 500);
    
    return () => clearTimeout(timeout);
  };

  const { data, isLoading, error } = useQuery({
    queryKey: ['notes', currentPage, selectedTag, debouncedSearch],
    queryFn: () => fetchNotes({
      page: currentPage,
      perPage: 12,
      tag: selectedTag === 'all' ? undefined : (selectedTag as NoteTag),
      search: debouncedSearch || undefined,
    }),
  });

  const handleTagFilter = (tag: string) => {
    setSelectedTag(tag);
    setCurrentPage(1);
  };

  if (isLoading) {
    return (
      <main className={styles.main}>
        <div className={styles.container}>
          <div className={styles.loading}>
            <div className={styles.spinner}></div>
            <p>Loading notes...</p>
          </div>
        </div>
      </main>
    );
  }

  if (error) {
    return (
      <main className={styles.main}>
        <div className={styles.container}>
          <div className={styles.error}>
            <p>Error loading notes. Please try again later.</p>
          </div>
        </div>
      </main>
    );
  }

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

        {/* Search input */}
        <div className={styles.searchSection}>
          <input
            type="text"
            placeholder="Search notes..."
            value={searchQuery}
            onChange={handleSearchChange}
            className={styles.searchInput}
          />
        </div>

        {/* Tag filters */}
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
          <div className={styles.empty}>
            <p>No notes found. Create your first note!</p>
          </div>
        ) : (
          <>
            <div className={styles.resultsCount}>
              Found {notes.length} note{notes.length !== 1 ? 's' : ''}
            </div>
            <NotesList notes={notes} />
            
            {/* Pagination */}
            {totalPages > 1 && (
              <div className={styles.pagination}>
                <button
                  onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                  disabled={currentPage === 1}
                  className={styles.pageButton}
                >
                  Previous
                </button>
                <span className={styles.pageInfo}>
                  Page {currentPage} of {totalPages}
                </span>
                <button
                  onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                  disabled={currentPage === totalPages}
                  className={styles.pageButton}
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