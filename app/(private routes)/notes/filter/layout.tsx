import React from 'react';

interface FilterLayoutProps {
  children: React.ReactNode;
  sidebar: React.ReactNode;
}

export default function FilterLayout({ children, sidebar }: FilterLayoutProps) {
  return (
    <div style={{ display: 'flex', gap: '40px', padding: '20px' }}>
      <aside style={{ minWidth: '250px', borderRight: '1px solid #ddd' }}>
        {sidebar}
      </aside>
      <main style={{ flex: 1 }}>
        {children}
      </main>
    </div>
  );
}