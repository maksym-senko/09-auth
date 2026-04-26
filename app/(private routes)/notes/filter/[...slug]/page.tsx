import React from 'react';

interface FilterSlugProps {
  params: Promise<{ slug: string[] }>;
}

export default async function FilterSlugPage({ params }: FilterSlugProps) {
  const { slug } = await params;

  return (
    <div>
      <h2>Результати фільтрації</h2>
      <p>Активні фільтри: <strong>{slug.join(' → ')}</strong></p>
    </div>
  );
}