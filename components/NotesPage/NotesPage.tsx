'use client';

import { useSearchParams, useRouter, usePathname } from 'next/navigation';
import { useQuery } from '@tanstack/react-query';
import { fetchNotes } from '@/lib/api/clientApi';
import NoteList from '@/components/NoteList/NoteList';
import { Pagination } from '@/components/Pagination/Pagination';
import { Note, NoteTag } from '@/types/note';

interface LocalNotesData {
  notes: Note[];
  totalPages: number;
}

export const NotesPage = ({ tag }: { tag?: string }) => {
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const { replace } = useRouter();

  const currentPage = Number(searchParams.get('page')) || 1;

  const { data, isLoading, isError } = useQuery<LocalNotesData>({
    queryKey: ['notes', tag, currentPage],
    queryFn: async () => {
      const response = await fetchNotes({ 
        tag: tag as NoteTag | undefined, 
        page: currentPage 
      });
      
      return response as unknown as LocalNotesData;
    },
  });

  const handlePageClick = (event: { selected: number }) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set('page', (event.selected + 1).toString());
    replace(`${pathname}?${params.toString()}`);
  };

  if (isLoading) return <div>Loading...</div>;
  if (isError) return <div>Error loading data.</div>;

  return (
    <div>
      <NoteList notes={data?.notes ?? []} />
      
      {data && data.totalPages > 1 && (
        <Pagination 
          pageCount={data.totalPages} 
          onPageChange={handlePageClick}
          forcePage={currentPage - 1}
        />
      )}
    </div>
  );
};