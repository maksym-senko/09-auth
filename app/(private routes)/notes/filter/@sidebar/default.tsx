import Link from 'next/link';
import css from './Sidebar.module.css';

const TAGS = [
  { name: 'All notes', value: 'all' },
  { name: 'Todo', value: 'Todo' },
  { name: 'Work', value: 'Work' },
  { name: 'Personal', value: 'Personal' },
  { name: 'Meeting', value: 'Meeting' },
  { name: 'Shopping', value: 'Shopping' },
] as const;

export default function SidebarDefault() {
  return (
    <aside className={css.sidebar}>
      <h2 className={css.title}>Filter by Tags</h2>
      <nav>
        <ul className={css.list}>
          {TAGS.map((tag) => (
            <li key={tag.value} className={css.listItem}>
              <Link
                href={`/notes/filter/${tag.value}`}
                className={css.link}
              >
                {tag.name}
              </Link>
            </li>
          ))}
        </ul>
      </nav>
    </aside>
  );
}