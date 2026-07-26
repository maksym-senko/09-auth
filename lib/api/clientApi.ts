import { axiosInstance } from "./api";
import type { Note, NoteTag } from "@/types/note";
import type { User } from "@/types/user";

export interface RegisterData {
  email: string;
  password: string;
}

export interface LoginData {
  email: string;
  password: string;
}

export interface FetchNotesParams {
  page?: number;
  perPage?: number;
  search?: string;
  tag?: string;
}

export interface NewNote {
  title: string;
  content: string;
  tag: NoteTag;
}

export interface FetchNotesResponse {
  notes: Note[];
  totalPages: number;
}

// --- АУТЕНТИФІКАЦІЯ (AUTH) ---

export const register = async (data: RegisterData): Promise<User> => {
  const res = await axiosInstance.post<User>("/auth/register", data);
  return res.data;
};

export const login = async (data: LoginData): Promise<User> => {
  const res = await axiosInstance.post<User>("/auth/login", data);
  return res.data;
};

export const logout = async (): Promise<void> => {
  await axiosInstance.post("/auth/logout");
};

export const checkSession = async (): Promise<User | null> => {
  const res = await axiosInstance.get<User | null>("/auth/session");
  return res.data;
};

// --- КОРИСТУВАЧІ (USERS) ---
export const getMe = async (): Promise<User> => {
  const res = await axiosInstance.get<User>("/users/me");
  return res.data;
};

export const updateMe = async (userData: Partial<User>): Promise<User> => {
  const res = await axiosInstance.patch<User>("/users/me", userData);
  return res.data;
};

// --- НОТАТКИ (NOTES) ---

export const fetchNotes = async (
  params: FetchNotesParams,
): Promise<FetchNotesResponse> => {
  const res = await axiosInstance.get<FetchNotesResponse>("/notes", { params });
  return res.data;
};

export const fetchNoteById = async (id: string): Promise<Note> => {
  const res = await axiosInstance.get<Note>(`/notes/${id}`);
  return res.data;
};

export const createNote = async (noteData: NewNote): Promise<Note> => {
  const res = await axiosInstance.post<Note>("/notes", noteData);
  return res.data;
};

export const deleteNote = async (noteId: string): Promise<Note> => {
  const res = await axiosInstance.delete<Note>(`/notes/${noteId}`);
  return res.data;
};