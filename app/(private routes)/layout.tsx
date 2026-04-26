import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'NoteHub | User Area',
  description: 'Your personal note management area',
};

export default function PrivateRoutesLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
