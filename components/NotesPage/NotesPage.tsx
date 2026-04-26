'use client';

import { useSearchParams, useRouter, usePathname } from 'next/navigation';
import { useQuery } from '@tanstack/react-query';
import { fetchNotes } from '@/lib/api/clientApi';
import  NoteList  from '@/components/NoteList/NoteList';
import { Pagination } from '@/components/Pagination/Pagination';
import { Note } from '@/types/note';

interface NotesResponse {
  notes: Note[];
  totalPages: number;
}

export const NotesPage = ({ tag }: { tag?: string }) => {
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const { replace } = useRouter();

  const currentPage = Number(searchParams.get('page')) || 1;

  const { data, isLoading, isError } = useQuery<NotesResponse>({
    queryKey: ['notes', tag, currentPage],
    queryFn: () => fetchNotes({ tag, page: currentPage }),
  });

  const handlePageClick = (event: { selected: number }) => {
    const params = new URLSearchParams(searchParams);
    params.set('page', (event.selected + 1).toString());
    replace(`${pathname}?${params.toString()}`);
  };

  if (isLoading) return <div>Loading...</div>;
  if (isError) return <div>Error loading data.</div>;

  return (
    <div>
      <NoteList notes={data?.notes ?? []} />
      
      <Pagination 
        pageCount={data?.totalPages ?? 1} 
        onPageChange={handlePageClick}
        forcePage={currentPage - 1}
      />
    </div>
  );
};