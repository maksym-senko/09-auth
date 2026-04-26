import { cookies } from 'next/headers';
import { User } from '@/types/user';
import { Note, NotesResponse, NoteTag } from '@/types/note';

interface FetchNotesParams {
  page?: number;
  perPage?: number;
  tag?: NoteTag;
  search?: string;
}

const BASE_URL = 'https://notehub-api.goit.study';

async function makeRequest<T>(
  endpoint: string,
  options?: RequestInit,
): Promise<T> {
  const cookieStore = await cookies();
  const headers = new Headers(options?.headers || {});
  
  // Add cookies to the request
  headers.set('Content-Type', 'application/json');
  
  const allCookies = cookieStore.getAll();
  if (allCookies.length > 0) {
    const cookieString = allCookies.map(c => `${c.name}=${c.value}`).join('; ');
    headers.set('Cookie', cookieString);
  }

  const response = await fetch(`${BASE_URL}${endpoint}`, {
    ...options,
    headers,
    credentials: 'include',
  });

  if (!response.ok) {
    throw new Error(`API Error: ${response.status}`);
  }

  const data = await response.json();
  return data;
}

// --- ПЕРЕВІРКА АВТОРИЗАЦІЇ ---

export const checkSession = async (): Promise<User | null> => {
  try {
    const user = await makeRequest<User>('/auth/session');
    return user;
  } catch {
    return null;
  }
};

// --- НОТАТКИ ---

export const fetchNotes = async (params: FetchNotesParams): Promise<NotesResponse> => {
  const searchParams = new URLSearchParams();
  if (params.page) searchParams.append('page', String(params.page));
  if (params.perPage) searchParams.append('perPage', String(params.perPage));
  if (params.tag) searchParams.append('tag', params.tag);
  if (params.search) searchParams.append('search', params.search);

  const queryString = searchParams.toString();
  const endpoint = `/notes${queryString ? `?${queryString}` : ''}`;
  
  return makeRequest<NotesResponse>(endpoint);
};

export const fetchNoteById = async (id: string): Promise<Note> => {
  return makeRequest<Note>(`/notes/${id}`);
};

// --- КОРИСТУВАЧ ---

export const getMe = async (): Promise<User> => {
  return makeRequest<User>('/users/me');
};
