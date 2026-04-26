export const NOTE_TAGS = [
  'Todo',
  'Work',
  'Personal',
  'Meeting',
  'Shopping',
  'Health',
  'Education',
  'Ideas',
] as const;

export type NoteTag = (typeof NOTE_TAGS)[number];

export interface Note {
  id: string;
  title: string;
  content: string;
  tag: NoteTag;
  createdAt: string;
  updatedAt: string;
}

export interface NotesResponse {
  notes: Note[];
  total: number;
  pages: number;
}