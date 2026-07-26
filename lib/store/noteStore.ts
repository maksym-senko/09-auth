import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { NoteTag } from "@/types/note";

interface DraftNote {
  title: string;
  content: string;
  tag: NoteTag;
}

interface NoteState {
  draft: DraftNote;
  setDraft: (fields: Partial<DraftNote>) => void;
  clearDraft: () => void;
}

const initialDraft: DraftNote = {
  title: "",
  content: "",
  tag: "Todo",
};

export const useNoteStore = create<NoteState>()(
  persist(
    (set) => ({
      draft: initialDraft,

      setDraft: (fields) =>
        set((state) => ({
          draft: { ...state.draft, ...fields },
        })),

      clearDraft: () => set({ draft: initialDraft }),
    }),
    {
      name: "note-draft-storage", 
    },
  ),
);