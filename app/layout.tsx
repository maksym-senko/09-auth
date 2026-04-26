import type { Metadata } from 'next';
import { Roboto } from 'next/font/google';
import Header from '@/components/Header/Header';
import Footer from '@/components/Footer/Footer';
import { TanStackProvider } from "@/components/TanStackProvider/TanStackProvider"; 
import AuthProvider from "@/components/AuthProvider/AuthProvider"; 

import './globals.css';

const roboto = Roboto({
  weight: ['400', '500', '700'],
  variable: '--font-roboto',
  display: 'swap',
  subsets: ['latin', 'cyrillic'],
});

export const metadata: Metadata = {
  title: 'NoteHub | Ваш особистий менеджер нотаток',
  description:
    'Створюйте, редагуйте та організовуйте свої нотатки. Простий та зручний інструмент для ведення записів.',
  openGraph: {
    title: 'NoteHub - Менеджер нотаток',
    description: 'Організуйте свої думки з NoteHub',
    url: 'https://your-vercel-app.vercel.app',
    images: ['https://ac.goit.global/fullstack/react/notehub-og-meta.jpg'],
  },
};

interface RootLayoutProps {
  children: React.ReactNode;
  modal: React.ReactNode; 
}

export default function RootLayout({ children, modal }: RootLayoutProps) {
  return (
    <html 
      lang="uk" 
      className={roboto.variable} 
      suppressHydrationWarning
      data-scroll-behavior="smooth"
    >
      <body suppressHydrationWarning className="antialiased">
        <TanStackProvider>
          <AuthProvider>
            <Header />
            <main>
              {children}
            </main>
            {modal}
            <Footer />
          </AuthProvider>
        </TanStackProvider>
      </body>
    </html>
  );
}