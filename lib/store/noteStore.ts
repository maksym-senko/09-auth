import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import type { NoteTag } from "@/types/note";

export const initialDraft = {
  title: "",
  content: "",
  tag: "Todo" as NoteTag,
};

interface NoteDraft {
  title: string;
  content: string;
  tag: NoteTag;
}

interface NoteState {
  draft: NoteDraft;
  setDraft: (data: Partial<NoteDraft>) => void;
  clearDraft: () => void;
}

export const useNoteStore = create<NoteState>()(
  persist(
    (set) => ({
      draft: initialDraft,
      setDraft: (data) => set((state) => ({ draft: { ...state.draft, ...data } })),
      clearDraft: () => set({ draft: initialDraft }),
    }),
    {
      name: "note-draft-storage",
      storage: createJSONStorage(() => localStorage),
    }
  )
);