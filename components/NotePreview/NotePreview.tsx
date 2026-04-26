import { Note } from "@/types/note";
import css from "./NotePreview.module.css";


interface Props {
  note: Note;
}

export const NotePreview = ({ note }: Props) => {
  return (
    <article className={css.container}>
      <h2 className={css.title}>{note.title}</h2>
      <span className={css.tagBadge}>{note.tag}</span>
      <p className={css.content}>{note.content}</p>
    </article>
  );
};