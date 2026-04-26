import React from 'react';
import Link from 'next/link';

export default function FilterSidebar() {
  return (
    <div>
      <h2>Категорії</h2>
      <nav>
        <ul style={{ listStyle: 'none', padding: 0 }}>
          <li><Link href="/notes/filter/work">Робота</Link></li>
          <li><Link href="/notes/filter/personal">Особисте</Link></li>
          <li><Link href="/notes/filter/important">Важливе</Link></li>
        </ul>
      </nav>
    </div>
  );
}