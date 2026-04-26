
import { Metadata } from 'next';
import Link from 'next/link';
import { fetchNotes } from '@/lib/api/clientApi';
import { NOTE_TAGS, NoteTag } from '@/types/note';
import NotesList from '@/components/NoteList/NoteList';
import styles from './page.module.css';

interface PageProps {
  params: Promise<{ slug: string[] }>;
}

export async function generateMetadata(props: PageProps): Promise<Metadata> {
  const params = await props.params;
  const filter = params.slug.join('/');
  
  return {
    title: `Нотатки: ${filter} | NoteHub`,
    description: `Перегляд нотаток відфільтрованих за категорією "${filter}"`,
    openGraph: {
      title: `Фільтр нотаток - ${filter}`,
      description: `Перегляд нотаток у категорії ${filter}`,
      url: `https://your-vercel-app.vercel.app/notes/filter/${filter}`,
      images: ['https://ac.goit.global/fullstack/react/notehub-og-meta.jpg'],
    },
  };
}

export default async function FilteredNotesPage(props: PageProps) {
  const params = await props.params;
  const filter = params.slug.join('/');
  
  const tag = filter === 'all' ? undefined : (filter as NoteTag);
  const response = await fetchNotes({ page: 1, perPage: 100, tag });
  const notes = response.notes;
  
  return (
    <main className={styles.main} suppressHydrationWarning>
      <div className={styles.container} suppressHydrationWarning>
        <div className={styles.header} suppressHydrationWarning>
          <Link href="/notes" className={styles.backButton}>
            ← Back to all notes
          </Link>
          <h1 className={styles.title}>Notes tagged: {filter}</h1>
        </div>
        
        <div className={styles.tagsSection}>
          <h2 className={styles.tagsTitle}>Filter by tag:</h2>
          <div className={styles.tagsList}>
            <Link
              href="/notes/filter/all"
              className={`${styles.tagLink} ${filter === 'all' ? styles.activeTag : ''}`}
            >
              All
            </Link>
            {NOTE_TAGS.map((tag) => (
              <Link
                key={tag}
                href={`/notes/filter/${tag}`}
                className={`${styles.tagLink} ${
                  tag === filter ? styles.activeTag : ''
                }`}
              >
                {tag}
              </Link>
            ))}
          </div>
        </div>

        {notes.length === 0 ? (
          <div className={styles.empty}>
            <p>No notes found with tag: {filter === 'all' ? 'all' : filter}</p>
            <Link href="/notes/action/create" className={styles.createLink}>
              Create your first note with this tag
            </Link>
          </div>
        ) : (
          <>
            <div className={styles.resultsCount}>
              Found {notes.length} note{notes.length !== 1 ? 's' : ''}
            </div>
            <NotesList notes={notes} />
          </>
        )}
      </div>
    </main>
  );
}