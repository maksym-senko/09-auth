import type { Metadata } from "next";
import css from "./Home.module.css";

export const metadata: Metadata = {
  title: "404 - Сторінку не знайдено | NoteHub",
  description:
    "На жаль, сторінка, яку ви шукаєте, не існує або була переміщена.",

  openGraph: {
    title: "404 - Сторінку не знайдено | NoteHub",
    description:
      "Ви потрапили на неіснуючу сторінку. Поверніться на головну, щоб продовжити роботу з нотатками.",
    url: "https://notehub-your-username.vercel.app/404",
    images: [
      {
        url: "https://ac.goit.global/fullstack/react/notehub-og-meta.jpg",
        width: 1200,
        height: 630,
        alt: "Page not found - NoteHub",
      },
    ],
    type: "website",
  },
};

const NotFoundPage = () => {
  return (
    <div style={{ padding: "20px" }}>
      <h1 className={css.title}>404 - Page not found</h1>
      <p className={css.description}>
        Sorry, the page you are looking for does not exist.
      </p>
    </div>
  );
};

export default NotFoundPage;