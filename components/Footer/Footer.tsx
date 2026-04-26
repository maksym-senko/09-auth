import css from './Footer.module.css';


const Footer = () => {
  return (
    <footer className={css.footer}>
      <p suppressHydrationWarning>
        © {new Date().getFullYear()} NoteHub. Developer: Maksym Senko
      </p>
    </footer>
  );
};

export default Footer;