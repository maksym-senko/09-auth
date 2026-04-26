'use client';

import { useState, useCallback, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { fetchNotes } from '@/lib/api/clientApi';
import { NoteTag } from '@/types/note';
import NotesList from '@/components/NoteList/NoteList';
import { Pagination } from '@/components/Pagination/Pagination';
import { SearchBox } from '@/components/SearchBox/SearchBox';
import styles from './page.module.css';
import Link from 'next/link';

interface NotesClientProps {
  initialFilter: string;
}

const DEBOUNCE_DELAY = 300;
const PER_PAGE = 12;

export default function NotesClient({ initialFilter }: NotesClientProps) {
  const [currentPage, setCurrentPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState('');
  const [debouncedSearchQuery, setDebouncedSearchQuery] = useState('');

  const tag = initialFilter === 'all' ? undefined : (initialFilter as NoteTag);

  useEffect(() => {
    const debounceTimer = setTimeout(() => {
      setDebouncedSearchQuery(searchQuery);
      setCurrentPage(1); 
    }, DEBOUNCE_DELAY);

    return () => clearTimeout(debounceTimer);
  }, [searchQuery]);

  const { data, isLoading, error } = useQuery({
    queryKey: ['filteredNotes', tag, debouncedSearchQuery, currentPage],
    queryFn: () => fetchNotes({ 
      page: currentPage,
      perPage: PER_PAGE, 
      tag: tag,
      search: debouncedSearchQuery,
    }),
  });


  const handleSearchChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
  }, []);

  const handlePageChange = (selectedItem: { selected: number }) => {
    setCurrentPage(selectedItem.selected + 1);
  };

  if (isLoading) {
    return (
      <div className={styles.loading}>
        <div className={styles.spinner}></div>
        <p>Loading notes...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className={styles.error}>
        <p>Error loading notes. Please try again later.</p>
        <Link href="/notes" className={styles.backLink}>
          ← Back to all notes
        </Link>
      </div>
    );
  }

  const notes = data?.notes || [];
  const totalPages = data?.pages || 0;

  return (
    <>
      <SearchBox value={searchQuery} onChange={handleSearchChange} />


      {notes.length === 0 ? (
        <div className={styles.empty}>
          <p>
            No notes found 
            {debouncedSearchQuery && ` matching "${debouncedSearchQuery}"`}
          </p>
          <Link href="/notes/action/create" className={styles.createLink}>
            Create your first note
          </Link>
        </div>
      ) : (
        <>
          <div className={styles.resultsCount}>
            Found {notes.length} note{notes.length !== 1 ? 's' : ''}
          </div>
          
          <NotesList notes={notes} />
          
          {totalPages > 1 && (
            <Pagination 
              pageCount={totalPages}
              forcePage={currentPage - 1} 
              onPageChange={handlePageChange}
            />
          )}
        </>
      )}
    </>
  );
}