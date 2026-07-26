import { axiosInstance } from "./api";
import { cookies } from "next/headers";
import type { AxiosResponse } from "axios";
import type { Note } from "@/types/note";
import type { User } from "@/types/user";
import type { FetchNotesParams } from "./clientApi";

const getServerHeaders = async () => {
  const cookieStore = await cookies();
  return {
    headers: {
      Cookie: cookieStore.toString(),
    },
  };
};

export const fetchNotes = async (params: FetchNotesParams) => {
  const headers = await getServerHeaders();
  const res = await axiosInstance.get("/notes", { ...headers, params });
  return res.data;
};

export const fetchNoteById = async (id: string): Promise<Note> => {
  const headers = await getServerHeaders();
  const res = await axiosInstance.get(`/notes/${id}`, headers);
  return res.data;
};

export const getMe = async (): Promise<User> => {
  const headers = await getServerHeaders();
  const res = await axiosInstance.get("/users/me", headers);
  return res.data;
};

export const getSession = async (): Promise<AxiosResponse<User>> => {
  const headers = await getServerHeaders();
  return await axiosInstance.get("/auth/session", headers);
};