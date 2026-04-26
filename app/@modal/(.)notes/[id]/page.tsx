import NotePreviewClient from './NotePreview.client';

interface PageProps {
  params: Promise<{ id: string }>;
}

export default function NotePreviewPage(props: PageProps) {
  return <NotePreviewClient params={props.params} />;
}