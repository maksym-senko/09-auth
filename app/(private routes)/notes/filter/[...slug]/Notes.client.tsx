'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useSearchParams, useRouter, usePathname } from 'next/navigation';
import { useQuery } from '@tanstack/react-query';
import { useDebounce } from 'use-debounce'; 
import { fetchNotes } from '@/lib/api/clientApi';
import NoteList from '@/components/NoteList/NoteList';
import { Pagination } from '@/components/Pagination/Pagination';
import { SearchBox } from '@/components/SearchBox/SearchBox'; 

type FetchNotesArgs = Parameters<typeof fetchNotes>[0];
type NoteTag = FetchNotesArgs['tag'];

export default function NotesClient({ tag }: { tag?: NoteTag | string }) {
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const { replace } = useRouter();

  const [searchValue, setSearchValue] = useState(searchParams.get('search') || '');
  const [debouncedSearch] = useDebounce(searchValue, 500);

  const currentPage = Number(searchParams.get('page')) || 1;

  const { data, isLoading, isError } = useQuery({
    queryKey: ['notes', tag, currentPage, debouncedSearch],
    queryFn: () => fetchNotes({ tag: tag as NoteTag, page: currentPage, search: debouncedSearch }),
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

  // Безпечне отримання сторінок без використання 'any'
  const responseData = data as Record<string, unknown> | undefined;
  const totalPagesCount = Number(
    responseData?.totalPages ?? 
    responseData?.pageCount ?? 
    responseData?.total_pages ?? 
    1
  );

  if (isError) return <div>Error loading data.</div>;

  return (
    <div className="flex flex-col gap-6">
      <div className="flex justify-between items-center gap-4">
        <SearchBox 
          value={searchValue} 
          onChange={(e) => setSearchValue(e.target.value)} 
        />
        <Link href="/notes/action/create">Add Note</Link>
      </div>

      {isLoading ? <div>Loading...</div> : <NoteList notes={data?.notes ?? []} />}
      
      {data && totalPagesCount > 1 && (
        <Pagination 
          pageCount={totalPagesCount} 
          onPageChange={handlePageChange}
          forcePage={currentPage - 1} 
        />
      )}
    </div>
  );
}