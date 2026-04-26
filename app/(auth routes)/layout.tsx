import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Authentication | NoteHub',
  description: 'Sign in or sign up to NoteHub',
};

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
