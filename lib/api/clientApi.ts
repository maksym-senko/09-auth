import { api } from "../api";
import { User } from "@/types/user";
import { Note, NotesResponse, NoteTag } from "@/types/note";


interface FetchNotesParams {
  page?: number;
  perPage?: number;
  tag?: NoteTag;
  search?: string;
}

// --- АВТОРИЗАЦІЯ ---

export const login = async (credentials: Pick<User, 'email'> & { password: string }): Promise<User> => {
  const { data } = await api.post<User>("/auth/login", credentials);
  return data;
};

export const register = async (credentials: Omit<User, 'avatar'> & { password: string }): Promise<User> => {
  const { data } = await api.post<User>("/auth/register", credentials);
  return data;
};

export const logout = async (): Promise<void> => {
  await api.post("/auth/logout");
};

export const checkSession = async (): Promise<User | null> => {
  try {
    const { data } = await api.get<User>("/auth/session");
    return data;
  } catch {
    return null;
  }
};

// --- НОТАТКИ ---

export const fetchNotes = async (params: FetchNotesParams): Promise<NotesResponse> => {
  const { data } = await api.get<NotesResponse>("/notes", { params });
  return data;
};

export const createNote = async (note: Pick<Note, 'title' | 'content' | 'tag'>): Promise<Note> => {
  const { data } = await api.post<Note>("/notes", note);
  return data;
};

export const deleteNote = async (id: string): Promise<void> => {
  await api.delete(`/notes/${id}`);
};

export const updateNote = async (id: string, note: Partial<Note>): Promise<Note> => {
  const { data } = await api.patch<Note>(`/notes/${id}`, note);
  return data;
};

export const fetchNoteById = async (id: string): Promise<Note> => {
  const { data } = await api.get<Note>(`/notes/${id}`);
  return data;
};

// --- КОРИСТУВАЧ ---

export const getMe = async (): Promise<User> => {
  const { data } = await api.get<User>("/users/me");
  return data;
};

export const updateMe = async (user: Partial<User>): Promise<User> => {
  const { data } = await api.patch<User>("/users/me", user);
  return data;
};