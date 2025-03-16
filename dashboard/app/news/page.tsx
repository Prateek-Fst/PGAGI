'use client';
import { useState } from 'react';
import { useGetTopHeadlinesQuery } from '@/store/api/newsApi';
import Card from '@/components/ui/Card';

export default function NewsPage() {
  const [page, setPage] = useState(1);
  const [category, setCategory] = useState<string>('business'); 
  const [selectedArticle, setSelectedArticle] = useState<Article | null>(null); 

  const categories = ['technology', 'sports', 'business', 'health', 'entertainment'];

  const { data, error, isLoading } = useGetTopHeadlinesQuery({
    country: 'us',
    category, 
    page,
    pageSize: 5,
  });

  const handleCategoryChange = (cat: string) => {
    setCategory(cat === category ? undefined : cat);
    setPage(1); 
  };

  const openModal = (article: Article) => setSelectedArticle(article);
  const closeModal = () => setSelectedArticle(null);

  return (
    <div className="p-4 max-w-5xl mx-auto">
      <h1 className="text-3xl font-bold mb-6 text-gray-900 dark:text-black">Latest News</h1>
      <div className="mb-6 flex flex-wrap gap-2">
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => handleCategoryChange(cat)}
            className={`px-4 py-2 rounded-full text-sm font-medium ${
              category === cat
                ? 'bg-blue-600 text-white'
                : 'bg-gray-200 text-gray-700 dark:bg-gray-700 dark:text-gray-300'
            }`}
          >
            {cat.charAt(0).toUpperCase() + cat.slice(1)}
          </button>
        ))}
      </div>

      {isLoading ? (
        <div className="text-center">Loading...</div>
      ) : error ? (
        <div className="text-center text-red-500">Error: {(error as any).message}</div>
      ) : !data?.articles.length ? (
        <div className="text-center text-gray-500">No articles available</div>
      ) : (
        <div className="grid gap-6">
          {data?.articles.map((article, index) => (
            <div
              key={index}
              onClick={() => openModal(article)}
              className="cursor-pointer bg-white dark:bg-gray-800 shadow-md rounded-lg overflow-hidden hover:shadow-lg transition-shadow"
            >
              <Card title={article.title}>
                {article.urlToImage && (
                  <img
                    src={article.urlToImage}
                    alt={article.title}
                    className="w-full h-48 object-cover"
                  />
                )}
                <div className="p-4">
                  <p className="text-gray-700 dark:text-gray-300 mb-2">
                    {article.description}
                  </p>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    By {article.author || 'Unknown'} - {article.source.name}
                  </p>
                  <p className="text-gray-700 dark:text-gray-300 mb-2">

                  </p>
                </div>
              </Card>
            </div>
          ))}
        </div>
      )}
      <div className="mt-6 flex justify-center gap-4">
        <button
          onClick={() => setPage(page - 1)}
          disabled={page === 1}
          className="px-4 py-2 bg-gray-200 dark:bg-gray-700 rounded disabled:opacity-50"
        >
          Previous
        </button>
        <span className="py-2 text-gray-900 dark:text-white">Page {page}</span>
        <button
          onClick={() => setPage(page + 1)}
          disabled={data?.totalResults <= page * 5}
          className="px-4 py-2 bg-gray-200 dark:bg-gray-700 rounded disabled:opacity-50"
        >
          Next
        </button>
      </div>
      {selectedArticle && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white dark:bg-gray-800 rounded-lg p-6 max-w-2xl w-full mx-4 max-h-[80vh] overflow-y-auto">
            <h2 className="text-2xl font-bold mb-4 text-gray-900 dark:text-white">
              {selectedArticle.title}
            </h2>
            {selectedArticle.urlToImage && (
              <img
                src={selectedArticle.urlToImage}
                alt={selectedArticle.title}
                className="w-full h-64 object-cover mb-4 rounded"
              />
            )}
            <p className="text-gray-700 dark:text-gray-300 mb-4">
              {selectedArticle.content}
            </p>
            <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">
              By {selectedArticle.author || 'Unknown'} - {selectedArticle.source.name} -{' '}
              {new Date(selectedArticle.publishedAt).toLocaleDateString()}
            </p>
            <a
              href={selectedArticle.url}
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 dark:text-blue-400 underline"
            >
              Read full article
            </a>
            <button
              onClick={closeModal}
              className="mt-2 px-2 bg-red-600 text-white rounded hover:bg-red-700 ml-3"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
}