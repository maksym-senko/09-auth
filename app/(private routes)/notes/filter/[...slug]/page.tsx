export default function FilterSlugPage({ params }: { params: { slug: string[] } }) {
  return <div>Filter results for: {params.slug?.join('/')}</div>;
}