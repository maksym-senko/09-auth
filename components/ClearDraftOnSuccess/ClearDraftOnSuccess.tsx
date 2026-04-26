'use client';

import { useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import { useNoteStore } from '@/lib/store/noteStore';

export function ClearDraftOnSuccess() {
  const searchParams = useSearchParams();
  const { clearDraft } = useNoteStore();

  useEffect(() => {
    if (searchParams.get('created') === '1') {
      clearDraft();
    }
  }, [searchParams, clearDraft]);

  return null;
}