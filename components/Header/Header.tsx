import Link from 'next/link';
import css from './Header.module.css';
import AuthNavigation from '@/components/AuthNavigation/AuthNavigation';

const Header = () => {
  return (
    <header className={css.header}>
      <Link href="/" className={css.logo}>NoteHub</Link>
      
      <nav className={css.nav}>
        <ul className={css.navList}>
          <li>
            <Link href="/">Home</Link>
          </li>
          
          <li>
            <Link 
              href="/notes/filter/all"
            >
              Notes
            </Link>
          </li>
          
          <AuthNavigation />
        </ul>
      </nav>
    </header>
  );
};

export default Header;