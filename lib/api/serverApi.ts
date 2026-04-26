import { cookies } from 'next/headers';
import { AxiosResponse } from 'axios';
import { api } from './api';
import { User } from '@/types/user';
import { Note, NotesResponse, NoteTag } from '@/types/note';

interface FetchNotesParams {
  page?: number;
  perPage?: number;
  tag?: NoteTag;
  search?: string;
}

const getServerHeaders = async () => {
  const cookieStore = await cookies();
  const cookieString = cookieStore
    .getAll()
    .map((c) => `${c.name}=${c.value}`)
    .join('; ');

  return {
    Cookie: cookieString,
  };
};

// --- ПЕРЕВІРКА АВТОРИЗАЦІЇ ---

export const checkSession = async (): Promise<AxiosResponse<User> | null> => {
  try {
    const headers = await getServerHeaders();
    const response = await api.get<User>('/auth/session', { headers });
    return response;
  } catch (error) {
    return null;
  }
};

// --- НОТАТКИ ---

export const fetchNotes = async (params: FetchNotesParams): Promise<NotesResponse> => {
  const headers = await getServerHeaders();
  const { data } = await api.get<NotesResponse>('/notes', { 
    params, 
    headers 
  });
  return data;
};

export const fetchNoteById = async (id: string): Promise<Note> => {
  const headers = await getServerHeaders();
  const { data } = await api.get<Note>(`/notes/${id}`, { headers });
  return data;
};

// --- КОРИСТУВАЧ ---

export const getMe = async (): Promise<User> => {
  const headers = await getServerHeaders();
  const { data } = await api.get<User>('/users/me', { headers });
  return data;
};