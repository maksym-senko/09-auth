import Link from "next/link";
import css from "./Home.module.css";


export const Home = () => {
  return (
    <section className={css.hero}>
      <h1 className={css.title}>Welcome to NoteHub</h1>
      <p className={css.description}>
        Your personal space for capturing ideas, tasks, and inspirations. 
        Organize your thoughts efficiently with our tag-based system.
      </p>
      <div className={css.actions}>
        <Link href="/notes/filter/all" className={css.mainButton}>
          View All Notes
        </Link>
      </div>
    </section>
  );
};