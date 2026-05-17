import { dehydrate, HydrationBoundary, QueryClient } from '@tanstack/react-query';
import { fetchNotes } from '@/lib/api/api';
import NotesClient from "./Notes.client";

interface PageProps {
  params: Promise<{ slug: string[] }>;
  searchParams: Promise<{ page?: string; search?: string }>;
}

export default async function FilteredNotesPage({ params, searchParams }: PageProps) {
  const { slug } = await params;
  const { page, search } = await searchParams;

  const currentTag = slug[0] === 'all' ? undefined : slug[0];
  const currentPage = Number(page) || 1;
  const currentSearch = search || "";

  const queryClient = new QueryClient();

  await queryClient.prefetchQuery({
    queryKey: ['notes', currentTag, currentPage, currentSearch],
    queryFn: () => fetchNotes({ tag: currentTag, page: currentPage, search: currentSearch }),
  });

  return (
    <section>
      <h1 className="sr-only">Notes list</h1>
      
      <HydrationBoundary state={dehydrate(queryClient)}>
        <NotesClient tag={currentTag} />
      </HydrationBoundary>
    </section>
  );
}