type FilterLayoutProps = {
  children: React.ReactNode;
  sidebar: React.ReactNode;
};

export default function FilterLayout({ children, sidebar }: FilterLayoutProps) {
  return (
    <div style={{ display: 'flex', gap: '1rem' }}>
      <aside style={{ flex: '0 0 auto' }}>{sidebar}</aside>
      <main style={{ flex: '1' }}>{children}</main>
    </div>
  );
}
