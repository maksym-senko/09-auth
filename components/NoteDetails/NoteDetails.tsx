'use client';

import { Note } from "@/types/note";
import { useRouter } from "next/navigation";
import css from "./NoteDetails.module.css";


interface Props {
  note: Note;
}

export const NoteDetails = ({ note }: Props) => {
  const router = useRouter();

  return (
    <div className={css.container}>
      <div className={css.item}>
        <button 
          className={css.backBtn} 
          onClick={() => router.back()}
        >
          ← Back to list
        </button>

        <header className={css.header}>
          <h2>{note.title}</h2>
          <span className={css.tag}>{note.tag}</span>
        </header>

        <div className={css.content}>
          {note.content}
        </div>

        <div className={css.date}>
          Note ID: {note.id}
        </div>
      </div>
    </div>
  );
};