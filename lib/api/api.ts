import axios from "axios";
import { Note, NoteTag } from "@/types/note";

export interface NotesResponse {
  notes: Note[];
  totalPages: number;
  totalCount?: number;
}

export interface FetchNotesParams {
  page?: number;
  perPage?: number;
  tag?: NoteTag | string;
  search?: string;
}

export interface CreateNoteData {
  title: string;
  content: string;
  tag: NoteTag;
}

const baseURL = (process.env.NEXT_PUBLIC_API_URL || "https://notehub-goit.vercel.app") + "/api";

export const api = axios.create({
  baseURL,
  withCredentials: true, 
  headers: {
    "Content-Type": "application/json",
  },
});

export const createNote = async (data: CreateNoteData): Promise<Note> => {
  const response = await api.post<Note>("/notes", data);
  return response.data;
};

export const fetchNotes = async (params: FetchNotesParams): Promise<NotesResponse> => {
  const response = await api.get<NotesResponse>("/notes", { params });
  return response.data;
};