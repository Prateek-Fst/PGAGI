'use client';
import { useState } from 'react';
import { useSession, signIn } from 'next-auth/react';
import dynamic from 'next/dynamic';
import DraggableWidget from '@/components/ui/DraggableWidget';
import NewsWidget from '@/components/widgets/NewsWidget';
import FinanceWidget from '@/components/widgets/FinanceWidget';
import GitHubWidget from  '@/components/widgets/GithubWidget';
import { useSearch } from '@/lib/SearchContext';
import { useTranslation } from 'react-i18next';

const WeatherWidget = dynamic(() => import('@/components/widgets/WeatherWidget'), {
  ssr: false,
});

const initialWidgets = [
  { id: 'weather', component: <WeatherWidget /> },
  { id: 'news', component: <NewsWidget /> },
  { id: 'finance', component: <FinanceWidget /> },
  { id: 'github', component: <GitHubWidget /> },
];

export default function Home() {
  const { data: session, status } = useSession();
  const { searchQuery } = useSearch();
  const [widgets, setWidgets] = useState(initialWidgets);
  const { t } = useTranslation();

  const moveWidget = (fromIndex: number, toIndex: number) => {
    const updatedWidgets = [...widgets];
    const [movedWidget] = updatedWidgets.splice(fromIndex, 1);
    updatedWidgets.splice(toIndex, 0, movedWidget);
    setWidgets(updatedWidgets);
  };

  if (status === 'loading') {
    return <div className="min-h-screen flex items-center justify-center">Loading...</div>;
  }

  if (!session) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-6 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-semibold text-gray-900 dark:text-white mb-6">
            {t('home.sign_in_prompt')}
          </h1>
          <div className="space-y-4">
            <button
              onClick={() => signIn('github', { callbackUrl: '/' })}
              className="w-full px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
            >
              {t('home.sign_in_github')}
            </button>
            <button
              onClick={() => signIn('google', { callbackUrl: '/' })}
              className="w-full px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
            >
              {t('home.sign_in_google')}
            </button>
          </div>
        </div>
      </div>
    );
  }

  const filteredWidgets = searchQuery
    ? widgets.filter((widget) =>
        widget.id.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : widgets;

  const topWidgets = filteredWidgets.filter((widget) => widget.id !== 'github');
  const githubWidget = filteredWidgets.find((widget) => widget.id === 'github');

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-6">
      <div className="max-w-7xl mx-auto">
        <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-6">
          {t('home.welcome', { name: session.user?.name })}
        </h2>
        {filteredWidgets.length === 0 ? (
          <p className="text-gray-600 dark:text-gray-400">{t('home.no_widgets')}</p>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
            <div className="lg:col-span-1 flex flex-col gap-6">
              {topWidgets.map((widget, index) => (
                <DraggableWidget
                  key={widget.id}
                  index={index}
                  id={widget.id}
                  component={widget.component}
                  moveWidget={moveWidget}
                  className="w-full h-64"
                />
              ))}
            </div>
            {githubWidget && (
              <div className="lg:col-span-3">
                <DraggableWidget
                  key={githubWidget.id}
                  index={filteredWidgets.findIndex((w) => w.id === 'github')}
                  id={githubWidget.id}
                  component={githubWidget.component}
                  moveWidget={moveWidget}
                  className="w-full h-96"
                />
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}