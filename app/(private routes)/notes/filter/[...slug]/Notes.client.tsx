'use client';

import { useState, useEffect } from 'react';
import { useSearchParams, useRouter, usePathname } from 'next/navigation';
import { useQuery } from '@tanstack/react-query';
import { useDebounce } from 'use-debounce'; 
import { fetchNotes, NotesResponse } from '@/lib/api/api';
import  NoteList  from '@/components/NoteList/NoteList';
import { Pagination } from '@/components/Pagination/Pagination';
import { SearchBox } from '@/components/SearchBox/SearchBox'; 
import { Modal } from '@/components/Modal/Modal';
import  NoteForm  from '@/components/NoteForm/NoteForm';


export default function NotesClient({ tag }: { tag?: string }) {
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const { replace } = useRouter();

  const [searchValue, setSearchValue] = useState(searchParams.get('search') || '');
  const [debouncedSearch] = useDebounce(searchValue, 500);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const currentPage = Number(searchParams.get('page')) || 1;

  const { data, isLoading, isError } = useQuery<NotesResponse>({
    queryKey: ['notes', tag, currentPage, debouncedSearch],
    queryFn: () => fetchNotes({ tag, page: currentPage, search: debouncedSearch }),
  });

  useEffect(() => {
    const params = new URLSearchParams(searchParams);
    if (debouncedSearch) params.set('search', debouncedSearch);
    else params.delete('search');
    params.set('page', '1');
    replace(`${pathname}?${params.toString()}`);
  }, [debouncedSearch]);

  const handlePageChange = ({ selected }: { selected: number }) => {
    const params = new URLSearchParams(searchParams);
    params.set('page', (selected + 1).toString());
    replace(`${pathname}?${params.toString()}`);
  };

  if (isError) return <div>Error loading data.</div>;

  return (
    <div className="flex flex-col gap-6">
      <div className="flex justify-between items-center gap-4">
        <SearchBox 
          value={searchValue} 
          onChange={(e) => setSearchValue(e.target.value)} 
        />
        <button onClick={() => setIsModalOpen(true)}>Add Note</button>
      </div>

      {isLoading ? <div>Loading...</div> : <NoteList notes={data?.notes ?? []} />}
      
      {data && data.totalPages > 1 && (
        <Pagination 
          pageCount={data.totalPages} 
          onPageChange={handlePageChange}
          forcePage={currentPage - 1} 
        />
      )}

{isModalOpen && (
  <Modal onClose={() => setIsModalOpen(false)}>
    <NoteForm />
  </Modal>
)}
    </div>
  );
}