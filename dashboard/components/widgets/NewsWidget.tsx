'use client';
import { useState } from 'react';
import { useGetTopHeadlinesQuery } from '@/store/api/newsApi';
import Card from '@/components/ui/Card';

export default function NewsWidget() {
  const [category, setCategory] = useState<string>('business'); 
  const categories = ['technology', 'sports', 'business', 'health', 'entertainment'];

  const { data, error, isLoading } = useGetTopHeadlinesQuery({
    country: 'us',
    category,
    pageSize: 1,
  });

  if (isLoading) return <Card title="Top News"><div>Loading...</div></Card>;
  if (error) return <Card title="Top News"><div className="text-red-500">Error: {(error as any).message}</div></Card>;

  const article = data?.articles[0]; 

  return (
    <Card title="Top News">
      <div className="mb-4 flex flex-wrap gap-2">
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => setCategory(cat === category ? 'business' : cat)}
            className={`px-2 py-1 rounded-full text-xs font-medium ${
              category === cat
                ? 'bg-blue-600 text-white'
                : 'bg-gray-200 text-gray-700 dark:bg-gray-700 dark:text-gray-300'
            }`}
          >
            {cat.charAt(0).toUpperCase() + cat.slice(1)}
          </button>
        ))}
      </div>
      {article ? (
        <div>
          {article.urlToImage && (
            <img
              src={article.urlToImage}
              alt={article.title}
              className="w-full h-24 object-cover rounded mb-2"
            />
          )}
          <p className="text-gray-900 dark:text-white font-semibold text-sm truncate">{article.title}</p>
          <p className="text-xs text-gray-500 dark:text-gray-400">
            By {article.author || 'Unknown'} - {article.source.name}
          </p>
        </div>
      ) : (
        <p className="text-gray-500 dark:text-gray-400">No news available</p>
      )}
    </Card>
  );
}