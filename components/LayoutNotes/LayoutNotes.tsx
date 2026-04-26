import css from "./LayoutNotes.module.css";


interface Props {
  children: React.ReactNode;
  sidebar: React.ReactNode;
}

export const LayoutNotes = ({ children, sidebar }: Props) => {
  return (
    <div className={css.wrapper}>
      <aside className={css.sidebar}>{sidebar}</aside>
      <section className={css.content}>{children}</section>
    </div>
  );
};