import {
  dehydrate,
  HydrationBoundary,
  QueryClient,
} from "@tanstack/react-query";
import { Metadata } from "next";
import NotesClient from "./Notes.client";
import { fetchNotes } from "@/lib/api/serverApi";

type Props = {
  params: Promise<{ slug: string[] }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const tag = slug[0];

  const displayTag = tag === "all" ? "All notes" : tag;
  const title = `${displayTag} | NoteHub`;
  const description = `Explore your notes in the "${displayTag}" category. Stay organized with NoteHub.`;
  const url = `https://your-app-name.vercel.app/notes/filter/${tag}`;

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      url,
      siteName: "NoteHub",
      images: [
        {
          url: "https://ac.goit.global/fullstack/react/notehub-og-meta.jpg",
          width: 1200,
          height: 630,
          alt: `NoteHub - ${displayTag}`,
        },
      ],
      locale: "en_US",
      type: "website",
    },
  };
}

export default async function FilteredNotesPage({ params }: Props) {
  const { slug } = await params;
  const currentTag = slug[0];

  const tag = currentTag === "all" ? undefined : currentTag;

  const queryClient = new QueryClient();

  await queryClient.prefetchQuery({
    queryKey: ["notes", 1, "", tag],
    queryFn: () => fetchNotes({ page: 1, search: "", perPage: 12, tag }),
  });

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <section>
        <h2 style={{ marginBottom: "20px" }}>
          Category: {currentTag === "all" ? "All Notes" : currentTag}
        </h2>

        <NotesClient tag={tag} />
      </section>
    </HydrationBoundary>
  );
}